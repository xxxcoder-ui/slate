import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";
import * as Actions from "~/common/actions";
import * as Validations from "~/common/validations";
import * as Events from "~/common/custom-events";
import * as UserBehaviors from "~/common/user-behaviors";

import { ButtonSecondary } from "~/components/system/components/Buttons";
import { css } from "@emotion/react";
import { ViewAllButton } from "~/components/core/ViewAll";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { GlobalModal } from "~/components/system/components/GlobalModal";

import ProcessedText from "~/components/core/ProcessedText";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeader from "~/components/core/WebsitePrototypeHeader";
import WebsitePrototypeFooter from "~/components/core/WebsitePrototypeFooter";
import CTATransition from "~/components/core/CTATransition";
import DataView from "~/components/core/DataView";

const DEFAULT_IMAGE =
  "https://slate.textile.io/ipfs/bafkreiaow45dlq5xaydaeqocdxvffudibrzh2c6qandpqkb6t3ahbvh6re";
const DEFAULT_BOOK =
  "https://slate.textile.io/ipfs/bafkreibk32sw7arspy5kw3p5gkuidfcwjbwqyjdktd5wkqqxahvkm2qlyi";
const DEFAULT_DATA =
  "https://slate.textile.io/ipfs/bafkreid6bnjxz6fq2deuhehtxkcesjnjsa2itcdgyn754fddc7u72oks2m";
const DEFAULT_DOCUMENT =
  "https://slate.textile.io/ipfs/bafkreiecdiepww52i5q3luvp4ki2n34o6z3qkjmbk7pfhx4q654a4wxeam";
const DEFAULT_VIDEO =
  "https://slate.textile.io/ipfs/bafkreibesdtut4j5arclrxd2hmkfrv4js4cile7ajnndn3dcn5va6wzoaa";
const DEFAULT_AUDIO =
  "https://slate.textile.io/ipfs/bafkreig2hijckpamesp4nawrhd6vlfvrtzt7yau5wad4mzpm3kie5omv4e";

const STYLES_ROOT = css`
  display: block;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
  padding: 0px 32px 24px 32px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px;
  }
`;

const STYLES_HEADER = css`
  padding: 32px 32px 0px 32px;
  display: flex;
  align-item: baseline;
  max-width: 100%;
  justify-content: space-between;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
    padding: 24px 24px 0px 24px;
  }
`;

const STYLES_SLATE_INTRO = css`
  overflow-wrap: break-word;
  white-space: pre-wrap;
  flex-shrink: 0;
  display: block;
  max-width: 85%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
    margin-bottom: 24px;
  }
`;

const STYLES_TITLELINE = css`
  display: flex;
  align-items: flex-start;
  word-wrap: break-word;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
    font-size: 14px;
  }
`;

const STYLES_CREATOR = css`
  flex-shrink: 0;
  margin-right: 4px;
  text-decoration: none;
  font-size: ${Constants.typescale.lvl3};
  color: ${Constants.system.black};
  font-family: ${Constants.font.medium};
  :hover {
    color: ${Constants.system.blue};
  }
`;

const STYLES_TITLE = css`
  font-size: ${Constants.typescale.lvl3};
  font-family: ${Constants.font.medium};
  font-weight: 400;
  color: ${Constants.system.black};
  width: auto;
  max-width: 100%;
  margin-right: 24px;
  word-wrap: break-word;
`;

const STYLES_DESCRIPTION = css`
  font-size: ${Constants.typescale.lvl0};
  color: ${Constants.system.grayLight2};
  width: 50%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin-top: 16px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
  }

  ul,
  ol {
    white-space: normal;
  }
`;

const STYLES_STATS = css`
  font-size: ${Constants.typescale.lvl0};
  margin: 16px 0;
  display: flex;
  width: 100%;
  color: ${Constants.system.grayDark2};
`;

const STYLES_STAT = css`
  margin-right: 16px;
  flex-shrink: 0;
`;

const STYLES_SLATE = css`
  padding: 0 32px;
  display: block;
  width: 100%;
  margin: 48px auto 0 auto;
  min-height: 10%;
  height: 100%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0 24px 0 24px;
  }
`;

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

export const FileTypeDefaultPreview = (props) => {
  if (props.type) {
    if (Validations.isVideoType(type)) {
      return DEFAULT_VIDEO;
    } else if (Validations.isAudioType(type)) {
      return DEFAULT_AUDIO;
    } else if (Validations.isPdfType(type)) {
      return DEFAULT_DOCUMENT;
    } else if (Validations.isEpubType(type)) {
      return DEFAULT_BOOK;
    }
  }
  return DEFAULT_DATA;
};

export default class SlatePage extends React.Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    if (!this.props.slate) {
      return null;
    }

    if (!Strings.isEmpty(this.props.cid)) {
      let files = this.props.slate.objects || [];
      let index = files.findIndex((object) => object.cid === this.props.cid);
      if (index !== -1) {
        Events.dispatchCustomEvent({
          name: "slate-global-open-carousel",
          detail: { index },
        });
      }
    }
  }

  _handleSelect = (index) => {
    Events.dispatchCustomEvent({
      name: "slate-global-open-carousel",
      detail: { index },
    });
  };

  _handleDownloadFiles = () => {
    const slateName = this.props.slate.data.name;
    const slateFiles = this.props.slate.data.objects;
    UserBehaviors.compressAndDownloadFiles({
      files: slateFiles,
      name: `${slateName}.zip`,
    });
  };

  render() {
    let title = `${this.props.creator.username}/${this.props.slate.slatename}`;
    let url = `https://slate.host/${this.props.creator.username}/${this.props.slate.slatename}`;
    let headerURL = `https://slate.host/${this.props.creator.username}`;

    let { objects, body, preview } = this.props.slate;
    let image;
    if (Strings.isEmpty(this.props.cid)) {
      image = preview;
      if (Strings.isEmpty(image)) {
        for (let i = 0; i < objects.length; i++) {
          if (
            objects[i].type &&
            Validations.isPreviewableImage(objects[i].type) &&
            objects[i].size &&
            objects[i].size < Constants.linkPreviewSizeLimit
          ) {
            image = Strings.getURLfromCID(objects[i].cid);
            break;
          }
        }
      }
    } else {
      const cid = Strings.getCIDFromIPFS(each.cid);
      let object = objects.find((each) => {
        return cid === this.props.cid;
      });

      if (object) {
        title = object.data.name || object.filename;
        body = !Strings.isEmpty(object.data.body) ? Strings.elide(object.data.body) : "";
        image = object.type.includes("image/") ? (
          Strings.getURLfromCID(object.cid)
        ) : (
          <FileTypeDefaultPreview type={object.data.type} />
        );
        url = `${url}/cid:${this.props.cid}`;
      }
    }
    if (Strings.isEmpty(image)) {
      image = DEFAULT_IMAGE;
    }

    const slateCreator = `${this.props.creator.username} / `;
    const slateTitle = `${this.props.slate.slatename}`;

    const counts = objects.reduce((counts, { ownerId }) => {
      counts[ownerId] = (counts[ownerId] || 0) + 1;
      return counts;
    }, {});

    const contributorsCount = Object.keys(counts).length;
    const isSlateEmpty = objects.length === 0;

    return (
      <WebsitePrototypeWrapper title={title} description={body} url={url} image={image}>
        <WebsitePrototypeHeader />
        <div css={STYLES_ROOT}>
          <div css={STYLES_HEADER}>
            <div css={STYLES_SLATE_INTRO}>
              <div css={STYLES_TITLELINE}>
                <a css={STYLES_CREATOR} href={`/${this.props.creator.username}`}>
                  {slateCreator}
                </a>
                <div css={STYLES_TITLE}>{slateTitle} </div>
              </div>
              <div css={STYLES_DESCRIPTION}>
                <ViewAllButton fullText={this.props.slate.data.body} maxCharacter={208}>
                  <ProcessedText text={this.props.slate.data.body} />
                </ViewAllButton>
              </div>
              <div css={STYLES_STATS}>
                <div css={STYLES_STAT}>
                  <div style={{ fontFamily: `${Constants.font.medium}` }}>
                    {this.props.slate.objects.length}{" "}
                    <span style={{ color: `${Constants.system.grayLight2}` }}>Files</span>
                  </div>
                </div>
                {/* <div css={STYLES_STAT}>
                <div style={{ fontFamily: `${Constants.font.medium}` }}>
                  {contributorsCount}{" "}
                  <span style={{ color: `${Constants.system.grayLight2}` }}>Contributors</span>
                </div>
              </div> */}
              </div>
            </div>
            <div>
              {!isSlateEmpty && (
                <ButtonSecondary
                  style={{ marginRight: "16px" }}
                  onClick={this._handleDownloadFiles}
                >
                  Download
                </ButtonSecondary>
              )}
              <ButtonSecondary onClick={() => this.setState({ visible: true })}>
                Follow
              </ButtonSecondary>
            </div>
          </div>
          <div css={STYLES_SLATE}>
            <GlobalCarousel
              data={this.props.slate}
              viewer={this.props.viewer}
              objects={objects}
              isMobile={this.props.isMobile}
              isOwner={false}
              external
            />
            {
              <div style={{ marginTop: 40 }}>
                <DataView
                  key="scene-collection"
                  type="collection"
                  collection={this.props.slate}
                  onAction={this.props.onAction}
                  viewer={this.props.viewer}
                  items={objects}
                  view={"grid"}
                  isOwner={false}
                  page={this.props.page}
                />
              </div>
            }
          </div>
        </div>
        <GlobalModal />
        {this.state.visible && (
          <div>
            <CTATransition
              onClose={() => this.setState({ visible: false })}
              viewer={this.props.viewer}
              open={this.state.visible}
              redirectURL={`/_${Strings.createQueryParams({
                scene: "NAV_SLATE",
                user: this.props.creator.username,
                slate: this.props.slate.slatename,
              })}`}
            />
          </div>
        )}
        <WebsitePrototypeFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
