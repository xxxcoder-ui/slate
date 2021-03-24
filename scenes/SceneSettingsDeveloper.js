import * as React from "react";
import * as Actions from "~/common/actions";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";

import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import CodeBlock from "~/components/system/CodeBlock";

import APIDocsGet from "~/components/api/get";
import APIDocsGetSlate from "~/components/api/get-slate.js";
import APIDocsUpdateSlate from "~/components/api/update-slate.js";
import APIDocsUploadToSlate from "~/components/api/upload.js";

const STYLES_KEY = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 416px;
  background-color: ${Constants.system.foreground};
  color: ${Constants.system.pitchBlack};
  border-radius: 4px;
  height: 40px;
`;

const STYLES_KEY_LEFT = css`
  min-width: 10%;
  width: 100%;
  font-family: ${Constants.font.code};
  padding: 0 16px;
  font-size: 11px;
`;

const STYLES_KEY_CONTAINER = css`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const STYLES_CIRCLE_BUTTON = css`
  height: 40px;
  width: 40px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  background: ${Constants.system.gray};
  color: ${Constants.system.black};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition: 200ms ease all;

  :hover {
    background: ${Constants.system.brand};
    color: ${Constants.system.white};
  }
`;

const STYLES_LANGUAGE_CONTAINER = css`
  display: flex;
  width: 240px;
  flex-direction: row;
  position: relative;
  justify-self: center;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
`;

const STYLES_LANGUAGE_TILE = css`
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100px;
  border-radius: 4px;
  align-items: center;
  justify-content: flex-end;
  user-select: pointer;
  border: 2px solid #1a1a1a;
  cursor: pointer;
`;

//NOTE(toast): overrides ScenePage from AppLayout
const STYLES_PAGE = css`
  max-width: 960px;
  width: 100%;
  margin: 0 auto 0 auto;
  padding: 88px 24px 128px 0px;

  @media (max-width: 568px) {
    padding: 88px 24px 128px 24px;
  }
`;

const STYLES_SIDEBAR = css`
  padding: 160px 24px 128px 24px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 236px;
  background-color: ${Constants.system.foreground};
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: ${Constants.system.gray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${Constants.system.darkGray};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${Constants.system.brand};
  }

  @media (max-width: 568px) {
    width: 100%;
    position: relative;
    overflow-y: auto;
  }
`;

const STYLES_LABEL = css`
  font-family: ${Constants.font.semiBold};
  display: block;
  font-size: 16px;
  text-transform: uppercase;
  color: ${Constants.system.darkGray};
  letter-spacing: 0.6px;
  margin-top: 32px;
`;

const STYLES_LINK = css`
  font-family: ${Constants.font.semiBold};
  color: ${Constants.system.pitchBlack};
  font-size: 16px;
  text-decoration: none;
  font-weight: 400;
  display: block;
  margin-top: 8px;

  :hover {
    color: ${Constants.system.brand};
    cursor: pointer;
  }
`;

class Key extends React.Component {
  state = { visible: false };

  _handleToggleVisible = () => {
    this.setState({ visible: !this.state.visible });
  };

  _handleDelete = async (id) => {
    await this.props.onDelete(id);
  };

  render() {
    return (
      <div css={STYLES_KEY_CONTAINER}>
        <div css={STYLES_KEY}>
          {this.state.visible ? (
            <div css={STYLES_KEY_LEFT}>{this.props.data.key}</div>
          ) : (
            <div css={STYLES_KEY_LEFT}>XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX</div>
          )}
        </div>
        <span
          css={STYLES_CIRCLE_BUTTON}
          onClick={this._handleToggleVisible}
          style={{
            marginLeft: 8,
          }}
        >
          <SVG.Privacy height="16px" />
        </span>
        <span
          css={STYLES_CIRCLE_BUTTON}
          onClick={() => this._handleDelete(this.props.data.id)}
          style={{
            marginLeft: 8,
          }}
        >
          <SVG.Dismiss height="16px" />
        </span>
      </div>
    );
  }
}

export default class SceneSettingsDeveloper extends React.Component {
  state = {
    loading: false,
    language: "javascript",
    docs: "GET",
  };

  _handleSave = async (e) => {
    this.setState({ loading: true });

    const response = await Actions.generateAPIKey();

    Events.hasError(response);

    this.setState({ loading: false });
  };

  _handleDelete = async (id) => {
    this.setState({ loading: true });

    if (!window.confirm("Are you sure you want to delete this key? This action is irreversible")) {
      this.setState({ loading: false });
      return;
    }

    const response = await Actions.deleteAPIKey({ id });

    Events.hasError(response);

    this.setState({ loading: false });
  };

  //handles language changes
  _handleChangeLanguage = (newLanguage) => {
    this.setState({ language: newLanguage });
  };

  //handles doc changes
  _changeDocs = (newDocs) => {
    this.setState({ docs: newDocs });
  };

  _getCurrentDocs = ({ APIKey, slateId }) => {
    let lang = this.state.language;
    let docs = this.state.docs;

    if (docs === "INTRO") {
      console.log("intro");
      return;
    }
    if (docs === "GET") {
      console.log("get");
      return <APIDocsGet language={lang} APIKey={APIKey} />;
    }
    if (docs === "GET_SLATE") {
      console.log("get slate");
      return <APIDocsGetSlate language={lang} APIKey={APIKey} slateId={slateId} />;
    }
    if (docs === "UPDATE_SLATE") {
      console.log("update slate");
      return <APIDocsUpdateSlate language={lang} APIKey={APIKey} slateId={slateId} />;
    }
    if (docs === "UPLOAD_TO_SLATE") {
      console.log("upload slate");
      return <APIDocsUploadToSlate language={lang} APIKey={APIKey} slateId={slateId} />;
    }
  };

  async componentDidMount() {
    if (!this.props.viewer.keys) {
      return;
    }
    if (!this.props.viewer.keys.length) {
      return;
    }

    const response = await fetch("/api/v1/get-slate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.props.viewer.keys[0].key}`,
      },
    });
    const json = await response.json();
    console.log(json);
  }

  render() {
    let APIKey = "YOUR-API-KEY-HERE";
    if (this.props.viewer.keys) {
      if (this.props.viewer.keys.length) {
        APIKey = this.props.viewer.keys[0].key;
      }
    }

    let slateId = "YOUR-SLATE-ID-VALUE";
    if (this.props.viewer.slates) {
      if (this.props.viewer.slates.length) {
        slateId = this.props.viewer.slates[0].id;
      }
    }
    let docsPage = this._getCurrentDocs({ APIKey, slateId });

    return (
      <ScenePage css={STYLES_PAGE}>
        <div css={STYLES_SIDEBAR}>
          <span css={STYLES_LINK} onClick={() => this._changeDocs("INTRO")}>
            Introduction
          </span>
          <span css={STYLES_LABEL}>api</span>
          <div>
            <span
              css={STYLES_LINK}
              style={{ color: this.state.docs === "GET" ? Constants.system.brand : null }}
              onClick={() => this._changeDocs("GET")}
            >
              Get all slates
            </span>
            <span
              css={STYLES_LINK}
              style={{ color: this.state.docs === "GET_SLATE" ? Constants.system.brand : null }}
              onClick={() => this._changeDocs("GET_SLATE")}
            >
              Get slate by ID
            </span>
            <span
              css={STYLES_LINK}
              style={{
                color: this.state.docs === "UPLOAD_TO_SLATE" ? Constants.system.brand : null,
              }}
              onClick={() => this._changeDocs("UPLOAD_TO_SLATE")}
            >
              Upload to slate by ID
            </span>
            <span
              css={STYLES_LINK}
              style={{ color: this.state.docs === "UPDATE_SLATE" ? Constants.system.brand : null }}
              onClick={() => this._changeDocs("UPDATE_SLATE")}
            >
              Update slate
            </span>
          </div>
          <span css={STYLES_LABEL}>guides</span>
        </div>
        <ScenePageHeader title="Developer Documentation">
          You can use your API key to get slates and add images to slates. You can have a total of
          10 keys at any given time.
        </ScenePageHeader>
        <br />
        <br />

        {this.props.viewer.keys.map((k) => {
          return <Key key={k.id} data={k} onDelete={this._handleDelete} />;
        })}

        <div style={{ marginTop: 24 }}>
          <System.ButtonPrimary onClick={this._handleSave} loading={this.state.loading}>
            Generate
          </System.ButtonPrimary>
          {APIKey === "YOUR-API-KEY-HERE" ? (
            <ScenePageHeader title="">
              Generate an API key to have it appear in the code examples
            </ScenePageHeader>
          ) : null}
        </div>
        <div css={STYLES_LANGUAGE_CONTAINER}>
          <div
            css={STYLES_LANGUAGE_TILE}
            style={{ color: this.state.language === "javascript" ? Constants.system.brand : null }}
            onClick={() => this._handleChangeLanguage("javascript")}
          >
            <span style={{ marginBottom: 32 }}>JS ICON</span>
            <span>Node.js</span>
          </div>
          <div
            css={STYLES_LANGUAGE_TILE}
            style={{ color: this.state.language === "python" ? Constants.system.brand : null }}
            onClick={() => this._handleChangeLanguage("python")}
          >
            <span style={{ marginBottom: 32 }}>PY ICON</span>
            <span>Python3</span>
          </div>
        </div>
        {docsPage}
      </ScenePage>
    );
  }
}
