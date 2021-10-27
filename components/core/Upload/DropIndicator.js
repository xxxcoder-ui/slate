import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as FileUtilities from "~/common/file-utilities";

import { css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import { Show } from "~/components/utility/Show";

import FilePlaceholder from "~/components/core/ObjectPreview/placeholders/File";
import { clamp } from "lodash";
import { useEventListener } from "~/common/hooks";

const STYLES_INDICATOR_WRAPPER = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0px;
  left: 0;
  z-index: ${theme.zindex.cta};
  background-color: ${theme.semantic.bgWhite};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
`;

const STYLES_PLACEHOLDER = css`
  width: 64px;
  height: 80px;
  svg {
    height: 100%;
    width: 100%;
  }
`;

export default function DropIndicator({ data }) {
  const DEFAULT_DROPPING_STATE = {
    isDroppingFiles: false,
    totalFilesDropped: undefined,
  };

  const timerRef = React.useRef();

  const [{ isDroppingFiles, totalFilesDropped }, setDroppingState] =
    React.useState(DEFAULT_DROPPING_STATE);

  const handleDragOver = (e) => {
    e.preventDefault();
    // NOTE(amine): Hack to hide the indicator if the user drags files outside of the app
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDroppingState(DEFAULT_DROPPING_STATE);
    }, 100);
  };

  const handleDragEnter = async (e) => {
    e.preventDefault();
    const { files } = await FileUtilities.formatDroppedFiles({
      dataTransfer: e.dataTransfer,
    });
    setDroppingState({ totalFilesDropped: files.length || undefined, isDroppingFiles: true });
  };

  useEventListener({ type: "dragenter", handler: handleDragEnter }, []);
  useEventListener({ type: "dragover", handler: handleDragOver }, []);

  return (
    <AnimatePresence>
      {isDroppingFiles ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          css={STYLES_INDICATOR_WRAPPER}
        >
          <DroppedFilesPlaceholder totalFilesDropped={totalFilesDropped} />
          <div style={{ marginTop: 64 }}>
            <System.H3 as="p" style={{ textAlign: "center" }}>
              {data?.name
                ? `Drag and drop files to save them to #${data.name}`
                : "Drag and drop files to save them to Slate"}
            </System.H3>
            <Show when={!totalFilesDropped || totalFilesDropped > 200}>
              <System.H5 as="p" color="textGrayDark">
                (we recommend uploading 200 files at a time)
              </System.H5>
            </Show>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const DroppedFilesPlaceholder = ({ totalFilesDropped = 3 }) => {
  const marginRight = clamp(totalFilesDropped - 1, 0, 2) * 8;
  return (
    <div style={{ position: "relative", right: marginRight }}>
      <div css={STYLES_PLACEHOLDER}>
        <FilePlaceholder />
      </div>
      <Show when={totalFilesDropped >= 2}>
        <div
          style={{ position: "absolute", top: -15, right: -16, zIndex: -1 }}
          css={STYLES_PLACEHOLDER}
        >
          <FilePlaceholder />
        </div>
      </Show>
      <Show when={totalFilesDropped >= 3}>
        <div
          style={{ position: "absolute", top: 2 * -15, right: 2 * -16, zIndex: -2 }}
          css={STYLES_PLACEHOLDER}
        >
          <FilePlaceholder />
        </div>
      </Show>
    </div>
  );
};
