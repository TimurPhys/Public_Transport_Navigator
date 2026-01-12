import { time_tables } from "../../json/parse_json.js";

function getNearestTimes(route, direction, station) {
  const now = new Date();
  const curTimeString = now.toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Riga",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const cur_hour = curTimeString.split(":")[0];
  const cur_minute = curTimeString.split(":")[1];
  const cur_day = now.getDay();

  let chosen_table_index = 0;
  if (
    cur_day > 5 &&
    time_tables[route][direction]["time_tables"][station].length === 2
  ) {
    chosen_table_index = 1;
  }

  let nearest_times = [];

  // console.log(`Станция ${station}`);
  // console.log(`Маршрут ${route}`);
  // console.log(`Направление ${direction}`);
  // console.log(`Номер таблицы ${chosen_table_index}`);
  for (
    let i = parseInt(cur_hour);
    i <=
    Math.max(
      ...Object.keys(
        time_tables[route][direction]["time_tables"][station][
          chosen_table_index
        ]
      ).map((value) => parseInt(value))
    );
    i++
  ) {
    if (
      time_tables[route][direction]["time_tables"][station][chosen_table_index][
        i.toString()
      ]
    ) {
      if (nearest_times.length <= 3) {
        if (i >= parseInt(cur_hour)) {
          const minutes = time_tables[route][direction]["time_tables"][station][
            chosen_table_index
          ][i.toString()].filter(
            (value) => value.split("-")[1] === route.toLowerCase()
          );
          for (const minute of minutes) {
            if (
              (parseInt(cur_hour) === i &&
                parseInt(minute.split("-")[0]) >= parseInt(cur_minute)) ||
              i > parseInt(cur_hour)
            ) {
              nearest_times.push(`<b>${i}:${minute.split("-")[0]}</b>`);
            }
          }
        }
      } else {
        break;
      }
    }
  }
  // Далее выполняется только, если не произошел break и nearest_times.length все еще < 3, тогда начинаем идти с нуля
  if (nearest_times.length <= 3) {
    if (
      cur_day === 5 &&
      time_tables[route][direction]["time_tables"][station][1]
    ) {
      chosen_table_index = 1;
    }
    for (
      let i = Math.min(
        ...Object.keys(
          time_tables[route][direction]["time_tables"][station][
            chosen_table_index
          ]
        ).map((value) => parseInt(value))
      );
      i <= parseInt(cur_hour);
      i++
    ) {
      if (
        time_tables[route][direction]["time_tables"][station][
          chosen_table_index
        ][i.toString()]
      ) {
        if (nearest_times.length <= 3) {
          if (i <= parseInt(cur_hour)) {
            const minutes = time_tables[route][direction]["time_tables"][
              station
            ][chosen_table_index][i.toString()].filter(
              (value) => value.split("-")[1] === route.toLowerCase()
            );
            for (const minute of minutes) {
              if (
                (parseInt(cur_hour) === i &&
                  parseInt(minute.split("-")[0]) < parseInt(cur_minute)) ||
                i < parseInt(cur_hour)
              ) {
                nearest_times.push(`<b>${i}:${minute.split("-")[0]}</b>`);
              }
            }
          }
        } else {
          break;
        }
      }
    }
  }

  return nearest_times;
}

export { getNearestTimes };
