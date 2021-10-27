import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { ModalPortal } from "~/components/core/ModalPortal";
import { css } from "@emotion/react";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useEscapeKey } from "~/common/hooks";
import { Show } from "~/components/utility/Show";

import ObjectBoxPreview from "~/components/core/ObjectBoxPreview";

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const JUMPER_WIDTH = 640;
const JUMPER_HEIGHT = 400;

const STYLES_JUMPER_ROOT = (theme) => css`
  ${Styles.VERTICAL_CONTAINER};
  position: fixed;
  top: calc(50% - ${JUMPER_HEIGHT / 2}px);
  left: calc(50% - ${JUMPER_WIDTH / 2}px);
  width: ${JUMPER_WIDTH}px;
  min-height: ${JUMPER_HEIGHT}px;
  z-index: ${theme.zindex.jumper};
  border-radius: 16px;
  border: 1px solid ${theme.semantic.borderGrayLight};
  overflow: hidden;
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

function Root({ children, onClose, ...props }) {
  useEscapeKey(onClose);
  return (
    <ModalPortal>
      <System.Boundary enabled={true} onOutsideRectEvent={onClose}>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          css={STYLES_JUMPER_ROOT}
          {...props}
        >
          {children}
        </motion.div>
      </System.Boundary>
    </ModalPortal>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Header
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_HEADER = css`
  padding: 17px 20px 15px;
`;

function Header({ children, css, ...props }) {
  return (
    <div css={[STYLES_JUMPER_HEADER, css]} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Item
 * -----------------------------------------------------------------------------------------------*/

const STYLES_JUMPER_ITEM = css`
  padding: 13px 20px 12px;
`;

function Item({ children, ...props }) {
  return (
    <div css={[STYLES_JUMPER_ITEM, css]} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Divider
 * -----------------------------------------------------------------------------------------------*/
function Divider({ children, ...props }) {
  return (
    <System.Divider height={1} color="bgGrayLight" {...props}>
      {children}
    </System.Divider>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  ObjectPreview
 * -----------------------------------------------------------------------------------------------*/

function ObjectPreview({ file }) {
  return (
    <div
      css={Styles.HORIZONTAL_CONTAINER_CENTERED}
      style={{ color: Constants.system.green, width: "100%" }}
    >
      <div>
        <SVG.CheckCircle />
      </div>
      <div style={{ marginLeft: 12, marginRight: 12 }}>
        <AnimateSharedLayout>
          <motion.div layoutId={`${file.id}-title`} key={`${file.id}-title`}>
            <System.H5 nbrOflines={1} as="h1" style={{ wordBreak: "break-all" }} color="textBlack">
              {file?.name || file?.filename}
            </System.H5>
          </motion.div>
        </AnimateSharedLayout>
        <Show when={file?.source}>
          <System.P3 nbrOflines={1} color="textBlack" style={{ marginTop: 3 }}>
            {file?.source}
          </System.P3>
        </Show>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <ObjectBoxPreview file={file} placeholderRatio={2} style={{ width: 28, height: 39 }} />
      </div>
    </div>
  );
}

export { Root, Header, Item, Divider, ObjectPreview };
