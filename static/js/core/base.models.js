class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }
}

class BaseComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = null;
    this.block_type = null;
  }

  // 1. Генерируем чистую строку HTML
  getTemplate() {
    return `<div>Base Template</div>`;
  }
  к;

  // 3. Главный метод отрисовки
  render() {
    // Вставляем HTML
    this.container.innerHTML = this.getTemplate();

    // 4. Важно: навешиваем события ТОЛЬКО после вставки в DOM
    this.bindEvents();
  }

  bindEvents() {
    // Переопределяется в дочерних классах
  }

  hide() {
    this.container.classList.replace("component-active", "component-hidden");
  }

  show() {
    if (this.container.innerHTML === "") this.render();
    this.container.classList.remove("component-hidden");
    this.container.classList.add("component-active");
  }
}

export { BaseComponent };
export const stationEvent = new EventEmitter();
export const transportEvent = new EventEmitter();
export const transportListEvent = new EventEmitter();
export const sidebarEvent = new EventEmitter();
