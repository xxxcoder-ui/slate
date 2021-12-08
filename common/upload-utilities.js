import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Actions from "~/common/actions";

// NOTE(amine): utilities
export const getFileKey = ({ lastModified, name, cid }) => cid || `${lastModified}-${name}`;

const getLinkSize = (url) => new TextEncoder().encode(url).length;

let UploadStore = {
  queue: [],
  failedFilesCache: {},
  isUploading: false,
  uploadedFiles: {},
};

let UploadAbort = {
  currentUploadingFile: null,
  abort: null,
};

// NOTE(amine): queue utilities
const getUploadQueue = () => UploadStore.queue;
const pushToUploadQueue = ({ file, slate }) => UploadStore.queue.push({ file, slate });
const resetUploadQueue = () => (UploadStore.queue = []);
const removeFromUploadQueue = ({ fileKey }) =>
  (UploadStore.queue = UploadStore.queue.filter(({ file }) => getFileKey(file) !== fileKey));

// NOTE(amine): failedFilesCache utilities
const storeFileInCache = ({ file, slate }) =>
  (UploadStore.failedFilesCache[getFileKey(file)] = { file, slate });
const removeFileFromCache = ({ fileKey }) => delete UploadStore.failedFilesCache[fileKey];
const getFileFromCache = ({ fileKey }) => UploadStore.failedFilesCache[fileKey] || {};
const getFailedFilesCache = () => UploadStore.failedFilesCache;

// NOTE(amine): UploadAbort utilities
const registerFileUploading = ({ fileKey }) => (UploadAbort.currentUploadingFile = fileKey);
const resetAbortUploadState = () => (UploadAbort = { currentUploadingFile: null, abort: null });
const abortCurrentFileUpload = () => UploadAbort.abort();
const canCurrentFileBeAborted = () => UploadAbort.currentUploadingFile && UploadAbort.abort;
const isFileCurrentlyUploading = ({ fileKey }) =>
  fileKey === UploadAbort.currentUploadingFile && UploadAbort.abort;

// NOTE(amine): upload factory function
export function createUploadProvider({
  onStart,
  onFinish,
  onAddedToQueue,
  onProgress,
  onSuccess,
  onError,
  onCancel,
  onDuplicate,
}) {
  const scheduleQueueUpload = async () => {
    const uploadQueue = getUploadQueue();
    if (UploadStore.isUploading || uploadQueue.length === 0) return;

    const { file, slate } = getUploadQueue().shift() || {};

    const fileKey = getFileKey(file);

    UploadStore.isUploading = true;
    registerFileUploading({ fileKey });

    try {
      if (file.type === "link") {
        onProgress({ fileKey, loaded: getLinkSize(file.name) });
        const response = await FileUtilities.uploadLink({
          url: file.name,
          slate,
          uploadAbort: UploadAbort,
        });

        if (!response?.aborted) {
          if (!response || response.error) throw new Error(response);

          const isDuplicate = response.data?.duplicate;
          const fileCid = response.data?.links[0];

          UploadStore.uploadedFiles[fileKey] = true;
          if (isDuplicate) {
            if (onDuplicate) onDuplicate({ fileKey, cid: fileCid });
          } else {
            if (onSuccess) onSuccess({ fileKey, cid: fileCid });
          }
        }
        // NOTE(amine): if the file being upload has a cid, use savecopy action.
      } else if (file.cid) {
        onProgress({ fileKey, loaded: file.size });
        const response = await FileUtilities.saveCopy({ file, uploadAbort: UploadAbort });

        if (!response?.aborted) {
          if (!response || response.error) throw new Error(response);

          if (onSuccess) onSuccess({ fileKey });
        }
      } else {
        const response = await FileUtilities.upload({
          file,
          uploadAbort: UploadAbort,
          onProgress: (e) => onProgress({ fileKey, loaded: e.loaded }),
        });

        if (!response?.aborted) {
          if (!response || response.error) throw new Error(response);
          // TODO(amine): merge createFile and upload endpoints
          let createResponse = await Actions.createFile({ files: [response], slate });
          if (!createResponse || createResponse.error) throw new Error(response);

          const isDuplicate = createResponse?.data?.skipped > 0;
          const fileCid = createResponse.data?.cid;
          UploadStore.uploadedFiles[fileKey] = true;

          if (isDuplicate) {
            if (onDuplicate) onDuplicate({ fileKey, cid: fileCid });
          } else {
            if (onSuccess) onSuccess({ fileKey, cid: fileCid });
          }
        }
      }
    } catch (e) {
      storeFileInCache({ file, slate });

      if (onError) onError({ fileKey });
      Logging.error(e);
    }

    UploadStore.isUploading = false;
    resetAbortUploadState();

    const isQueueEmpty = getUploadQueue().length === 0;
    if (!isQueueEmpty) {
      scheduleQueueUpload();
      return;
    }

    if (onFinish) onFinish();
  };

  const addBlobToUploadQueue = ({ files, slate }) => {
    if (!files || !files.length) return;

    for (let i = 0; i < files.length; i++) {
      files[i].isBlob = true;
      const fileKey = getFileKey(files[i]);
      const doesQueueIncludeFile = getUploadQueue().some(
        ({ file }) => fileKey === getFileKey(file)
      );
      const isUploaded = fileKey in UploadStore.uploadedFiles;
      const isUploading = UploadAbort.currentUploadingFile === fileKey;
      // NOTE(amine): skip the file if already uploaded or is in queue
      if (doesQueueIncludeFile || isUploaded || isUploading) continue;

      // NOTE(amine): if the added file has failed before, remove it from failedFilesCache
      if (fileKey in UploadStore.failedFilesCache) removeFileFromCache({ fileKey });

      if (onAddedToQueue) onAddedToQueue(files[i]);
      pushToUploadQueue({ file: files[i], slate });
    }

    const isQueueEmpty = getUploadQueue().length === 0;
    if (!UploadStore.isUploading && !isQueueEmpty && onStart) {
      onStart();
      scheduleQueueUpload();
    }
  };

  const retry = ({ fileKey }) => {
    const { file, slate } = getFileFromCache({ fileKey });
    if (file.type === "link") {
      addLinkToUploadQueue({ url: file.name, slate });
      return;
    }
    if (file.cid) {
      return addFileToUploadQueue(file);
    }

    addBlobToUploadQueue({ files: [file], slate });
  };

  const retryAll = () => {
    const failedFilesCache = getFailedFilesCache();
    Object.entries(failedFilesCache).forEach(([key]) => {
      retry({ fileKey: key });
    });
  };

  const cancel = ({ fileKey }) => {
    if (onCancel) onCancel({ fileKeys: [fileKey] });

    if (isFileCurrentlyUploading({ fileKey })) {
      abortCurrentFileUpload();
      return;
    }

    removeFromUploadQueue({ fileKey });
  };

  const cancelAll = () => {
    const fileKeys = getUploadQueue().map(({ file }) => getFileKey(file));
    if (onCancel) onCancel({ fileKeys: [UploadAbort.currentUploadingFile, ...fileKeys] });

    if (canCurrentFileBeAborted()) abortCurrentFileUpload();
    resetUploadQueue();
  };

  const addLinkToUploadQueue = async ({ url, slate }) => {
    const linkAsBlob = {
      name: url,
      filename: url,
      type: "link",
      isBlob: true,
      isLink: true,
      size: getLinkSize(url),
      lastModified: "",
    };
    const fileKey = getFileKey(linkAsBlob);

    const doesQueueIncludeFile = getUploadQueue().some(({ file }) => fileKey === getFileKey(file));
    const isUploaded = fileKey in UploadStore.uploadedFiles;
    const isUploading = UploadAbort.currentUploadingFile === fileKey;
    // NOTE(amine): skip the file if already uploaded or is in queue
    if (doesQueueIncludeFile || isUploaded || isUploading) return;

    // NOTE(amine): if the added file has failed before, remove it from failedFilesCache
    if (fileKey in UploadStore.failedFilesCache) removeFileFromCache({ fileKey });

    if (onAddedToQueue) onAddedToQueue(linkAsBlob);
    pushToUploadQueue({ file: linkAsBlob, slate });

    const isQueueEmpty = getUploadQueue().length === 0;
    if (!UploadStore.isUploading && !isQueueEmpty && onStart) {
      onStart();
      scheduleQueueUpload();
    }
  };

  const addFileToUploadQueue = async (file) => {
    const fileAsBlob = {
      ...file,
    };

    const fileKey = getFileKey(fileAsBlob);

    const doesQueueIncludeFile = getUploadQueue().some(({ file }) => fileKey === getFileKey(file));
    const isUploaded = fileKey in UploadStore.uploadedFiles;
    const isUploading = UploadAbort.currentUploadingFile === fileKey;
    // NOTE(amine): skip the file if already uploaded or is in queue
    if (doesQueueIncludeFile || isUploaded || isUploading) return;

    // NOTE(amine): if the added file has failed before, remove it from failedFilesCache
    if (fileKey in UploadStore.failedFilesCache) removeFileFromCache({ fileKey });

    if (onAddedToQueue) onAddedToQueue(fileAsBlob);
    pushToUploadQueue({ file: fileAsBlob });

    const isQueueEmpty = getUploadQueue().length === 0;
    if (!UploadStore.isUploading && !isQueueEmpty && onStart) {
      onStart();
      scheduleQueueUpload();
    }
  };

  const clearUploadCache = () => {
    UploadStore.failedFilesCache = {};
    UploadStore.uploadedFiles = {};
  };

  return {
    upload: addBlobToUploadQueue,
    saveCopy: addFileToUploadQueue,
    uploadLink: addLinkToUploadQueue,
    retry,
    retryAll,
    cancel,
    cancelAll,
    clearUploadCache,
  };
}
