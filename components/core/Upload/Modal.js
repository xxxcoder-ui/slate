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
import { Link } from "~/components/core/Link";
import { motion } from "framer-motion";

import FilePlaceholder from "~/components/core/ObjectPreview/placeholders/File";
import DataMeter from "~/components/core/DataMeter";

/* -------------------------------------------------------------------------------------------------
 * UploadModal
 * -----------------------------------------------------------------------------------------------*/

const STYLES_MODAL = css`
  z-index: ${Constants.zindex.uploadModal};
  top: ${Constants.sizes.header}px;
  right: 0;
  bottom: 0;
  position: fixed;
  left: 0;
  padding: 24px 24px 32px;
  height: calc(100vh - ${Constants.sizes.header}px);
  overflow-y: auto;

  background-color: ${Constants.semantic.bgBlurWhiteOP};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
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

const STYLES_MODAL_CONTROLS_MARGINS = (theme) => css`
  margin-top: 200px;
  margin-bottom: 200px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 70px;
    margin-bottom: 70px;
  }
`;

export default function UploadModal({ onAction, viewer }) {
  const [, { hideUploadModal }] = useUploadContext();

  useEscapeKey(hideUploadModal);

  useLockScroll();

  return (
    <div css={STYLES_MODAL}>
      <div css={STYLES_SIDEBAR_HEADER} style={{ position: "absolute", right: 24 }}>
        {/** TODO CLOSE */}
        <button onClick={hideUploadModal} css={[Styles.BUTTON_RESET, STYLES_DISMISS]}>
          <SVG.Dismiss height="24px" />
        </button>
      </div>
      <div>
        <Controls css={STYLES_MODAL_CONTROLS_MARGINS} />
        <Summary onAction={onAction} viewer={viewer} />
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

const STYLES_MODAL_CONTROLS = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
`;

const STYLES_LINK_INPUT = (theme) => css`
  width: 392px;
  border-radius: 12;
  background-color: ${theme.semantic.bgWhite};

  @media (max-width: ${theme.sizes.mobile}px) {
    width: 100%;
  }
`;

function Controls({ css, ...props }) {
  const [, { upload, uploadLink }] = useUploadContext();

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
    uploadLink({ url: state.url, slate: state.slate });
  };

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value, urlError: false }));
  };

  return (
    <div css={[STYLES_MODAL_CONTROLS, css]} {...props}>
      <input css={STYLES_FILE_HIDDEN} multiple type="file" id="file" onChange={handleUpload} />
      <div css={Styles.HORIZONTAL_CONTAINER}>
        <System.Input
          placeholder="Paste a link to save"
          value={state.url}
          inputCss={STYLES_LINK_INPUT}
          style={{
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
  box-shadow: ${theme.shadow.lightSmall};
`;

const STYLES_SUMMARY_WRAPPER = (theme) => css`
  ${Styles.VERTICAL_CONTAINER}
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 160px;
  border: 1px solid ${theme.semantic.borderGrayLight};
`;

function Summary({ onAction }) {
  const [{ fileLoading }, { retry, cancel }] = useUploadContext();

  const { uploadSummary, totalFilesSummary } = React.useMemo(() => {
    let totalFilesSummary = { failed: 0, duplicate: 0, saved: 0 };
    const uploadSummary = Object.entries(fileLoading).map(([, file]) => {
      if (file.status === "saving") return file;
      totalFilesSummary[file.status]++;
      return file;
    });

    const statusOrder = {
      failed: 1,
      saving: 2,
      duplicate: 3,
      success: 4,
    };
    return {
      totalFilesSummary,
      uploadSummary: uploadSummary.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.createdAt - b.createdAt
      ),
    };
  }, [fileLoading]);

  if (uploadSummary.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      css={STYLES_SUMMARY_WRAPPER}
    >
      <SummaryBox totalFilesSummary={totalFilesSummary} />
      <SummaryTable
        onAction={onAction}
        retry={retry}
        cancel={cancel}
        uploadSummary={uploadSummary}
      />
    </motion.div>
  );
}

const TableButton = ({ children, as = "button", ...props }) => (
  <System.H5 css={Styles.BUTTON_RESET} color="blue" as={as} {...props}>
    {children}
  </System.H5>
);

const STYLES_SUMMARY_BOX = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  padding: 24px;
  background-color: ${theme.semantic.bgWhite};
  min-height: 165px;
  box-shadow: ${theme.shadow.lightSmall};
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};
`;

const SummaryBox = ({ totalFilesSummary }) => {
  const [
    {
      totalBytesUploaded,
      totalBytes,
      totalFilesUploaded,
      totalFiles,
      uploadStartingTime,
      isUploading,
    },
    { cancelAll },
  ] = useUploadContext();

  const uploadRemainingTime = useUploadRemainingTime({
    uploadStartingTime,
    totalBytes,
    totalBytesUploaded,
  });

  const title = React.useMemo(() => {
    if (isUploading)
      return {
        copy: `Saving ${totalFiles - totalFilesUploaded} of ${totalFiles} Objects...`,
        color: "textBlack",
      };

    if (totalFilesSummary.failed === 0) return { copy: "Upload completed", color: "textBlack" };

    return {
      copy: `Upload completed, failed to upload ${totalFilesSummary.failed} ${Strings.pluralize(
        "file",
        totalFilesSummary.failed
      )}`,
      color: "red",
    };
  }, [isUploading, totalFiles, totalFilesUploaded, totalFilesSummary]);

  const getTextSummary = (fileStatus, suffix) =>
    `${totalFilesSummary[fileStatus]} ${Strings.pluralize(
      "file",
      totalFilesSummary[fileStatus]
    )} ${suffix}`;

  return (
    <div css={STYLES_SUMMARY_BOX}>
      <div css={STYLES_PLACEHOLDER}>
        <FilePlaceholder />
      </div>
      <div style={{ marginLeft: 36, width: "100%" }}>
        <System.H4 color={title.color}>{title.copy}</System.H4>
        {isUploading ? (
          <>
            <DataMeter
              bytes={totalBytesUploaded}
              maximumBytes={totalBytes}
              style={{ marginTop: 10 }}
            />
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
          </>
        ) : (
          <div style={{ marginTop: 8 }}>
            <System.H5 as="p" color="textGrayDark">
              <Show when={totalFilesSummary.saved}>
                {getTextSummary("saved", "saved")}
                <br />
              </Show>
              <Show when={totalFilesSummary.failed}>
                {getTextSummary("failed", "failed")}
                <br />
              </Show>

              <Show when={totalFilesSummary.duplicate}>
                {getTextSummary("duplicate", "already exists")}
              </Show>
            </System.H5>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryTable = ({ uploadSummary, onAction, retry, cancel, ...props }) => {
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
        name: <System.H5 color="textGrayDark">Object</System.H5>,
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
        name: <System.H5 color="textGrayDark">Size</System.H5>,
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
              <System.H5 color="green">Already saved</System.H5>
            </Match>
          </Switch>
        </div>
      ),
      object: (
        <div>
          {row.cid ? (
            <Link onAction={onAction} href={`/_/data?cid=${row.cid}`}>
              <System.H5 nbrOflines={1} title={row.name}>
                {row.name}
              </System.H5>
            </Link>
          ) : (
            <System.H5 nbrOflines={1} title={row.name}>
              {row.name}
            </System.H5>
          )}
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
                <Link onAction={onAction} href={`/_/data?cid=${row.cid}`}>
                  <TableButton as="p">Edit</TableButton>
                </Link>
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
    </div>
  );
};
