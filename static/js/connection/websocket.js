import { updateMap } from "../map/map.js";
import { transportListComponent } from "../components/sidebar/list/list.js";

let ws = null;
let reconnectTimeout = null;

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;

ws = new WebSocket(wsUrl);

function connectWebSocket() {
  ws.onopen = () => {
    transportListComponent.statusManager.updateConnection("connected")
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      transportListComponent.statusManager.updateConnection("connected")
      transportListComponent.statusManager.updateQuantity(data.data.length);
      updateMap(data.data);
    } else if (data.type === "data_error") {
      transportListComponent.statusManager.updateConnection("default")
      transportListComponent.statusManager.updateQuantity(0);
    }
  };

  ws.onclose = () => {
    transportListComponent.statusManager.updateConnection("default")
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
    transportListComponent.statusManager.updateConnection("orange")
    connectWebSocket();
  }, 3000);
}

connectWebSocket();
