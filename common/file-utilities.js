import * as Actions from "~/common/actions";
import * as Credentials from "~/common/credentials";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Events from "~/common/custom-events";
import * as Logging from "~/common/logging";
import * as Environment from "~/common/environment";
import * as Constants from "~/common/constants";

import { encode, isBlurhashValid } from "blurhash";
import { v4 as uuid } from "uuid";

export const fileKey = ({ lastModified, name }) => `${lastModified}-${name}`;

const loadImage = async (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

const getImageData = (image) => {
  let ratio = Math.min(100 / image.height, 100 / image.width);
  image.height = image.height * ratio;
  image.width = image.width * ratio;
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

const encodeImageToBlurhash = async (imageUrl) => {
  const image = await loadImage(imageUrl);
  const imageData = getImageData(image);
  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

// NOTE(jim): We're speaking to a different server now.
const getCookie = (name) => {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
};

export const uploadLink = async ({ url, slate, uploadAbort }) => {
  const abortController = new AbortController();
  if (uploadAbort) uploadAbort.abort = abortController.abort.bind(abortController);

  let createResponse = await Actions.createLink({ url, slate }, { signal: abortController.signal });
  return createResponse;
};

export const saveCopy = async ({ file, uploadAbort }) => {
  const abortController = new AbortController();
  if (uploadAbort) uploadAbort.abort = abortController.abort.bind(abortController);

  return await Actions.saveCopy({ files: [file] }, { signal: abortController.signal });
};

export const upload = async ({ file, onProgress, bucketName, uploadAbort }) => {
  let formData = new FormData();
  const HEIC2ANY = require("heic2any");

  // NOTE(jim): You must provide a file from an type="file" input field.
  if (!file) {
    return null;
  }

  const isZipFile =
    file.type.startsWith("application/zip") || file.type.startsWith("application/x-zip-compressed");
  const isUnityFile = await Validations.isUnityFile(file);

  // TODO(jim): Put this somewhere else to handle conversion cases.
  if (file.type.startsWith("image/heic")) {
    const converted = await HEIC2ANY({
      blob: file,
      toType: "image/png",
      quality: 1,
    }); //TODO(martina): figure out how to cancel an await if upload has been cancelled

    formData.append("data", converted);
  } else {
    formData.append("data", file);
  }

  const _privateUploadMethod = (path, file) =>
    new Promise((resolve) => {
      const XHR = new XMLHttpRequest();

      if (uploadAbort) uploadAbort.abort = XHR.abort.bind(XHR);

      XHR.open("post", path, true);
      XHR.setRequestHeader("authorization", getCookie(Credentials.session.key));
      XHR.onerror = (event) => {
        Logging.error(event);
        XHR.abort();
      };

      // NOTE(jim): UPLOADS ONLY.
      XHR.upload.addEventListener(
        "progress",
        (event) => {
          if (event.lengthComputable) {
            Logging.log("FILE UPLOAD PROGRESS", event);
            if (onProgress) onProgress(event);
          }
        },
        false
      );
      XHR.addEventListener("abort", () => {
        resolve({ aborted: true });
      });

      XHR.onloadend = (event) => {
        Logging.log("FILE UPLOAD END", event);
        try {
          return resolve(JSON.parse(event.target.response));
        } catch (e) {
          return resolve({
            error: "SERVER_UPLOAD_ERROR",
          });
        }
      };
      XHR.send(formData);
    });

  const storageDealRoute = `${Environment.URI_SHOVEL}/api/deal/`;
  const generalRoute = `${Environment.URI_SHOVEL}/api/data/`;
  const zipUploadRoute = `${Environment.URI_SHOVEL}/api/data/zip/`;

  if (!storageDealRoute || !generalRoute || !zipUploadRoute) {
    Events.dispatchMessage({ message: "We could not find our upload server." });

    return {
      decorator: "NO_UPLOAD_RESOURCE_URI_ATTACHED",
      error: true,
    };
  }

  let res;
  if (isZipFile && isUnityFile) {
    res = await _privateUploadMethod(`${zipUploadRoute}${file.name}`, file);
  } else if (bucketName && bucketName === Constants.textile.dealsBucket) {
    res = await _privateUploadMethod(`${storageDealRoute}${file.name}`, file);
  } else {
    res = await _privateUploadMethod(`${generalRoute}${file.name}`, file);
  }

  if (!res || res.error || res.aborted) {
    return res;
  }

  let item = res.data.data;
  if (Validations.isPreviewableImage(item.type)) {
    let url = Strings.getURLfromCID(item.cid);
    try {
      let blurhash = await encodeImageToBlurhash(url);
      if (isBlurhashValid(blurhash).result) {
        item.blurhash = blurhash;
      }
    } catch (e) {
      Logging.error(e);
    }
  }

  return item;
};

export const formatPastedImages = ({ clipboardItems }) => {
  let files = [];
  for (let i = 0; i < clipboardItems.length; i++) {
    // Note(Amine): skip content if it's not an image
    if (clipboardItems[i].type.indexOf("image") === -1) continue;
    const file = clipboardItems[i].getAsFile();
    files.push(file);
  }
  return { files };
};

export const formatDroppedFiles = async ({ dataTransfer }) => {
  // NOTE(jim): If this is true, then drag and drop came from a slate object.
  const data = dataTransfer.getData("slate-object-drag-data");
  if (data) {
    return;
  }

  const files = [];
  if (dataTransfer.items && dataTransfer.items.length) {
    for (var i = 0; i < dataTransfer.items.length; i++) {
      const data = dataTransfer.items[i];

      let file = null;
      if (data.kind === "file") {
        file = data.getAsFile();
      } else if (data.kind == "string" && data.type == "text/uri-list") {
        try {
          const dataAsString = new Promise((resolve) => data.getAsString((d) => resolve(d)));
          const resp = await fetch(await dataAsString);
          const blob = resp.blob();

          file = new File(blob, `data-${uuid()}`);
          file.name = `data-${uuid()}`;
        } catch (e) {
          Events.dispatchMessage({
            message: "File type not supported. Please try a different file",
          });

          return { error: true };
        }
      }

      files.push(file);
    }
  }

  return { files };
};

export const formatUploadedFiles = ({ files }) => {
  let toUpload = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (!file) {
      continue;
    }
    toUpload.push(file);
  }

  return { files: toUpload };
};
