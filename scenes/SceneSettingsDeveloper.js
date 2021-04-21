import * as React from "react";
import * as Actions from "~/common/actions";
import * as Window from "~/common/window";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { TabGroup, PrimaryTabGroup, SecondaryTabGroup } from "~/components/core/TabGroup";

import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import SquareButtonGray from "~/components/core/SquareButtonGray";

import APIDocsGetV1 from "~/components/api-docs/v1/get";
import APIDocsGetSlateV1 from "~/components/api-docs/v1/get-slate.js";
import APIDocsUpdateSlateV1 from "~/components/api-docs/v1/update-slate.js";
import APIDocsUploadToSlateV1 from "~/components/api-docs/v1/upload.js";

import APIDocsGetV2 from "~/components/api-docs/v2/get";
import APIDocsGetSlateV2 from "~/components/api-docs/v2/get-slate.js";
import APIDocsGetUserV2 from "~/components/api-docs/v2/get-user.js";
import APIDocsUpdateSlateV2 from "~/components/api-docs/v2/update-slate.js";
import APIDocsUpdateFileV2 from "~/components/api-docs/v2/update-file.js";
import APIDocsUploadToSlateV2 from "~/components/api-docs/v2/upload.js";

const STYLES_API_KEY = css`
  height: 40px;
  border-radius: 4px;
  cursor: copy;
  background-color: ${Constants.system.white};
  outline: none;
  border: none;
  width: 380px;
  font-family: ${Constants.font.code};
  padding: 0 16px;
  font-size: 14px;
`;

const STYLES_KEY_CONTAINER = css`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

class Key extends React.Component {
  _input;

  state = { visible: false, copying: false };

  _handleDelete = async (id) => {
    await this.props.onDelete(id);
  };

  _handleCopy = async () => {
    this._input.select();
    document.execCommand("copy");
    await this.setState({ copying: true });
    await Window.delay(1000);
    await this.setState({ copying: false });
  };

  render() {
    return (
      <div css={STYLES_KEY_CONTAINER}>
        <input
          ref={(c) => {
            this._input = c;
          }}
          value={this.state.copying ? "Copied!" : this.props.data.key}
          readOnly
          type={this.state.visible || this.state.copying ? "text" : "password"}
          css={STYLES_API_KEY}
          onClick={this._handleCopy}
          onMouseEnter={() => this.setState({ visible: true })}
          onMouseLeave={() => this.setState({ visible: false })}
        />
        <SquareButtonGray
          onClick={() => this._handleDelete(this.props.data.id)}
          style={{
            marginLeft: 8,
          }}
        >
          <SVG.Trash height="16px" />
        </SquareButtonGray>
      </div>
    );
  }
}

export default class SceneSettingsDeveloper extends React.Component {
  _bucketCID;

  state = {
    loading: false,
    language: "javascript",
    docs: "GET",
    copying: false,
    tab: 0,
  };

  _handleCopy = async () => {
    this._bucketCID.select();
    document.execCommand("copy");
    await this.setState({ copying: true });
    await Window.delay(1000);
    await this.setState({ copying: false });
  };

  _handleSave = async (e) => {
    this.setState({ loading: true });

    const response = await Actions.generateAPIKey();

    Events.hasError(response);

    this.setState({ loading: false });
  };

  _handleDelete = async (id) => {
    this.setState({ loading: true });

    if (
      !window.confirm(
        "Are you sure you want to revoke this API key? Any services using it will no longer be able to access your Slate account"
      )
    ) {
      this.setState({ loading: false });
      return;
    }

    const response = await Actions.deleteAPIKey({ id });

    Events.hasError(response);

    this.setState({ loading: false });
  };

  _handleChangeLanguage = (newLanguage) => {
    this.setState({ language: newLanguage });
  };

  render() {
    let APIKey = "YOUR-API-KEY-HERE";
    let lang = this.state.language;
    if (this.props.viewer.keys) {
      if (this.props.viewer.keys.length) {
        APIKey = this.props.viewer.keys[0].key;
      }
    }

    const userId = this.props.viewer.id;

    let slateId = "YOUR-SLATE-ID-VALUE";
    if (this.props.viewer.slates) {
      if (this.props.viewer.slates.length) {
        slateId = this.props.viewer.slates[0].id;
      }
    }

    let userBucketCID = this.props.viewer?.userBucketCID;
    if (userBucketCID) {
      userBucketCID = userBucketCID.replace("/ipfs/", "");
    }

    return (
      <ScenePage>
        {/*
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
        */}
        <ScenePageHeader title="API Keys">
          You can use your API keys to access your account information outside of Slate and upload
          files to Slate. You can have a maximum of 10 keys at any given time.
        </ScenePageHeader>

        {userBucketCID && (
          <div style={{ marginTop: 34, marginBottom: 24 }}>
            <System.DescriptionGroup
              style={{ maxWidth: 640 }}
              label="Bucket CID"
              description={
                "This is your bucket CID. Use this to access your Slate files on other platforms"
              }
            />
            <input
              value={this.state.copying ? "Copied!" : userBucketCID}
              css={STYLES_API_KEY}
              style={{ textOverflow: "ellipsis" }}
              type="text"
              readOnly
              ref={(c) => {
                this._bucketCID = c;
              }}
              onClick={this._handleCopy}
            />
          </div>
        )}
        <br />

        <System.DescriptionGroup style={{ maxWidth: 640, marginBottom: 24 }} label="API Keys" />
        {this.props.viewer.keys.map((k) => {
          return <Key key={k.id} data={k} onDelete={this._handleDelete} />;
        })}

        <div style={{ marginTop: 24 }}>
          {this.props.viewer.keys.length < 10 ? (
            <System.ButtonPrimary onClick={this._handleSave} loading={this.state.loading}>
              Generate
            </System.ButtonPrimary>
          ) : (
            <System.ButtonDisabled>Generate</System.ButtonDisabled>
          )}
          {this.props.viewer.keys.length === 0 ? (
            <ScenePageHeader title="">
              Generate an API key to have it appear in the code examples
            </ScenePageHeader>
          ) : null}
        </div>

        {/*
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

          <APIDocsGet language={lang} APIKey={APIKey} />
          <APIDocsUpdateSlate language={lang} APIKey={APIKey} slateId={slateId} />
          <APIDocsUploadToSlate language={lang} APIKey={APIKey} slateId={slateId} />
        */}
        <ScenePageHeader title="Developer Documentation" style={{ marginTop: 96 }}>
          Slate is currently on v2.0 of the API. While prior versions are still supported, we
          recommend using the most up to date version.
        </ScenePageHeader>

        <SecondaryTabGroup
          tabs={["Version 2.0", "Version 1.0"]}
          value={this.state.tab}
          onChange={(tab) => this.setState({ tab })}
        />

        {this.state.tab === 0 ? (
          <>
            <APIDocsGetV2
              language={lang}
              APIKey={APIKey}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsGetSlateV2
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsGetUserV2
              language={lang}
              APIKey={APIKey}
              userId={userId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsUpdateSlateV2
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsUpdateFileV2
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsUploadToSlateV2
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
          </>
        ) : (
          <>
            <APIDocsGetV1
              language={lang}
              APIKey={APIKey}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsGetSlateV1
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsUpdateSlateV1
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
            <APIDocsUploadToSlateV1
              language={lang}
              APIKey={APIKey}
              slateId={slateId}
              onLanguageChange={this._handleChangeLanguage}
            />
          </>
        )}
      </ScenePage>
    );
  }
}
