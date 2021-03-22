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
  padding: 132px 24px 128px 24px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 224px;
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
  font-size: 14px;
  text-transform: uppercase;
  color: ${Constants.system.darkGray};
  letter-spacing: 0.6px;
  margin-top: 32px;
`;

const STYLES_LINK = css`
  font-family: ${Constants.font.semiBold};
  color: ${Constants.system.pitchBlack};
  font-size: 14px;
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

const EXAMPLE_UPDATE_SLATE = (key, slateId) => {
  return `const slateAPIResponseData = ${EXAMPLE_GET_SLATE_RESPONSE(key, slateId)};

// NOTE(jim)
// Make any modifications you want!
// Be careful because if you modify too many things, your Slate may not work
// With https://slate.host
const slate = slateAPIResponseData.data;
slate.data.objects[0].title = "Julie Was Here."

const response = await fetch('https://slate.host/api/v1/update-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: slate })
});

const json = await response.json();
console.log(json);`;
};

const EXAMPLE_GET_SLATE = (
  key,
  slateId
) => `const response = await fetch('https://slate.host/api/v1/get-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    // NOTE: your slate ID
    id: '${slateId}'
  }})
});

const json = await response.json();
console.log(json);`;

const EXAMPLE_GET = (key) => `const response = await fetch('https://slate.host/api/v1/get', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    // NOTE: optional, if you want your private slates too.
    private: false
  }})
});

const json = await response.json();
console.log(json);`;

const EXAMPLE_GET_SLATE_RESPONSE = (key, slateId) => `{
  data: {
    id: '${slateId}',
    updated_at: '2020-07-27T09:04:53.007Z',
    created_at: '2020-07-27T09:04:53.007Z',
    published_at: '2020-07-27T09:04:53.007Z',
    slatename: 'slatename',
    // NOTE(jim)
    // This 'data' property is JSONB in our postgres database
    // so every child is customizable.
    data: {
      name: "slatename",
      public: true,
      objects: [
        {
          id: "data-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          name: "Name Example",
          ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          title: "The Final Storage System",
          body: "You can store 4GB on Slate",
          author: "Jason Leyser",
          source: "https://google.com",
          anything: "you-want",
          // NOTE(jim)
          // When you use the API you can make these API fields anything.
          url: "https://slate.host/static/art-v2-social.png"
        }
      ],
      ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }
}`;

const EXAMPLE_UPLOAD_TO_SLATE = (
  key,
  slateId
) => `const url = 'https://uploads.slate.host/api/public/${slateId}';

let file = e.target.files[0];
let data = new FormData();
data.append("data", file);

const response = await fetch(url, {
  method: 'POST',
  headers: {
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: data
});

const json = await response.json();

// NOTE: the URL to your asset will be available in the JSON response.
console.log(json);`;

export default class SceneSettingsDeveloper extends React.Component {
  state = {
    loading: false,
    language: "language-javascript",
    docs: "introduction",
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
  _changeDoc = (newExample) => {
    this.setState({ example: newExample }, this._getCurrentExample);
  };

  _getCurrentDocs = () => {
    let example = this.state.example;
    if (example === "INTRO") {
      console.log("intro");
      console.log(this.props.viewer.keys);
      console.log(this.props.viewer.slates);
      return;
    }
    if (example === "GET") {
      console.log("get");
      return;
    }
    if (example === "GET_SLATE") {
      console.log("get slate");
      return;
    }
    if (example === "UPDATE_SLATE") {
      console.log("update slate");
      return;
    }
    if (example === "UPLOAD") {
      console.log("upload slate");
      return;
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
    let APIKey;
    if (this.props.viewer.keys) {
      if (this.props.viewer.keys.length) {
        APIKey = this.props.viewer.keys[0].key;
      } else {
        APIKey = "YOUR-API-KEY-HERE";
      }
    }

    let slateId = "your-slate-uuid-v4-value";
    if (this.props.viewer.slates) {
      if (this.props.viewer.slates.length) {
        slateId = this.props.viewer.slates[0].id;
      }
    }

    return (
      <ScenePage css={STYLES_PAGE}>
        <div css={STYLES_SIDEBAR}>
          <span css={STYLES_LINK} onClick={() => this._changeExample("INTRO")}>
            Introduction
          </span>
          <span css={STYLES_LABEL}>reference</span>
          <div>
            <span css={STYLES_LINK} onClick={() => this._changeExample("GET")}>
              Get all slates
            </span>
            <span css={STYLES_LINK} onClick={() => this._changeExample("GET_SLATE")}>
              Get slate by ID
            </span>
            <span css={STYLES_LINK} onClick={() => this._changeExample("UPDATE_SLATE")}>
              Upload to slate by ID
            </span>
            <span css={STYLES_LINK} onClick={() => this._changeExample("UPLOAD")}>
              Update slate
            </span>
          </div>
        </div>
        <ScenePageHeader title="Developer API">
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
        </div>

        <React.Fragment>
          <APIDocsGet language="javascript" APIKey={APIKey} />
          <APIDocsGetSlate language="javascript" APIKey={APIKey} slateId={slateId} />
          <System.DescriptionGroup
            style={{ marginTop: 48 }}
            label="Upload data to slate by ID"
            description="This API endpoint will add a JavaScript file object to your slate."
          />
          <CodeBlock
            children={EXAMPLE_UPLOAD_TO_SLATE(APIKey, slateId)}
            style={{ maxWidth: "768px" }}
          />
          <System.DescriptionGroup
            style={{ marginTop: 48 }}
            label="Update slate"
            description="This API endpoint will allow you to update a slate by sending your current locally modified version. This API endpoint allows for full customization so be careful."
          />
          <CodeBlock
            children={EXAMPLE_UPDATE_SLATE(APIKey, slateId)}
            style={{ maxWidth: "768px" }}
          />
        </React.Fragment>
      </ScenePage>
    );
  }
}
