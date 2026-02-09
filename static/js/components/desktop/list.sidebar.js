import { BaseComponent } from "../../core/base.models.js";
import { offCanvas } from "../../core/base.models.js";
import { getTransportListTemplate } from "./templates/list.template.js";

class SidebarTransportListComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.routes_data = this.getRoutesData();

    offCanvas.addEventListener("shown.bs.offcanvas", () => {
      this.render();
    });
  }

  // Возваращает html шаблон с нужными данными
  getTemplate() {
    return getTransportListTemplate(this.routes_data);
  }

  // Возвращает данные о каждом маршруте
  getRoutesData() {
    return null;
  }

  render() {
    this.container.innerHTML = this.getTemplate();

    this.bindEvents();
  }

  updateConnectionData(data) {
    const { state, vehicle_quantity } = data;
    // Обновляем статус подключения
    const connection_status_span = document.getElementById("connection-status");
    connection_status_span.textContent = state;
    // Обновляем количество транспорта
    const vehicles_quantity_span = document.getElementById("connection-status");
    vehicles_quantity_span.textContent = vehicle_quantity;
  }

  bindEvents() {}

  hide() {}
}

export const transportListComponent = new SidebarTransportListComponent(
  "routesList",
);
