import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { H4, P } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";

const STYLES_BACKGROUND_LIGHT = (theme) => css`
  background-color: ${theme.system.grayLight5};
  box-shadow: ${theme.shadow.medium};
  border-radius: 8px;
`;

const STYLES_WRAPPER = css`
  border-radius: 8px;
  overflow: hidden;
`;

const STYLES_DESCRIPTION = (theme) => css`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${theme.system.white};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
    backdrop-filter: blur(75px);
    -webkit-backdrop-filter: blur(75px);
  }
`;

const STYLES_DESCRIPTION_HEADING = (theme) => css`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: ${theme.typescale.lvl0};
  }
`;

const STYLES_DESCRIPTION_META = css`
  justify-content: space-between;
  margin-top: 12px;
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
`;

const STYLES_DESCRIPTION_TAG = (theme) => css`
  position: absolute;
  top: -32px;
  left: 12px;
  text-transform: uppercase;
  border: 1px solid ${theme.system.grayLight5};
  background-color: ${theme.system.bgLight};
  padding: 2px 8px;
  border-radius: 4px;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue};
  border-radius: 8px;
`;

export default function ObjectPreviewPremitive({
  children,
  likes = 0,
  saves = 0,
  type,
  title,
  isSelected,
  ...props
}) {
  return (
    <div css={isSelected && STYLES_SELECTED_RING}>
      <AspectRatio ratio={295 / 248} css={STYLES_BACKGROUND_LIGHT} {...props}>
        <div css={STYLES_WRAPPER}>
          <AspectRatio ratio={1}>
            <div>{children}</div>
          </AspectRatio>

          <article css={STYLES_DESCRIPTION}>
            {type && (
              <div css={STYLES_DESCRIPTION_TAG}>
                <P css={Styles.SMALL_TEXT}>{type}</P>
              </div>
            )}
            <H4 css={STYLES_DESCRIPTION_HEADING}>{title}</H4>

            <div css={[Styles.HORIZONTAL_CONTAINER_CENTERED, STYLES_DESCRIPTION_META]}>
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
    </div>
  );
}
