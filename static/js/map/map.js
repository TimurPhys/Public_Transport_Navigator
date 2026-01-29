import createLayers from "./style/map_styles.js";
import { createCustomIcon } from "./style/markers.js";
import { allowed_transports } from "../transports/filter_transport.js";
import { showPanel } from "../transports/show_labels.js";
import { showMarkersRoute } from "./handle_marker_click.js";
import { stations, buses, minibuses } from "../routes/routes.js";
import { getStationIcon } from "./style/markers.js";
import { mapType, translations } from "../../json/parse_json.js";
import { removeCurrentRouteFromMap } from "../sidebar/show_schedule.js";

const map = L.map("map").setView([56.49, 21.02], 15);

const transport_quantity = document
  .querySelectorAll(".connection-info-block div")[1]
  .querySelector("span");

const tiles = createLayers()[`${mapType}`];
tiles.addTo(map);

const routeState = {
  currentPolyline: null,
  currentArrows: null,
  currentMarkers: [],
  currentRoute: null,
  currentNumber: null,
  latlng: null,
};
const totalState = {
  map_vehicles: [],
  map_stations: [],
};

function vehicle_init(vehicle) {
  let type = null;
  let icon = null;
  if (buses.includes(vehicle["route"])) {
    type = "bus";
    icon = createCustomIcon("bus", vehicle["route"], vehicle["azimuth"]);
  } else if (minibuses.includes(vehicle["route"])) {
    type = "minibus";
    icon = createCustomIcon("minibus", vehicle["route"], vehicle["azimuth"]);
  } else {
    type = "tram";
    icon = createCustomIcon("tram", vehicle["route"], vehicle["azimuth"]);
  }
  return {
    type: type,
    icon: icon,
  };
}
let currentIds = new Set();

function updateMap(vehicles) {
  transport_quantity.textContent = vehicles.length;

  // Обновляем маркеры
  vehicles.forEach((vehicle) => {
    if (vehicle["route"] !== "") {
      const latlng = [vehicle["long"], vehicle["lat"]];

      if (
        !totalState.map_vehicles.find(
          (map_vehicle) => map_vehicle["number"] === vehicle["number"],
        )
      ) {
        const settings = vehicle_init(vehicle);
        const marker = L.marker(latlng, {
          title: `Транспорт ${vehicle["route"]}`,
          icon: settings["icon"],
          zIndexOffset: 900,
        });
        vehicle["type"] = settings[`type`];
        vehicle["marker"] = marker;

        if (allowed_transports.includes(settings["type"])) {
          // Рисую
          currentIds.add(vehicle["number"]);
          totalState.map_vehicles.push(vehicle); // Добавляю в массив
          vehicle["marker"].addTo(map); // Добавляем маркер на карте
          vehicle["marker"].bindPopup(`
                                <b>${translations["number"]}: ${
                                  vehicle["number"]
                                }</b><br>
                                ${translations["type"]}: ${
                                  translations[`${settings[`type`]}`]
                                }<br>
                                ${translations["route"]}: ${vehicle["route"]}
                            `); // Добавляем всплывающее окно
          vehicle["marker"].on("click", () => {
            routeState.currentRoute = vehicle["route"];
            routeState.currentNumber = vehicle["number"];
            routeState.latlng = vehicle["marker"].getLatLng();
            // Привязываю обработчик нажатий
            showMarkersRoute(routeState, totalState);
            const hide_route_div = document.querySelector("div.hide-route"); // Достаю кнопку из div
            if (window.innerWidth >= 990) {
              showPanel(map, vehicle, null);
            } else {
              hide_route_div.classList.remove("d-none");
              const hide_route_button = hide_route_div.querySelector("button");
              hide_route_button.addEventListener("click", () => {
                removeCurrentRouteFromMap(routeState);
                hide_route_div.classList.add("d-none");
                map.closePopup();
              });
            }
          });
        }
      } else {
        const vehicle_to_update = totalState.map_vehicles.find(
          (map_vehicle) => map_vehicle["number"] === vehicle["number"],
        );
        vehicle_to_update["marker"].setLatLng(latlng);
      }
    }
  });
  // Удаляем старые маркеры
  for (let i = totalState.map_vehicles.length - 1; i >= 0; i--) {
    const map_vehicle = totalState.map_vehicles[i];

    if (!currentIds.has(map_vehicle["number"])) {
      map.removeLayer(map_vehicle["marker"]);
      totalState.map_vehicles.splice(i, 1); // Удаляем текущий элемент
    }
  }
}

function refreshTransports() {
  for (let i = totalState.map_vehicles.length - 1; i >= 0; i--) {
    const map_vehicle = totalState.map_vehicles[i];
    const transport_type = map_vehicle["type"];

    if (!allowed_transports.includes(transport_type)) {
      map.removeLayer(map_vehicle["marker"]);
      totalState.map_vehicles.splice(i, 1); // Удаляем текущий элемент
    }
  }
}

function showStations(yesNo) {
  if (totalState.map_stations.length === 0 && yesNo === true) {
    for (const station of stations) {
      const marker = L.marker(station.coords, {
        icon: getStationIcon("stationIcon", 0.8),
      }).addTo(map);
      marker.on("click", () => {
        showPanel(map, null, station);
      });
      marker.bindPopup(`<b>${station.name}</b>`);
      totalState.map_stations.push(marker);

      clusterGroup.addLayer(marker);
    }
    map.addLayer(clusterGroup);
  } else if (totalState.map_stations.length !== 0 && yesNo === false) {
    for (const station_marker of totalState.map_stations) {
      map.removeLayer(station_marker);
      station_marker.off("click");
    }
    totalState.map_stations.length = 0;
    clusterGroup.clearLayers();
    map.removeLayer(clusterGroup);
  }
}

const clusterGroup = L.markerClusterGroup({
  maxClusterRadius: 10, // Радиус в пикселях для объединения маркеров
  iconCreateFunction: function (cluster) {
    return getStationIcon("stationIcon", 1);
  },
  spiderfyOnMaxZoom: true, // Раскрывать кластер при максимальном зуме
  showCoverageOnHover: true, // Показывать область кластера при наведении
  zoomToBoundsOnClick: true, // Приближать при клике на кластер
  disableClusteringAtZoom: 14, // Отключить кластеризацию на этом зуме и выше
});

function openChosenStationPopup(station_name) {
  for (const marker of routeState.currentMarkers) {
    const marker_popup_content = marker.getPopup().getContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(marker_popup_content, "text/html");
    const cleanText = doc.body.textContent;
    if (
      cleanText === station_name ||
      (cleanText === "Mirdzas Ķempes iela" && station_name === "M. Ķempes iela")
    ) {
      marker.openPopup();
      break;
    }
  }
}

function findStationMarkerByName(station_name) {
  for (const marker of routeState.currentMarkers) {
    const marker_popup_content = marker.getPopup().getContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(marker_popup_content, "text/html");
    const cleanText = doc.body.textContent;
    if (
      cleanText === station_name ||
      (cleanText === "Mirdzas Ķempes iela" && station_name === "M. Ķempes iela")
    ) {
      return marker;
    }
  }
}

// -----------------------------------------------------------------------

export { map, routeState, totalState };
export { updateMap };
export {
  refreshTransports,
  showStations,
  openChosenStationPopup,
  findStationMarkerByName,
};
