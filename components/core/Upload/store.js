import * as UploadUtilities from "~/common/upload-utilities";

import create from "zustand";

const DEFAULT_STATE = {
  fileLoading: {},
  isUploading: false,
  totalBytesUploaded: 0,
  totalBytes: 0,
  totalFilesUploaded: 0,
  totalFiles: 0,
  isFinished: false,
};

export const useUploadStore = create((setUploadState) => {
  const handleStartUploading = () => {
    setUploadState((prev) => ({
      ...prev,
      state: { ...prev.state, isFinished: false, isUploading: true },
    }));
  };

  const handleFinishUploading = () => {
    setUploadState((prev) => ({
      ...prev,
      state: {
        ...DEFAULT_STATE,
        fileLoading: prev.state.fileLoading,
        isFinished: true,
      },
    }));
  };

  const handleAddToQueue = (file) => {
    const fileKey = UploadUtilities.getFileKey(file);
    setUploadState((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        fileLoading: {
          ...prev.state.fileLoading,
          [fileKey]: {
            id: fileKey,
            status: "uploading",
            name: file?.name || file?.filename,
            cid: file.cid,
            type: file.type,
            createdAt: Date.now(),
            loaded: 0,
            total: file.size,
            isLink: file.isLink || false,
            isBlob: file.isBlob || false,
            blob: file,
          },
        },
        isFinished: false,
        totalFiles: prev.state.totalFiles + 1,
        totalBytes: prev.state.totalBytes + file.size,
      },
    }));
  };

  const handleSuccess = ({ fileKey }) => {
    setUploadState((prev) => {
      const newFileLoading = { ...prev.state.fileLoading };
      newFileLoading[fileKey].status = "saved";
      return {
        ...prev,
        state: {
          ...prev.state,
          fileLoading: newFileLoading,
          totalFilesUploaded: prev.state.totalFilesUploaded + 1,
        },
      };
    });
  };

  const handleDuplicate = ({ fileKey, cid }) => {
    setUploadState((prev) => {
      const newFileLoading = { ...prev.state.fileLoading };
      newFileLoading[fileKey].status = "duplicate";
      newFileLoading[fileKey].cid = cid;
      return {
        ...prev,
        state: {
          ...prev.state,
          fileLoading: newFileLoading,
          totalFilesUploaded: prev.state.totalFilesUploaded + 1,
        },
      };
    });
  };

  const handleProgress = ({ fileKey, loaded }) => {
    setUploadState((prev) => {
      const newFileLoading = { ...prev.state.fileLoading };
      const bytesLoaded = loaded - newFileLoading[fileKey].loaded;
      newFileLoading[fileKey].loaded = loaded;
      return {
        ...prev,
        state: {
          ...prev.state,
          fileLoading: newFileLoading,
          totalBytesUploaded: prev.state.totalBytesUploaded + bytesLoaded,
        },
      };
    });
  };

  const handleError = ({ fileKey }) => {
    setUploadState((prev) => {
      const newFileLoading = { ...prev.state.fileLoading };
      newFileLoading[fileKey].status = "failed";
      return {
        ...prev,
        state: {
          ...prev.state,
          fileLoading: newFileLoading,
          totalFiles: prev.state.totalFiles - 1,
          totalBytes: prev.state.totalBytes - newFileLoading[fileKey].total,
          totalBytesUploaded: prev.state.totalBytesUploaded - newFileLoading[fileKey].total,
        },
      };
    });
  };

  const handleCancelUploading = ({ fileKeys }) => {
    setUploadState((prev) => {
      const newFileLoading = { ...prev.state.fileLoading };
      const newTotalFiles = prev.state.totalFiles - fileKeys.length;
      let newTotalBytes = prev.state.totalBytes;
      let newTotalBytesUploaded = prev.state.totalBytesUploaded;

      fileKeys.forEach((fileKey) => {
        newTotalBytes -= newFileLoading[fileKey].total;
        newTotalBytesUploaded -= newFileLoading[fileKey].loaded;
        delete newFileLoading[fileKey];
      });

      return {
        ...prev,
        state: {
          ...prev.state,
          fileLoading: newFileLoading,
          totalFiles: newTotalFiles,
          totalBytes: newTotalBytes,
          totalBytesUploaded: newTotalBytesUploaded,
        },
      };
    });
  };

  const uploadProvider = UploadUtilities.createUploadProvider({
    onStart: handleStartUploading,
    onFinish: handleFinishUploading,
    onAddedToQueue: handleAddToQueue,
    onSuccess: handleSuccess,
    onDuplicate: handleDuplicate,
    onProgress: handleProgress,
    onCancel: handleCancelUploading,
    onError: handleError,
  });

  const resetUploadState = () => (
    uploadProvider.clearUploadCache(), setUploadState((prev) => ({ ...prev, state: DEFAULT_STATE }))
  );

  return {
    state: DEFAULT_STATE,
    handlers: {
      upload: uploadProvider.upload,
      uploadLink: uploadProvider.uploadLink,
      saveCopy: uploadProvider.saveCopy,
      retry: uploadProvider.retry,
      retryAll: uploadProvider.retryAll,
      cancel: uploadProvider.cancel,
      cancelAll: uploadProvider.cancelAll,
      resetUploadState,
    },
  };
});
