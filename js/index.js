// Point d'entrée JS du kit Boite de Dev UI.
// Stimulus n'est PAS inclus : le projet le fournit (via son importmap).

import ModalController from "./controllers/modal_controller.js"
import NavController from "./controllers/nav_controller.js"

// Export un par un, pour qui veut choisir ses noms ou n'en prendre qu'un.
export { ModalController, NavController }

// Enregistre tous les controllers du kit d'un coup.
// Usage : registerControllers(Application.start())
export function registerControllers(application) {
  application.register("modal", ModalController)
  application.register("nav", NavController)
}
