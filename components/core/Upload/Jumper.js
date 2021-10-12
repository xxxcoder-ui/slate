import * as React from "react";
import * as Jumper from "~/components/core/Jumper";
import * as System from "~/components/system";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { useUploadContext } from "~/components/core/Upload/Provider";

const STYLES_JUMPER_HEADER = css`
  padding: 17px 20px 15px;
`;

const STYLES_LINK_INPUT = (theme) => css`
  width: 392px;
  border-radius: 12;
  background-color: ${theme.semantic.bgWhite};

  @media (max-width: ${theme.sizes.mobile}px) {
    width: 100%;
  }
`;

const STYLES_JUMPER_OVERLAY = (theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${theme.zindex.jumper};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurLightTRN};
  }
`;

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

const STYLES_LINK_UPLOAD_WRAPPER = css`
  padding: 50px 72px;
`;

const STYLES_FILES_UPLOAD_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  padding-top: 55px;
  padding-bottom: 55px;
`;

export function UploadJumper({ data }) {
  const [{ isUploadJumperVisible }, { upload, uploadLink, hideUploadJumper }] = useUploadContext();

  const [state, setState] = React.useState({
    url: "",
    urlError: false,
  });

  const handleUpload = (e) => {
    const { files } = FileUtilities.formatUploadedFiles({ files: e.target.files });
    upload({ files, slate: data });
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
    uploadLink({ url: state.url, slate: data });
    setState({ url: "", urlError: false });
  };

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value, urlError: false }));
  };

  return (
    <>
      {isUploadJumperVisible && <div css={STYLES_JUMPER_OVERLAY} />}
      <Jumper.Root isOpen={isUploadJumperVisible} onClose={hideUploadJumper}>
        <Jumper.Item css={STYLES_JUMPER_HEADER}>
          <System.H5 color="textBlack">Upload</System.H5>
        </Jumper.Item>
        <Jumper.Divider />
        <Jumper.Item css={STYLES_LINK_UPLOAD_WRAPPER}>
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
        </Jumper.Item>
        <Jumper.Divider />
        <Jumper.Item css={STYLES_FILES_UPLOAD_WRAPPER}>
          <input css={STYLES_FILE_HIDDEN} multiple type="file" id="file" onChange={handleUpload} />
          <System.H5 color="textGrayDark" as="p" style={{ textAlign: "center" }}>
            Drop or select files to save to Slate
            <br />
            <System.P3 color="textGrayDark" as="span">
              (we recommend uploading fewer than 200 files at a time)
            </System.P3>
          </System.H5>
          <System.ButtonTertiary
            type="label"
            htmlFor="file"
            style={{
              marginTop: 23,
              maxWidth: 122,
            }}
          >
            Select files
          </System.ButtonTertiary>
        </Jumper.Item>
      </Jumper.Root>
    </>
  );
}
