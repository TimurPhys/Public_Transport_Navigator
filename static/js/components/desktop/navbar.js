import { BaseComponent } from "../../core/base.models.js";
import { getNavbarTemplate } from "./templates/navbar.template.js";
import { bindFilterEvents } from "../../map/markers.visibility.js";

class NavbarComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
  }

  getTemplate() {
    return getNavbarTemplate();
  }

  render() {
    this.container.innerHTML = this.getTemplate();
    this.bindEvents();
  }

  bindEvents() {
    bindFilterEvents();
  }

  hide() {
    this.container.classList.add("navbar-hidden");
  }

  show() {
    if (this.container.innerHTML === "") {
      this.render();
    }

    this.container.classList.remove("navbar-hidden");
  }
}

export const navbar = new NavbarComponent("navbar-block");

navbar.show();
// setTimeout(() => {
//   navbar.hide();
// }, 2000);
