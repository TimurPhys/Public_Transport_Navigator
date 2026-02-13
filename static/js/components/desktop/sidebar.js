import { BaseComponent } from "../../core/base.models.js";
import { map } from "../../map/map.js";

class SibebarComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.isVisible = false;
  }

  hide() {
    this.container.classList.replace("component-active", "component-hidden");
    this.isVisible = false;
    // Используем опциональную цепочку или проверку типа
    if (
      typeof map !== "undefined" &&
      map &&
      typeof map.invalidateMap === "function"
    ) {
      map.invalidateMap();
    }
  }

  show() {
    this.container.classList.remove("component-hidden");
    this.container.classList.add("component-active");
    this.isVisible = true;
    // Используем опциональную цепочку или проверку типа
    if (
      typeof map !== "undefined" &&
      map &&
      typeof map.invalidateMap === "function"
    ) {
      map.invalidateMap();
    }
    // Если была логика отрисовки, она остается тут
  }
  isVisible() {
    return this.isVisible;
  }
}

export const sidebarComponent = new SibebarComponent("sidebar");
