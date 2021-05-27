import * as React from "react";
import * as Constants from "~/common/constants";
import * as Validations from "~/common/validations";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";
import { FileTypeIcon } from "~/components/core/FileTypeIcon";
import { H4, P } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

const STYLES_WRAPPER = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const STYLES_OBJECT_CONTAINER = (theme) => css`
  flex-grow: 1;
  width: 100%;
  background-color: ${theme.system.grayLight5};
`;

const STYLES_BACKGROUND_LIGHT = (theme) => css`
  background-color: ${theme.system.grayLight5};
  border-radius: 8px;
`;

const STYLES_DESCRIPTION = (theme) => css`
  box-sizing: border-box;
  position: relative;
  background-color: ${theme.system.bgLight};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 45.31%);
  padding: 24px 16px 12px;
  width: 100%;
  h4 {
    margin-bottom: 2px;
  }
`;

const STYLES_DESCRIPTION_HEADING = (theme) => css`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const STYLES_METRICS = (theme) => css`
  font-size: ${theme.typescale.lvl0};
  color: ${theme.system.textGrayDark};
  line-height: 21px;
`;

const STYLES_REACTIONS_CONTAINER = css`
  display: flex;
  & > * + * {
    margin-left: 32px;
  }
`;

const STYLES_DESCRIPTION_TAG = (theme) => css`
  position: absolute;
  top: 0%;
  left: 12px;
  transform: translateY(-50%);
  display: inline-block;
  background-color: ${theme.system.bgBlurLight6};
  border: 1px solid ${theme.system.grayLight4};
  text-transform: uppercase;
  border-radius: 4px;
  padding: 2px 8px;
`;

const STYLES_TEXT_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
`;

const STYLES_REACTION = css`
  display: flex;
  & > * + * {
    margin-left: 8px;
  }
`;

const STYLES_PROFILE_IMAGE = css`
  background-color: ${Constants.system.foreground};
  background-size: cover;
  background-position: 50% 50%;
  flex-shrink: 0;
  height: 20px;
  width: 20px;
  border-radius: 2px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

export default function ObjectPreviewPremitive({ children, likes = 0, saves = 0, type, title }) {
  return (
    <AspectRatio ratio={347 / 248} css={STYLES_BACKGROUND_LIGHT}>
      <div css={STYLES_WRAPPER}>
        <div css={STYLES_OBJECT_CONTAINER}>{children}</div>
        <article css={STYLES_DESCRIPTION}>
          <div css={STYLES_DESCRIPTION_TAG}>
            <P css={STYLES_TEXT_SMALL}>{type}</P>
          </div>
          <H4 css={STYLES_DESCRIPTION_HEADING}>{title}</H4>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <div css={STYLES_REACTIONS_CONTAINER}>
              <div css={STYLES_REACTION}>
                <SVG.Heart />
                <P css={STYLES_METRICS}>{likes}</P>
              </div>
              <div css={STYLES_REACTION}>
                <SVG.FolderPlus />
                <P css={STYLES_METRICS}>{saves}</P>
              </div>
            </div>
            <span
              css={STYLES_PROFILE_IMAGE}
              style={{
                backgroundImage: `url('https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i')`,
              }}
            />
          </div>
        </article>
      </div>
    </AspectRatio>
  );
}
