async function parse_json(file_path) {
  try {
    const response = await fetch(file_path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
}

const appData = JSON.parse(document.getElementById("app-data").textContent);
const translations = appData.translations;
const mapType = appData.map_type;

let time_tables = null;
let new_routes = null;
let stations = null;

await parse_json("/static/json/new_time_tables.json").then((data) => {
  if (data) {
    time_tables = data;
    console.log("Данные загружены!");
  }
});
await parse_json("/static/json/new_routes.json").then((data) => {
  if (data) {
    new_routes = data;
  }
});
await parse_json("/static/json/stations.json").then((data) => {
  if (data) {
    stations = data;
  }
});

// let new_time_tables = {};
// for (const route_key of Object.keys(time_tables)) {
//   new_time_tables[route_key] = {};
//   for (const direction_key of Object.keys(time_tables[route_key])) {
//     new_time_tables[route_key][direction_key] = {};
//     for (const station_key of Object.keys(
//       time_tables[route_key][direction_key],
//     )) {
//       new_time_tables[route_key][direction_key][station_key] =
//         time_tables[route_key][direction_key][station_key][0];
//     }
//   }
// }
console.log(time_tables);
// console.log(new_routes);
console.log(stations);

export { time_tables, new_routes, stations, translations, mapType };
