import * as React from "react";
import * as System from "~/components/system";

import { ModalPortal } from "~/components/core/ModalPortal";
import { css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEscapeKey } from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 *  Root
 * -----------------------------------------------------------------------------------------------*/

const JUMPER_WIDTH = 640;
const JUMPER_HEIGHT = 400;

const STYLES_JUMPER_ROOT = (theme) => css`
  position: fixed;
  top: calc(50% - ${JUMPER_HEIGHT / 2}px);
  left: calc(50% - ${JUMPER_WIDTH / 2}px);
  width: ${JUMPER_WIDTH}px;
  height: ${JUMPER_HEIGHT}px;
  z-index: ${theme.zindex.modal};
  border-radius: 16px;
  border: 1px solid ${theme.semantic.borderGrayLight};
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

function Root({ children, isOpen, onClose, ...props }) {
  useEscapeKey(onClose);
  return (
    <AnimatePresence>
      {isOpen ? (
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
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Item
 * -----------------------------------------------------------------------------------------------*/

function Item({ children, ...props }) {
  return <div {...props}>{children}</div>;
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

export { Root, Item, Divider };
