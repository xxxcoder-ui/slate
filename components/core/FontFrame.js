import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";

const STYLES_WRAPPER = (theme) => css`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: ${theme.typescale.lvl2};
  letter-spacing: 1.15px;
`;

const STYLES_DARK_CONTAINER = (theme) => css`
  display: flex;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding-top: 96px;
  background-color: ${theme.system.pitchBlack};
  color: ${theme.system.wallLight};
  .${STYLES_NAME} {
    color: red;
  }
`;

const STYLES_LIGHT_CONTAINER = (theme) => css`
  display: flex;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding-top: 96px;
  background-color: ${theme.system.wallLight};
  color: ${theme.system.pitchBlack};
  .${STYLES_NAME} {
    color: green;
  }
`;

export default function FontFrame({ cid, url }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const customFonts = new FontFace(cid, `url(${url})`);
    customFonts.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setLoading(false);
    });
  }, [cid]);

  if (loading) {
    return (
      <div css={STYLES_WRAPPER}>
        <div css={STYLES_DARK_CONTAINER} />
        <div css={STYLES_LIGHT_CONTAINER} />
      </div>
    );
  }
  return (
    <div css={STYLES_WRAPPER} style={{ fontFamily: cid }}>
      <div css={STYLES_DARK_CONTAINER}>
        <div>
          <Name dark>{name}</Name>
          <Letter dark />
          <Glyphs dark />
        </div>
      </div>
      <div css={STYLES_LIGHT_CONTAINER}>
        <div>
          <Name>{name}</Name>
          <Letter />
          <Glyphs />
        </div>
      </div>
    </div>
  );
}

const STYLES_NAME = (dark) => (theme) => css`
  color: ${dark ? theme.system.wallLight : theme.system.pitchBlack};
`;
const Name = ({ dark, children }) => <div css={STYLES_NAME(dark)}>{children}</div>;

const STYLES_LETTER = (dark) => (theme) => css`
  font-size: ${theme.typescale.lvl10};
  color: ${dark ? theme.system.wallLight : theme.system.pitchBlack};
  margin-top: 36px;
`;
const Letter = ({ dark }) => <div css={STYLES_LETTER(dark)}>Aa</div>;

const GLYPHS = (dark) => (theme) => css`
  color: ${dark ? theme.system.wallLight : theme.system.pitchBlack};
  margin-top: 152px;
  & > * + * {
    margin-top: 12px;
  }
`;
const Glyphs = ({ dark }) => (
  <div css={GLYPHS(dark)}>
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
    <div>abcdefghijklmnopqrstuvwxyz</div>
    <div>0123456789</div>
    <div>!?()[]{}@$#%</div>
  </div>
);
