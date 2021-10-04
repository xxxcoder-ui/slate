import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Constants from "~/node_common/constants";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";
import * as Websocket from "~/node_common/nodejs-websocket";
import * as Logging from "~/common/logging";
import * as Window from "~/common/window";

import WebSocket from "ws";

import { Client } from "@elastic/elasticsearch";

const client = new Client({
  cloud: {
    id: Environment.ELASTIC_SEARCH_ID,
  },
  auth: {
    apiKey: Environment.ELASTIC_SEARCH_API_KEY,
  },
});

const createUserIndex = () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          store: true,
        },
        username: {
          type: "keyword",
          store: true,
        },
        name: {
          type: "text",
          store: true,
        },
        body: {
          type: "text",
          store: true,
        },
        followerCount: {
          type: "integer",
          index: false,
          store: true,
        },
        slateCount: {
          type: "integer",
          index: false,
          store: true,
        },
        photo: {
          type: "keyword",
          index: false,
          store: true,
        },
      },
    },
  };
};

const createSlateIndex = () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          store: true,
        },
        slatename: {
          type: "keyword",
          store: true,
        },
        name: {
          type: "text",
          store: true,
        },
        body: {
          type: "text",
          store: true,
        },
        preview: {
          type: "text",
          index: false,
          store: true,
        },
        ownerId: {
          type: "keyword",
          store: true,
        },
        isPublic: {
          type: "bool",
          store: true,
        },
        subscriberCount: {
          type: "integer",
          index: false,
          store: true,
        },
        fileCount: {
          type: "integer",
          index: false,
          store: true,
        },
      },
    },
  };
};

const createFileIndex = () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          store: true,
        },
        cid: {
          type: "keyword",
          store: true,
        },
        filename: {
          type: "keyword",
          index: false,
          store: true,
        },
        name: {
          type: "text",
          store: true,
        },
        body: {
          type: "text",
          store: true,
        },
        author: {
          type: "text",
          store: true,
        },
        source: {
          type: "text",
          store: true,
        },
        type: {
          type: "keyword",
          index: false,
          store: true,
        },
        isPublic: {
          type: "bool",
          store: true,
        },
        downloadCount: {
          type: "integer",
          index: false,
          store: true,
        },
        saveCount: {
          type: "integer",
          index: false,
          store: true,
        },
        data: {
          type: "object",
          index: false,
          store: true,
        },
        isLink: {
          type: "bool",
          store: true,
        },
        fileCategory: {
          type: "keyword",
        },
      },
    },
  };
};

// const websocketSend = async (type, data) => {
//   if (Strings.isEmpty(Environment.PUBSUB_SECRET)) {
//     return;
//   }

//   let ws = Websocket.get();
//   if (!ws) {
//     ws = Websocket.create();
//     await Window.delay(2000);
//   }

//   const encryptedData = await Utilities.encryptWithSecret(
//     JSON.stringify(data),
//     Environment.PUBSUB_SECRET
//   );

//   // NOTE(jim): Only allow this to be passed around encrypted.
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(
//       JSON.stringify({
//         type,
//         iv: encryptedData.iv,
//         data: encryptedData.hex,
//       })
//     );
//   }
// };

// export const updateUser = async (user, action) => {
//   if (!user || !action) return;

//   Logging.log(`Search is updating user ...`);

//   let data;
//   if (Array.isArray(user)) {
//     data = user.map((item) => {
//       return { ...Serializers.sanitizeUser(item), type: "USER" };
//     });
//   } else {
//     data = { ...Serializers.sanitizeUser(user), type: "USER" };
//   }

//   websocketSend("UPDATE", {
//     id: "LENS",
//     data: { action, data },
//   });
// };

// export const updateSlate = async (slate, action) => {
//   if (!slate || !action) return;

//   Logging.log(`Search is updating slate ...`);

//   let data;
//   if (Array.isArray(slate)) {
//     data = slate.map((item) => {
//       return { ...item, type: "SLATE" };
//     });
//   } else {
//     data = { ...slate, type: "SLATE" };
//   }

//   websocketSend("UPDATE", {
//     id: "LENS",
//     data: { action, data },
//   });
// };

// export const updateFile = async (file, action) => {
//   if (!file || !action) return;

//   Logging.log(`Search is updating file ...`);

//   let data;
//   if (Array.isArray(file)) {
//     data = file.map((item) => {
//       return { ...item, type: "FILE" };
//     });
//   } else {
//     data = { ...file, type: "FILE" };
//   }

//   websocketSend("UPDATE", {
//     id: "LENS",
//     data: { action, data },
//   });
// };
