import createLayers from "../core/map.style/map.styles.js";
import { createCustomIcon } from "../core/map.style/markers.js";
import markersVisility from "./markers.visibility.js";
import { showPanel } from "../transports/show_labels.js";
import { stations } from "../routes/routes.js";
import { getStationIcon } from "../core/map.style/markers.js";
import { mapType, translations } from "../../json/parse_json.js";
import { removeCurrentRouteFromMap } from "../sidebar/show_schedule.js";
import { transportListComponent } from "../components/desktop/list.sidebar.js";

import {
  TransportMap,
  TransportRoute,
  TransportStation,
  TransportMarker,
} from "../core/map.models.js";

const map = new TransportMap("map", [56.49, 21.02], mapType);

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
  // transport_quantity.textContent = vehicles.length;

  // 1. Создаем Set локально при каждом обновлении
  const uniqueTransportMarkers = new Set();

  vehicles.forEach((vehicle) => {
    if (vehicle["route"]) {
      const vehicle_data = {
        transport_id: vehicle["route"],
        transport_number: vehicle["number"],
        coords: [vehicle["long"], vehicle["lat"]],
        azimuth: vehicle["azimuth"],
      };
      uniqueTransportMarkers.add(vehicle["number"]);

      // Если маркера нет на карте, то добавляем его
      if (!map.isTransportMarkerOnMap(vehicle_data.transport_number)) {
        // console.log("Добавляем маркер транспорта");

        const vehicleObject = TransportMarker.create(vehicle_data);
        // Если можно показывать
        if (vehicleObject) {
          if (markersVisility[vehicleObject.type] === true) {
            map.displayTransportMarker(vehicleObject);
          }
        }
      }
      // Если маркер уже на карте, то просто меняем его состояние
      else {
        const existingVehicle = map.getTransportMarkerByNumber(
          vehicle_data.transport_number,
        );
        existingVehicle.updateTransportMarkerPosition(vehicle_data);
      }
    }
  });

  // 2. Удаляем те маркеры, которых нет в свежем списке uniqueTransportMarkers
  // Итерируемся по всем маркерам, которые СЕЙЧАС хранятся в объекте карты
  for (const transport_number of map.getTransportMarkers().keys()) {
    if (!uniqueTransportMarkers.has(transport_number)) {
      map.removeTransportMarker(transport_number);
    }
  }
}

export function refreshTransports() {
  console.log("Обновляем транспорт");
  for (const transport_marker of map.getTransportMarkers().values()) {
    // Если маркер транспорта сейчас отображается на карте
    const transport_number = transport_marker.transport_number;
    if (!markersVisility[transport_marker.type]) {
      // Маркер уничтожен
      map.removeTransportMarker(transport_number);
      // Иначе добавляем транспорт обратно на карту
    }
  }
}

export function refreshStations() {
  if (markersVisility.stations) {
    for (const station of stations) {
      const metadata = {
        name: station.name,
        coords: station.coords,
        trans_attend: station.trans_attend,
      };
      const new_station = new TransportStation(metadata);
      map.displayStationMarker(new_station);
    }
  } else {
    const existing_station_markers = map.getStationMarkers();
    for (const existing_station_coords of existing_station_markers.keys()) {
      map.removeStationMarker(existing_station_coords);
    }
  }
}

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
export { openChosenStationPopup, findStationMarkerByName };
