import { BaseComponent } from "../../core/base.models.js";
import { offCanvas } from "../../core/base.models.js";
import { getTransportListTemplate, generateRouteButtonsTemplates } from "./templates/list.template.js";
import { translations } from "../../../json/parse_json.js";
import { time_tables } from "../../../json/parse_json.js";

class SidebarTransportListComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.typed_route = "";

    offCanvas.addEventListener("shown.bs.offcanvas", () => {
      if (this.container.innerHTML == "") {
        this.render();
      }
    });
  }

  // Возваращает html шаблон с нужными данными
  getTemplate() {
    return getTransportListTemplate(this.typed_route);
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

  bindEvents() {
    const containers = {
        bus: document.getElementById('busRouteList'),
        minibus: document.getElementById('minibusRouteList'),
        tram: document.getElementById('tramRouteList')
      }
    const route_filter_input = document.getElementById("routeFilterInput");
    route_filter_input.addEventListener("input", (e) => {
      this.typed_route = e.target.value

      const newButtons = generateRouteButtonsTemplates(this.typed_route)
      containers.bus.innerHTML = newButtons.bus
      containers.minibus.innerHTML = newButtons.minibus
      containers.tram.innerHTML = newButtons.tram
      
      Object.keys(containers).forEach(type => {
            if (!newButtons[type]) {
                containers[type].innerHTML = `<div class="p-3 text-center text-muted">Не найдено</div>`;
            }
        });
    })
  }

  hide() {}
}

export const transportListComponent = new SidebarTransportListComponent(
  "routesList",
);
