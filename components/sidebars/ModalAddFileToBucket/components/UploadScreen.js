/* eslint-disable jsx-a11y/no-autofocus */
import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";

import { css } from "@emotion/react";

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

export default class UploadScreen extends React.Component {
  state = {
    url: "",
    urlError: false,
  };

  _handleUploadLink = () => {
    if (Strings.isEmpty(this.state.url)) {
      this.setState({ urlError: true });
      return;
    }
    try {
      new URL(this.state.url);
    } catch (e) {
      Logging.error(e);
      this.setState({ urlError: true });
      return;
    }
    FileUtilities.uploadLink({ url: this.state.url, slate: this.state.slate });
    this.props.onCancel();
  };

  _handleUpload = (e) => {
    this.props.onUpload({
      files: e.target.files,
      slate: this.state.slate,
    });
    this.props.onCancel();
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, urlError: false });
  };

  render() {
    return (
      <div
        css={Styles.VERTICAL_CONTAINER_CENTERED}
        style={{ width: "100%", height: "100%", justifyContent: "center" }}
      >
        <input
          css={STYLES_FILE_HIDDEN}
          multiple
          type="file"
          id="file"
          onChange={this._handleUpload}
        />
        <div css={Styles.HORIZONTAL_CONTAINER}>
          <System.Input
            placeholder="Paste a link to save"
            value={this.state.url}
            style={{
              width: 392,
              backgroundColor: Constants.semantic.bgWhite,
              borderRadius: 12,
              boxShadow: this.state.urlError
                ? `0 0 0 1px ${Constants.system.red} inset`
                : `${Constants.shadow.lightSmall}, 0 0 0 1px ${Constants.semantic.bgGrayLight} inset`,
            }}
            containerStyle={{ maxWidth: 600 }}
            name="url"
            type="url"
            onChange={this._handleChange}
            onSubmit={this._handleUploadLink}
            autoFocus
          />
          <System.ButtonPrimary
            style={{ marginLeft: 8, width: 96 }}
            onClick={this._handleUploadLink}
          >
            Save
          </System.ButtonPrimary>
        </div>

        <System.Divider width="64px" style={{ margin: "41px 0px" }} />

        <System.H5 color="textGrayDark">Drop or select files to save to Slate</System.H5>
        <System.H5 color="textGrayDark">(we recommend uploading n files at a time)</System.H5>
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
}
