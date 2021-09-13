import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";

import ScenePage from "~/components/core/ScenePage";
import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

const STYLES_SCENE_PAGE = css`
  padding: 20px 24px 44px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 31px 16px 44px;
  }
`;

export default class SceneFilesFolder extends React.Component {
  state = {
    index: -1,
  };

  render() {
    let files = this.props.viewer?.library;
    const tab = this.props.page.params?.tab || "grid";

    return (
      <WebsitePrototypeWrapper
        title={`${this.props.page.pageTitle} • Slate`}
        url={`${Constants.hostname}${this.props.page.pathname}`}
      >
        <ScenePage css={STYLES_SCENE_PAGE}>
          <GlobalCarousel
            carouselType="DATA"
            viewer={this.props.viewer}
            objects={files}
            onAction={this.props.onAction}
            isMobile={this.props.isMobile}
            params={this.props.page.params}
            isOwner={true}
            index={this.state.index}
            onChange={(index) => this.setState({ index })}
          />

          {files.length ? (
            <DataView
              key="scene-files-folder"
              onAction={this.props.onAction}
              viewer={this.props.viewer}
              items={files}
              view={tab}
              isOwner={true}
              page={this.props.page}
            />
          ) : (
            <EmptyState>
              <FileTypeGroup />
              <div style={{ marginTop: 24 }}>
                Drag and drop files into Slate to upload, or press the plus button to save a file or
                link
              </div>
            </EmptyState>
          )}
        </ScenePage>
      </WebsitePrototypeWrapper>
    );
  }
}
