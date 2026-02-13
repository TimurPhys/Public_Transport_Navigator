import { BaseComponent } from "../../core/base.models.js";
import { transportListEvent } from "../../core/base.models.js";
import {
  getTransportListTemplate,
  generateRouteButtonsTemplates,
} from "./templates/list.template.js";
import { translations } from "../../../json/parse_json.js";
import { sidebarComponent } from "./sidebar.js";
import { navbar } from "./navbar.js";

class SidebarTransportListComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.typed_route = "";
    this.route_filter_input = null;

    // offCanvas.addEventListener("show.bs.offcanvas", () => {
    //   if (this.container.innerHTML === "") this.render();
    //   navbar.hide();
    //   this.show();
    // });
    // offCanvas.addEventListener("hide.bs.offcanvas", () => {
    //   this.typed_route = "";
    //   if (this.route_filter_input) {
    //     this.route_filter_input.value = this.typed_route;
    //     this.refreshButtons(this.typed_route);
    //     this.bindEventsOnButtons();
    //   }
    //   navbar.show();
    //   setTimeout(() => this.show(), 300);
    // });
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
    const connection_status_span =
      this.container.querySelector("#connection-status");
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
    const vehicles_quantity_span =
      this.container.querySelector("#vehicleCount");
    if (vehicles_quantity_span) {
      vehicles_quantity_span.textContent = String(new_quantity);
    }
  }

  bindEvents() {
    this.route_filter_input = this.container.querySelector("#routeFilterInput");
    this.route_filter_input.addEventListener("input", (e) => {
      this.refreshButtons(e.target.value);
      this.bindEventsOnButtons();
    });
    this.bindEventsOnButtons();
  }

  bindEventsOnButtons() {
    const route_buttons = this.container.querySelectorAll(
      "button.list-group-item",
    );
    route_buttons.forEach((route_button) => {
      route_button.addEventListener("click", () => {
        const route_id = route_button.getAttribute("data-id");
        const default_direction = route_button.getAttribute(
          "data-default-direction",
        );
        transportListEvent.emit("route:selected", {
          id: route_id,
          default_direction: default_direction,
        });
      });
    });
  }

  refreshButtons(value) {
    const containers = {
      bus: this.container.querySelector("#busRouteList"),
      minibus: this.container.querySelector("#minibusRouteList"),
      tram: this.container.querySelector("#tramRouteList"),
    };

    this.typed_route = value;
    const newButtons = generateRouteButtonsTemplates(this.typed_route);
    containers.bus.innerHTML = newButtons.bus;
    containers.minibus.innerHTML = newButtons.minibus;
    containers.tram.innerHTML = newButtons.tram;

    Object.keys(containers).forEach((type) => {
      if (!newButtons[type]) {
        containers[type].innerHTML =
          `<div class="p-3 text-center text-muted">Не найдено</div>`;
      }
    });
  }

  hide() {
    this.container.classList.replace("component-active", "component-hidden");
  }

  show() {
    this.container.classList.remove("component-hidden");
    this.container.classList.add("component-active");
    // Если была логика отрисовки, она остается тут
  }
}

export const transportListComponent = new SidebarTransportListComponent(
  "routesList",
);
