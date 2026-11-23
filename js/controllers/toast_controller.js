import { Controller } from "@hotwired/stimulus"

// Message temporaire qui se ferme tout seul.
// Usage (dans le conteneur <div id="toasts" class="toasts" aria-live="polite">) :
//   <div class="toast toast-success" data-controller="toast">
//     <span class="icon icon-check-circle" aria-hidden="true"></span>
//     <p class="toast-body">Prospect enregistré.</p>
//     <button class="btn btn-ghost btn-icon btn-sm" data-action="toast#close">…</button>
//   </div>
//
// Se ferme après 5 s. data-toast-delay-value="8000" pour changer, "0" pour qu'il reste.
// Le compte à rebours s'arrête tant que la souris est dessus ou que le focus est
// dedans, pour laisser le temps de lire ou de cliquer.
// Avec Turbo : le toast est retiré avant la mise en cache de la page, pour ne pas
// réapparaître au retour arrière.
const PAUSE_EVENTS = ["mouseenter", "focusin"]
const RESUME_EVENTS = ["mouseleave", "focusout"]

export default class extends Controller {
  static values = { delay: { type: Number, default: 5000 } }

  connect() {
    this.remaining = this.delayValue
    this.pause = this.pause.bind(this)
    this.resume = this.resume.bind(this)
    this.remove = this.remove.bind(this)

    PAUSE_EVENTS.forEach((name) => this.element.addEventListener(name, this.pause))
    RESUME_EVENTS.forEach((name) => this.element.addEventListener(name, this.resume))
    document.addEventListener("turbo:before-cache", this.remove)

    this.resume()
  }

  disconnect() {
    clearTimeout(this.timer)
    PAUSE_EVENTS.forEach((name) => this.element.removeEventListener(name, this.pause))
    RESUME_EVENTS.forEach((name) => this.element.removeEventListener(name, this.resume))
    document.removeEventListener("turbo:before-cache", this.remove)
  }

  close() {
    if (this.closing) return
    this.closing = true
    clearTimeout(this.timer)

    this.element.classList.add("toast-leaving")
    // Sans animation (prefers-reduced-motion), animationend n'arrive jamais.
    if (getComputedStyle(this.element).animationName === "none") return this.remove()
    this.element.addEventListener("animationend", this.remove, { once: true })
    // Sécurité si animationend n'arrive pas (animation coupée, onglet en arrière-plan…).
    setTimeout(this.remove, 500)
  }

  pause() {
    if (!this.timer) return
    clearTimeout(this.timer)
    this.timer = null
    this.remaining -= Date.now() - this.startedAt
  }

  resume() {
    if (this.delayValue <= 0 || this.timer || this.closing) return
    // Souris sortie mais focus encore dedans (ou l'inverse) : on reste en pause.
    if (this.element.matches(":hover") || this.element.contains(document.activeElement)) return

    this.startedAt = Date.now()
    this.timer = setTimeout(() => this.close(), Math.max(this.remaining, 0))
  }

  remove() {
    this.element.remove()
  }
}
