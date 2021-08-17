import * as Environment from "~/node_common/environment";
import * as Logging from "~/common/logging";

import "isomorphic-fetch";

import JWT from "jsonwebtoken";
import microlink from "@microlink/mql";
import CID from "cids";
import multihashing from "multihashing-async";

export const fetchLinkData = async (url) => {
  try {
    const { status, data, response } = await microlink(url, {
      // screenshot: true,
      apiKey: Environment.MICROLINK_API_KEY,
    });
    if (status !== "success") {
      return;
    }
    return data;
  } catch (e) {
    Logging.error(e);
  }
};

export const getDomainFromURL = (url = "") => {
  let parsedURL;
  try {
    parsedURL = new URL(url);
  } catch (e) {
    Logging.error(e);
    return;
  }
  const domain = parsedURL.hostname.replace("www.", ""); //NOTE(martina): returns example.com
  return domain;
};

export const getCIDofString = async (url = "") => {
  const bytes = new TextEncoder().encode(url);
  const hash = await multihashing(bytes, "sha2-256");
  const cid = new CID(1, "dag-pb", hash);
  return cid.toString();
};

export const fetchEmbed = async (url) => {
  try {
    const request = await fetch(
      `https://iframe.ly/api/oembed?url=${encodeURIComponent(url)}&api_key=${
        Environment.IFRAMELY_API_KEY
      }&iframe=1&omit_script=1`,
      {
        method: "GET",
      }
    );
    const data = await request.json();
    return data?.html;
  } catch (e) {
    Logging.error(e);
  }
};

export const testIframe = async (url) => {
  try {
    const request = await fetch(url, {
      method: "GET",
    });
    if (request?.headers && request?.headers.get("x-frame-options")) {
      return false;
    }
    return true;
  } catch (e) {
    Logging.error(e);
    return false;
  }
};

// export const uploadScreenshot = async (file, user) => {
//   const token = JWT.sign({ id: user.id, username: user.username }, Environment.JWT_SECRET);
//   const data = {
//     url: file.data.coverImage.data.url,
//     updateType: "COVER_IMAGE",
//     targetId: file.id,
//   };
//   try {
//     const request = await fetch(`${Environment.}/api/data/url`, {
//       method: "POST",
//       credentials: "omit",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//       body: JSON.stringify({ data }),
//     });
//     return true;
//   } catch (e) {
//     Logging.error(e);
//     return false;
//   }
// };
