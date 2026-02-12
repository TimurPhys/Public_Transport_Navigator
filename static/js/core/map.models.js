import { createPolyline } from "./map.style/polyline.style.js";
import createLayers from "./map.style/map.styles.js";
import { createCustomIcon } from "./map.style/markers.js";
import { transportType_to_id } from "../routes/routes.js";
import { getStationIcon } from "./map.style/markers.js";
import { translations } from "../../json/parse_json.js";
import { transportEvent, stationEvent } from "./base.models.js";

// Класс карты транспорта
class TransportMap {
  constructor(containerId, center = [56.49, 21.02], map_type) {
    this.map = L.map(containerId).setView(center, 15);
    this.currentRoute = null; // Текующий отображаемый путь
    this.transportMarkers = new Map();
    this.stationMarkers = new Map();
    this.stationsClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 10, // Радиус в пикселях для объединения маркеров
      iconCreateFunction: function (cluster) {
        return getStationIcon("stationIcon", 1);
      },
      spiderfyOnMaxZoom: true, // Раскрывать кластер при максимальном зуме
      showCoverageOnHover: true, // Показывать область кластера при наведении
      zoomToBoundsOnClick: true, // Приближать при клике на кластер
      disableClusteringAtZoom: 14, // Отключить кластеризацию на этом зуме и выше
    });
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
  // Показывает маркер трнаспорта на карте
  
  displayTransportMarker(markerObject) {
    this.transportMarkers.set(markerObject.transport_number, markerObject);
    markerObject.marker.addTo(this.map);
  }
  // Показывает остановку
  displayStationMarker(stationObject) {
    this.stationMarkers.set(stationObject.coords, stationObject);
    this.stationsClusterGroup.addLayer(stationObject.marker)
    this.stationsClusterGroup.addTo(this.map)
  }

  // Убираю маркер с карты по номеру транспортного средства
  // (номер транспортного средства = индентификатор маркера этого транспорта на карте)
  removeTransportMarker(markerId) {
    if (this.transportMarkers.has(markerId)) {
      const marker = this.transportMarkers.get(markerId);
      this.map.removeLayer(marker.marker);
      marker.deleteMarker();
      this.transportMarkers.delete(markerId);
    }
  }
  removeStationMarker(stationId) {
    if (this.stationMarkers.has(stationId)) {
      const marker = this.stationMarkers.get(stationId);
      this.stationsClusterGroup.removeLayer(marker.marker)
      marker.deleteMarker();
      this.stationMarkers.delete(stationId);
    }
  }

  isTransportMarkerOnMap(markerId) {
    if (this.transportMarkers.has(markerId)) {
      return true;
    }
    return false;
  }

  getTransportMarkerByNumber(markerNumber) {
    if (this.transportMarkers.has(markerNumber)) {
      return this.transportMarkers.get(markerNumber);
    }
    return null;
  }

  getTransportMarkers() {
    return this.transportMarkers;
  }

  getStationMarkers() {
    return this.stationMarkers;
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
  constructor(metadata, transportType) {
    this.type = transportType;
    this.azimuth = metadata.azimuth;
    this.transport_id = metadata.transport_id;
    this.transport_number = metadata.transport_number;
    this.coords = metadata.coords;
    this.marker = null;

    this.createMarker();
  }

  // Статический метод для создания экземпляра
  static create(metadata) {
    // 1. Ищем тип до того, как создать объект
    const transportType = TransportMarker.determineType(metadata.transport_id);

    // 2. Если тип не найден, возвращаем null вместо объекта
    if (!transportType) {
      // console.warn(`Тип для ID ${metadata.transport_id} не найден. Объект не создан.`);
      return null; 
    }

    // 3. Если всё ок, создаем и возвращаем экземпляр
    return new TransportMarker(metadata, transportType);
  }

  // Получает тип транспорта (автобус, трамвай, маршрутка)
  static determineType(transportId) {
    for (const [type, ids] of Object.entries(transportType_to_id)) {
      if (ids.includes(transportId)) {
        return type;
      }
    }
    return null;
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
    marker.on("click", () => {
      transportEvent.emit("transport:selected", {
        type: this.type,
        id: this.transport_id,
        number: this.transport_number,
        marker_instance: this.marker,
      });
    });

    this.marker = marker;
  }

  // Обновляет положение маркера на карте и его азимут (угол поворота)
  updateTransportMarkerPosition(new_metadata) {
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
    // console.log(`Маркер транспорта ${this.transport_number} уничтожен`);
  }
}

// Класс остановки транспорта
class TransportStation {
  constructor(metadata) {
    this.name = metadata.name;
    this.coords = metadata.coords;
    this.trans_attend = metadata.trans_attend;
    this.marker = null;

    this.createStation();
  }

  // Создает объект маркера станции
  createStation() {
    const station_marker = L.marker(this.coords, {
      icon: getStationIcon("stationIcon", 0.8),
      zIndexOffset: 900,
    });
    station_marker.bindPopup(`<b>${this.name}</b>`)
    this.marker = station_marker;
    station_marker.on("click", () => {
      stationEvent.emit("station:selected", {
        name: this.name,
        coords: this.coords,
        trans_attend: this.trans_attend,
        marker_instance: this.marker
      });
    });
  }

  deleteMarker() {
    this.marker.off();
    this.marker = null;
    // console.log(`Маркер остановки ${this.name} уничтожен`);
  }
}

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

export { TransportMap, TransportMarker, TransportRoute, TransportStation };
