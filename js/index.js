// Point d'entrée JS du kit Boite de Dev UI.
// Stimulus n'est PAS inclus : le projet le fournit (via son importmap).

import DropdownController from "./controllers/dropdown_controller.js"
import ModalController from "./controllers/modal_controller.js"
import NavController from "./controllers/nav_controller.js"
import ScrollspyController from "./controllers/scrollspy_controller.js"
import TabsController from "./controllers/tabs_controller.js"
import ToastController from "./controllers/toast_controller.js"

// Export un par un, pour qui veut choisir ses noms ou n'en prendre qu'un.
export { DropdownController, ModalController, NavController, ScrollspyController, TabsController, ToastController }

// Enregistre tous les controllers du kit d'un coup.
// Usage : registerControllers(Application.start())
export function registerControllers(application) {
  application.register("dropdown", DropdownController)
  application.register("modal", ModalController)
  application.register("nav", NavController)
  application.register("scrollspy", ScrollspyController)
  application.register("tabs", TabsController)
  application.register("toast", ToastController)
}
