import { generateRouteButtonsTemplates } from "../list.template.js";
import { transportListEvent } from "../../../../core/base.models.js";
import { time_tables } from "../../../../../json/parse_json.js";

export default class ListManager {
  constructor(container) {
    this.container = container;
    this.containers = {
      bus: container.querySelector("#busRouteList"),
      minibus: container.querySelector("#minibusRouteList"),
      tram: container.querySelector("#tramRouteList"),
    };
  }

  refresh(searchValue) {
    const newButtons = generateRouteButtonsTemplates(searchValue);

    Object.keys(this.containers).forEach((type) => {
      const content =
        newButtons[type] ||
        `<div class="p-3 text-center text-muted">Не найдено</div>`;
      this.containers[type].innerHTML = content;
    });
  }

  bindEventsOnButtons() {
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest("button.list-group-item");
      if (!btn) return;

      const route_id = btn.getAttribute("data-id");
      const default_direction = btn.getAttribute("data-default-direction");
      const station = Object.keys(time_tables[route_id][default_direction])[0];
      transportListEvent.emit("list:hidden", {});
      transportListEvent.emit("route:selected", {
        id: route_id,
        direction: default_direction,
        station: station,
      });
    });
  }
}
