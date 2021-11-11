import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";

import LinkTag from "~/components/core/Link/LinkTag";

import { P3 } from "~/components/system/components/Typography";
import { css } from "@emotion/react";

const STYLES_CARD = css`
  height: 448px;
  width: 600px;
  max-height: 100%;
  max-width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${Constants.shadow.lightLarge};
  background-color: ${Constants.semantic.bgGrayLight};

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 90vw;
    height: 50vh;
  }
`;

const STYLES_TAG_CONTAINER = (theme) => css`
  color: ${theme.semantic.textGray};
  ${Styles.HORIZONTAL_CONTAINER_CENTERED}
`;

const STYLES_FREEFORM_CARD = css`
  max-height: 90%;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${Constants.shadow.large};
  background-color: ${Constants.semantic.bgGrayLight};
`;

const STYLES_IMAGE_CONTAINER = css`
  width: 100%;
  height: 100%;
  min-height: 60%;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const STYLES_TEXT_BOX = css`
  max-height: 40%;
  padding: 16px;
  color: ${Constants.system.black};
`;

const STYLES_NAME = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
  color: ${Constants.system.black};
`;

const STYLES_BODY = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
  color: ${Constants.semantic.textGrayDark};
  max-width: 600px;
`;

const STYLES_LINK = (theme) => css`
  display: block;
  width: 100%;
  ${Styles.LINK}
  :hover small, .link_external_link {
    color: ${theme.semantic.textGrayDark};
  }

  .link_external_link {
    opacity: 0;
    transition: opacity 0.3s;
  }
  :hover .link_external_link {
    opacity: 1;
  }
`;

const STYLES_SOURCE = css`
  transition: color 0.4s;
  max-width: 80%;
`;

const STYLES_SOURCE_LOGO = css`
  height: 12px;
  width: 12px;
  border-radius: 4px;
`;

export default function LinkCard({ file, isNFTLink }) {
  const { url, linkImage, linkName, linkBody } = file;

  if (isNFTLink) {
    const faviconImgState = useImage({ src: link.logo });

    const tag = (
      <a
        css={STYLES_LINK}
        href={file.url}
        target="_blank"
        rel="noreferrer"
        style={{ position: "relative", zIndex: 2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div css={STYLES_TAG_CONTAINER}>
          {faviconImgState.error ? (
            <SVG.Link height={12} width={12} style={{ marginRight: 4 }} />
          ) : (
            <img
              src={link.logo}
              alt="Link source logo"
              style={{ marginRight: 4 }}
              css={STYLES_SOURCE_LOGO}
            />
          )}
          <P3 css={STYLES_SOURCE} as="small" color="textGray" nbrOflines={1}>
            {link.source}
          </P3>
          <SVG.ExternalLink
            className="link_external_link"
            height={12}
            width={12}
            style={{ marginLeft: 4 }}
          />
        </div>
      </a>
    );

    return (
      <a
        css={Styles.LINK}
        href={url}
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        style={{ margin: 24 }}
      >
        <div css={[Styles.VERTICAL_CONTAINER, STYLES_FREEFORM_CARD]}>
          <div css={STYLES_IMAGE_CONTAINER}>
            <img src={image} css={Styles.IMAGE_FILL} style={{ maxHeight: "calc(100vh - 200px)" }} />
          </div>
          <div css={[STYLES_TEXT_BOX]}>{tag}</div>
          {/* <div css={[Styles.VERTICAL_CONTAINER, STYLES_TEXT_BOX]}>
            <div css={STYLES_NAME}>
              <System.H3>{name}</System.H3>
            </div>
            <div css={STYLES_BODY}>
              <System.P1>{body}</System.P1>
            </div>
            <LinkTag url={url} fillWidth={false} style={{ color: Constants.semantic.textGray }} />
          </div> */}
        </div>
      </a>
    );
  }

  return (
    <a
      css={Styles.LINK}
      href={url}
      target="_blank"
      onClick={(e) => e.stopPropagation()}
      style={{ margin: 24 }}
    >
      <div css={[Styles.VERTICAL_CONTAINER, STYLES_CARD]}>
        <div css={STYLES_IMAGE_CONTAINER}>
          <img src={linkImage} css={Styles.IMAGE_FILL} />
        </div>
        <div css={[Styles.VERTICAL_CONTAINER, STYLES_TEXT_BOX]}>
          <div css={STYLES_NAME}>
            <System.H3>{linkName}</System.H3>
          </div>
          <div css={STYLES_BODY}>
            <System.P1>{linkBody}</System.P1>
          </div>
          <LinkTag url={url} fillWidth={false} style={{ color: Constants.semantic.textGray }} />
        </div>
      </div>
    </a>
  );
  {
    /* <div
      css={Styles.VERTICAL_CONTAINER_CENTERED}
      style={{ backgroundColor: Constants.semantic.bgLight, height: "100%" }}
    >
      <div css={STYLES_IMAGE_CONTAINER}>
        <img src={linkImage} style={{ width: "100%" }} />
      </div>
      <div css={Styles.VERTICAL_CONTAINER_CENTERED}>
        <System.H3 style={{ marginBottom: 16, color: Constants.semantic.textBlack }}>
          {linkName}
        </System.H3>
        <LinkTag fillWidth={false} url={url} style={{ marginBottom: 16 }} />
        <LoaderSpinner style={{ height: 24, width: 24 }} />
      </div>
    </div> */
  }
}

const useImage = ({ src, maxWidth }) => {
  const [imgState, setImgState] = React.useState({
    loaded: false,
    error: true,
    overflow: false,
  });

  React.useEffect(() => {
    if (!src) setImgState({ error: true, loaded: true });

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (maxWidth && img.naturalWidth < maxWidth) {
        setImgState((prev) => ({ ...prev, loaded: true, error: false, overflow: true }));
      } else {
        setImgState({ loaded: true, error: false });
      }
    };
    img.onerror = () => setImgState({ loaded: true, error: true });
  }, []);

  return imgState;
};
