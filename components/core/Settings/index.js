import * as React from "react";
import * as Styles from "~/common/styles";
import * as Events from "~/common/custom-events";

import { ModalPortal } from "../ModalPortal";
import { Provider } from "~/components/core/Settings/Provider";
import { SettingsJumper as Jumper } from "~/components/core/Settings/Jumper";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
const Root = ({ children, viewer }) => {
  return (
    <>
      {children}
      <ModalPortal>
        <Jumper data={viewer} />
      </ModalPortal>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = ({ viewer, css, children, ...props }) => {
  const showSettingsModal = () => {
    Events.dispatchCustomEvent({ name: "open-settings-jumper" });
  };
  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <button css={[Styles.BUTTON_RESET, css]} onClick={showSettingsModal} {...props}>
        {children}
      </button>
    </div>
  );
};

export { Provider, Root, Trigger };
