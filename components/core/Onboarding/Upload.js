import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Jumper from "~/components/system/components/fragments/Jumper";
import * as MobileJumper from "~/components/system/components/fragments/MobileJumper";
import * as Utilities from "~/common/utilities";
import * as Actions from "~/common/actions";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { ModalPortal } from "~/components/core/ModalPortal";
import { useCheckIfExtensionIsInstalled } from "~/common/hooks";
import { DynamicIcon } from "~/components/core/DynamicIcon";
import { motion } from "framer-motion";

import ProfilePhoto from "~/components/core/ProfilePhoto";
import OnboardingPopup from "~/components/core/Onboarding/Popup";
import OnboardingOverlay from "~/components/core/Onboarding/Overlay";
import DownloadExtensionButton from "../Extension/DownloadExtensionButton";

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

const UploadOnboardingContext = React.createContext();
export const useUploadOnboardingContext = () => React.useContext(UploadOnboardingContext);

const steps = {
  welcome: "welcome",
  extension: "extension",
  trigger: "trigger",
  jumper: "jumper",
  finish: "finish",
};

function Provider({ children, viewer, onAction, ...props }) {
  const [currentStep, setCurrentStep] = React.useState(
    viewer?.hasCompletedUploadOnboarding ? steps.finish : steps.welcome
  );

  const { isExtensionDownloaded } = useCheckIfExtensionIsInstalled();

  const goToNextStep = React.useCallback(() => {
    if (currentStep === steps.finish) return;

    const nextStepMapper = {
      welcome: "extension",
      extension: "trigger",
      trigger: "jumper",
      jumper: "finish",
    };
    const nextStep = nextStepMapper[currentStep];

    setCurrentStep(nextStep);
    if (nextStep === steps.finish) {
      onAction({ type: "UPDATE_VIEWER", viewer: { hasCompletedUploadOnboarding: true } });
      Actions.updateViewer({ user: { hasCompletedUploadOnboarding: true } });
    }
  }, [currentStep, isExtensionDownloaded]);

  return (
    <UploadOnboardingContext.Provider value={{ currentStep, steps, goToNextStep }} {...props}>
      {children}
    </UploadOnboardingContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Welcome
 * -----------------------------------------------------------------------------------------------*/

const STYLES_WELCOME_WRAPPER = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  position: fixed;
  height: 100vh;
  width: 100%;
  padding: 16px;
  top: 0;
  left: 0;
  z-index: ${theme.zindex.cta};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteTRN};
  }
`;

function WelcomeOnboarding({ viewer }) {
  const { goToNextStep, currentStep, steps } = useUploadOnboardingContext();

  if (currentStep !== steps.welcome) return null;

  return (
    <ModalPortal>
      <div css={STYLES_WELCOME_WRAPPER}>
        <div css={Styles.VERTICAL_CONTAINER_CENTERED}>
          <ProfilePhoto user={viewer} style={{ borderRadius: "12px" }} size={64} />
          <System.H2 as="h1" style={{ marginTop: 25, textAlign: "center" }}>
            Welcome to Slate, {viewer.username}
          </System.H2>
          <System.P1
            as={motion.p}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeInOut" }}
            style={{ marginTop: 5, textAlign: "center", maxWidth: "47ch" }}
          >
            Slate is a personal search engine that's designed to help you save and remember things
            you care about on the web.
          </System.P1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.4, ease: "easeInOut" }}
            style={{ marginTop: 38 }}
          >
            <System.ButtonSecondary onClick={goToNextStep} style={{ boxShadow: "none" }}>
              Get Started
            </System.ButtonSecondary>
          </motion.div>
        </div>
      </div>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Extension
 * -----------------------------------------------------------------------------------------------*/
const STYLES_BUTTON_SMALL = (theme) => css`
  border-radius: 8px;
  min-height: 24px;
  max-height: 24px;
  @media (max-width: ${theme.sizes.mobile}px) {
    border-radius: 12px;
    padding: 5px 24px 7px;
    min-height: 32px;
    max-height: 32px;
  }
`;

const STYLES_EXTENSION_SCREEN = css`
  width: 100%;
  object-fit: cover;
`;

function ExtensionOnboarding({ isMobile }) {
  const { goToNextStep } = useUploadOnboardingContext();

  const header = (
    <System.H2 as="h1">
      Save to Slate <br />
      as you browse the web
    </System.H2>
  );

  const body = (
    <img
      src={
        isMobile
          ? "/static/chrome-extension-jumper-mobile.png"
          : "/static/chrome-extension-jumper.png"
      }
      height={isMobile ? 411 : 281}
      width={isMobile ? 390 : 640}
      css={STYLES_EXTENSION_SCREEN}
      alt="chrome extension"
    />
  );

  const actions = (
    <>
      <System.ButtonSecondary
        onClick={goToNextStep}
        css={STYLES_BUTTON_SMALL}
        style={{ marginLeft: "auto" }}
      >
        Later
      </System.ButtonSecondary>
      <DownloadExtensionButton css={STYLES_BUTTON_SMALL} style={{ marginLeft: 8 }} />
    </>
  );

  return (
    <ModalPortal>
      <MobileJumper.AnimatePresence>
        {isMobile ? (
          <MobileJumper.Root>
            <MobileJumper.Header>{header}</MobileJumper.Header>
            <MobileJumper.Content style={{ padding: 0, marginTop: 28 }}>
              {body}
            </MobileJumper.Content>
            <MobileJumper.Footer style={{ display: "flex" }}>{actions}</MobileJumper.Footer>
          </MobileJumper.Root>
        ) : null}
      </MobileJumper.AnimatePresence>
      {!isMobile ? (
        <Jumper.Root>
          <Jumper.Header>{header}</Jumper.Header>
          <Jumper.Item style={{ flexGrow: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
            {body}
          </Jumper.Item>
          <Jumper.Divider style={{ marginTop: "auto" }} />
          <Jumper.Item css={STYLES_JUMPER_FOOTER} style={{ marginTop: "auto" }}>
            {actions}
          </Jumper.Item>
        </Jumper.Root>
      ) : null}
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  UploadWalkthrough
 * -----------------------------------------------------------------------------------------------*/
const STYLES_OVERLAY_ZINDEX = css`
  z-index: 1;
`;

const STYLES_JUMPER_FOOTER = (theme) => css`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLight};
  }
`;

const STYLES_UPLOAD_BUTTON = (theme) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 8px;
  padding: 2px;
  margin-left: 10px;
  margin-right: 10px;
  position: relative;
  top: 3px;
`;

const STYLES_COPIED_INITIAL = (theme) => css`
  ${Styles.LINK};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.system.blue};
`;

const STYLES_COPIED_SUCCESS = (theme) => css`
  ${Styles.LINK};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.system.blue};
`;

const LINK_ARCHILLECT = "https://archillect.com";

function UploadWalkthrough() {
  const { currentStep, steps } = useUploadOnboardingContext();

  return (
    <div>
      <OnboardingOverlay css={currentStep === steps.jumper && STYLES_OVERLAY_ZINDEX} />
      <OnboardingPopup
        header="Save to Slate"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {currentStep === steps.trigger ? (
          <>
            <System.P2>
              You can save links and files to Slate. <br />
              Just click on the
              <span css={STYLES_UPLOAD_BUTTON}>
                <SVG.Plus height="16px" />
              </span>
              button on top right.
            </System.P2>
            <System.P2 color="textGray" style={{ marginTop: 14 }}>
              1/<div style={{ display: "inline-block" }}>2</div>
            </System.P2>
          </>
        ) : (
          <>
            <System.P2>
              Save something you find interesting today.
              <br /> Or try pasting →
              <button
                css={[Styles.ICON_CONTAINER, Styles.BUTTON_RESET]}
                style={{ display: "inline-flex" }}
                onClick={() => Utilities.copyToClipboard(LINK_ARCHILLECT)}
              >
                <DynamicIcon
                  successState={
                    <span css={STYLES_COPIED_SUCCESS}>
                      <System.P2 as="span" style={{ marginLeft: 4 }}>
                        {LINK_ARCHILLECT}
                      </System.P2>
                      <SVG.Check height="16px" style={{ marginLeft: 4 }} />
                    </span>
                  }
                >
                  <span css={[STYLES_COPIED_INITIAL]}>
                    <System.P2 as="span" style={{ marginLeft: 4 }}>
                      {LINK_ARCHILLECT}
                    </System.P2>
                    <SVG.CopyAndPaste
                      height="16px"
                      style={{ marginLeft: 4, color: Constants.semantic.textGrayDark }}
                    />
                  </span>
                </DynamicIcon>
              </button>
            </System.P2>
            <System.P2 color="textGray" style={{ marginTop: 14 }}>
              2/<div style={{ display: "inline-block" }}>2</div>
            </System.P2>
          </>
        )}
      </OnboardingPopup>
    </div>
  );
}

function UploadSteps({ viewer, isMobile }) {
  const { currentStep, steps } = useUploadOnboardingContext();

  if (currentStep === steps.welcome) return <WelcomeOnboarding viewer={viewer} />;
  if (currentStep === steps.extension) return <ExtensionOnboarding isMobile={isMobile} />;
  if (currentStep === steps.trigger || currentStep === steps.jumper) return <UploadWalkthrough />;

  return null;
}

export function UploadOnboarding({ viewer, isMobile, onAction, children }) {
  return (
    <Provider viewer={viewer} onAction={onAction}>
      <UploadSteps viewer={viewer} isMobile={isMobile} />
      {children}
    </Provider>
  );
}
