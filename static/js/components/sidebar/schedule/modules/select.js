import { time_tables } from "../../../../../json/parse_json.js";

function generateDirectionSelect(data) {
  const route_id = data.id;
  const directions = Object.keys(time_tables[route_id]);
  let options = "";
  directions.forEach((direction) => {
    options += `<option value="${direction}" ${direction === data.direction ? "selected" : ""}>${direction}</option>`;
  });
  return `
    <select class="form-select" aria-label=".form-select">
      ${options}
    </select>
    `;
}

export default class SelectManager {
  constructor(data, container) {
    this.data = data;
    this.container = container.querySelector("#direction-select-container");
    this.refresh(); // чтобы сразу появилось в DOM при инициализации
  }

  refresh() {
    const directionSelect = generateDirectionSelect(this.data);
    this.container.insertAdjacentHTML("beforeend", directionSelect);
  }
}
