import { time_tables, translations } from "../../../../../json/parse_json.js";

function generateTableCollapseButton(data, days_type) {
  return `
        <div 
          class="card-header bg-white py-1 mt-2 d-flex justify-content-center ${data.collapsed_tables.includes(days_type) ? "collapsed" : ""}" 
          role="button"
          id="button-collapse-table"
          data-bs-toggle="collapse"
          data-dayType="${days_type}"
          data-bs-target="#collapse-${days_type}" 
          aria-expanded="false" 
        >
          <i class="bi bi-chevron-down transition-icon me-1"></i>
          <span>${translations[days_type]}</span>
        </div>
  `;
}

export function generateTables(data) {
  const route_id = data.id;
  const direction = data.direction;
  const station = data.station;
  const stationData = time_tables[route_id][direction][station];

  let tables = "";
  for (const days_type of Object.keys(stationData)) {
    const day_time_table = stationData[days_type];
    let trs = "";
    for (const hour of Object.keys(day_time_table)) {
      let minute_links = "";
      for (const minute of day_time_table[hour]) {
        const minute_value = minute.split("-")[0];
        const route = minute.split("-")[1];
        const a_link = `<a id="minute-link" data-daysType="${days_type}" data-hour="${hour}" data-route="${route}" class="link-opacity-75-hover me-1 ${route === route_id ? "" : "other_route"}">${minute_value}</a>`;
        minute_links += a_link;
      }
      trs += `
            <tr>
              <td class="fw-bold">${hour}</td>
              <td class="">${minute_links}</td>
            </tr>
      `;
    }

    tables += `
    ${generateTableCollapseButton(data, days_type)}
    <div class="collapse ${data.collapsed_tables.includes(days_type) ? "" : "show"}" id="collapse-${days_type}">
              <div class="card-body p-0">
                <table class="table table-bordered table-sm mb-0 schedule-table">
                  <tbody>
                    ${trs}
                  </tbody>
                </table>
              </div>
            </div>`;
  }

  return tables;
}

export default class InfoContentManager {
  constructor(data, container) {
    this.data = data;
    this.containers = {
      also_attend: container.querySelector("#also-attend-card"),
      schedule: container.querySelector("#schedule-container"),
    };
    this.refresh();
  }
  refresh() {
    const tables = generateTables(this.data);
    this.containers.schedule.innerHTML = tables;
  }
}
