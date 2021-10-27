import * as React from "react";
import * as Styles from "~/common/styles";
import * as Events from "~/common/custom-events";

import { ModalPortal } from "../ModalPortal";
import { Provider } from "~/components/core/Upload/Provider";
import { Popup } from "~/components/core/Upload/Popup";
import { UploadJumper as Jumper } from "~/components/core/Upload/Jumper";
import { useUploadContext } from "~/components/core/Upload/Provider";

import DropIndicator from "~/components/core/Upload/DropIndicator";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
const Root = ({ children, data }) => {
  const [{ isUploadJumperVisible }] = useUploadContext();
  return (
    <>
      {children}
      {isUploadJumperVisible && <Jumper data={data} />}
      <ModalPortal>
        <Popup />
        <DropIndicator data={data} />
      </ModalPortal>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = ({ viewer, css, children, ...props }) => {
  const showUploadModal = () => {
    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    Events.dispatchCustomEvent({ name: "open-upload-jumper" });
  };

  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <button css={[Styles.BUTTON_RESET, css]} onClick={showUploadModal} {...props}>
        {children}
      </button>
    </div>
  );
};

export { Provider, Root, Trigger };
