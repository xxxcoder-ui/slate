import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as System from "~/components/system";
import * as Store from "~/common/store";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";

import { css } from "@emotion/react";
import { DataMeterBar } from "~/components/core/DataMeter";
import { SidebarWarningMessage } from "~/components/core/WarningMessage";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

const STYLES_FILE_LIST = css`
  box-shadow: 0 0 0 1px inset ${Constants.semantic.borderGrayLight};
  border-radius: 8px;
`;

const STYLES_FILE_LINE = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border-bottom: 1px solid ${Constants.semantic.borderGrayLight};
`;

const STYLES_FILE_NAME = css`
  min-width: 10%;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.9rem;
  font-family: ${Constants.font.medium};
`;

const STYLES_LEFT = css`
  width: 100%;
  min-width: 10%;
  display: flex;
  align-items: center;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const STYLES_FILE_STATUS = css`
  flex-shrink: 0;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const STYLES_BAR_CONTAINER = css`
  ${"" /* background: ${Constants.semantic.bgLight}; */}
  box-shadow: 0 0 0 1px inset ${Constants.semantic.borderGrayLight};
  border-radius: 8px;
  padding: 24px;
  ${"" /* margin-top: 48px; */}
`;

const STYLES_PERFORMANCE = css`
  font-family: ${Constants.font.code};
  font-size: 12px;
  display: block;
  margin: 0 0 8px 0;
`;

export default class ModalAddFileToBucket extends React.Component {
  state = {
    url: "",
    slate: this.props.page.id === "NAV_SLATE" && this.props.data?.id ? this.props.data : null,
    urlError: false,
  };

  componentDidMount = () => {
    window.addEventListener("keydown", this._handleDocumentKeydown);
  };

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this._handleDocumentKeydown);
  };

  _handleDocumentKeydown = (e) => {
    if (e.keyCode === 27) {
      this.props.onCancel();
      e.stopPropagation();
    }
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

  _handleCancel = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    Events.dispatchCustomEvent({ name: `cancel-${key}` }); //NOTE(martina): so that will cancel if is in the middle of uploading
    Store.setCancelled(key); //NOTE(martina): so that will cancel if hasn't started uploading yet
    this.props.onAction({ type: "REGISTER_FILE_CANCELLED", value: key }); //NOTE(martina): so that fileLoading registers it
  };

  _handleUploadLink = () => {
    if (Strings.isEmpty(this.state.url)) {
      this.setState({ urlError: true });
      return;
    }
    try {
      const url = new URL(this.state.url);
    } catch (e) {
      Logging.error(e);
      this.setState({ urlError: true });
      return;
    }
    FileUtilities.uploadLink({ url: this.state.url, slate: this.state.slate });
    this.props.onCancel();
  };

  render() {
    let loaded = 0;
    let total = 0;
    if (this.props.fileLoading) {
      for (let file of Object.values(this.props.fileLoading)) {
        if (typeof file.loaded === "number" && typeof file.total === "number") {
          total += file.total;
          loaded += file.loaded;
        }
      }
    }

    if (this.props.fileLoading && Object.keys(this.props.fileLoading).length) {
      return (
        <div style={{ width: "100%", height: "100%" }}>
          <System.H2 style={{ marginBottom: 36, marginTop: 12 }}>Upload Status</System.H2>
          <div css={STYLES_BAR_CONTAINER}>
            <strong css={STYLES_PERFORMANCE}>
              {Strings.bytesToSize(loaded)} / {Strings.bytesToSize(total)}
            </strong>
            <DataMeterBar bytes={loaded} maximumBytes={total} />
          </div>
          <div css={STYLES_FILE_LIST} style={{ marginTop: 36, overflow: "hidden" }}>
            {this.props.fileLoading
              ? Object.entries(this.props.fileLoading).map((entry) => {
                  let file = entry[1];
                  return (
                    <div css={STYLES_FILE_LINE} key={file.name}>
                      <span css={STYLES_LEFT}>
                        <div css={STYLES_FILE_STATUS}>
                          {file.failed ? (
                            <SVG.Alert
                              height="24px"
                              style={{
                                color: Constants.system.red,
                                pointerEvents: "none",
                              }}
                            />
                          ) : file.cancelled ? (
                            <SVG.Dismiss
                              height="24px"
                              style={{
                                color: Constants.system.gray,
                                pointerEvents: "none",
                              }}
                            />
                          ) : file.loaded === file.total ? (
                            <SVG.CheckBox
                              height="24px"
                              style={{ color: Constants.system.grayLight2 }}
                            />
                          ) : (
                            <System.LoaderSpinner
                              style={{
                                width: "20px",
                                height: "20px",
                                margin: "2px",
                              }}
                            />
                          )}
                        </div>
                        <div
                          css={STYLES_FILE_NAME}
                          style={
                            file.failed
                              ? { color: Constants.system.red }
                              : file.cancelled
                              ? { color: Constants.system.gray }
                              : null
                          }
                        >
                          {file.name}
                        </div>
                      </span>
                      {file.loaded === file.total || file.failed || file.cancelled ? (
                        <div css={STYLES_RIGHT} style={{ height: 24, width: 24 }} />
                      ) : (
                        <span
                          css={STYLES_RIGHT}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => this._handleCancel(e, entry[0])}
                        >
                          <SVG.Dismiss
                            height="24px"
                            className="boundary-ignore"
                            style={{
                              color: Constants.system.gray,
                              pointerEvents: "none",
                            }}
                          />
                        </span>
                      )}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      );
    } else {
      return (
        <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ width: "100%" }}>
          <input
            css={STYLES_FILE_HIDDEN}
            multiple
            type="file"
            id="file"
            onChange={this._handleUpload}
          />
          <System.Input
            placeholder="Paste a link to save"
            value={this.state.url}
            style={{
              height: 48,
              backgroundColor: Constants.semantic.bgLight,
              boxShadow: this.state.urlError ? `0 0 0 1px ${Constants.system.red} inset` : "none",
            }}
            containerStyle={{ maxWidth: 600 }}
            name="url"
            type="url"
            onChange={this._handleChange}
            onSubmit={this._handleUploadLink}
            autoFocus
            icon={SVG.RightArrow}
          />
          <System.Divider width="64px" style={{ margin: "40px 0px" }} />

          <System.H4
            style={{
              color: Constants.semantic.textGrayDark,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Drag and drop files or use the button below to save to{" "}
            {this.props.data ? Strings.getPresentationSlateName(this.props.data) : "Slate"}
          </System.H4>
          <System.P3
            style={{
              color: Constants.semantic.textGray,
              maxWidth: 456,
              textAlign: "center",
            }}
          >
            Please don't upload sensitive information to Slate yet. All uploaded data can currently
            be accessed by anyone with the link. Private storage is coming soon.
          </System.P3>

          <System.ButtonPrimary
            type="label"
            full
            htmlFor="file"
            style={{ marginTop: 40, maxWidth: 210 }}
          >
            Select files
          </System.ButtonPrimary>
          <br />
        </div>
      );
    }
  }
}
