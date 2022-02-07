import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Upload from "~/components/core/Upload";
import * as Search from "~/components/core/Search";

import {
  ApplicationUserControls,
  ApplicationUserControlsPopup,
} from "~/components/core/ApplicationUserControls";

import { css } from "@emotion/react";
import { DarkSymbol } from "~/common/logo";
import { Link } from "~/components/core/Link";
import { ButtonPrimary, ButtonTertiary } from "~/components/system/components/Buttons";
import { Show } from "~/components/utility/Show";
import { useMediaQuery } from "~/common/hooks";
import { motion } from "framer-motion";
import { useSearchStore } from "~/components/core/Search/store";
import { UploadOnboarding } from "~/components/core/Onboarding/Upload";

const STYLES_APPLICATION_HEADER_BACKGROUND = (theme) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background-color: ${theme.system.white};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

const STYLES_APPLICATION_HEADER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  height: ${theme.sizes.header}px;
  padding: 0px 24px;
  border-bottom: 0.5px solid ${theme.semantic.borderGrayLight};
  box-sizing: border-box;

  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 14px 16px;
    width: 100%;
  }
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const STYLES_MIDDLE = css`
  flex-grow: 1;
  height: 100%;
  padding: 0 12px;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const STYLES_BACKGROUND = css`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: ${Constants.semantic.bgBlurDark};
  pointer-events: auto;
  @keyframes fade-in {
    from {
      opacity: 50%;
    }
    to {
      opacity: 100%;
    }
  }
  animation: fade-in 200ms ease-out;
`;

const STYLES_HEADER = (theme) => css`
  z-index: ${theme.zindex.header};
  width: 100vw;
  height: ${theme.sizes.header}px;
  position: fixed;
  right: 0;
  top: 0;
`;

const STYLES_UPLOAD_BUTTON = (theme) => css`
  position: relative;
  ${Styles.CONTAINER_CENTERED};
  background-color: ${Constants.semantic.bgGrayLight};
  color: ${theme.semantic.textBlack};
  border-radius: 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  pointer-events: auto;
  transition: background-color 200ms;

  :hover {
    background-color: ${Constants.semantic.bgGrayLight4};
    color: ${Constants.semantic.textBlack};
  }
`;

export default function ApplicationHeader({ viewer, page, data, onAction, isMobile }) {
  const [state, setState] = React.useState({
    showDropdown: false,
    popup: null,
    isRefreshing: false,
  });

  const _handleTogglePopup = (value) => {
    if (!value || state.popup === value) {
      setState((prev) => ({ ...prev, popup: null }));
    } else {
      setState((prev) => ({ ...prev, popup: value, showDropdown: false }));
    }
  };

  const { mobile } = useMediaQuery();
  const isSignedOut = !viewer;

  return (
    <div css={STYLES_HEADER}>
      <header style={{ position: "relative" }}>
        <div css={STYLES_APPLICATION_HEADER}>
          <div css={STYLES_LEFT}>
            <Show
              when={viewer}
              fallback={
                <Link onAction={onAction} href="/_/data" style={{ pointerEvents: "auto" }}>
                  <DarkSymbol style={{ height: 24, display: "block" }} />
                </Link>
              }
            >
              <ApplicationUserControls
                popup={mobile ? false : state.popup}
                onTogglePopup={_handleTogglePopup}
                viewer={viewer}
                onAction={onAction}
              />
            </Show>
          </div>
          <div css={STYLES_MIDDLE}>
            {/**TODO: update Search component */}
            <Search.Input viewer={viewer} data={data} onAction={onAction} page={page} />
          </div>
          {isSignedOut ? (
            <AuthActions onAction={onAction} />
          ) : (
            <UploadOnboarding onAction={onAction} viewer={viewer} isMobile={isMobile}>
              <Upload.Provider page={page} data={data} viewer={viewer}>
                <Upload.Root page={page} data={data} isMobile={isMobile}>
                  <div css={STYLES_RIGHT}>
                    <UserActions viewer={viewer} />
                  </div>
                </Upload.Root>
              </Upload.Provider>
            </UploadOnboarding>
          )}
        </div>
        <Show when={mobile && state.popup === "profile"}>
          <ApplicationUserControlsPopup
            popup={state.popup}
            onTogglePopup={_handleTogglePopup}
            viewer={viewer}
            onAction={onAction}
            style={{ pointerEvents: "auto" }}
          />
          <div css={STYLES_BACKGROUND} />
        </Show>
        {/** NOTE(amine): a fix for a backdrop-filter bug where the filter doesn't take any effects.
         *   It happens when we have two elements using backdrop-filter with a parent-child relationship */}
        <div css={STYLES_APPLICATION_HEADER_BACKGROUND} />
      </header>
    </div>
  );
}

const AuthActions = ({ onAction }) => {
  const { isSearching } = useSearchStore();

  if (isSearching) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Search.Dismiss style={{ marginLeft: 4 }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ y: 10, opacity: 0 }}
    >
      <Link href="/_/auth?tab=signin" onAction={onAction} style={{ pointerEvents: "auto" }}>
        <span css={Styles.MOBILE_HIDDEN}>
          <ButtonTertiary
            style={{
              padding: "0px 12px",
              minHeight: "30px",
              fontFamily: Constants.font.text,
              marginRight: 8,
            }}
          >
            Sign in
          </ButtonTertiary>
        </span>
      </Link>
      <Link href="/_/auth?tab=signup" onAction={onAction} style={{ pointerEvents: "auto" }}>
        <ButtonPrimary
          style={{ padding: "0px 12px", minHeight: "30px", fontFamily: Constants.font.text }}
        >
          Sign up
        </ButtonPrimary>
      </Link>
    </motion.div>
  );
};

const UserActions = ({ viewer }) => {
  const { isSearching } = useSearchStore();

  if (isSearching) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Search.Dismiss style={{ marginLeft: 4 }} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Upload.Trigger viewer={viewer} aria-label="Upload" css={STYLES_UPLOAD_BUTTON}>
        <SVG.Plus height="16px" />
      </Upload.Trigger>
    </motion.div>
  );
};
