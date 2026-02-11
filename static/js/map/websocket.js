import { updateMap } from "./map.js";
import { translations } from "../../json/parse_json.js";
import { transportListComponent } from "../components/desktop/list.sidebar.js";

let ws = null;
let reconnectTimeout = null;

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;

ws = new WebSocket(wsUrl);

function connectWebSocket() {
  ws.onopen = () => {
    transportListComponent.updateConnectionState("connected");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      transportListComponent.updateConnectionState("connected");
      transportListComponent.updateVehiclesQuantity(data.data.length);
      updateMap(data.data);
    } else if (data.type === "data_error") {
      transportListComponent.updateConnectionState("no_answer");
      transportListComponent.updateVehiclesQuantity(0);
    }
  };

  ws.onclose = () => {
    transportListComponent.updateConnectionState("disconnected");
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
    transportListComponent.updateConnectionState("reconnection");
    connectWebSocket();
  }, 3000);
}

connectWebSocket();
