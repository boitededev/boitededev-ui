import { Controller } from "@hotwired/stimulus"
import { centerHorizontally } from "../helpers/scroll.js"

// Onglets accessibles (motif ARIA « tabs »).
// Usage :
//   <div data-controller="tabs">
//     <div class="tabs" role="tablist" aria-label="Fiche client">
//       <button class="tab" role="tab" data-tabs-target="tab">Infos</button>
//       <button class="tab" role="tab" data-tabs-target="tab">Factures</button>
//     </div>
//     <div class="tab-panel" role="tabpanel" data-tabs-target="panel">…</div>
//     <div class="tab-panel" role="tabpanel" data-tabs-target="panel" hidden>…</div>
//   </div>
//
// Le n-ième onglet affiche le n-ième panneau. Le controller pose les id et les
// attributs ARIA (aria-selected, aria-controls, aria-labelledby, tabindex).
//
// Onglet ouvert au départ, dans cet ordre :
//   1. celui dont le panneau a l'id de l'ancre de l'URL (/clients/4#factures) ;
//   2. celui qui a aria-selected="true" ;
//   3. le premier.
// Si le panneau a un id, l'URL prend son ancre quand on change d'onglet, pour
// retrouver le même onglet après un rechargement ou une redirection.
//
// Clavier : flèches gauche/droite, Début, Fin. Tab sort vers le panneau.
// Événement : "tabs:change" (detail : { tab, panel, index }) à chaque changement.
export default class extends Controller {
  static targets = ["tab", "panel"]

  connect() {
    // Ids générés par le controller : seuls les ids écrits dans le HTML vont dans l'URL.
    this.ownIds = new WeakSet()
    this.tabTargets.forEach((tab, index) => {
      const panel = this.panelTargets[index]
      if (!panel) return
      tab.id ||= uniqueId("tab")
      if (!panel.id) {
        panel.id = uniqueId("tab-panel")
        this.ownIds.add(panel)
      }
      tab.setAttribute("aria-controls", panel.id)
      panel.setAttribute("aria-labelledby", tab.id)
      panel.tabIndex = 0
      if (tab.tagName === "BUTTON") tab.type = "button"
    })

    this.onClick = this.onClick.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
    this.element.addEventListener("click", this.onClick)
    this.element.addEventListener("keydown", this.onKeydown)

    this.select(this.initialIndex(), { focus: false, updateUrl: false })
  }

  disconnect() {
    this.element.removeEventListener("click", this.onClick)
    this.element.removeEventListener("keydown", this.onKeydown)
  }

  // L'onglet (de ce controller, pas d'onglets imbriqués) visé par un événement.
  tabIndexFor(event) {
    return this.tabTargets.findIndex((tab) => tab.contains(event.target))
  }

  onClick(event) {
    const index = this.tabIndexFor(event)
    if (index >= 0) this.select(index)
  }

  onKeydown(event) {
    const current = this.tabIndexFor(event)
    if (current < 0) return
    const last = this.tabTargets.length - 1
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    this.select(next)
  }

  select(index, { focus = true, updateUrl = true } = {}) {
    const previous = this.index
    this.index = index

    this.tabTargets.forEach((tab, i) => {
      const selected = i === index
      tab.setAttribute("aria-selected", selected)
      tab.tabIndex = selected ? 0 : -1
      const panel = this.panelTargets[i]
      if (panel) panel.hidden = !selected
    })

    const tab = this.tabTargets[index]
    const panel = this.panelTargets[index]
    if (focus) tab.focus()
    centerHorizontally(tab)

    if (updateUrl && panel) this.updateUrl(panel)
    if (previous !== undefined && previous !== index) {
      this.dispatch("change", { detail: { tab, panel, index } })
    }
  }

  // Ancre du panneau si son id vient du HTML. Sinon, on retire l'ancre si elle
  // désignait un autre panneau de ces onglets (une ancre sans rapport reste).
  updateUrl(panel) {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    let url = null
    if (!this.ownIds.has(panel)) {
      url = `#${panel.id}`
    } else if (hash && this.panelTargets.some((p) => p.id === hash)) {
      url = window.location.pathname + window.location.search
    }
    if (url) history.replaceState(history.state, "", url)
  }

  initialIndex() {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    const fromHash = hash ? this.panelTargets.findIndex((panel) => panel.id === hash) : -1
    if (fromHash >= 0) return fromHash

    const fromMarkup = this.tabTargets.findIndex((tab) => tab.getAttribute("aria-selected") === "true")
    return fromMarkup >= 0 ? fromMarkup : 0
  }
}

let counter = 0
function uniqueId(prefix) {
  let id
  do id = `${prefix}-${++counter}`
  while (document.getElementById(id))
  return id
}
