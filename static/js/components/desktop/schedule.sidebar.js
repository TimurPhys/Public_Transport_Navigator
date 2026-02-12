import { BaseComponent, offCanvas } from "../../core/base.models.js";
import { transportListEvent } from "../../core/base.models.js";
import { transportListComponent } from "./list.sidebar.js";
import { getScheduleTemplate } from "./templates/schedule.template.js";

class SidebarScheduleComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    this.block_type = "block";

    transportListEvent.on("route:selected", (route_data) => {
      this.data = route_data;
      console.log("Route selected Event");
      transportListComponent.hide();
      this.show();
    });

    offCanvas.addEventListener("hide.bs.offcanvas", () => {
      this.hide();
    });
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
  }
  show() {
    this.container.style.display = "block"; // Или "flex", если используете его
    if (this.container.innerHTML === "") {
      this.render();
    }
  }
}

const sidebarScheduleComponent = new SidebarScheduleComponent("scheduleBlock");
