import * as React from "react";
import * as Constants from "~/common/constants";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsiteHeader from "~/components/core/WebsiteHeader";
import WebsiteFooter from "~/components/core/WebsiteFooter";

import { css } from "@emotion/react";

const STYLES_ROOT = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
  color: ${Constants.semantic.textGrayDark};
`;

const STYLES_CONTAINER = css`
  max-width: 1080px;
  margin: 0 auto;
  padding: 160px 24px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 480px;
    padding: 96px 16px;
  }
`;

const STYLES_HERO_TEXT = css`
  display: flex;
  align-items: center;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
  }
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.semiBold};
  flex-shrink: 0;
  color: ${Constants.semantic.textBlack};
  flex-shrink: 0;
  min-width: 50%;
  max-width: 100%;
`;

const STYLES_HEADING1 = css`
  ${STYLES_HEADING};
  font-size: 84px;
  line-height: 88px;
  letter-spacing: -0.05em;
  display: flex;
  align-items: baseline;

  @media (max-width: ${Constants.sizes.tablet}px) {
    font-size: 64px;
    line-height: 68px;
    letter-spacing: -0.04em;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.04em;
  }
`;

const STYLES_BODY1 = css`
  font-family: ${Constants.font.text};
  font-size: 24px;
  line-height: 36px;
  letter-spacing: -0.02em;
  margin-bottom: 32px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 20px;
  }
`;

const STYLES_IMG = css`
  max-width: 100%;
  overflow: hidden;
  box-shadow: 0px 10.8725px 57.9866px rgba(174, 176, 178, 0.3);
  max-width: calc(50% - 24px);
`;

const STYLES_IMG_HERO = css`
  ${STYLES_IMG};
  max-width: 100%;
  border: 12px solid ${Constants.semantic.textBlack};
  border-radius: 40px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    border: 8px solid ${Constants.semantic.textBlack};
    border-radius: 24px;
  }
`;

const STYLES_BUTTON = css`
  cursor: poitner;
  display: inline-flex;
  flex-grow: 0;
  justify-content: center;
  align-items: center;
  box-shadow: ${Constants.shadow.lightMedium};
  text-decoration: none;
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  cursor: pointer;
`;

const STYLES_BUTTON_PRIMARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textWhite};
  background-color: ${Constants.system.blue};
`;

const STYLES_BUTTON_PRIMARY_BIG = css`
  ${STYLES_BUTTON_PRIMARY};
  padding: 18px 28px 18px 24px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
`;

const STYLES_BUTTON_PRIMARY_BIG_HERO = css`
  ${STYLES_BUTTON_PRIMARY_BIG};
  margin-bottom: 48px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-bottom: 32px;
  }
`;

const STYLES_FEATURE_IMG = css`
  display: block;
  margin: 0 20px;
  width: 60%;
  border: ${Constants.semantic.borderGrayLight4};
  border-radius: 16px;
  box-shadow: ${Constants.shadow.darkMedium};
`;

export default class SlateForChromePage extends React.Component {
  render() {
    const title = `Slate for Chrome`;
    const description = "Upload images to Slate from anywhere on the web";
    const url = "https://slate.host/slate-for-chrome";
    const image =
      "https://slate.textile.io/ipfs/bafybeidi6z774yoge5uowzwkdrrnrzi5bzqgzrwfizw4dg4xdjxfjoa5ei";

    return (
      <WebsitePrototypeWrapper title={title} description={description} url={url} image={image}>
        <WebsiteHeader />
        <div css={STYLES_ROOT}>
          <div css={STYLES_CONTAINER}>
            <div css={STYLES_HEADING1}>Slate web extension</div>
            <br />
            <div css={STYLES_BODY1}>
              Access Slate anytime, anywhere when you browse the Internet.
            </div>
            <a css={STYLES_BUTTON_PRIMARY_BIG_HERO}>Get Slate for Chrome</a>
            <img
              css={STYLES_IMG_HERO}
              src="https://slate.textile.io/ipfs/bafybeihsrxgjk5ax4wzbnfnq2kyg4djylrvpsbzrhitvnmcjixupbk5qjm"
            />
            <img
              css={STYLES_FEATURE_IMG}
              style={{ margin: "-50% auto 48px auto" }}
              src="https://slate.textile.io/ipfs/bafkreidm2ffwdjgk5j5w4ja2p7fjrflfeldyhak2qigkpatvhazc5rsvda"
            />
          </div>
        </div>
        <WebsiteFooter />
      </WebsitePrototypeWrapper>
    );
  }
}
