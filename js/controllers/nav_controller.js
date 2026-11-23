import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["links"]

  connect(e) { 
    const links = this.linksTarget;
    links.childNodes.forEach((item) => {
        if (item instanceof HTMLAnchorElement && (document.location.pathname === new URL(item.href).pathname)) {
            item.setAttribute('aria-current', "page")
        } 
    });

    // const path = window.location.pathname;
    
  }
}
