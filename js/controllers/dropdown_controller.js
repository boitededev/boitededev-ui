import { Controller } from "@hotwired/stimulus"

// Menu déroulant basé sur l'attribut natif popover.
// Le navigateur gère déjà : la fermeture au clic extérieur, la touche Échap,
// le retour du focus sur le bouton, et l'affichage au-dessus de tout (même dans
// un .table-wrap qui coupe ce qui dépasse).
//
// Usage :
//   <div data-controller="dropdown">
//     <button class="btn btn-ghost btn-icon btn-sm" data-dropdown-target="button">…</button>
//     <div class="menu" popover data-dropdown-target="menu">
//       <a class="menu-item" href="/prospects/12/edit">Modifier</a>
//       <button class="menu-item menu-item-danger">Supprimer</button>
//     </div>
//   </div>
//
// Pas besoin d'id : le controller relie le bouton au menu.
// Le menu s'aligne sur le bord droit du bouton. data-dropdown-align-value="start"
// pour l'aligner à gauche. Il s'ouvre vers le haut s'il manque de place en bas.
// Clavier : flèches haut/bas, Début, Fin pour passer d'un élément à l'autre.
const GAP = 4 // espace entre le bouton et le menu
const EDGE = 8 // marge minimale avec les bords de la fenêtre
const ITEMS = '.menu-item:not([disabled]):not([aria-disabled="true"])'

export default class extends Controller {
  static targets = ["button", "menu"]
  static values = { align: { type: String, default: "end" } }

  connect() {
    this.buttonTarget.popoverTargetElement = this.menuTarget

    this.onToggle = this.onToggle.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
    this.onClick = this.onClick.bind(this)
    this.schedule = this.schedule.bind(this)
    this.hide = this.hide.bind(this)

    this.menuTarget.addEventListener("toggle", this.onToggle)
    this.menuTarget.addEventListener("keydown", this.onKeydown)
    this.menuTarget.addEventListener("click", this.onClick)
    document.addEventListener("turbo:before-cache", this.hide)
  }

  disconnect() {
    this.stopFollowing()
    this.menuTarget.removeEventListener("toggle", this.onToggle)
    this.menuTarget.removeEventListener("keydown", this.onKeydown)
    this.menuTarget.removeEventListener("click", this.onClick)
    document.removeEventListener("turbo:before-cache", this.hide)
  }

  hide() {
    if (this.menuTarget.matches(":popover-open")) this.menuTarget.hidePopover()
  }

  onToggle(event) {
    if (event.newState === "open") {
      this.position()
      this.items()[0]?.focus()
      // Le menu suit le bouton si la page ou un conteneur défile.
      window.addEventListener("scroll", this.schedule, { capture: true, passive: true })
      window.addEventListener("resize", this.schedule, { passive: true })
    } else {
      this.stopFollowing()
    }
  }

  // Un clic sur un élément ferme le menu (le lien ou le formulaire suit son cours).
  onClick(event) {
    if (event.target.closest(ITEMS)) this.hide()
  }

  onKeydown(event) {
    const items = this.items()
    const index = items.indexOf(document.activeElement)
    const next = {
      ArrowDown: items[(index + 1) % items.length],
      ArrowUp: items[(index - 1 + items.length) % items.length],
      Home: items[0],
      End: items[items.length - 1],
    }[event.key]

    if (!next) return
    event.preventDefault()
    next.focus()
  }

  // Place le menu sous le bouton, ou au-dessus s'il n'y a pas la place en bas,
  // sans jamais sortir de la fenêtre.
  position() {
    const button = this.buttonTarget.getBoundingClientRect()
    const menu = this.menuTarget
    const width = menu.offsetWidth
    const height = menu.offsetHeight

    let top = button.bottom + GAP
    const fitsBelow = top + height <= window.innerHeight - EDGE
    const fitsAbove = button.top - GAP - height >= EDGE
    if (!fitsBelow && fitsAbove) top = button.top - GAP - height

    let left = this.alignValue === "start" ? button.left : button.right - width
    left = Math.min(Math.max(left, EDGE), window.innerWidth - width - EDGE)

    menu.style.top = `${Math.round(top)}px`
    menu.style.left = `${Math.round(left)}px`
  }

  schedule() {
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame(() => this.position())
  }

  stopFollowing() {
    cancelAnimationFrame(this.frame)
    window.removeEventListener("scroll", this.schedule, { capture: true })
    window.removeEventListener("resize", this.schedule)
  }

  items() {
    return [...this.menuTarget.querySelectorAll(ITEMS)]
  }
}
