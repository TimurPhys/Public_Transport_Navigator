import {
  showStationTimetable,
  createSchedule,
  createSelect,
} from "./show_schedule.js";
import {
  openChosenStationPopup,
  findStationMarkerByName,
  routeState,
} from "../map/map.js";
import { time_tables } from "../../json/parse_json.js";
import { getStopTimes } from "./get_stop_times.js";
import { showCurrentRouteOnMap, processCloseButton } from "./show_schedule.js";
import { new_routes } from "../routes/routes.js";
import { getDirectionFromRouteOption } from "../map/handle_marker_click.js";

const schedule_tables = {
  working_days: true,
  holidays: true,
};

function setHandlerOnButtons(row_div, direction, route_name, station_buttons) {
  if (station_buttons.length !== 0) {
    station_buttons.forEach((station_button) => {
      station_button.addEventListener("click", (e) => {
        station_buttons.forEach((btn) => {
          btn.className = "list-group-item list-group-item-action";
        });
        station_button.className =
          "list-group-item list-group-item-action active";

        const station_name = e.target.lastChild.textContent.trim();
        openChosenStationPopup(station_name);
        showStationTimetable(
          row_div,
          direction,
          route_name,
          station_name,
          station_buttons
        );
        const cur_time = e.target.querySelector("strong").textContent.trim();
        if (cur_time) {
          const cur_hour = cur_time.split(":")[0];
          const cur_minutes = cur_time.split(":")[1];
          const cur_minute_link = findNewMinuteLink(cur_hour, cur_minutes);
          cur_minute_link.click();
        }
      });
    });
  }
}

function setHandlersOnLinks(route_name, direction, station_buttons) {
  let minutes_links = document.querySelectorAll('a[id^="route_"]');
  minutes_links.forEach((minute_link) => {
    minute_link.addEventListener("click", (e) => {
      let active_button_index = null;
      let active_station_name = null;
      station_buttons.forEach((station_button) => {
        if (station_button.classList.contains("active")) {
          active_station_name = station_button.lastChild.textContent.trim();
          active_button_index =
            Array.from(station_buttons).indexOf(station_button);
        }
      });

      const cur_hour =
        minute_link.parentElement.previousElementSibling.textContent;
      const cur_minutes = minute_link.textContent;

      const table = minute_link.closest("table");
      const tables = table.closest("div").querySelectorAll("table");
      const table_index = Array.from(tables).indexOf(table);

      const other_route_name = minute_link.id.split("_")[1];

      if (other_route_name === route_name.toLowerCase()) {
        // Если номер транспорта не поменялся
        const stop_times = getStopTimes(
          // Находим времена для нашего транспорта
          cur_hour,
          cur_minutes,
          direction,
          route_name,
          table_index,
          station_buttons,
          active_button_index
        );

        let i = 0;
        station_buttons.forEach((station_button) => {
          const strong = station_button.querySelector("strong"); // Вставляем времена
          strong.textContent = stop_times[i];
          i += 1;
        });
        minutes_links.forEach((each_minute_link) => {
          // Удаляем только стили выделения, оставляя остальные
          each_minute_link.style.fontWeight = "";
          each_minute_link.style.color = "";
          each_minute_link.style.border = "";
          each_minute_link.style.borderRadius = "";
          each_minute_link.style.padding = "";
        });
        minute_link.style.fontWeight = "700";
        minute_link.style.color = "black";
        minute_link.style.border = "1px solid blue";
        minute_link.style.borderRadius = "20%";
        minute_link.style.padding = "1px";
        // minute_link.style.cssText = `
        //   font-weight: 700; color: black; border: 1px solid blue; border-radius: 20%; padding: 1px;`; // Делаем выделение клетки
      } else {
        // Если номер транспорта изменился
        const other_route_directions = Object.keys(
          // Находим направление для нового номера транспорта
          time_tables[
            !other_route_name.includes("s")
              ? other_route_name.toUpperCase()
              : other_route_name
          ]
        );
        let direction_for_redirect = null;
        for (const other_route_direction of other_route_directions) {
          if (
            other_route_direction.split(" - ")[0] === direction.split(" - ")[0]
          ) {
            direction_for_redirect = other_route_direction;
          } else if (
            other_route_direction.split(" - ")[1] === direction.split(" - ")[1]
          ) {
            direction_for_redirect = other_route_direction;
          }
        }
        createSelect(
          // Делаем редирект на новую страницу
          !other_route_name.includes("s")
            ? other_route_name.toUpperCase()
            : other_route_name,
          direction_for_redirect
        );
        const my_station_button = document.querySelector(
          `[data-station-name="${active_station_name.replaceAll(" ", "_")}"]`
        );
        my_station_button.click(); // Кликаем на нашу до этого выбранную остановку
        const newMinuteLink = findNewMinuteLink(cur_hour, cur_minutes); // Находим ту ссылку у которой значение совпадает
        newMinuteLink.click(); // Нажимаем на эту ссылку, далее выполняется код в первом if

        showCurrentRouteOnMap(
          !other_route_name.includes("s")
            ? other_route_name.toUpperCase()
            : other_route_name,
          direction_for_redirect
        ); // Обновляю маршрут на карте
        openChosenStationPopup(active_station_name);
      }
    });
  });
}

function findNewMinuteLink(hourValue, minutesValue) {
  const rows = document.querySelectorAll("tr");
  for (let row of rows) {
    const firstTd = row.querySelector("td:first-child");
    const links = row.querySelectorAll('a[id^="route_"]');

    if (firstTd && links) {
      for (let link of links) {
        const hour = firstTd.textContent.trim();
        const minutes = link.textContent.trim();

        if (hour === hourValue && minutes === minutesValue) {
          return link;
        }
      }
    }
  }
  return null;
}

function setHandlerOnSelect(
  select_direction,
  my_route_name,
  offcanvas_body_div
) {
  select_direction.addEventListener("change", (e) => {
    const new_direction = e.target.value.trim();
    createSchedule(my_route_name, new_direction, offcanvas_body_div);
    showCurrentRouteOnMap(my_route_name, new_direction);
  });
}

function handleTablesCollapse() {
  const tableDivs = document.querySelectorAll("div.table-collapse");
  for (const tableDiv of tableDivs) {
    tableDiv.addEventListener("hidden.bs.collapse", () => {
      const table_type = tableDiv.getAttribute("data-week-day");
      if (table_type === "working_days") {
        schedule_tables.working_days = false;
      } else if (table_type === "holidays") {
        schedule_tables.holidays = false;
      }
    });
    tableDiv.addEventListener("shown.bs.collapse", () => {
      const table_type = tableDiv.getAttribute("data-week-day");
      if (table_type === "working_days") {
        schedule_tables.working_days = true;
      } else if (table_type === "holidays") {
        schedule_tables.holidays = true;
      }
    });
  }
}

function setHandlersOnRedirectLinks(chosen_station) {
  const redirect_links = document.querySelectorAll("[data-route-number]");
  Array.from(redirect_links).forEach((redirect_link) => {
    redirect_link.addEventListener("click", () => {
      const chosen_station_latlng =
        findStationMarkerByName(chosen_station).getLatLng();
      const route_name = redirect_link.getAttribute("data-route-number");
      console.log(route_name);
      let myKeyDirection = null;
      for (const key of Object.keys(new_routes[route_name])) {
        for (const station of new_routes[route_name][key]["stations"]) {
          if (
            station.coords.lat === chosen_station_latlng.lat &&
            station.coords.lng === chosen_station_latlng.lng
          ) {
            myKeyDirection = key;
          }
        }
      }
      routeState.currentRoute = route_name;
      const direction = getDirectionFromRouteOption(routeState, myKeyDirection);
      console.log(route_name, chosen_station, direction);

      createSelect(route_name, direction);
      const my_station_button = document.querySelector(
        `[data-station-name="${chosen_station.replaceAll(" ", "_")}"]`
      );
      my_station_button.click(); // Кликаем на нашу до этого выбранную остановку
      showCurrentRouteOnMap(route_name, direction);
      // processCloseButton();
    });
  });
}

export {
  setHandlerOnButtons,
  setHandlerOnSelect,
  setHandlersOnLinks,
  handleTablesCollapse,
  setHandlersOnRedirectLinks,
  schedule_tables,
};
