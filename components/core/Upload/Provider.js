import * as React from "react";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";

import { useEventListener } from "~/common/hooks";
import { useUploadStore } from "~/components/core/Upload/store";
import { useUploadOnboardingContext } from "~/components/core/Onboarding/Upload";

const UploadContext = React.createContext();
export const useUploadContext = () => React.useContext(UploadContext);

export const Provider = ({ children, page, data, viewer }) => {
  const uploadHandlers = useUploadStore((store) => store.handlers);

  const [isUploadJumperVisible, { showUploadJumper, hideUploadJumper }] = useUploadJumper();

  useUploadOnDrop({ upload: uploadHandlers.upload, page, data, viewer });

  useUploadFromClipboard({
    upload: uploadHandlers.upload,
    uploadLink: uploadHandlers.uploadLink,
    page,
    data,
    viewer,
  });

  useEventListener({ type: "open-upload-jumper", handler: showUploadJumper });

  const providerValue = React.useMemo(
    () => [
      { isUploadJumperVisible },
      {
        showUploadJumper,
        hideUploadJumper,
      },
    ],
    [isUploadJumperVisible]
  );

  return <UploadContext.Provider value={providerValue}>{children}</UploadContext.Provider>;
};

const useUploadJumper = () => {
  const [isUploadJumperVisible, setUploadJumperState] = React.useState(false);
  const showUploadJumper = () => setUploadJumperState(true);
  const hideUploadJumper = () => setUploadJumperState(false);
  return [isUploadJumperVisible, { showUploadJumper, hideUploadJumper }];
};

const useUploadOnDrop = ({ upload, page, data, viewer }) => {
  const onboardingContext = useUploadOnboardingContext();

  const handleDragEnter = (e) => e.preventDefault();
  const handleDragLeave = (e) => e.preventDefault();
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e) => {
    e.preventDefault();

    const { files, error } = await FileUtilities.formatDroppedFiles({
      dataTransfer: e.dataTransfer,
    });

    if (error) {
      return null;
    }

    let slate = null;
    if (page?.id === "NAV_SLATE" && data?.ownerId === viewer?.id) {
      slate = data;
    }

    // NOTE(amine): finish the upload onboarding only if we're at the jumper walkthrough
    if (onboardingContext.currentStep === onboardingContext.steps.jumperWalkthrough)
      onboardingContext.goToNextStep();
    upload({ files, slate });
  };

  useEventListener({ type: "dragenter", handler: handleDragEnter }, []);
  useEventListener({ type: "dragleave", handler: handleDragLeave }, []);
  useEventListener({ type: "dragover", handler: handleDragOver }, []);
  useEventListener({ type: "drop", handler: handleDrop }, [onboardingContext]);
};

const useUploadFromClipboard = ({ upload, uploadLink, page, data, viewer }) => {
  const onboardingContext = useUploadOnboardingContext();

  const handlePaste = (e) => {
    //NOTE(amine): skip when pasting into an input/textarea or an element with contentEditable set to true
    const eventTargetTag = document?.activeElement.tagName.toLowerCase();
    const isEventTargetEditable = !!document?.activeElement.getAttribute("contentEditable");
    if (eventTargetTag === "input" || eventTargetTag === "textarea" || isEventTargetEditable) {
      return;
    }

    let slate = null;
    if (page?.id === "NAV_SLATE" && data?.ownerId === viewer?.id) {
      slate = data;
    }

    const link = e.clipboardData?.getData("text");
    try {
      new URL(link);
      uploadLink({ url: link, slate });
    } catch (e) {
      Logging.error(e);
    }

    const clipboardItems = e.clipboardData?.items || [];
    if (!clipboardItems) return;
    const { files } = FileUtilities.formatPastedImages({
      clipboardItems,
    });

    if (onboardingContext.currentStep === onboardingContext.steps.jumperWalkthrough)
      onboardingContext.goToNextStep();
    upload({ files, slate });
  };

  useEventListener({ type: "paste", handler: handlePaste }, [onboardingContext]);
};
