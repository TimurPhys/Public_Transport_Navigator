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

// function downloadObjectAsJson(exportObj, exportName) {
//   // 1. Превращаем объект в строку JSON с отступами (для красоты)
//   const dataStr =
//     "data:text/json;charset=utf-8," +
//     encodeURIComponent(JSON.stringify(exportObj, null, 2));

//   // 2. Создаем временный элемент <a> (ссылку)
//   const downloadAnchorNode = document.createElement("a");

//   // 3. Устанавливаем атрибуты: путь к данным и имя файла
//   downloadAnchorNode.setAttribute("href", dataStr);
//   downloadAnchorNode.setAttribute("download", exportName + ".json");

//   // 4. Добавляем в документ, "кликаем" и удаляем
//   document.body.appendChild(downloadAnchorNode);
//   downloadAnchorNode.click();
//   downloadAnchorNode.remove();
// }

// let new_time_tables = {};
// for (const route_key of Object.keys(time_tables)) {
//   new_time_tables[route_key] = {};
//   for (const direction_key of Object.keys(time_tables[route_key])) {
//     new_time_tables[route_key][direction_key] = {};
//     for (const station_key of Object.keys(
//       time_tables[route_key][direction_key],
//     )) {
//       new_time_tables[route_key][direction_key][station_key] = {};
//       const stationData = time_tables[route_key][direction_key][station_key];

//       new_time_tables[route_key][direction_key][station_key]["working_days"] =
//         stationData[0];
//       if (stationData.length === 2) {
//         new_time_tables[route_key][direction_key][station_key]["holidays"] =
//           stationData[1];
//       }
//     }
//   }
// }

// downloadObjectAsJson(new_time_tables, "new_time_tables");

console.log(time_tables);
// console.log(new_routes);
console.log(stations);

export { time_tables, new_routes, stations, translations, mapType };
