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
            class="list-group-item list-group-item-action ${data.station === station ? "active" : ""}"
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

function generateTableCollapseButton(data, days_type) {
  return `
        <div 
          class="card-header bg-white py-1 mt-2 d-flex justify-content-center ${data.collapsed_tables.includes(days_type) ? "collapsed" : ""}" 
          role="button"
          id="button-collapse-table"
          data-bs-toggle="collapse"
          data-dayType="${days_type}"
          data-bs-target="#collapse-${days_type}" 
          aria-expanded="false" 
        >
          <i class="bi bi-chevron-down transition-icon me-1"></i>
          <span>${translations[days_type]}</span>
        </div>
  `;
}

export function generateInfoContent(data) {
  const route_id = data.id;
  const direction = data.direction;
  const station = data.station;
  const stationData = time_tables[route_id][direction][station];

  let tables = "";
  for (const days_type of Object.keys(stationData)) {
    const day_time_table = stationData[days_type];
    let trs = "";
    for (const hour of Object.keys(day_time_table)) {
      let minute_links = "";
      for (const minute of day_time_table[hour]) {
        const minute_value = minute.split("-")[0];
        const route = minute.split("-")[1];
        const a_link = `<a id="minute-link" data-daysType="${days_type}" data-hour="${hour}" data-route="${route}" class="link-opacity-75-hover me-1 ${route === route_id ? "" : "other_route"}">${minute_value}</a>`;
        minute_links += a_link;
      }
      trs += `
            <tr>
              <td class="fw-bold">${hour}</td>
              <td class="">${minute_links}</td>
            </tr>
      `;
    }

    tables += `
    ${generateTableCollapseButton(data, days_type)}
    <div class="collapse ${data.collapsed_tables.includes(days_type) ? "" : "show"}" id="collapse-${days_type}">
              <div class="card-body p-0">
                <table class="table table-bordered table-sm mb-0 schedule-table">
                  <tbody>
                    ${trs}
                  </tbody>
                </table>
              </div>
            </div>`;
  }

  return tables;
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
      <div class="col pe-0 h-100">
        <div class="list-group">
          ${generateStationsButtons(data)}
        </div>
      </div>
      <div class="col pe-1">
        <div
          class="tab-content p-3"
          id="nav-tabContent"
          style="background-color: whitesmoke; border-radius: 2%"
        >
          <div
            class="tab-pane fade show active"
            id="list-home"
            role="tabpanel"
            aria-labelledby="list-home-list"
          >
            <div class="card">
              <div class="card-header" style="font-weight: 600">
                Также посещают:
              </div>
            </div>
            <div class="container d-flex flex-column px-0" id="schedule-container">
              ${generateInfoContent(data)}
            </div>
            <div class="card my-3">
              <div class="card-header">
                <strong style="font-weight: 600">Перевозчик:</strong> A/S
                "Liepājas autobusu parks"
              </div>
            </div>

            <div class="card mt-3">
              <div class="card-header">
                <strong style="font-weight: 600">Подсказки:</strong> Lorem ipsum
                dolor, sit amet consectetur adipisicing elit. Saepe, quod?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
    `;
};
