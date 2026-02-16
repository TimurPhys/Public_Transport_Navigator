import { translations } from "../../../../json/parse_json.js";

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
    <div class="container d-flex mb-3 px-0" id="direction-select-container">
      <span
        class="badge bg-primary me-2 d-inline-flex align-items-center justify-content-center badge-custom"
        style="width: auto; font-size: 18px"
        >${data.id}</span
      >
    </div>

    <div class="row flex-grow-1 overflow-hidden scrollable-list">
      <div class="col pe-0 h-100">
        <div class="list-group" id="station-button-container">
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
            <div class="card" id="also-attend-card">
              <div class="card-header" style="font-weight: 600">
                Также посещают:
              </div>
            </div>
            <div class="container d-flex flex-column px-0" id="schedule-container">
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
