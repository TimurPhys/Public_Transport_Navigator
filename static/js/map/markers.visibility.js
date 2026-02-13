import { refreshTransports, refreshStations } from "./map.js";

// Объект в котором будут указаны маркеры, которые можно показывать
export const markersVisility = {
  tram: true,
  bus: true,
  minibus: true,
  stations: false,
};

export function bindFilterEvents() {
  const transport_checkboxes = document
    .querySelector(".transports-show")
    .querySelectorAll("input");
  const stations_checkbox = document
    .querySelector(".show-stations")
    .querySelector("input");

  transport_checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const checkbox_type = checkbox.id.replace("filter", "").toLowerCase();
      markersVisility[checkbox_type] = checkbox.checked;
      refreshTransports();
    });
  });

  stations_checkbox.addEventListener("change", () => {
    markersVisility.stations = stations_checkbox.checked;
    refreshStations();
  });
}
