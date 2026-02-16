import { BaseComponent } from "../../core/base.models.js";
import { getNavbarTemplate } from "./navbar.template.js";
import { bindFilterEvents } from "../../map/markers.visibility.js";
import { sidebarEvent } from "../../core/base.models.js";

class NavbarComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);

    sidebarEvent.on("sidebar:hidden", () => {
      this.show();
    });
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
    const button_toggle_sidebar = this.container.querySelector(
      "button#toggle-sidebar",
    );
    button_toggle_sidebar.addEventListener("click", () => {
      sidebarEvent.emit("sidebar:shown", {});
      this.hide();
    });
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
