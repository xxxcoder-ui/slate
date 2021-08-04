import * as Environment from "~/node_common/environment";
import * as Strings from "~/common/strings";
import * as Logging from "~/common/logging";

import WebSocket from "ws";

let ws;

export const create = () => {
  if (ws) {
    return;
  }

  if (Strings.isEmpty(Environment.URI_FIJI)) {
    return;
  }

  ws = new WebSocket(Environment.URI_FIJI, {
    perMessageDeflate: false,
  });

  ws.on("ping", function () {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      Logging.log(`Did not receive ping in time. Disconnecting websocket`);
      this.terminate();
    }, 30000 + 1000);
  });

  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "SUBSCRIBE_HOST", data: {} }));
  });

  ws.on("close", () => {
    global.websocket = null;
    setTimeout(() => {
      Logging.log(`Auto reconnecting websocket`);
      create();
    }, 1000);
    Logging.log(`Websocket disconnected`);
  });

  Logging.log(`Websocket server started`);

  global.websocket = ws;
  return global.websocket;
};

export const get = () => global.websocket;
