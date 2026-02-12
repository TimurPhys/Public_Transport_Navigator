import { translations } from "../../../../json/parse_json.js";
import { transportType_to_id } from "../../../routes/routes.js";
import { time_tables } from "../../../../json/parse_json.js";

export function generateRouteButtonsTemplates(typed_route) {
  const html_templates = {
    tram: "",
    bus: "",
    minibus: "",
  };
  for (const transport_type of Object.keys(transportType_to_id)) {
    for (const id of transportType_to_id[transport_type].filter((el) =>
      typed_route != ""
        ? el.toLowerCase().includes(typed_route.toLowerCase())
        : el,
    )) {
      const direction = Object.keys(time_tables[id])[0];
      html_templates[transport_type] += `
        <button class="list-group-item list-group-item-action d-flex route-item" 
                data-id="${id}" data-default-direction="${direction}">
                <div class="route-id-container me-2">
                    <span class="badge bg-primary route-badge">${id}</span>
                </div>
            <div class="flex-grow-1">
                <div class="fw-semibold text-truncate">
                    ${direction}
                </div>
            </div>
            <span class="ms-2 text-muted small">&rsaquo;</span>
        </button>
      `;
    }
  }
  return html_templates;
}

function generateTypeButtonsTemplates(type, active) {
  return `
    <li class="nav-item" role="presentation">
        <button
          class="nav-link ${active ? "active" : ""}"
          id="pills-${type}-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-${type}"
          type="button"
          role="tab"
        >
          ${translations[type]}
        </button>
      </li>
  `;
}

export const getTransportListTemplate = (typed_route) => {
  const buttons_templates = generateRouteButtonsTemplates(typed_route);
  return `
  <div class="offcanvas-header border-bottom">
    <div>
      <h5 class="offcanvas-title mb-0" id="sidebarRoutesLabel">
        ${translations["first-sidebar-header-h1"]}
      </h5>
      <small class="text-muted"
        >${translations["first-sidebar-header-p"]}</small
      >
    </div>
    <button
      type="button"
      class="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
  </div>

  <div class="offcanvas-body d-flex flex-column overflow-hidden">
    <!-- Переключатели типов транспорта -->
    <ul class="nav nav-pills nav-fill mb-3" id="transport-pills-tab" role="tablist">
      ${generateTypeButtonsTemplates("bus", true)}
      ${generateTypeButtonsTemplates("minibus", false)}
      ${generateTypeButtonsTemplates("tram", false)}
    </ul>

    <!-- Фильтр по номеру/названию -->
    <div class="mb-3">
      <label class="form-label mb-1 small text-uppercase text-muted">
        ${translations["route-filter-title"]}
      </label>
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="${translations["route-filter-placeholder"]}"
        id="routeFilterInput"
      />
    </div>

    <!-- Списки маршрутов -->
    <div class="tab-content flex-grow-1 overflow-hidden" id="pills-tabContent">
      <!-- Автобусы -->
      <div
        class="tab-pane fade show active h-100"
        id="pills-bus"
        role="tabpanel"
      >
        <div class="list-group route-list-scroll overflow-y-auto small" id="busRouteList">
          <!-- Пример одного элемента. Потом вы будете генерировать их из JS -->
          ${buttons_templates["bus"]}
        </div>
      </div>

      <!-- Микроавтобусы -->
      <div class="tab-pane fade h-100" id="pills-minibus" role="tabpanel">
        <div class="list-group route-list-scroll overflow-y-auto small" id="minibusRouteList">
          <!-- наполнение аналогично автобусам -->
          ${buttons_templates["minibus"]}
        </div>
      </div>

      <!-- Трамваи -->
      <div class="tab-pane fade h-100" id="pills-tram" role="tabpanel">
        <div class="list-group route-list-scroll overflow-y-auto small" id="tramRouteList">
          <!-- наполнение аналогично -->
          ${buttons_templates["tram"]}
        </div>
      </div>
    </div>

    <!-- Служебный блок снизу -->
    <div class="pt-3 mt-3 border-top small text-muted connection-info-block">
      <div>
        ${translations["connection-state-title"]}:
        <span class="fw-semibold" id="connection-status">pievienots</span>
      </div>
      <div>
        ${translations["transports-quantity"]}:
        <span id="vehicleCount" id="vehicles_quantity">48</span>
      </div>
    </div>
    </div>
    `;
};

/* <div class="text-muted small text-center mt-3">
            Маршруты микроавтобусов будут отображены здесь
          </div> */
