import * as React from "react";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { Tag } from "~/components/system/components/Tag";

const STYLES_GROUPING = css`
  width: 100%;
  border: 1px solid rgba(196, 196, 196, 0.5);
  background-color: ${Constants.system.white};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 40px;
`;

export default class SidebarEditTags extends React.Component {
  state = {
    newTags:
      !Array.isArray(this.props.sidebarData.commonTags) ||
      this.props.sidebarData.commonTags?.length === 0
        ? []
        : this.props.sidebarData.commonTags,
    suggestions:
      !Array.isArray(this.props.sidebarData.suggestions) ||
      this.props.sidebarData.suggestions?.length === 0
        ? []
        : this.props.sidebarData.suggestions,
  };

  _handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /* updateSuggestions = () => {
    let newSuggestions = new Set([...this.props.sidebarData.suggestions, ...this.state.newTags]);
    this.setState({ suggestions: Array.from(newSuggestions) });
  }; */

  _handleSave = async (details, index) => {
    let { objects } = this.props.sidebarData;

    objects[index] = { ...objects[index], ...details };
    const response = await Actions.updateData({
      id: this.props.viewer.id,
      data: objects[index],
    });
    console.log(response);
    Events.hasError(response);
  };

  _handleSubmit = async () => {
    let { checked, objects, commonTags } = this.props.sidebarData;

    const checkedIndexes = Object.keys(checked);
    /* data must be fixed */
    /* let data = { tags: this.state.newTags }; */

    await Promise.all(
      checkedIndexes.map(async (checkedIndex) => {
        let prevTags = objects[checkedIndex]?.tags;
        console.log({ prevTags });
        let newTags = this.state.newTags;
        console.log({ newTags });
        console.log({ commonTags });
        /* commonTags */

        /* 
          1. If there is an item in newTags which is not in commonTag, add to prevTags;
          2. If there is an item in commonTag which is not in newTags, remove it from prevTags;
         */
        let data;

        if (newTags.length > commonTags.length) {
          let update = new Set([...prevTags, ...newTags, ...commonTags]);
          data = { tags: Array.from(update) };
        }

        this._handleSave(data, checkedIndex);
      })
    );
  };

  render() {
    const { numChecked } = this.props.sidebarData;

    return (
      <div style={{ marginBottom: 64 }}>
        <System.P
          style={{
            fontFamily: Constants.font.semiBold,
            fontSize: Constants.typescale.lvl2,
            marginBottom: 36,
          }}
        >
          Edit tags
        </System.P>

        <div css={STYLES_GROUPING}>
          <System.P
            style={{
              fontFamily: Constants.font.semiBold,
              fontSize: Constants.typescale.lvl1,
              marginBottom: 8,
            }}
          >
            Tags
          </System.P>
          <System.P
            style={{
              fontFamily: Constants.font.text,
              fontSize: Constants.typescale.lvl0,
              color: Constants.system.textGray,
              marginBottom: 16,
            }}
          >
            Add or remove common tags on your files
          </System.P>
          <Tag
            name="tags"
            placeholder={`Edit tags for ${`${numChecked} file${numChecked === 1 ? "" : "s"}`} `}
            tags={this.state.newTags}
            suggestions={this.state.suggestions}
            style={{ margin: "0 0 16px" }}
            onChange={this._handleChange}
            /* handleTagDelete={this._handleTagDelete} */
          />
        </div>

        <System.ButtonPrimary
          full
          style={{ padding: "14px 0" }}
          onClick={() => this._handleSubmit()}
        >
          Update tags for {`${numChecked} file${numChecked === 1 ? "" : "s"}`}
        </System.ButtonPrimary>
      </div>
    );
  }
}
