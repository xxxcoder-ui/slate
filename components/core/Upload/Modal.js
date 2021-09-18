/* eslint-disable jsx-a11y/no-autofocus */
import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";
import * as System from "~/components/system";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { Show } from "~/components/utility/Show";
import { useEscapeKey, useLockScroll } from "~/common/hooks";
import { useUploadContext, useUploadRemainingTime } from "~/components/core/Upload/Provider";
import { Table } from "~/components/system/components/Table";
import { Match, Switch } from "~/components/utility/Switch";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { motion } from "framer-motion";
import { ModalPortal } from "~/components/core/ModalPortal";

import FilePlaceholder from "~/components/core/ObjectPreview/placeholders/File";
import DataMeter from "~/components/core/DataMeter";

/* -------------------------------------------------------------------------------------------------
 * UploadModal
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SUMMARY_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  border-radius: 8px;
  padding: 6px 8px;
  background-color: ${theme.semantic.bgLight};
`;
const STYLES_MODAL = css`
  z-index: ${Constants.zindex.uploadModal};
  top: ${Constants.sizes.header}px;
  right: 0;
  bottom: 0;
  position: fixed;
  left: 0;
  padding: 24px 24px 32px;
  height: calc(100vh - ${Constants.sizes.header}px);

  background-color: ${Constants.semantic.bgBlurWhiteOP};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
`;

const STYLES_MODAL_ELEMENTS = css`
  width: 100%;
  height: 100%;
`;

const STYLES_SIDEBAR_HEADER = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const STYLES_DISMISS = css`
  ${Styles.ICON_CONTAINER}

  color: ${Constants.semantic.textGray};

  :focus {
    outline: none;
  }

  :hover {
    color: ${Constants.system.blue};
  }
`;

const STYLES_MODAL_WRAPPER = css`
  height: 100%;
  width: 100%;
  @keyframes global-carousel-fade-in {
    from {
      transform: translate(8px);
      opacity: 0;
    }
    to {
      transform: translateX(0px);
      opacity: 1;
    }
  }
  animation: global-carousel-fade-in 400ms ease;
`;

export default function UploadModal({ onAction, viewer }) {
  const [{ isUploading }, { hideUploadModal }] = useUploadContext();

  const [state, setState] = React.useState({
    url: "",
    urlError: false,
    // NOTE(amine): initial || summary
    view: isUploading ? "summary" : "initial",
  });

  const toggleSummaryView = () => {
    setState((prev) => ({
      ...prev,
      view: state.view === "initial" ? "summary" : "initial",
    }));
  };

  useEscapeKey(hideUploadModal);

  useLockScroll();

  return (
    <div css={STYLES_MODAL}>
      <div css={STYLES_MODAL_ELEMENTS}>
        <div css={STYLES_SIDEBAR_HEADER} style={{ position: "absolute", right: 24 }}>
          {/** TODO CLOSE */}
          <button onClick={hideUploadModal} css={[Styles.BUTTON_RESET, STYLES_DISMISS]}>
            <SVG.Dismiss height="24px" />
          </button>
        </div>
        <div css={STYLES_MODAL_WRAPPER}>
          <button
            css={STYLES_SUMMARY_BUTTON}
            onClick={toggleSummaryView}
            style={{
              backgroundColor:
                state.view === "summary"
                  ? Constants.semantic.bgGrayLight
                  : Constants.semantic.bgLight,
            }}
          >
            <SVG.List />
            <span style={{ marginLeft: 8 }}>Upload Summary</span>
          </button>
          <Show when={state.view === "summary"} fallback={<Controls />}>
            <Summary onAction={onAction} viewer={viewer} />
          </Show>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Controls
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

function Controls() {
  const [, { upload }] = useUploadContext();

  const [state, setState] = React.useState({
    url: "",
    urlError: false,
  });

  const handleUpload = (e) => {
    const { files } = FileUtilities.formatUploadedFiles({ files: e.target.files });
    upload({ files, slate: state.slate });
  };

  const handleUploadLink = () => {
    if (Strings.isEmpty(state.url)) {
      setState((prev) => ({ ...prev, urlError: true }));
      return;
    }
    try {
      new URL(state.url);
    } catch (e) {
      Logging.error(e);
      setState((prev) => ({ ...prev, urlError: true }));
      return;
    }
    FileUtilities.uploadLink({ url: state.url, slate: state.slate });
  };

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value, urlError: false }));
  };

  return (
    <div
      css={Styles.VERTICAL_CONTAINER_CENTERED}
      style={{ width: "100%", height: "100%", justifyContent: "center" }}
    >
      <input css={STYLES_FILE_HIDDEN} multiple type="file" id="file" onChange={handleUpload} />
      <div css={Styles.HORIZONTAL_CONTAINER}>
        <System.Input
          placeholder="Paste a link to save"
          value={state.url}
          style={{
            width: 392,
            backgroundColor: Constants.semantic.bgWhite,
            borderRadius: 12,
            boxShadow: state.urlError
              ? `0 0 0 1px ${Constants.system.red} inset`
              : `${Constants.shadow.lightSmall}, 0 0 0 1px ${Constants.semantic.bgGrayLight} inset`,
          }}
          containerStyle={{ maxWidth: 600 }}
          name="url"
          type="url"
          onChange={handleChange}
          onSubmit={handleUploadLink}
          autoFocus
        />
        <System.ButtonPrimary style={{ marginLeft: 8, width: 96 }} onClick={handleUploadLink}>
          Save
        </System.ButtonPrimary>
      </div>

      <System.Divider width="64px" style={{ margin: "41px 0px" }} />

      <System.H5 color="textGrayDark" as="p" style={{ textAlign: "center" }}>
        Drop or select files to save to Slate
        <br />
        (we recommend uploading fewer than 200 files at a time)
      </System.H5>
      <System.ButtonTertiary
        type="label"
        htmlFor="file"
        style={{
          marginTop: 23,
          maxWidth: 122,
          boxShadow: "0px 0px 40px rgba(15, 14, 18, 0.03)",
        }}
      >
        Select files
      </System.ButtonTertiary>
      <br />
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Summary
 * -----------------------------------------------------------------------------------------------*/

const STYLES_BAR_CONTAINER = (theme) => css`
  border-radius: 16px;
  margin-top: 24px;
  padding: 24px;
  box-shadow: ${theme.shadow.lightSmall};
  border: 1px solid ${theme.semantic.borderGrayLight};
  background-color: ${theme.semantic.bgWhite};
  ${Styles.HORIZONTAL_CONTAINER};
`;

const STYLES_PLACEHOLDER = css`
  width: 64px;
  height: 80px;
  svg {
    height: 100%;
    width: 100%;
  }
`;

const STYLES_TABLE = (theme) => css`
  overflow: hidden;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: ${theme.shadow.lightSmall};
  border: 1px solid ${theme.semantic.borderGrayLight};
`;

function Summary({ viewer }) {
  const [{ fileLoading, isUploading }, { retry, cancel }] = useUploadContext();

  const { library } = viewer;

  const uploadSummary = React.useMemo(() => {
    const uploadSummary = Object.entries(fileLoading).map(([, file]) => {
      // NOTE(amine): find the duplicate element in the library
      if (file.status === "duplicate") {
        const libraryId = library.findIndex((item) => item.cid === file.cid);
        return {
          ...file,
          libraryId,
        };
      }
      return file;
    });

    library.forEach((file, idx) => {
      uploadSummary.push({
        id: file.id,
        name: file.filename,
        total: file.size,
        createdAt: file.createdAt,
        status: "saved",
        libraryId: idx,
      });
    });
    return uploadSummary;
  }, [fileLoading, library]);

  return (
    <div style={{ height: "100%", width: "100%" }} css={Styles.VERTICAL_CONTAINER}>
      <Show when={isUploading}>
        <SummaryBox />
      </Show>
      <SummaryTable
        style={{ marginTop: 24, marginBottom: 20 }}
        viewer={viewer}
        retry={retry}
        cancel={cancel}
        fileLoading={fileLoading}
        uploadSummary={uploadSummary}
      />
    </div>
  );
}

const TableButton = ({ children, ...props }) => (
  <System.H5 css={Styles.BUTTON_RESET} color="blue" as="button" {...props}>
    {children}
  </System.H5>
);

const SummaryBox = () => {
  const [
    { totalBytesUploaded, totalBytes, totalFilesUploaded, totalFiles, uploadStartingTime },
    { cancelAll },
  ] = useUploadContext();

  const uploadRemainingTime = useUploadRemainingTime({
    uploadStartingTime,
    totalBytes,
    totalBytesUploaded,
  });

  return (
    <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} css={STYLES_BAR_CONTAINER}>
      <div css={STYLES_PLACEHOLDER}>
        <FilePlaceholder />
      </div>
      <div style={{ marginLeft: 36, width: "100%" }}>
        <System.H4 color="textBlack">
          Saving {totalFiles - totalFilesUploaded} of {totalFiles} Objects...
        </System.H4>
        <DataMeter bytes={totalBytesUploaded} maximumBytes={totalBytes} style={{ marginTop: 10 }} />
        <System.H5 color="textGrayDark" style={{ marginTop: 12 }}>
          {Strings.bytesToSize(totalBytesUploaded, 0)} of {Strings.bytesToSize(totalBytes, 0)}{" "}
          <Show when={uploadRemainingTime && uploadRemainingTime !== Infinity}>
            – {Strings.getRemainingTime(uploadRemainingTime)} (Please keep this tab open during
            uploading)
          </Show>
        </System.H5>
        <System.ButtonTertiary
          onClick={cancelAll}
          style={{
            backgroundColor: Constants.semantic.bgLight,
            marginTop: 15,
            padding: "1px 12px 3px",
            minHeight: "auto",
            boxShadow: "none",
          }}
        >
          Cancel
        </System.ButtonTertiary>
      </div>
    </motion.div>
  );
};

const SummaryTable = ({ uploadSummary, viewer, fileLoading, retry, cancel, ...props }) => {
  const [globalCarouselState, setGlobalCarouselState] = React.useState({
    currentCarousel: -1,
    currentObjects: viewer.library,
  });

  const handleFileClick = (fileIdx) => {
    setGlobalCarouselState((prev) => ({
      ...prev,
      currentCarousel: fileIdx - (fileLoading?.length || 0),
    }));
  };

  const columns = React.useMemo(() => {
    return [
      {
        key: "status",
        name: <System.H5 color="textGrayDark">Status</System.H5>,
        width: "19%",
        contentstyle: { padding: "0px" },
      },
      {
        key: "object",
        name: <System.H5 color="textGrayDark">Objects</System.H5>,
        width: "30%",
        contentstyle: { padding: "0px" },
      },
      {
        key: "date",
        name: <System.H5 color="textGrayDark">Date saved</System.H5>,
        width: "23%",
        contentstyle: { padding: "0px" },
      },
      {
        key: "size",
        name: <System.H5 color="textGrayDark">Sizes</System.H5>,
        width: "20%",
        contentstyle: { padding: "0px" },
      },
      {
        key: "actions",
        name: <System.H5 color="textGrayDark">Actions</System.H5>,
        width: "8%",
        contentstyle: { padding: "0px" },
      },
    ];
  }, []);

  const rows = React.useMemo(() => {
    return uploadSummary.map((row) => ({
      status: (
        <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
          <Switch fallback={<System.H5>Saved</System.H5>}>
            <Match when={row.status === "saving"}>
              <System.LoaderSpinner />
              <System.H5 color="blue" style={{ marginLeft: 8 }}>
                Saving
              </System.H5>
            </Match>
            <Match when={row.status === "failed"}>
              <System.H5 color="red">Failed</System.H5>
            </Match>
            <Match when={row.status === "duplicate"}>
              <System.H5 color="green">Already exists</System.H5>
            </Match>
          </Switch>
        </div>
      ),
      object: (
        <div>
          <System.H5 nbrOflines={1} title={row.name}>
            {row.name}
          </System.H5>
        </div>
      ),
      date: (
        <div>
          <System.H5 nbrOflines={1} title={row.createdAt}>
            {Utilities.formatDateToString(row.createdAt)}
          </System.H5>
        </div>
      ),
      size: (
        <div>
          <Show
            fallback={<System.H5>{Strings.bytesToSize(row.total)}</System.H5>}
            when={row.status === "saving"}
          >
            <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
              <DataMeter bytes={row.loaded} maximumBytes={row.total} style={{ maxWidth: 84 }} />
              <System.P3 style={{ marginLeft: 8 }}>
                {Strings.bytesToSize(row.loaded, 0)} of {Strings.bytesToSize(row.total, 0)}
              </System.P3>
            </div>
          </Show>
        </div>
      ),
      actions: (
        <div>
          <Switch
            fallback={
              <div css={Styles.HORIZONTAL_CONTAINER}>
                <TableButton onClick={() => handleFileClick(row.libraryId)}>Edit</TableButton>
                <TableButton style={{ marginLeft: 15 }}>Share</TableButton>
              </div>
            }
          >
            <Match when={row.status === "saving"}>
              <TableButton
                css={Styles.BUTTON_RESET}
                onClick={() => cancel({ fileKey: row.id })}
                color="blue"
                as="button"
              >
                Cancel
              </TableButton>
            </Match>
            <Match when={row.status === "failed"}>
              <TableButton onClick={() => retry({ fileKey: row.id })}>Retry</TableButton>
            </Match>
          </Switch>
        </div>
      ),
    }));
  }, [uploadSummary]);

  return (
    <div css={STYLES_TABLE} {...props}>
      <Table
        noColor
        topRowStyle={{
          position: "sticky",
          zIndex: 1,
          top: "0%",
          padding: "14px 24px",
          backgroundColor: Constants.semantic.bgLight,
        }}
        rowStyle={{
          padding: "14px 24px",
          backgroundColor: Constants.system.white,
        }}
        data={{
          columns,
          rows,
        }}
      />
      <ModalPortal>
        <GlobalCarousel
          carouselType="ACTIVITY"
          viewer={viewer}
          objects={globalCarouselState.currentObjects}
          index={globalCarouselState.currentCarousel}
          isMobile={props.isMobile}
          onChange={(idx) =>
            setGlobalCarouselState((prev) => ({
              ...prev,
              currentCarousel: idx - (fileLoading?.length || 0),
            }))
          }
          isOwner={false}
          onAction={() => {}}
        />
      </ModalPortal>
    </div>
  );
};
