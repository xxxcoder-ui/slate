import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { H5, P3 } from "~/components/system/components/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { useEscapeKey, useLockScroll } from "~/common/hooks";

import ProfilePhoto from "~/components/core/ProfilePhoto";

const STYLES_OVERLAY = (theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: ${theme.semantic.bgBlurBlackTRN};
  ${Styles.CONTAINER_CENTERED};
  z-index: ${theme.zindex.modal};
`;

const STYLES_MODAL_WRAPPER = (theme) => css`
  min-width: 400px;
  padding: 24px;
  border: 1px solid ${theme.semantic.bgGrayLight};
  border-radius: 16px;
  background: ${theme.system.white};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background: linear-gradient(
      120.84deg,
      rgba(255, 255, 255, 0.85) 5.24%,
      rgba(255, 255, 255, 0.544) 98.51%
    );
  }
`;

const STYLES_PROFILE = css`
  display: block;
  ${Styles.HORIZONTAL_CONTAINER};
  align-items: flex-start;
`;

const STYLES_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  color: ${theme.semantic.textGray};
`;

// NOTE(amine): social buttons styles
const STYLES_SOCIAL_BUTTON = (theme) => css`
  ${Styles.VERTICAL_CONTAINER_CENTERED}
  padding: 16px;
  border-radius: 12px;
  box-shadow: ${theme.shadow.lightLarge};
`;

const STYLES_TWITTER_BUTTON = css`
  background-color: #58aee7;
`;

const STYLES_EMAIL_BUTTON = (theme) => css`
  background-color: ${theme.system.white};
`;

const STYLES_TEXT_CENTER = css`
  text-align: center;
`;

// NOTE(amine): This modal will be a building block for both Object and Collection sharing modals
export const ShareModalPrimitive = ({
  isOpen,
  closeModal,
  title,
  description,
  includeSocialSharing = true,
  onTwitterSharing,
  onEmailSharing,
  user,
  children,
}) => {
  useEscapeKey(closeModal);
  useLockScroll({ lock: isOpen });

  const handleModalClick = (e) => (e.preventDefault(), e.stopPropagation());

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          css={STYLES_OVERLAY}
          onClick={closeModal}
        >
          <motion.div
            layoutId
            exit={{ y: 50 }}
            transition={{ duration: 0.5, easings: "easeInOut" }}
            css={STYLES_MODAL_WRAPPER}
            onClick={handleModalClick}
          >
            <motion.div layout css={STYLES_PROFILE} style={{ alignItems: "flex-start" }}>
              <ProfilePhoto user={user} size={48} />
              <div style={{ marginLeft: 12, flexGrow: 1 }}>
                <H5 color="textBlack" nbrOflines={1}>
                  {title}
                </H5>
                <P3 style={{ marginTop: 3 }} color="textGrayDark" nbrOflines={1}>
                  {description}
                </P3>
              </div>
              <button css={STYLES_DISMISS_BUTTON} style={{ marginLeft: 13 }} onClick={closeModal}>
                <span>
                  <SVG.Dismiss height={20} />
                </span>
              </button>
            </motion.div>

            {includeSocialSharing && (
              <div css={Styles.CONTAINER_CENTERED} style={{ marginTop: 24 }}>
                <button css={Styles.BUTTON_RESET} onClick={onTwitterSharing}>
                  <span>
                    <div css={[STYLES_SOCIAL_BUTTON, STYLES_TWITTER_BUTTON]}>
                      <SVG.Twitter style={{ display: "block" }} />
                    </div>
                    <P3 style={{ marginTop: 4 }} css={STYLES_TEXT_CENTER}>
                      Twitter
                    </P3>
                  </span>
                </button>

                <button
                  css={Styles.BUTTON_RESET}
                  style={{ marginLeft: 24 }}
                  onClick={onEmailSharing}
                >
                  <span>
                    <div css={[STYLES_SOCIAL_BUTTON, STYLES_EMAIL_BUTTON]}>
                      <SVG.Mail style={{ display: "block" }} />
                    </div>
                    <P3 style={{ marginTop: 4 }} css={STYLES_TEXT_CENTER}>
                      Email
                    </P3>
                  </span>
                </button>
              </div>
            )}
            <div style={{ marginTop: 24 }}>{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
