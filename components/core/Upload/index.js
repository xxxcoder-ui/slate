import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";
import * as Events from "~/common/custom-events";

import { useUploadContext } from "~/components/core/Upload/Provider";
import { Show } from "~/components/utility/Show";
import { ModalPortal } from "../ModalPortal";
import { motion } from "framer-motion";
import { Provider } from "~/components/core/Upload/Provider";

import UploadModal from "~/components/core/Upload/Modal";
import Popup from "~/components/core/Upload/Popup";
import DataMeter from "~/components/core/DataMeter";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
const Root = ({ onAction, viewer, children }) => {
  const [{ isUploadModalVisible }] = useUploadContext();
  return (
    <>
      {children}
      <Show when={isUploadModalVisible}>
        <ModalPortal>
          <UploadModal viewer={viewer} onAction={onAction} />
        </ModalPortal>
      </Show>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = ({ enableMetrics = false, viewer, css, children, ...props }) => {
  const showUploadModal = () => {
    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    Events.dispatchCustomEvent({ name: "upload-modal-open" });
  };

  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <Show when={enableMetrics}>
        <UploadMetrics />
      </Show>
      <button css={[Styles.BUTTON_RESET, css]} onClick={showUploadModal} {...props}>
        {children}
      </button>
    </div>
  );
};

const UploadMetrics = () => {
  const [{ isUploading, totalBytesUploaded, totalBytes }, { showUploadModal }] = useUploadContext();
  const uploadProgress = Math.floor((totalBytesUploaded / totalBytes) * 100);

  return (
    isUploading && (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ y: 10, opacity: 0 }}
        css={Styles.BUTTON_RESET}
        style={{ marginRight: 14 }}
        aria-label="Upload"
        onClick={showUploadModal}
      >
        <System.P3 color="textBlack">{uploadProgress}%</System.P3>
        <DataMeter
          bytes={totalBytesUploaded}
          maximumBytes={totalBytes}
          style={{
            width: 28,
            marginTop: 4,
            backgroundColor: Constants.semantic.bgGrayLight,
          }}
        />
      </motion.button>
    )
  );
};

export { Provider, Root, Popup, Trigger };
