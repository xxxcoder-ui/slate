import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Actions from "~/common/actions";

// NOTE(amine): utilities
export const getFileKey = ({ lastModified, name }) => `${lastModified}-${name}`;

let UploadStore = {
  queue: [],
  failedFilesCache: {},
  isUploading: false,
};

// NOTE(amine): upload factory function
export function createUploadProvider({
  onStart,
  onFinish,
  onAddedToQueue,
  onProgress,
  onSuccess,
  onError,
  onDuplicate,
}) {
  const scheduleQueueUpload = async () => {
    if (UploadStore.isUploading) return;

    const { file, slate, bucketName } = UploadStore.queue.shift() || {};
    if (!file) return;

    UploadStore.isUploading = true;

    let fileKey = getFileKey(file);

    try {
      // NOTE(amine): delete file from FailedFilesCache
      delete UploadStore.failedFilesCache[fileKey];

      const response = await FileUtilities.upload({
        file,
        bucketName,
        onProgress: (e) => onProgress({ fileKey, loaded: e.loaded }),
      });

      if (!response || response.error) {
        UploadStore.failedFilesCache[fileKey] = file;

        if (onError) onError({ fileKey });
        return;
      }

      let createResponse = await Actions.createFile({ files: [response], slate });
      if (!createResponse || createResponse.error) {
        UploadStore.failedFilesCache[fileKey] = file;
      }

      const isDuplicate = createResponse?.data?.skipped > 0;
      if (isDuplicate) {
        if (onDuplicate) onDuplicate({ fileKey });
      } else {
        if (onSuccess) onSuccess({ fileKey });
      }
    } catch (e) {
      UploadStore.failedFilesCache[fileKey] = file;

      if (onError) onError({ fileKey });
      Logging.error(e);
    }

    if (UploadStore.queue.length !== 0) {
      UploadStore.isUploading = false;
      scheduleQueueUpload();
      return;
    }

    if (onFinish) onFinish();
  };

  const addToUploadQueue = ({ files, slate, bucketName }) => {
    if (UploadStore.queue.length === 0 && !UploadStore.isUploading && onStart) onStart();

    if (!files || !files.length) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      onAddedToQueue(files[i]);
      UploadStore.queue.push({ file: files[i], slate, bucketName });
      scheduleQueueUpload();
    }
  };

  return {
    upload: addToUploadQueue,
  };
}

// const cancel = ({ fileKey, context }) => {
//   if (fileKey === UploadQueueStore.currentFile) {
//     console.log("still UPLOADING");
//   }
//   // TODO UI update
//   UploadQueueStore.filter((file) => fileKey(file) !== fileKey);
//   context.setState({});
// };

// const retry = async ({ fileKey, context }) => {
//   const file = FailedFilesCache[fileKey];
//   await upload({ file, context });
// };
