import { updateMap } from "./map.js";
import { translations } from "../../json/parse_json.js";

let ws = null;
let reconnectTimeout = null;

const connection_info_block = document.querySelectorAll(
  ".connection-info-block div",
);
// const connection_state = connection_info_block[0].querySelector("span");
// const transport_count = connection_info_block[1].querySelector("span");

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;

ws = new WebSocket(wsUrl);

function connectWebSocket() {
  ws.onopen = () => {
    // connection_state.textContent = translations["connected"];
    // connection_state.style.color = "green";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      updateMap(data.data);
    } else if (data.type === "data_error") {
      connection_state.textContent = translations["no_answer"];
      connection_state.style.color = "red";
      transport_count.textContent = "0";
    }
  };

  ws.onclose = () => {
    // connection_state.textContent = translations["disconnected"];
    // connection_state.style.color = "red";
    reconnect();
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    reconnect();
  };
}

function reconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    // connection_state.textContent = `${translations["reconnection"]}...`;
    // connection_state.style.color = "orange";
    connectWebSocket();
  }, 3000);
}

connectWebSocket();
