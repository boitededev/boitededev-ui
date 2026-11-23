import { Controller } from "@hotwired/stimulus"
import { centerHorizontally } from "../helpers/scroll.js"

// Sommaire qui suit la lecture : marque avec aria-current="location" le lien
// d'ancre (href="#section") dont la section est en cours de lecture.
// Usage : <nav data-controller="scrollspy"><a href="#intro">…</a><a href="#tarifs">…</a></nav>
//
// La section active est la dernière dont le haut a dépassé la ligne de lecture.
// Cette ligne se place par défaut au scroll-margin-top des sections (sous la navbar
// sticky), là où un clic sur le lien amène la section. On peut la régler en pixels
// avec data-scrollspy-offset-value="120".
// En bas de page, la dernière section devient active même si elle est trop courte
// pour atteindre la ligne.
export default class extends Controller {
  static values = { offset: Number }

  connect() {
    this.links = [...this.element.querySelectorAll('a[href*="#"]')]
      .map((link) => ({ link, section: sectionFor(link) }))
      .filter(({ section }) => section)
      // Ordre des sections dans la page, même si les liens sont dans un autre ordre.
      .sort((a, b) =>
        a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )

    if (this.links.length === 0) return

    this.schedule = this.schedule.bind(this)
    window.addEventListener("scroll", this.schedule, { passive: true })
    window.addEventListener("resize", this.schedule, { passive: true })
    this.update()
  }

  disconnect() {
    window.removeEventListener("scroll", this.schedule)
    window.removeEventListener("resize", this.schedule)
    cancelAnimationFrame(this.frame)
  }

  // Un seul calcul par image, même si scroll se déclenche plus souvent.
  schedule() {
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame(() => this.update())
  }

  update() {
    const line = this.line()
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

    let current = this.links[0]
    if (atBottom) {
      current = this.links[this.links.length - 1]
    } else {
      for (const entry of this.links) {
        if (entry.section.getBoundingClientRect().top <= line) current = entry
      }
    }

    if (current.link === this.active) return
    this.active = current.link

    this.links.forEach(({ link }) => {
      if (link === this.active) {
        link.setAttribute("aria-current", "location")
      } else {
        link.removeAttribute("aria-current")
      }
    })
    centerHorizontally(this.active)
  }

  // Position de la ligne de lecture, en pixels depuis le haut de la fenêtre.
  // Quelques pixels de marge pour les arrondis du défilement fluide.
  line() {
    if (this.hasOffsetValue) return this.offsetValue
    const margin = parseFloat(getComputedStyle(this.links[0].section).scrollMarginTop) || 0
    return margin + 8
  }
}

// La section visée par un lien d'ancre de la page courante, ou null.
function sectionFor(link) {
  if (link.pathname !== window.location.pathname || link.hash.length < 2) return null
  return document.getElementById(decodeURIComponent(link.hash.slice(1)))
}
