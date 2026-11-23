import { Controller } from "@hotwired/stimulus"

// Ouvre et ferme une modal basée sur la balise native <dialog>.
// Le navigateur gère déjà : le fond sombre, la touche Échap, le focus.
//
// Usage :
//   <div data-controller="modal">
//     <button data-action="modal#open">Ouvrir</button>
//     <dialog class="modal" data-modal-target="dialog" data-action="click->modal#backdrop">
//       …
//       <button data-action="modal#close">Fermer</button>
//     </dialog>
//   </div>
export default class extends Controller {
  static targets = ["dialog"]

  open() {
    this.dialogTarget.showModal()
  }

  close() {
    this.dialogTarget.close()
  }

  // La <dialog> n'a pas de padding : si on clique directement dessus
  // (et pas sur son contenu), c'est qu'on a cliqué sur le fond.
  // On vérifie aussi où le clic a COMMENCÉ : si on sélectionne du texte
  // dans un champ et qu'on relâche sur le fond, la modal reste ouverte.
  backdrop(event) {
    if (this.pressedOnBackdrop && event.target === this.dialogTarget) this.close()
  }

  // Appelé automatiquement par Stimulus quand la cible "dialog" apparaît.
  dialogTargetConnected(dialog) {
    this.onPress = (event) => {
      this.pressedOnBackdrop = event.target === dialog
    }
    dialog.addEventListener("pointerdown", this.onPress)
  }

  // Et quand elle disparaît : on retire l'écouteur.
  dialogTargetDisconnected(dialog) {
    dialog.removeEventListener("pointerdown", this.onPress)
  }
}
