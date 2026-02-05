import { createPolyline } from "./style/polyline_style.js";
import createLayers from "./style/map_styles.js";
import { createCustomIcon } from "./style/markers.js";
import { buses, minibuses } from "../routes/routes.js";
import { getStationIcon } from "./style/markers.js";
import { translations } from "../../json/parse_json.js";

// Класс пути транспорта
class TransportRoute {
  constructor(transport_id, route_direction, points) {
    this.transport_id = transport_id;
    this.route_direction = route_direction;
    this.points = points;
    this.polyline = null;
  }
  getPolyline() {
    if (!this.polyline) {
      this.polyline = createPolyline(this.points);
    }
    return this.polyline;
  }
}

// Класс карты транспорта
class TransportMap {
  constructor(containerId, center = [56.49, 21.02], map_type) {
    this.map = L.map(containerId).setView(center, 15);
    this.currentRoute = null; // Текующий отображаемый путь
    this.markers = new Map();
    createLayers()[map_type].addTo(this.map); // Инициализация стилей карты
  }

  // Центральный метод для добавления маршрута на карту
  displayRoute(routeData) {
    this.clearAll();

    const newRoute = new TransportRoute(routeData.id, routeData.path);
    const polyline = newRoute.getPolyline();

    polyline.addTo(this.map);
    this.currentRoute = polyline;

    this.map.fitBounds(polyline.getBounds());
  }

  // Показываю маркер на карте
  displayMarker(markerObject) {
    this.markers.set(markerObject.transport_number, markerObject);
    markerObject.marker.addTo(this.map);
  }

  // Убираю маркер с карты по номеру транспортного средства
  // (номер транспортного средства = индентификатор маркера этого транспорта на карте)
  removeMarker(markerId) {
    if (this.markers.has(markerId)) {
      const marker = this.markers.get(markerId);
      this.map.removeLayer(marker);
      marker.deleteMarker();
      this.markers.delete(markerId);
    }
  }

  isMarkerOnMap(markerId) {
    if (this.markers.has(markerId)) {
      return true;
    }
    return false;
  }

  getMarkerByNumber(markerNumber) {
    if (this.markers.has(markerNumber)) {
      return this.markers.get(markerNumber);
    }
    return null;
  }

  getMarkers() {
    return this.markers;
  }

  // Убрать все маршруты с карты
  hideRoute() {
    this.map.removeLayer(this.currentRoute);
  }
}

// Класс маркера транспорта
/*
metadata = {
    transport_id:
    transport_number:
    coords:
    azimuth:
}
*/
class TransportMarker {
  constructor(metadata) {
    this.type = null;
    this.azimuth = metadata.azimuth;
    this.transport_id = metadata.transport_id;
    this.transport_number = metadata.transport_number;
    this.coords = metadata.coords;
    this.marker = null;

    this.getTransportType(this.transport_id);
    this.createMarker();
  }

  // Получает тип транспорта (автобус, трамвай, маршрутка)
  getTransportType(transport_id) {
    let type = null;
    if (buses.includes(transport_id)) {
      type = "bus";
    } else if (minibuses.includes(transport_id)) {
      type = "minibus";
    } else {
      type = "tram";
    }
    this.type = type;
  }

  // Создает объект маркера, но не помещает ее на карту
  createMarker() {
    const marker = L.marker(this.coords, {
      icon: createCustomIcon(this.type, this.transport_id, this.azimuth),
      zIndexOffset: 900,
    });
    marker.bindPopup(`
              <b>${translations["number"]}: ${this.transport_number}</b><br>
              ${translations["type"]}: ${translations[this.type]}<br>
              ${translations["route"]}: ${this.transport_id}
          `);
    this.marker = marker;
  }

  // Обновляет положение маркера на карте и его азимут (угол поворота)
  updateMarkerPosition(new_metadata) {
    this.marker.setLatLng(new_metadata.coords);
    this.marker.setIcon(
      createCustomIcon(this.type, this.transport_id, new_metadata.azimuth),
    );
  }

  getMarkerNumber() {
    return this.transport_number;
  }

  // Удаляет маркер (полное удаление и стирание с карты происходит в TransportMap)
  deleteMarker() {
    this.marker.off();
    this.marker = null;
    console.log(`Маркер транспорта ${this.transport_number} уничтожен`);
  }
}

// Класс остановки транспорта
class TransportStation {
  constructor(name, coords, trans_attend) {
    this.name = name;
    this.coords = coords;
    this.trans_attend = trans_attend;
    this.station = null;
  }

  // Создает объект маркера станции
  createStation() {
    const station_marker = L.marker(this.coords, {
      icon: getStationIcon("stationIcon", 0.8),
      zIndexOffset: 900,
    });
    this.station = station_marker;
  }
}

export { TransportMap, TransportMarker, TransportRoute, TransportStation };
