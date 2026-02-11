import { BaseComponent } from "../../core/base.models.js";
import { offCanvas } from "../../core/base.models.js";
import { getTransportListTemplate } from "./templates/list.template.js";
import { translations } from "../../../json/parse_json.js";
import { time_tables } from "../../../json/parse_json.js";

class SidebarTransportListComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.routes_data = this.getRoutesData();

    offCanvas.addEventListener("shown.bs.offcanvas", () => {
      if (this.container.innerHTML == "") {
        this.render();
      }
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

  updateConnectionState(new_state) {
    // Обновляем статус подключения
    const connection_status_span = document.getElementById("connection-status");
    if (connection_status_span) {
      switch (new_state) {
        case "connected":
          connection_status_span.style.color = "green";
          break;
        case "no_answer" || "disconnected":
          connection_status_span.style.color = "red";
          break;
        case "orange":
          connection_status_span.style.color = "orange";
          break;
      }
      connection_status_span.textContent = translations[new_state];
    }
  }

  updateVehiclesQuantity(new_quantity) {
    // Обновляем количество транспорта
    const vehicles_quantity_span = document.getElementById("vehicleCount");
    if (vehicles_quantity_span) {
      vehicles_quantity_span.textContent = String(new_quantity);
    }
  }

  bindEvents() {}

  hide() {}
}

export const transportListComponent = new SidebarTransportListComponent(
  "routesList",
);
