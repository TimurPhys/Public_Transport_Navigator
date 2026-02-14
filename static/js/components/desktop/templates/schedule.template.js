import { translations } from "../../../../json/parse_json.js";
import { time_tables } from "../../../../json/parse_json.js";

function generateDirectionSelect(data) {
  const route_id = data.id;
  const directions = Object.keys(time_tables[route_id]);
  let options = "";
  directions.forEach((direction) => {
    options += `<option value="${direction}" ${direction === data.direction ? "selected" : ""}>${direction}</option>`;
  });
  return `
    <select class="form-select" aria-label=".form-select">
      ${options}
    </select>
    `;
}

export function generateStationsButtons(data) {
  const route_id = data.id;
  const direction = data.direction;
  let buttons = "";
  const stations = Object.keys(time_tables[route_id][direction]);
  stations.forEach((station) => {
    buttons += `<a
            type="button"
            class="list-group-item list-group-item-action"
            id="station-button"
            data-route="${route_id}"
            data-station="${station}"
            style="height: auto; font-size: 15px"
          >
            ${station}
          </a>`;
  });
  return buttons;
}

export function generateInfoContent(data) {
  return `
          <div
            class="tab-pane fade show active"
            id="list-home"
            role="tabpanel"
            aria-labelledby="list-home-list"
          >
            <div class="card mb-3">
              <div class="card-header" style="font-weight: 600">
                Также посещают:
              </div>
            </div>

            <div class="container d-flex flex-column">

            <div 
              class="card-header bg-white p-2 d-flex justify-content-between align-items-center" 
              role="button"
              data-bs-toggle="collapse" 
              data-bs-target="#collapseWorkdays" 
              aria-expanded="false" 
              style="cursor: pointer; font-weight: 600;"
            >
              <span>Рабочие дни</span>
              <i class="bi bi-chevron-down transition-icon"></i>
            </div>

            <div class="collapse show" id="collapseWorkdays">
              <div class="card-body p-0">
                <table class="table table-bordered mb-0">
                  <tbody>
                    <tr><td class="fw-bold" style="width: 50px;">6</td><td>05, 25, 45</td></tr>
                    <tr><td class="fw-bold">7</td><td>10, 30, 50</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

              <table class="table table-bordered mb-4" style="width: auto">
                <thead>
                  <tr>
                    <th colspan="2" style="font-weight: 600">Выходные дни</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600">6</td>
                    <td>adsf</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>Cell D</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card mb-3">
              <div class="card-header">
                <strong style="font-weight: 600">Перевозчик:</strong> A/S
                "Liepājas autobusu parks"
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <strong style="font-weight: 600">Подсказки:</strong> Lorem ipsum
                dolor, sit amet consectetur adipisicing elit. Saepe, quod?
              </div>
            </div>
          </div>
          `;
}

// Отображение расписания
export const getScheduleTemplate = (data) => {
  return `
  <div class="sidebar-schedule-content d-flex flex-column h-100">
  <div class="sidebar-header px-3 py-2 border-bottom d-flex justify-content-between align-items-center flex-shrink-0">
    <button 
      type="button" 
      class="btn-back-custom" 
      id="btn-back" 
      aria-label="Back"
    ><i class="bi bi-chevron-left"></i></button>
    <h5 class="sidebar-title mb-0">
      ${translations["second-sidebar-header-h1"]}
    </h5>
    <button 
      type="button" 
      class="btn-close-custom" 
      id="btn-close" 
      aria-label="Close"
    ><i class="bi bi-x-lg"></i></button>
  </div>
  <div class="sidebar-body py-2 px-3 d-flex flex-column flex-grow-1 overflow-hidden">
    <div class="container d-flex mb-3 px-0">
      <span
        class="badge bg-primary me-2 d-inline-flex align-items-center justify-content-center badge-custom"
        style="width: auto; font-size: 18px"
        >${data.id}</span
      >
      ${generateDirectionSelect(data)}
    </div>

    <div class="row flex-grow-1 overflow-hidden scrollable-list">
      <div class="col-4 pe-0 h-100">
        <div class="list-group">
          ${generateStationsButtons(data)}
        </div>
      </div>
      <div class="col-8 pe-1">
        <div
          class="tab-content p-3"
          id="nav-tabContent"
          style="background-color: whitesmoke; border-radius: 2%"
        >
          ${generateInfoContent(data)}
        </div>
      </div>
    </div>
  </div>
  </div>
    `;
};
