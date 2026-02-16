import { translations } from "../../../../../json/parse_json.js";

export default class StatusManager {
  constructor(container) {
    this.statusSpan = container.querySelector("#connection-status");
    this.countSpan = container.querySelector("#vehicleCount");
  }

  updateConnection(state) {
    if (!this.statusSpan) return;
    const colors = { connected: "green", orange: "orange", default: "red" };
    this.statusSpan.style.color = colors[state] || colors.default;
    this.statusSpan.textContent = translations[state];
  }

  updateQuantity(count) {
    if (this.countSpan) this.countSpan.textContent = String(count);
  }
}