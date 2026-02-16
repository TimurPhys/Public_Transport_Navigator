import { BaseComponent } from "../../../core/base.models.js";
import { getTransportListTemplate } from "./list.template.js";
import { transportListEvent } from "../../../core/base.models.js";
import { sidebarEvent } from "../../../core/base.models.js";

import ListManager from "./modules/listTransport.js";
import StatusManager from "./modules/status.js";

class SidebarTransportListComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.typed_route = "";
    this.route_filter_input = null;

    this.initGlobalListeners();
  }

  initGlobalListeners() {
    sidebarEvent.on("sidebar:shown", () => {
      this.show();
    });
    sidebarEvent.on("sidebar:movedBack", () => {
      this.show();
    });
    sidebarEvent.on("sidebar:hidden", () => {
      // Убираем все сделанные изменения
      this.typed_route = "";
      if (this.route_filter_input) {
        this.route_filter_input.value = this.typed_route;
        this.listManager.refresh(this.typed_route);
      }
      this.hide();
    });
    transportListEvent.on("list:hidden", () => {
      this.hide();
    });
  }

  // Возваращает html шаблон с нужными данными
  getTemplate() {
    return getTransportListTemplate(this.typed_route);
  }

  render() {
    this.container.innerHTML = this.getTemplate();

    this.listManager = new ListManager(this.container);
    this.statusManager = new StatusManager(this.container);

    this.bindEvents();
  }

  bindEvents() {
    this.route_filter_input = this.container.querySelector("#routeFilterInput");
    this.route_filter_input?.addEventListener("input", (e) => {
      this.typed_route = e.target.value;
      this.listManager.refresh(this.typed_route);
    });
    const close_button = this.container.querySelector("#btn-close");
    close_button.addEventListener("click", () => {
      sidebarEvent.emit("sidebar:hidden", {});
    });
    this.listManager.bindEventsOnButtons();
  }
}

export const transportListComponent = new SidebarTransportListComponent(
  "routesList",
);

transportListComponent.show();
