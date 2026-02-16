// import { new_routes } from "../routes/routes.js";
// import { routeState, totalState, openChosenStationPopup } from "../map/map.js";
// import {
//   showMarkersRoute,
//   getDirectionFromRouteOption,
// } from "../map/handleMarkerClick.js";
// import { getNearestTimes } from "./get_nearest_time.js";
// import {
//   openSecondOffcanvas,
//   createSelect,
//   processCloseButton,
// } from "../sidebar/show_schedule.js";
// import { card, showPanel, openOffCanvasButton } from "./show_labels.js";
// import { navbarCollapse } from "../init.js";
// import { translations } from "../../json/parse_json.js";

// function setHandlersOnRoutes(route_links, chosen_station) {
//   Array.from(route_links).forEach((route_link) => {
//     route_link.addEventListener("click", (e) => {
//       route_links.forEach((route_link) => {
//         route_link.style = "";
//       });
//       route_link.style.fontWeight = "700";
//       route_link.style.color = "black";
//       route_link.style.border = "1px solid blue";
//       route_link.style.borderRadius = "20%";
//       route_link.style.padding = "1px";
//       route_link.style.textDecoration = "none";
//       const chosen_route = route_link.getAttribute("data-route-name");
//       let myKeyDirection = null;
//       for (const key of Object.keys(new_routes[chosen_route])) {
//         for (const station of new_routes[chosen_route][key]["stations"]) {
//           if (
//             station.coords.lat === chosen_station.coords.lat &&
//             station.coords.lng === chosen_station.coords.lng
//           ) {
//             myKeyDirection = key;
//           }
//         }
//       }
//       routeState.currentRoute = chosen_route;
//       const direction = getDirectionFromRouteOption(routeState, myKeyDirection);
//       showMarkersRoute(
//         routeState,
//         totalState,
//         myKeyDirection,
//         "route_name",
//         true,
//       );
//       navbarCollapse.hide();
//       openChosenStationPopup(chosen_station.name);
//       showAdditionalStationInfo(chosen_route, direction, chosen_station);
//       handleClickOnOtherRouteMarkers(routeState, myKeyDirection);
//     });
//   });
// }

// function handleClickOnOtherRouteMarkers(routeState, myKeyDirection) {
//   const markers = routeState.currentMarkers;
//   const currentRoute = routeState.currentRoute;
//   for (const marker of markers) {
//     marker.on("click", () => {
//       const myStationObject = new_routes[currentRoute][myKeyDirection][
//         "stations"
//       ].find(
//         (station) =>
//           station.coords.lat === marker.getLatLng().lat &&
//           station.coords.lng === marker.getLatLng().lng,
//       );
//       showPanel(map, null, myStationObject);
//       const direction = getDirectionFromRouteOption(routeState, myKeyDirection);
//       showAdditionalStationInfo(currentRoute, direction, myStationObject);
//     });
//   }
// }

// function showAdditionalStationInfo(chosen_route, direction, chosen_station) {
//   const ul_list = document.querySelector("div.card ul.list-group");
//   const added_elements = document.querySelectorAll("li.add-info");
//   if (added_elements) {
//     Array.from(added_elements).forEach((added_element) =>
//       added_element.remove(),
//     );
//   }
//   const nearest_times = getNearestTimes(
//     chosen_route,
//     direction,
//     chosen_station.name,
//   );

//   let html = `
//   <li class="list-group-item add-info">${translations["nearest-times"]}: ${
//     nearest_times.length >= 3
//       ? nearest_times.slice(0, 3).join(", ")
//       : nearest_times.join(", ")
//   }</li>
//   <li class="list-group-item add-info">${
//     translations["direction"]
//   }: <b>${direction}</b></li>
//   <li class="list-group-item add-info">${
//     translations["add-info"]
//   } <a href="#" class="redirect_on_page">${translations["here"]}</a></li>
//   `;
//   ul_list.insertAdjacentHTML("beforeend", html);
//   setHandlerOnRedirectLink(chosen_route, direction, chosen_station);
// }

// function setHandlerOnRedirectLink(route_name, direction, station) {
//   const redirect_link = document.querySelector(
//     "li.add-info a.redirect_on_page",
//   );
//   redirect_link.addEventListener("click", function () {
//     console.log(route_name);
//     card.style.opacity = "0";
//     setTimeout(() => (card.style.display = "none"), 500);
//     openOffCanvasButton.disabled = false;
//     openSecondOffcanvas();
//     createSelect(route_name, direction);
//     const my_station_button = document.querySelector(
//       `[data-station-name="${station["name"].replaceAll(" ", "_")}"]`,
//     );
//     my_station_button.click(); // Кликаем на нашу до этого выбранную остановку
//     processCloseButton();
//   });
// }

// export { setHandlersOnRoutes };
