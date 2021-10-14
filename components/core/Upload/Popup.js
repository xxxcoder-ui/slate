import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { useUploadContext } from "~/components/core/Upload/Provider";
import { motion, AnimatePresence } from "framer-motion";
import { css } from "@emotion/react";
import { Match, Switch } from "~/components/utility/Switch";
import { Show } from "~/components/utility/Show";
import { useHover } from "~/common/hooks";

import DataMeter from "~/components/core/DataMeter";
import BlobObjectPreview from "~/components/core/BlobObjectPreview";
import { clamp } from "lodash";
/* -------------------------------------------------------------------------------------------------
 * Popup
 * -----------------------------------------------------------------------------------------------*/

const STYLES_POPUP_WRAPPER = (theme) => css`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: ${theme.zindex.tooltip};
  @media (max-width: ${theme.sizes.mobile}px) {
    right: 50%;
    transform: translateX(50%);
  }
`;

const STYLES_DISMISS_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  position: absolute;
  right: -8px;
  top: -8px;
  border-radius: 50%;
  padding: 4px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  color: ${theme.semantic.textGrayDark};

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }

  svg {
    display: block;
  }
`;

const STYLES_POPUP_CONTENT = css`
  border-radius: 12px;
  overflow: hidden;
`;

const useUploadPopup = ({ totalFilesSummary }) => {
  const [{ isFinished }, { resetUploadState }] = useUploadContext();
  const [popupState, setPopupState] = React.useState({
    isVisible: false,
    isSummaryExpanded: false,
  });

  // NOTE(amine): popup handlers
  const showUploadPopup = () => setPopupState((prev) => ({ ...prev, isVisible: true }));
  const hideUploadPopup = () => setPopupState((prev) => ({ ...prev, isVisible: false }));
  const expandUploadSummary = () => setPopupState({ isVisible: true, isSummaryExpanded: true });
  const collapseUploadSummary = () => setPopupState({ isVisible: true, isSummaryExpanded: false });

  const timeoutRef = React.useRef();
  //NOTE(amine): show the upload summary, then automatically collapse the upload summary after 3 seconds
  const isStarted = totalFilesSummary.total > 0;
  React.useEffect(() => {
    if (!isStarted) return;
    expandUploadSummary();
    timeoutRef.current = setTimeout(collapseUploadSummary, 3000);
  }, [isStarted]);

  /**
   * NOTE(amine): show the upload summary when a file fails to upload,
   * then automatically collapse the upload summary after 3 seconds
   */
  const isSummaryExpandedRef = React.useRef();
  isSummaryExpandedRef.current = popupState.isSummaryExpanded;
  React.useEffect(() => {
    if (isSummaryExpandedRef.current || totalFilesSummary.failed === 0) return;
    expandUploadSummary();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(collapseUploadSummary, 3000);
  }, [totalFilesSummary.failed]);

  // NOTE(amine): show the upload summary when upload finishes
  const totalFilesSummaryRef = React.useRef();
  totalFilesSummaryRef.current = totalFilesSummary;
  React.useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (!isFinished) return;
    //NOTE(amine): if all the upload items have been canceled, hide the upload popup
    if (totalFilesSummaryRef.current.total === 0) {
      hideUploadPopup();
      resetUploadState();
      return;
    }

    expandUploadSummary();

    //NOTE(amine): if the upload is successful, automatically close the popup
    if (totalFilesSummaryRef.current.failed === 0) {
      timeoutRef.current = setTimeout(() => {
        hideUploadPopup();
        resetUploadState();
      }, 10000);
    }
  }, [isFinished]);

  /**
   * NOTE(amine): the upload summary is set to automatically collapse when the upload starts and when a file fails to upload.
   * Let's cancel those effects when the user hovers over the summary
   */
  const cancelAutoCollapseOnMouseEnter = () => clearTimeout(timeoutRef.current);
  return [
    popupState,
    {
      showUploadPopup,
      hideUploadPopup,
      expandUploadSummary,
      collapseUploadSummary,
      cancelAutoCollapseOnMouseEnter,
    },
  ];
};

const useUploadSummary = ({ fileLoading }) =>
  React.useMemo(() => {
    let totalFilesSummary = { failed: 0, duplicate: 0, saved: 0, total: 0 };
    const uploadSummary = Object.entries(fileLoading).map(([, file]) => {
      totalFilesSummary["total"]++;
      if (file.status === "saving") return { ...file, filename: file.name };
      totalFilesSummary[file.status]++;
      return { ...file, filename: file.name };
    });

    const statusOrder = {
      failed: 1,
      saving: 2,
      duplicate: 3,
      saved: 4,
    };

    return {
      totalFilesSummary,
      uploadSummary: uploadSummary.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.createdAt - b.createdAt
      ),
    };
  }, [fileLoading]);

export function Popup() {
  const [{ isFinished, fileLoading }, { resetUploadState }] = useUploadContext();
  const { uploadSummary, totalFilesSummary } = useUploadSummary({ fileLoading });

  const [isHovered, { handleOnMouseEnter, handleOnMouseLeave }] = useHover();

  const [
    popupState,
    { hideUploadPopup, expandUploadSummary, collapseUploadSummary, cancelAutoCollapseOnMouseEnter },
  ] = useUploadPopup({ totalFilesSummary });

  if (!popupState.isVisible) return null;

  return (
    <div
      css={STYLES_POPUP_WRAPPER}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <div css={[STYLES_POPUP_CONTENT]}>
        <AnimatePresence>
          {popupState.isSummaryExpanded ? (
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", stiffness: 170, damping: 26 }}
              onMouseEnter={cancelAutoCollapseOnMouseEnter}
            >
              <Summary uploadSummary={uploadSummary} />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <Header
          totalFilesSummary={totalFilesSummary}
          popupState={popupState}
          expandUploadSummary={expandUploadSummary}
          collapseUploadSummary={collapseUploadSummary}
        />
      </div>
      <Show when={isHovered && isFinished}>
        <button css={STYLES_DISMISS_BUTTON} onClick={() => (hideUploadPopup(), resetUploadState())}>
          <SVG.Dismiss width={16} />
        </button>
      </Show>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Popup Header
 * -----------------------------------------------------------------------------------------------*/

const STYLES_POPUP_HEADER = (theme) => css`
  color: ${theme.semantic.textGrayDark};
  width: 264px;
  padding: 9px 12px 7px;
  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhiteOP};
  }
  border-radius: 12px;
  transition: border-radius 0.5s ease-in-out;
  border: 1px solid ${theme.semantic.bgGrayLight};

  svg {
    display: block;
  }
`;

const STYLES_RESET_BORDER_TOP = css`
  border-top: none;
  border-radius: 0px 0px 12px 12px;
`;

function Header({ totalFilesSummary, popupState, expandUploadSummary, collapseUploadSummary }) {
  const [{ isFinished, totalBytesUploaded, totalBytes }, { retryAll }] = useUploadContext();

  const uploadProgress = clamp(Math.floor((totalBytesUploaded / totalBytes) * 100), 0, 100);

  if (isFinished && totalFilesSummary.failed > 0) {
    return (
      <span
        css={[STYLES_POPUP_HEADER, STYLES_RESET_BORDER_TOP, Styles.HORIZONTAL_CONTAINER_CENTERED]}
      >
        <SVG.AlertTriangle style={{ color: Constants.system.red }} />
        <System.P2 style={{ marginLeft: 12 }}>{totalFilesSummary.failed} failed</System.P2>
        <button
          css={Styles.BUTTON_RESET}
          style={{ marginLeft: "auto", color: Constants.system.blue }}
          onClick={retryAll}
        >
          <span css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
            <SVG.RotateCcw width={16} />
            <System.P2 style={{ marginLeft: 4 }}>Retry failed</System.P2>
          </span>
        </button>
      </span>
    );
  }

  if (isFinished) {
    return (
      <div
        css={[STYLES_POPUP_HEADER, STYLES_RESET_BORDER_TOP, Styles.HORIZONTAL_CONTAINER_CENTERED]}
      >
        <SVG.CheckCircle style={{ color: Constants.system.green }} />
        <System.P2 style={{ marginLeft: 12 }}>
          {totalFilesSummary.saved + totalFilesSummary.duplicate} saved
        </System.P2>
      </div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ y: 10, opacity: 0 }}
      css={[
        Styles.BUTTON_RESET,
        STYLES_POPUP_HEADER,
        popupState.isSummaryExpanded && STYLES_RESET_BORDER_TOP,
      ]}
      aria-label="Upload Summary"
      onClick={popupState.isSummaryExpanded ? collapseUploadSummary : expandUploadSummary}
    >
      <span css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <System.P2 color="textBlack" style={{ width: "5ch" }}>
          {uploadProgress}%
        </System.P2>
        <DataMeter
          bytes={totalBytesUploaded}
          maximumBytes={totalBytes}
          style={{
            width: 164,
            marginLeft: 8,
            backgroundColor: Constants.semantic.bgGrayLight,
          }}
        />
        <motion.div initial={null} animate={{ rotateX: popupState.isSummaryExpanded ? 180 : 0 }}>
          <SVG.ChevronUp style={{ marginLeft: 24, display: "block" }} />
        </motion.div>
      </span>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Popup Summary
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SUMMARY = (theme) => css`
  position: relative;
  background-color: ${theme.system.white};
  max-height: 312px;
  overflow-y: auto;
  overflow-x: hidden;

  border: 1px solid ${theme.semantic.bgGrayLight};
  border-bottom: none;
  border-radius: 12px 12px 0px 0px;

  // NOTE(amine): fix alignment issue caused by inline display
  svg {
    display: block;
  }
`;

const STYLES_PREVIEW_WRAPPER = css`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
`;

const STYLES_SUMMARY_ACTION = css`
  ${Styles.BUTTON_RESET};
  position: relative;
  width: 32;
  height: 32;
  right: -16;
`;

function Summary({ uploadSummary }) {
  const [, { retry, cancel }] = useUploadContext();
  return (
    <div css={STYLES_SUMMARY}>
      {uploadSummary.map((file) => (
        <>
          <div
            key={file.id}
            style={{ padding: "9px 12px 11px" }}
            css={Styles.HORIZONTAL_CONTAINER_CENTERED}
          >
            <div css={STYLES_PREVIEW_WRAPPER}>
              <BlobObjectPreview file={file} placeholderRatio={2.4} />
            </div>

            <div style={{ marginLeft: 12, maxWidth: 164 }}>
              <System.H5 nbrOflines={1} as="p">
                {file.name}
              </System.H5>
              <Switch
                fallback={
                  <System.P3 color="textGrayDark">{Strings.bytesToSize(file.total, 0)}</System.P3>
                }
              >
                <Match when={file.status === "saving"}>
                  <DataMeter
                    bytes={file.loaded}
                    maximumBytes={file.total}
                    style={{ maxWidth: 84, marginTop: 2 }}
                  />
                </Match>
                <Match when={file.status === "failed"}>
                  <System.P3 color="red">failed</System.P3>
                </Match>
                <Match when={file.status === "duplicate"}>
                  <System.P3 color="green">already saved</System.P3>
                </Match>
              </Switch>
            </div>

            <div style={{ marginLeft: "auto" }}>
              <Switch fallback={<SVG.CheckCircle style={{ color: Constants.system.green }} />}>
                <Match when={file.status === "saving"}>
                  <button
                    css={STYLES_SUMMARY_ACTION}
                    style={{ color: Constants.semantic.textGray }}
                    onClick={() => cancel({ fileKey: file.id })}
                  >
                    <SVG.XCircle />
                  </button>
                </Match>
                <Match when={file.status === "failed"}>
                  <button
                    css={STYLES_SUMMARY_ACTION}
                    style={{ color: Constants.system.blue }}
                    onClick={() => retry({ fileKey: file.id })}
                  >
                    <SVG.RotateCcw width={16} />
                  </button>
                </Match>
              </Switch>
            </div>
          </div>
          <System.Divider height={1} color="bgLight" />
        </>
      ))}
    </div>
  );
}
