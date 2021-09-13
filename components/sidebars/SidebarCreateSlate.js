import * as React from "react";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as SVG from "~/common/svg";
import * as UserBehaviors from "~/common/user-behaviors";

import { RadioGroup } from "~/components/system/components/RadioGroup";
import { css } from "@emotion/react";

const STYLES_TEXT = css`
  color: ${Constants.semantic.textGray};
  font-size: ${Constants.typescale.lvl0};
`;

const STYLES_HEADER = css`
  font-family: ${Constants.font.semiBold};
`;

const STYLES_GROUPING = css`
  width: 100%;
  border: 1px solid rgba(196, 196, 196, 0.5);
  background-color: ${Constants.system.white};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
`;

export default class SidebarCreateSlate extends React.Component {
  state = {
    name: "",
    isPublic: true,
    body: "",
    loading: false,
  };

  _handleSubmit = async () => {
    this.setState({ loading: true });

    if (!Validations.slatename(this.state.name)) {
      Events.dispatchMessage({ message: "Please provide a name between 1-48 characters." });
      this.setState({ loading: false });
      return;
    }

    const response = await Actions.createSlate({
      name: this.state.name,
      isPublic: this.state.isPublic,
      body: this.state.body,
    });
    console.log(response);

    if (Events.hasError(response)) {
      this.setState({ loading: false });
      return;
    }

    if (this.props.sidebarData && this.props.sidebarData.files) {
      await UserBehaviors.saveCopy({
        slate: response.slate,
        files: this.props.sidebarData.files,
      });

      // if (Events.hasError(addResponse)) {
      //   this.setState({ loading: false });
      //   return;
      // }

      // const { added, skipped } = addResponse;
      // let message = Strings.formatAsUploadMessage(added, skipped, true);
      // if (message) {
      //   Events.dispatchMessage({ message, status: !added ? null : "INFO" });
      // }
    }

    this.setState({ loading: false });
    window.setTimeout(
      () =>
        this.props.onAction({
          type: "NAVIGATE",
          href: `/$/slate/${response.slate.id}`,
        }),
      200
    );
  };

  _handleCancel = () => {
    this.props.onCancel();
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const slug = Strings.createSlug(this.state.name);
    const url = `/${this.props.viewer.username}/${slug}`;
    return (
      <div>
        <System.P1
          style={{
            fontFamily: Constants.font.semiBold,
            fontSize: Constants.typescale.lvl3,
            marginBottom: 36,
          }}
        >
          Create collection
        </System.P1>

        <div css={STYLES_GROUPING}>
          <System.P1 css={STYLES_HEADER}>Name</System.P1>
          <System.P1
            css={STYLES_TEXT}
            style={{
              marginTop: 12,
            }}
          >
            Note: Changing the collection name will break any old links to the collection.
          </System.P1>

          <System.Input
            autoFocus
            placeholder="Collection name..."
            style={{ marginTop: 12 }}
            name="name"
            value={this.state.name}
            onChange={this._handleChange}
            onSubmit={this._handleSubmit}
            descriptionStyle={{ fontSize: "20px !important" }}
            labelStyle={{ fontSize: "20px" }}
            maxLength="255"
          />
          <System.P1
            style={{
              marginTop: 12,
              color: Constants.semantic.textGrayLight,
              fontSize: Constants.typescale.lvl0,
            }}
          >
            https://slate.host{url}
          </System.P1>
        </div>

        <div css={STYLES_GROUPING}>
          <System.P1 css={STYLES_HEADER}>Description</System.P1>
          {/* <System.P1
            css={STYLES_TEXT}
            style={{
              marginTop: 12,
            }}
          >
            Give your collection a description, add links, and connect it to other collections.
          </System.P1> */}

          <System.Textarea
            style={{ marginTop: 12 }}
            placeholder="Collection description..."
            name="body"
            value={this.state.body}
            onChange={this._handleChange}
            onSubmit={this._handleSubmit}
            maxLength="2000"
          />
        </div>

        <div css={STYLES_GROUPING}>
          <System.P1 css={STYLES_HEADER} style={{ marginBottom: 12 }}>
            Privacy
          </System.P1>
          <System.P1
            css={STYLES_TEXT}
            style={{
              marginTop: 12,
            }}
          >
            Public collections can be discovered and seen by anyone on the internet. If you make it
            private, only you will be able to see it.
          </System.P1>
          <RadioGroup
            name="isPublic"
            options={[
              {
                value: true,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <SVG.Globe height="16px" style={{ marginRight: 8 }} />
                    Public
                  </div>
                ),
              },
              {
                value: false,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <SVG.SecurityLock height="16px" style={{ marginRight: 8 }} />
                    Private
                  </div>
                ),
              },
            ]}
            style={{ marginTop: 12 }}
            labelStyle={{ fontFamily: Constants.font.medium }}
            selected={this.state.isPublic}
            onChange={this._handleChange}
          />
        </div>

        <System.ButtonPrimary
          full
          style={{ marginTop: 48 }}
          onClick={this._handleSubmit}
          loading={this.state.loading}
        >
          Create {this.state.name}
        </System.ButtonPrimary>
      </div>
    );
  }
}
