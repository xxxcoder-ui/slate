import * as Window from "~/common/window";
import * as Strings from "~/common/strings";
import * as Logging from "~/common/logging";
import * as Environment from "~/common/environment";

let pingTimeout = null;
let client = null;

let savedViewer = null;
let savedOnUpdate = null;

export const init = ({ viewer, onUpdate, onNewActiveUser = () => {} }) => {
  savedViewer = viewer;
  savedOnUpdate = onUpdate;
  if (!process.browser) {
    return null;
  }

  Logging.log(`${Environment.URI_FIJI}: init`);

  if (client) {
    Error.log("ERROR: Already has websocket client");
    return client;
  }

  client = new WebSocket(Environment.URI_FIJI);

  client.addEventListener("open", (e) => {
    if (!client) {
      return null;
    }

    const payload = { type: "SUBSCRIBE_VIEWER", data: { id: viewer.id } };
    client.send(JSON.stringify(payload));
  });

  client.addEventListener("ping", (e) => {
    if (!client) {
      return null;
    }

    Logging.log(`${Environment.URI_FIJI}: ping`);
    clearTimeout(pingTimeout);

    pingTimeout = setTimeout(() => {
      this.terminate();
    }, 30000 + 1000);
  });

  client.addEventListener("message", function (event) {
    if (!client) {
      return null;
    }

    if (Strings.isEmpty(event.data)) {
      return null;
    }

    let type;
    let data;
    try {
      const response = JSON.parse(event.data);
      type = response.type;
      data = response.data;
    } catch (e) {
      Logging.error(e);
    }

    if (!data) {
      return null;
    }

    if (!type) {
      return null;
    }

    if (type === "UPDATE") {
      onUpdate({ viewer: data });
    }

    if (type === "UPDATE_USERS_ONLINE" && typeof onNewActiveUser === "function") {
      onNewActiveUser(data);
    }
  });

  client.addEventListener("close", (e) => {
    if (e.reason === "SIGN_OUT") {
      window.location.replace("/_/auth");
    } else {
      setTimeout(() => {
        client = null;
        Logging.log("Auto reconnecting dropped websocket");
        init({ viewer, onUpdate });
      }, 1000);
    }
    if (!client) {
      return null;
    }

    Logging.log(`${Environment.URI_FIJI}: closed`);
    clearTimeout(pingTimeout);
  });

  return client;
};

export const getClient = () => {
  if (!process.browser) {
    return null;
  }

  return client;
};

export const deleteClient = async () => {
  if (!process.browser) {
    return null;
  }

  if (!client) {
    Logging.log("WEBSOCKET: NOTHING TO DELETE");
    return null;
  }

  clearTimeout(pingTimeout);

  client.close();
  client = null;
  await Window.delay(0);

  Logging.log("WEBSOCKET: TERMINATED");

  return client;
};

export const checkWebsocket = async () => {
  if (client) {
    return;
  }
  if (!savedViewer || !savedOnUpdate) {
    Logging.log("No saved resources from previous, so not connecting a websocket");
    return;
  }
  Logging.log("Reconnecting dropped websocket");
  init({ viewer: savedViewer, onUpdate: savedOnUpdate });
  await Window.delay(2000);
  return;
};
