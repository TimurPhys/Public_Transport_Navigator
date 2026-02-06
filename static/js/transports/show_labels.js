import { routeState, totalState } from "../map/map.js";
import {
  showOnlyChosenTransport,
  deletePolyline,
  deleteArrows,
  clearMarkers,
} from "../map/handleMarkerClick.js";
import { setHandlersOnRoutes } from "./handle_station_click.js";
import { sortRouteNames } from "../sidebar/list_routes.js";
import { translations } from "../../json/parse_json.js";

const image_from_type = {
  tram: "tram/real_tram.png",
  bus: "bus/real_bus.jpg",
  minibus: "minibus/real_minibus.png",
};

const card = document.querySelector(".transports-info-window");
const openOffCanvasButton = document.querySelector(
  "button.btn-openFirstOffcanvas",
);

function showPanel(map, vehicle, station) {
  card.style.display = "block"; // чтобы элемент был видим
  setTimeout(() => (card.style.opacity = "1"), 10);

  openOffCanvasButton.disabled = true;

  const card_body = createCardBody(vehicle, station);
  const list_group = createListGroup(vehicle, station);

  const transport_card = card.querySelector("div.card");
  transport_card.innerHTML = "";
  transport_card.appendChild(card_body);
  transport_card.appendChild(list_group);

  const close_button = document.querySelector(".transport-card .close-button");
  close_button.addEventListener("click", () => {
    closePanel();
  });

  if (station !== null && vehicle === null) {
    const route_links = document.querySelectorAll("ul.list-group a");
    setHandlersOnRoutes(route_links, station);
  }

  zoomOn(map, vehicle, station);
}

function createCardBody(vehicle, station) {
  const card_body = document.createElement("div");
  card_body.className = "card-body";
  if (vehicle !== null && station === null) {
    const type = vehicle["type"];
    const inner_html = `
      <h5 class="card-title">${translations[`${type}-singular`]}</p></h5>
      <button class="btn btn-danger close-button" type="button" style="position:absolute; top: 5px; right: 5px;">×</button>
      <img style="width: 300px; height: 225px;" src="../static/img/${
        image_from_type[type]
      }" alt="Transport image">
    `;
    card_body.insertAdjacentHTML("beforeend", inner_html);
    return card_body;
  } else if (station !== null && vehicle === null) {
    const inner_html = `
      <h5 class="card-title">${translations["station"]}</p></h5>
      <button class="btn btn-danger close-button" type="button" style="position:absolute; top: 5px; right: 5px;">×</button>
    `;
    card_body.insertAdjacentHTML("beforeend", inner_html);
    return card_body;
  }
}

function createListGroup(vehicle, station) {
  if (vehicle !== null && station === null) {
    const list_group = document.createElement("ul");
    list_group.className = "list-group list-group-flush";
    let inner_html = `
  <li class="list-group-item">${translations["route"]}: <b>${vehicle["route"]}</b></li>
    <li class="list-group-item">${translations["number"]}: <b>${vehicle["number"]}</b></li>
    `;
    list_group.insertAdjacentHTML("beforeend", inner_html);
    return list_group;
  } else if (station !== null && vehicle === null) {
    const list_group = document.createElement("ul");
    list_group.className = "list-group list-group-flush";
    let route_links = [];
    const sorted_trans_attend = sortRouteNames(station.trans_attend);
    for (const route of sorted_trans_attend) {
      const route_link = `<a href="#" data-route-name="${route}" class="text-nowrap me-2">${route}</a>`;
      route_links.push(route_link);
    }
    let inner_html = `
  <li class="list-group-item">${translations["station-name"]}: <b>${
    station.name
  }</b></li>
  <li class="list-group-item">${translations["routes"]}: ${route_links.join(
    "",
  )}</li>
    `;
    list_group.insertAdjacentHTML("beforeend", inner_html);
    return list_group;
  }
}

function zoomOn(map, vehicle, station) {
  if (vehicle !== null && station === null) {
    const lat = vehicle["marker"].getLatLng()["lat"];
    const lang = vehicle["marker"].getLatLng()["lng"];
    const latlng = [lat, lang];
    map.setView(latlng, map.getZoom());
  } // else if (station !== null && vehicle === null) {
  //   const lat = station["coords"]["lat"];
  //   const lang = station["coords"]["lng"];
  //   const latlng = [lat, lang];
  //   map.setView(latlng, map.getZoom());
  // }
}

function closePanel() {
  deletePolyline(routeState);
  deleteArrows(routeState);
  clearMarkers(routeState);
  showOnlyChosenTransport(routeState, totalState.map_vehicles, "number", true);
  card.style.opacity = "0";
  openOffCanvasButton.disabled = false;
  setTimeout(() => (card.style.display = "none"), 500); // убрать из потока после анимации
}

export { showPanel, closePanel, card, openOffCanvasButton };
