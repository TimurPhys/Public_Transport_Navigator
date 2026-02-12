import { BaseComponent } from "../../core/base.models.js";
import { stationEvent } from "../../core/base.models.js";

class StationCardComponent extends BaseComponent {
    constructor(containerId) {
        super(containerId)

        stationEvent.on("station:selected", (station_data) => {
            this.data = station_data;
            console.log("Station Event")
            this.render()
        })
    }
    getTemplate() {
    const { name, trans_attend } = this.data;
    return `
        <div class="card station-card">
            <div class="card-body">
                <h5 class="card-title">Остановка</p></h5>
                <button class="btn btn-danger close-button" type="button" style="position:absolute; top: 5px; right: 5px;">×</button>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item route"><span style="font-weight:600;">Название:</span> ${name}</li>
                <li class="list-group-item number"><span style="font-weight:600;">Маршруты:</span> ${trans_attend}</li>
             </ul>
        </div>
    `;
  }

  render() {
    // Вставляем контент
    this.container.innerHTML = this.getTemplate();

    // Принудительно заставляем браузер пересчитать стили перед анимацией
    requestAnimationFrame(() => {
      this.container.classList.add("active");
    });

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.container.querySelector(".close-button");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
        if (this.data.marker_instance) {
          this.data.marker_instance.closePopup();
        }
      });
    }
  }

  hide() {
    // 1. Убираем класс (запускается анимация CSS)
    this.container.classList.remove("active");

    // 2. Ждем окончания перехода, прежде чем стереть DOM
    // Это событие сработает, когда закончится transition из CSS
    this.container.addEventListener(
      "transitionend",
      () => {
        if (!this.container.classList.contains("active")) {
          this.container.innerHTML = "";
          this.data = null;
        }
      },
      { once: true },
    );
  }
}

const stationCard = new StationCardComponent("stations-info-window")