import { time_tables } from "../../json/parse_json.js";
import {
  setHandlerOnButtons,
  setHandlersOnLinks,
  setHandlerOnSelect,
  handleTablesCollapse,
  schedule_tables,
  setHandlersOnRedirectLinks,
} from "./handlers.js";
import { routeState, totalState } from "../map/map.js";
import { new_routes } from "../routes/routes.js";
// import { sortRouteNames } from "./list_routes.js";
import { translations } from "../../json/parse_json.js";

const secondOffcanvasDiv = document.getElementById("secondOffcanvas");
const firstOffcanvasDiv = document.getElementById("offcanvas");
const firstOffcanvas = new bootstrap.Offcanvas(firstOffcanvasDiv);
const route_items = document.querySelectorAll("button.route-item");

route_items.forEach((route_item) => {
  route_item.addEventListener("click", (e) => {
    const route_name = route_item.querySelector("span.badge").textContent;
    const direction = route_item.querySelector("div .fw-semibold").textContent;
    openSecondOffcanvas();
    firstOffcanvas.hide();
    createSelect(route_name, direction); // Далее рекурсивно создаеются остальные блоки
    showCurrentRouteOnMap(route_name, direction);
  });
});

// Работаю с картой и показываю траекторию маршрута
function showCurrentRouteOnMap(route_name, direction) {
  routeState.currentRoute = route_name;
  showMarkersRoute(routeState, totalState, direction, "route_name");
  processCloseButton();
}

function processCloseButton() {
  const hide_route_div = document.querySelector("div.hide-route");
  hide_route_div.classList.remove("d-none"); // Показываю div с кнопкой "Закрыть маршрут"
  const secondOffCanvas = document.querySelector("#secondOffcanvas");

  const hide_route_button = hide_route_div.querySelector("button"); // Достаю кнопку из div
  secondOffCanvas.addEventListener("hide.bs.offcanvas", () => {
    if (hide_route_button.offsetParent === null) {
      // Если кнопка не отображается
      removeCurrentRouteFromMap(routeState);
      hide_route_div.classList.add("d-none");
    } else {
      hide_route_button.addEventListener("click", () => {
        removeCurrentRouteFromMap(routeState);
        hide_route_div.classList.add("d-none");
      });
    }
  });
}

function removeCurrentRouteFromMap(routeState) {
  deletePolyline(routeState);
  deleteArrows(routeState);
  clearMarkers(routeState);
  showOnlyChosenTransport(
    routeState,
    totalState.map_vehicles,
    "route_name",
    true,
  );
}

function openSecondOffcanvas() {
  setTimeout(() => {
    const secondOffcanvas = new bootstrap.Offcanvas(secondOffcanvasDiv);
    secondOffcanvas.show();
  }, 200);
}

function showStationTimetable(
  row_div,
  direction,
  route_name,
  station_name,
  station_buttons,
) {
  let tables_html = "";
  const tables =
    time_tables[route_name][direction]["time_tables"][station_name];
  let weekDay = "";
  let maxHoursAmount = null;
  let largestTable = null;
  if (tables) {
    if (tables.length > 1) {
      maxHoursAmount = Math.max(
        Object.keys(tables[0]).length,
        Object.keys(tables[1]).length,
      );
      for (const table of tables) {
        if (Object.keys(table).length === maxHoursAmount) {
          largestTable = table;
        }
      }
    } else {
      largestTable = tables[0];
    }
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentLocaleTime = now.toLocaleString("ru-RU", {
    timeZone: "Europe/Riga",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const current_hour = currentLocaleTime.split(":")[0];
  const current_minute = currentLocaleTime.split(":")[1];

  for (let i = 0; i < tables.length; i++) {
    let table_index = null;
    if (i == 0) {
      weekDay = "working_days";
      table_index = 0;
    } else if (i == 1) {
      weekDay = "holidays";
      table_index = 1;
    }
    let table = document.createElement("table");
    table.className = "table table-bordered mt-3 mb-0 time-table custom-table";
    let rows = "";
    for (const hour of Object.keys(largestTable)) {
      const minutes = tables[i][hour];
      if (minutes) {
        let minutes_a = "";
        let all_row_is_left = true;
        for (const minute of minutes) {
          const minute_a = document.createElement("a");
          minute_a.className =
            "link-opacity-100-hover link-underline link-underline-opacity-0 me-2";
          const route_name_from_table = minute
            .split("-")[1]
            .trim()
            .toLowerCase();
          minute_a.textContent = minute.split("-")[0];
          if (
            parseInt(minute_a.textContent) < parseInt(current_minute) &&
            parseInt(hour) === parseInt(current_hour) &&
            ((i === 0 && currentDay <= 5 && currentDay > 0) ||
              (i === 1 && currentDay === 0) ||
              currentDay === 6)
          ) {
            minute_a.style.backgroundColor = "#ecececff";
            minute_a.style.padding = "1px";
          } else {
            all_row_is_left = false;
          }
          if (route_name_from_table === route_name.toLowerCase()) {
            minute_a.classList.add("link-dark");
          } else {
            minute_a.classList.add("link-primary");
          }
          minute_a.id = `route_${route_name_from_table}`;
          minute_a.href = "#";
          minutes_a += minute_a.outerHTML;
        }
        let hourStyle = "";
        let minutesStyle = "";
        if (
          (i === 0 && currentDay <= 5 && currentDay > 0) ||
          (i === 1 && currentDay === 0) ||
          currentDay === 6
        ) {
          if (parseInt(hour) < parseInt(current_hour) || all_row_is_left) {
            hourStyle = `background-color: #ecececff; color: #575757ff`;
            minutesStyle = `background-color: #ecececff; color: #1a1a1a`;
          } else {
            hourStyle = "";
            minutesStyle = "";
          }
        }
        rows += `
            <tr>
                            <td style="font-weight: 600; ${hourStyle}">${hour}</td>
                            <td style="${minutesStyle}">${minutes_a}</td>
                        </tr>
            `; // Добавляем каждую строку к таблице
      } else {
        rows += `
            <tr>
                            <td style="font-weight: 900">-</td>
                            <td></td>
                        </tr>
            `; // Все равно добавляем строку, если даже там пусто
      }
    }
    table.innerHTML = `<thead>
                        <tr>
                          <th colspan="2" style="font-weight: 600">
                              <button class="btn btn-sm float-center" 
                                  type="button" 
                                  data-bs-toggle="collapse" 
                                  data-bs-target="#tableBody-${weekDay}"
                                  aria-expanded="${
                                    weekDay == "working_days"
                                      ? schedule_tables.working_days
                                      : schedule_tables.holidays
                                  }"
                                  id="toggleButton">
                                    <span class="toggle-icon"><i class="bi bi-chevron-up"></i></span> ${
                                      weekDay == "working_days"
                                        ? translations["working-days"]
                                        : translations["holidays"]
                                    }
                              </button>
                          </th>
                        </tr>
                        </thead>
        
`;
    tables_html +=
      table.outerHTML +
      `<!-- Collapse должен быть на DIV -->
        <div id="tableBody-${weekDay}" data-week-day="${weekDay}" class="collapse ${
          weekDay === "working_days"
            ? schedule_tables.working_days
              ? "show"
              : "hide"
            : schedule_tables.holidays
              ? "show"
              : "hide"
        } my-0 table-collapse">
          <!-- ВНУТРЕННЯЯ таблица с твоими строками -->
          <table class="table table-bordered time-table custom-table" data-table-index="${table_index}">
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>`;
  }

  routeState.currentRoute = route_name;
  let route_links = [];
  const direction_option = getCorrectRouteOption(routeState, direction);
  for (const station of new_routes[route_name][direction_option]["stations"]) {
    if (
      station.name === station_name ||
      (station.name === "Mirdzas Ķempes iela" &&
        station_name === "M. Ķempes iela")
    ) {
      const sorted_trans_attend = sortRouteNames(station.trans_attend);
      for (const trans of sorted_trans_attend) {
        if (trans !== route_name) {
          const route_link = `<a href="#" data-route-number=${trans} class="text-nowrap pe-2">${trans}</a>`;
          route_links.push(route_link);
        }
      }
    }
  }

  const route_description_html = `<div class="col-8">
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
            <div class="card mb-3">
              <div class="card-header" style="font-weight: 600">
                ${translations["also-attend"]}: ${route_links.join("")}
              </div>
            </div>

            <div class="container m-0 justify-content-around">
             ${tables_html}
            </div>
            <div class="card mt-3 mb-3">
              <div class="card-header">
                <strong style="font-weight: 600">${
                  translations["carrier"]
                }:</strong> ${translations["carrier-name"]}
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <strong style="font-weight: 600">${
                  translations["hints"]
                }:</strong> ${translations["hints-text"]}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  if (document.querySelector("table.time-table")) {
    row_div.removeChild(row_div.lastChild);
  }

  row_div.insertAdjacentHTML("beforeend", route_description_html);
  handleTablesCollapse();

  setHandlersOnRedirectLinks(station_name);
  setHandlersOnLinks(route_name, direction, station_buttons);
}

function createSelect(my_route_name, my_direction) {
  secondOffcanvasDiv.innerHTML = "";
  const header = `<div class="offcanvas-header border-bottom">
    <h5 class="offcanvas-title">${translations["second-sidebar-header-h1"]}</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
    ></button>
  </div>
  `;
  const offcanvas_body_div = document.createElement("div");
  offcanvas_body_div.className = "offcanvas-body py-1";

  const select_direction = document.createElement("select");
  select_direction.name = "direction-selector";
  select_direction.className = "form-select direction-select";
  select_direction.ariaLabel = ".form-select";

  for (const direction of Object.keys(time_tables[my_route_name])) {
    const option = document.createElement("option");
    option.value = direction;
    option.text = direction;
    select_direction.options.add(option);
  }

  offcanvas_body_div.insertAdjacentHTML(
    "beforeend",
    `
  <div class="container d-flex mb-2 border-bottom py-2">
      <span
        class="badge bg-primary me-2 d-inline-flex align-items-center justify-content-center badge-custom"
        style="width: auto; font-size: 18px"
        >${my_route_name}</span>
        ${select_direction.outerHTML}
    </div>`,
  );
  secondOffcanvasDiv.insertAdjacentHTML("afterbegin", header);
  secondOffcanvasDiv.appendChild(offcanvas_body_div);

  const added_select_direction = document.querySelector(
    "select.direction-select",
  );
  added_select_direction.value = my_direction;
  setHandlerOnSelect(added_select_direction, my_route_name, offcanvas_body_div);
  createSchedule(my_route_name, my_direction, offcanvas_body_div);
}

function createSchedule(my_route_name, my_direction, offcanvas_body_div) {
  const old_row_div = offcanvas_body_div.querySelector("div.row");
  if (old_row_div) {
    offcanvas_body_div.removeChild(old_row_div);
  }
  const row_div = document.createElement("div");
  row_div.className = "row";

  let buttonsListHtml = "";
  let i = 0;
  let state = "";
  for (const station_name of Object.keys(
    time_tables[my_route_name][my_direction]["time_tables"],
  )) {
    if (i === 0) {
      state = "active";
    } else {
      state = "";
    }
    const button = `<button
            type="button"
            class="list-group-item list-group-item-action ${state} station-button"
            aria-current="true"
            style="min-height: 45px; font-size: 15px; line-height: 1.2; padding: 10px;"
            data-station-name=${station_name.replaceAll(" ", "_")}
          >
            <strong class="me-2"></strong>${station_name}</button>`;
    buttonsListHtml += button;
    i += 1;
  }

  const buttonsListDiv = `<div class="col-4 pe-0">
        <div class="list-group">
          ${buttonsListHtml}
        </div>
      </div>`;
  row_div.innerHTML = buttonsListDiv;
  offcanvas_body_div.appendChild(row_div);
  secondOffcanvasDiv.appendChild(offcanvas_body_div);

  const station_buttons = document.querySelectorAll("button.station-button");

  setHandlerOnButtons(row_div, my_direction, my_route_name, station_buttons);
  showStationTimetable(
    row_div,
    my_direction,
    my_route_name,
    station_buttons[0].textContent.trim(),
    station_buttons,
  );
}

export {
  showStationTimetable,
  createSchedule,
  showCurrentRouteOnMap,
  removeCurrentRouteFromMap,
  openSecondOffcanvas,
  createSelect,
  processCloseButton,
};
