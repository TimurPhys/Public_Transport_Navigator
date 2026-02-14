import { BaseComponent } from "../../core/base.models.js";
import { transportListEvent } from "../../core/base.models.js";
import { transportListComponent } from "./list.sidebar.js";
import { getScheduleTemplate } from "./templates/schedule.template.js";
import { map } from "../../map/map.js";
import { sidebarEvent } from "../../core/base.models.js";
import {
  generateInfoContent,
  generateStationsButtons,
} from "./templates/schedule.template.js";

class SidebarScheduleComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.containers = null;

    transportListEvent.on("route:selected", (route_data) => {
      this.data = route_data;
      this.show();
    });

    sidebarEvent.on("sidebar:hidden", () => {
      this.hide();
    });
    sidebarEvent.on("sidebar:movedBack", () => {
      this.hide();
    });
  }

  getTemplate() {
    return getScheduleTemplate(this.data);
  }

  render() {
    this.container.innerHTML = this.getTemplate();
    this.containers = {
      buttons_list: this.container.querySelector(".list-group"),
      info_content: this.container.querySelector("#nav-tabContent"),
    };

    this.bindEvents();
  }

  // Events связанные с закрытием/открытием меню
  bindSidebarEvents() {
    const close_button = this.container.querySelector("#btn-close");
    close_button.addEventListener("click", () => {
      sidebarEvent.emit("sidebar:hidden", {});
    });
    const back_button = this.container.querySelector("#btn-back");
    back_button.addEventListener("click", () => {
      sidebarEvent.emit("sidebar:movedBack", {});
    });
  }
  bindSelectEvents() {
    const select = this.container.querySelector("select.form-select");
    select.addEventListener("change", (e) => {
      const selectedDirection = e.target.value;
      this.data.direction = selectedDirection;
      this.render();
    });
  }

  bindStationButtonsEvents() {
    const station_buttons = this.container.querySelectorAll("a#station-button");
    station_buttons.forEach((station_button) => {
      station_button.addEventListener("click", () => {
        station_buttons.forEach((station_button) => {
          station_button.classList.remove("active");
        });
        station_button.classList.add("active");
        this.containers.info_content.innerHTML = generateInfoContent();
      });
    });
  }

  bindEvents() {
    this.bindSelectEvents();
    this.bindSidebarEvents();
    this.bindStationButtonsEvents();
  }

  hide() {
    this.container.style.display = "none";
    map.setAllStationsEvents(true);
    map.setAllTransportsEvents(true);
  }
  show() {
    this.container.style.display = "block"; // Или "flex", если используете его
    transportListComponent.hide();
    // Отключаем events у маркеров на карте
    map.setAllStationsEvents(false);
    map.setAllTransportsEvents(false);
    // Всегда обновляем содержимое
    this.render();
  }
}

const sidebarScheduleComponent = new SidebarScheduleComponent("scheduleBlock");
