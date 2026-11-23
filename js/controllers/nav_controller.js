import { Controller } from "@hotwired/stimulus"
import { centerHorizontally } from "../helpers/scroll.js"

// Marque le lien de la page courante avec aria-current="page".
// Usage : <nav data-controller="nav" data-nav-target="links">…<a href="/factures">…</nav>
// Le target est optionnel : sans lui, on cherche les liens dans l'élément du contrôleur.
//
// Sous-pages : ajouter data-nav-match="prefix" sur un lien pour qu'il reste actif
// sur ses sous-pages (ex. /prospects actif sur /prospects/12).
// Si plusieurs liens correspondent, le plus précis gagne (une correspondance exacte,
// sinon le préfixe le plus long).
//
// Le calcul est refait à chaque navigation (Turbo Drive, Turbo Frame avec
// data-turbo-action="advance", bouton précédent), même si la navbar n'est pas
// rechargée (data-turbo-permanent).
const EVENTS = [
  [document, "turbo:load"],
  [document, "turbo:frame-load"],
  [window, "popstate"],
]

export default class extends Controller {
  static targets = ["links"]

  connect() {
    this.update = this.update.bind(this)
    EVENTS.forEach(([target, name]) => target.addEventListener(name, this.update))
    this.update()
  }

  disconnect() {
    EVENTS.forEach(([target, name]) => target.removeEventListener(name, this.update))
  }

  update() {
    const container = this.hasLinksTarget ? this.linksTarget : this.element
    const current = normalize(window.location.pathname)
    const links = [...container.querySelectorAll("a[href]")]

    let active = null
    let bestScore = -1

    links.forEach((link) => {
      const score = matchScore(link, current)
      if (score > bestScore) {
        active = link
        bestScore = score
      }
    })

    links.forEach((link) => {
      if (link === active) {
        link.setAttribute("aria-current", "page")
      } else {
        link.removeAttribute("aria-current")
      }
    })

    if (active) centerHorizontally(active)
  }
}

// -1 : pas de correspondance.
// Sinon un score : un préfixe vaut sa longueur, une correspondance exacte passe devant tout.
function matchScore(link, current) {
  if (link.origin !== window.location.origin) return -1

  const path = normalize(link.pathname)
  if (path === current) return Infinity

  const isPrefix = link.dataset.navMatch === "prefix"
  // "/" en préfixe correspondrait à toutes les pages : on l'ignore.
  if (isPrefix && path !== "/" && current.startsWith(path + "/")) return path.length

  return -1
}

// "/factures/" et "/factures" désignent la même page.
function normalize(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path
}
