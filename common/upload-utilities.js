import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Actions from "~/common/actions";

let UploadStore = {
  queue: [],
  failedFilesCache: {},
  isUploading: false,
};

// NOTE(amine): utilities
export const getFileKey = ({ lastModified, name }) => `${lastModified}-${name}`;

// NOTE(amine): queue utilities
const isQueueEmpty = () => UploadStore.queue.length === 0;
const getFileFromQueue = () => UploadStore.queue.shift() || {};
const getFileKeysFromQueue = () => UploadStore.queue.map(({ file }) => getFileKey(file));
const pushFileToQueue = ({ file, slate, bucket }) =>
  UploadStore.queue.push({ file, slate, bucket });
const resetQueue = () => (UploadStore.queue = []);
const removeFileFromQueue = ({ fileKey }) =>
  (UploadStore.queue = UploadStore.queue.filter(({ file }) => getFileKey(file) !== fileKey));

// NOTE(amine): failedFilesCache utilities
const storeFileInCache = ({ file, slate, bucketName }) =>
  (UploadStore.failedFilesCache[getFileKey(file)] = { file, slate, bucketName });
const deleteFileFromCache = ({ fileKey }) => delete UploadStore.failedFilesCache[fileKey];
const getFileFromCache = ({ fileKey }) => UploadStore.failedFilesCache[fileKey] || {};

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
    if (UploadStore.isUploading) return;

    const { file, slate, bucketName } = getFileFromQueue();
    if (!file) return;

    UploadStore.isUploading = true;

    let fileKey = getFileKey(file);

    try {
      let response = await FileUtilities.upload({
        file,
        bucketName,
        onProgress: (e) => onProgress({ fileKey, loaded: e.loaded }),
      });

      if (!response || response.error) {
        UploadStore.isUploading = false;

        storeFileInCache({ file, slate, bucketName });
        if (onError) onError({ fileKey });
        return;
      }

      let createResponse = await Actions.createFile({ files: [response], slate });
      if (!createResponse || createResponse.error) {
        storeFileInCache({ file, slate, bucketName });
      }

      const isDuplicate = createResponse?.data?.skipped > 0;
      if (isDuplicate) {
        if (onDuplicate) onDuplicate({ fileKey });
      } else {
        if (onSuccess) onSuccess({ fileKey });
      }
    } catch (e) {
      UploadStore.isUploading = true;
      storeFileInCache({ file, slate, bucketName });
      if (onError) onError({ fileKey });
      Logging.error(e);
    }

    UploadStore.isUploading = false;

    if (!isQueueEmpty()) {
      scheduleQueueUpload();
      return;
    }

    if (onFinish) onFinish();
  };

  const addToUploadQueue = ({ files, slate, bucketName }) => {
    if (isQueueEmpty() && !UploadStore.isUploading && onStart) onStart();

    if (!files || !files.length) return;

    for (let i = 0; i < files.length; i++) {
      if (onAddedToQueue) onAddedToQueue(files[i]);
      pushFileToQueue({ file: files[i], slate, bucketName });
      scheduleQueueUpload();
    }
  };

  const retry = ({ fileKey }) => {
    const { file, slate, bucketName } = getFileFromCache({ fileKey });
    addToUploadQueue({ files: [file], slate, bucketName });
    deleteFileFromCache({ fileKey });
  };

  const cancel = ({ fileKey }) => {
    removeFileFromQueue({ fileKey });
    if (onCancel) onCancel({ fileKeys: [fileKey] });
  };

  const cancelAll = () => {
    const keys = getFileKeysFromQueue();
    resetQueue();
    if (onCancel) onCancel({ fileKeys: keys });
  };

  return {
    upload: addToUploadQueue,
    retry,
    cancel,
    cancelAll,
  };
}
