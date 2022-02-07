import * as React from "react";
import * as Styles from "~/common/styles";
import * as Events from "~/common/custom-events";
import * as System from "~/components/system";

import { ModalPortal } from "../ModalPortal";
import { Provider } from "~/components/core/Upload/Provider";
import { Popup } from "~/components/core/Upload/Popup";
import { UploadJumper, MobileUploadJumper } from "~/components/core/Upload/Jumper";
import { useUploadOnboardingContext } from "~/components/core/Onboarding/Upload";

import DropIndicator from "~/components/core/Upload/DropIndicator";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
const Root = ({ children, page, data, isMobile }) => {
  return (
    <>
      {children}
      {isMobile ? <MobileUploadJumper data={data} /> : <UploadJumper data={data} />}
      <ModalPortal>
        <Popup page={page} isMobile={isMobile} />
        <DropIndicator data={data} />
      </ModalPortal>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

const Trigger = ({ viewer, children, ...props }) => {
  const onboardingContext = useUploadOnboardingContext();
  const showUploadModal = () => {
    if (onboardingContext) onboardingContext?.goToNextStep?.call();

    if (!viewer) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    Events.dispatchCustomEvent({ name: "open-upload-jumper" });
  };

  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <System.ButtonPrimitive onClick={showUploadModal} {...props}>
        {children}
      </System.ButtonPrimitive>
    </div>
  );
};

export { Provider, Root, Trigger };
