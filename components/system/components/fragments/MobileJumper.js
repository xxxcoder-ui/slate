import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { FullHeightLayout } from "~/components/system/components/FullHeightLayout";
import { motion, AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { ModalPortal } from "~/components/core/ModalPortal";
import { useLockScroll } from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 *  AnimatePresence
 * -----------------------------------------------------------------------------------------------*/

function AnimatePresence({ children, ...props }) {
  return <FramerAnimatePresence {...props}>{children}</FramerAnimatePresence>;
}

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_WRAPPER = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: ${theme.zindex.jumper};

  background-color: ${theme.semantic.bgWhite};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhiteOP};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

const JumperContext = React.createContext({});
const useJumperContext = () => React.useContext(JumperContext);

function Root({ children, onClose, withDismissButton = true, ...props }) {
  useLockScroll();

  return (
    <ModalPortal>
      <FullHeightLayout
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        css={[STYLES_JUMPER_MOBILE_WRAPPER, css]}
        {...props}
      >
        <JumperContext.Provider value={{ onClose, withDismissButton }}>
          {children}
        </JumperContext.Provider>
      </FullHeightLayout>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Header
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_HEADER = css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  justify-content: space-between;
  padding: 7px 8px 3px 16px;
`;

function Header({ children, ...props }) {
  const { onClose, withDismissButton } = useJumperContext();
  return (
    <div css={[STYLES_JUMPER_MOBILE_HEADER, css]} {...props}>
      {children}
      {withDismissButton && (
        <button
          css={[Styles.BUTTON_RESET, Styles.CONTAINER_CENTERED]}
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <SVG.Dismiss
            width={16}
            height={16}
            style={{ display: "block", color: Constants.semantic.textGray }}
          />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Divider
 * -----------------------------------------------------------------------------------------------*/

function Divider({ children, color = "borderGrayLight4", ...props }) {
  return (
    <System.Divider height={1} color={color} {...props}>
      {children}
    </System.Divider>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Content
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_MOBILE_CONTENT = css`
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px 16px;
`;

function Content({ children, ...props }) {
  return (
    <div css={[STYLES_JUMPER_MOBILE_CONTENT, css]} {...props}>
      {children}
    </div>
  );
}

const STYLES_JUMPER_MOBILE_FOOTER = (theme) => css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 16px;
  min-height: 48px;

  border-top: 1px solid ${theme.semantic.borderGrayLight4};
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhite};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

/* -------------------------------------------------------------------------------------------------
 *  Footer
 * -----------------------------------------------------------------------------------------------*/

function Footer({ children, css, ...props }) {
  return (
    <div css={[STYLES_JUMPER_MOBILE_FOOTER, css]} {...props}>
      {children}
    </div>
  );
}

export { AnimatePresence, Root, Header, Divider, Content, Footer };
