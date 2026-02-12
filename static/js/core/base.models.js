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

  // 1. Сохраняем данные
  setState(newData) {
    this.data = newData;
    this.render(); // Перерисовываем при изменении данных
  }

  // 2. Генерируем чистую строку HTML
  getTemplate() {
    return `<div>Base Template</div>`;
  }

  // 3. Главный метод отрисовки
  render() {
    if (!this.data) return;

    // Вставляем HTML
    this.container.innerHTML = this.getTemplate();

    // 4. Важно: навешиваем события ТОЛЬКО после вставки в DOM
    this.bindEvents();
  }

  bindEvents() {
    // Переопределяется в дочерних классах
  }
}

export { BaseComponent };
export const stationEvent = new EventEmitter();
export const transportEvent = new EventEmitter();
export const transportListEvent = new EventEmitter();

export const offCanvas = document.getElementById("offcanvas");
