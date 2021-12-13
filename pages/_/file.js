import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { ButtonPrimary } from "~/components/system/components/Buttons";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeader from "~/components/core/WebsitePrototypeHeader";
import WebsitePrototypeFooter from "~/components/core/WebsitePrototypeFooter";
import CTATransition from "~/components/core/CTATransition";

const DEFAULT_IMAGE =
  "https://slate.textile.io/ipfs/bafkreiaow45dlq5xaydaeqocdxvffudibrzh2c6qandpqkb6t3ahbvh6re";

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

const STYLES_ROOT = css`
  display: block;
  grid-template-rows: auto 1fr auto;
  font-size: 1rem;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
`;

export default class ProfilePage extends React.Component {
  state = {
    visible: false,
    page: null,
  };

  // componentDidMount = () => {
  // window.onpopstate = this._handleBackForward;
  // if (!Strings.isEmpty(this.props.cid)) {
  //   let files = this.props.creator.library || [];
  //   let index = files.findIndex((object) => object.cid === this.props.cid);
  //   if (index !== -1) {
  //     Events.dispatchCustomEvent({
  //       name: "slate-global-open-carousel",
  //       detail: { index },
  //     });
  //   }
  // }
  // };

  //   _handleBackForward = (e) => {
  //     let page = window.history.state;
  //     this.setState({ page });
  //     Events.dispatchCustomEvent({ name: "slate-global-close-carousel", detail: {} });
  //   };

  render() {
    const isMobile = this.props.isMobile;

    const viewer = this.props.viewer;
    const file = this.props.data;
    const { filename: title, body: description } = this.props.data;
    // const title = this.props.data
    //   ? this.props.creator.name
    //     ? `${this.props.creator.name} on Slate`
    //     : `@${this.props.creator.username} on Slate`
    //   : "404";
    const url = `https://slate.host/${title}`;
    // const description = this.props.creator.body;
    const image = DEFAULT_IMAGE; //this.props.creator.photo;
    // if (Strings.isEmpty(image)) {
    //   image = DEFAULT_IMAGE;
    // }

    return (
      <WebsitePrototypeWrapper title={title} description={description} url={url} image={image}>
        <WebsitePrototypeHeader />
        <div css={STYLES_ROOT}>
          <GlobalCarousel
            isStandalone
            viewer={viewer}
            objects={[file]}
            onAction={() => {}}
            isMobile={isMobile}
            // params={page.params}
            isOwner={viewer?.id === file.ownerId}
            index={0}
            onChange={() => {}}
          />
        </div>
        <WebsitePrototypeFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
