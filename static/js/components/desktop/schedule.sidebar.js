import { BaseComponent } from "../../core/base.models.js";
import { transportListEvent } from "../../core/base.models.js";
import { transportListComponent } from "./list.sidebar.js";
import { getScheduleTemplate } from "./templates/schedule.template.js";
import { map } from "../../map/map.js";
import { navbar } from "./navbar.js";

class SidebarScheduleComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.block_type = "block";

    transportListEvent.on("route:selected", (route_data) => {
      this.data = route_data;

      this.show();
    });

    // offCanvas.addEventListener("hide.bs.offcanvas", () => {
    //   this.hide();
    //   navbar.show();
    // });
  }

  getTemplate() {
    return getScheduleTemplate();
  }

  render() {
    this.container.innerHTML = this.getTemplate();

    this.bindEvents();
  }

  bindEvents() {}

  hide() {
    this.container.style.display = "none";
    map.setAllStationsEvents(true);
    map.setAllTransportsEvents(true);
  }
  show() {
    this.container.style.display = "block"; // Или "flex", если используете его
    transportListComponent.hide();
    map.setAllStationsEvents(false);
    map.setAllTransportsEvents(false);
    if (this.container.innerHTML === "") {
      this.render();
    }
  }
}

const sidebarScheduleComponent = new SidebarScheduleComponent("scheduleBlock");
