import { refreshTransports, showStations } from "../map/map.js";

let allowed_transports = ["tram", "bus", "minibus"];

const checkboxes = document
  .querySelector(".transports-show")
  .querySelectorAll("input");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    switch (checkbox.id) {
      case "filterBus":
        if (checkbox.checked) {
          allowed_transports.push("bus");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("bus"), 1);
        }
        break;
      case "filterTram":
        if (checkbox.checked) {
          allowed_transports.push("tram");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("tram"), 1);
        }
        break;
      case "filterMinibus":
        if (checkbox.checked) {
          allowed_transports.push("minibus");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("minibus"), 1);
        }
        break;
    }

    console.log(allowed_transports);
    refreshTransports();
  });
});

const show_stations_checkbox = document.querySelector(".show-stations input");

show_stations_checkbox.addEventListener("change", (e) => {
  showStations(show_stations_checkbox.checked);
});

export { allowed_transports, show_stations_checkbox, checkboxes };
