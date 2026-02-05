import createLayers from "./style/map_styles.js";
import { createCustomIcon } from "./style/markers.js";
import { allowed_transports } from "../transports/filter_transport.js";
import { showPanel } from "../transports/show_labels.js";
import { showMarkersRoute } from "./handle_marker_click.js";
import { stations, buses, minibuses } from "../routes/routes.js";
import { getStationIcon } from "./style/markers.js";
import { mapType, translations } from "../../json/parse_json.js";
import { removeCurrentRouteFromMap } from "../sidebar/show_schedule.js";

import {
  TransportMap,
  TransportRoute,
  TransportStation,
  TransportMarker,
} from "./models.js";

const map = new TransportMap("map", [56.49, 21.02], mapType);
// const map = L.map("map").setView([56.49, 21.02], 15);

const transport_quantity = document
  .querySelectorAll(".connection-info-block div")[1]
  .querySelector("span");

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

function updateMap(vehicles) {
  transport_quantity.textContent = vehicles.length;

  // 1. Создаем Set локально при каждом обновлении
  const uniqueTransportMarkers = new Set();

  vehicles.forEach((vehicle) => {
    const vehicle_data = {
      transport_id: vehicle["route"],
      transport_number: vehicle["number"],
      coords: [vehicle["long"], vehicle["lat"]],
      azimuth: vehicle["azimuth"],
    };
    uniqueTransportMarkers.add(vehicle["number"]);

    // Если маркера нет на карте, то добавляем его
    if (!map.isMarkerOnMap(vehicle_data.transport_number)) {
      const vehicleObject = new TransportMarker(vehicle_data);
      map.displayMarker(vehicleObject);
    }
    // Если маркер уже на карте, то просто меняем его состояние
    else {
      const existingVehicle = map.getMarkerByNumber(
        vehicle_data.transport_number,
      );
      existingVehicle.updateMarkerPosition(vehicle_data);
    }
  });

  // 2. Удаляем те маркеры, которых нет в свежем списке uniqueTransportMarkers
  // Итерируемся по всем маркерам, которые СЕЙЧАС хранятся в объекте карты
  for (const transport_number of map.getMarkers().keys()) {
    if (!uniqueTransportMarkers.has(transport_number)) {
      console.log("Удаляем маркер");
      map.removeMarker(transport_number);
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
