import { time_tables } from "../../../../../json/parse_json.js";

function generateStationsButtons(data) {
  const route_id = data.id;
  const direction = data.direction;
  let buttons = "";
  const stations = Object.keys(time_tables[route_id][direction]);
  stations.forEach((station) => {
    buttons += `<a
            type="button"
            class="list-group-item list-group-item-action ${data.station === station ? "active" : ""}"
            id="station-button"
            data-route="${route_id}"
            data-station="${station}"
            style="height: auto; font-size: 15px"
          >
            ${station}
          </a>`;
  });
  return buttons;
}

export default class StationManager {
  constructor(data, container) {
    this.data = data;
    this.container = container.querySelector("#station-button-container");
    this.refresh(); // чтобы сразу появилось в DOM при инициализации
  }

  refresh() {
    const newStations = generateStationsButtons(this.data);
    this.container.innerHTML = newStations;
  }
}
