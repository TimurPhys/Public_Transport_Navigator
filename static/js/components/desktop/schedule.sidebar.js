import { BaseComponent } from "../../core/base.models.js";
import { transportListEvent } from "../../core/base.models.js";
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
    this.data = {
      collapsed_tables: [],
      station: null,
    };

    transportListEvent.on("route:selected", (route_data) => {
      Object.assign(this.data, route_data); // Копируем поля из route_data в this.data
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
      info_content: this.container.querySelector("#schedule-container"),
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
        const chosen_station_name = station_button.getAttribute("data-station");
        this.data.station = chosen_station_name;
        this.checkTablesCollapse();
        this.containers.info_content.innerHTML = generateInfoContent(this.data);
      });
    });
  }

  checkTablesCollapse() {
    let collapsed_tables = [];
    const tables = this.container.querySelectorAll("#button-collapse-table");
    tables.forEach((table) => {
      if (table.classList.contains("collapsed")) {
        const table_type = table.getAttribute("data-dayType");
        collapsed_tables.push(table_type);
      }
    });
    console.log(collapsed_tables);
    this.data.collapsed_tables = collapsed_tables;
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
    // Отключаем events у маркеров на карте
    map.setAllStationsEvents(false);
    map.setAllTransportsEvents(false);
    // Всегда обновляем содержимое
    this.render();
  }
}

const sidebarScheduleComponent = new SidebarScheduleComponent("scheduleBlock");
