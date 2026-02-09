import { BaseComponent } from "../../core/base.models.js";
import { translations } from "../../../json/parse_json.js";
import { transportEvent } from "../../core/base.models.js";

class TransportCardComponent extends BaseComponent {
  constructor(containerId) {
    super(containerId);
    // Подписываемся на событие
    transportEvent.on("transport:selected", (transport_data) => {
      this.data = transport_data;
      console.log("Event");
      this.render();
    });
  }
  getTemplate() {
    const { type, id, number } = this.data;
    return `
        <div class="card transport-card">
            <div class="card-body">
                <h5 class="card-title">${translations[`${type}-singular`]}</p></h5>
                <button class="btn btn-danger close-button" type="button" style="position:absolute; top: 5px; right: 5px;">×</button>
                <img style="width: 300px; height: 225px;" src="" alt="Transport image">
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item route"><span style="font-weight:600;">${translations["route"]}:</span> ${id}d</li>
                <li class="list-group-item number"><span style="font-weight:600;">${translations["number"]}:</span> ${number}</li>
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

  // Привязываем обработчики событий
  bindEvents() {
    const closeBtn = this.container.querySelector(".close-button");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
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

const transportCard = new TransportCardComponent("transports-info-window");
