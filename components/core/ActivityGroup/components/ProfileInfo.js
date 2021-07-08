import * as React from "react";
import * as Styles from "~/common/styles";

import { Link } from "~/components/core/Link";
import { css } from "@emotion/react";
import { P, H4 } from "~/components/system/components/Typography";

const STYLES_PROFILE_CONTAINER = css`
  display: flex;
  padding-right: 12px;
  box-sizing: border-box;
  & > * + * {
    margin-left: 12px;
  }
`;

const STYLES_TEXT_BLACK = (theme) =>
  css`
    color: ${theme.system.textBlack};
    display: inline;
  `;

const STYLES_TEXT_GRAY_DARK = (theme) =>
  css`
    color: ${theme.system.textGrayDark};
    display: inline;
  `;

const TEXT_TRUNCATE = css`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const STYLES_PROFILE = css`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;

const STYLES_MOBILE_ALIGN = (theme) => css`
  @media (max-width: ${theme.sizes.mobile}px) {
    width: 100%;
    & > span {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

export default function ProfileInfo({ owner, time, action, onAction }) {
  const { username, data = {} } = owner;
  const { photo } = data;

  return (
    <Link href={`/$/user/${owner.id}`} onAction={onAction}>
      <div css={STYLES_PROFILE_CONTAINER}>
        <img src={photo} alt={`${username} profile`} css={STYLES_PROFILE} />
        <div css={STYLES_MOBILE_ALIGN}>
          <span>
            <H4 css={[STYLES_TEXT_BLACK, Styles.HEADING_04]}>{username}</H4>
            <H4 css={[STYLES_TEXT_BLACK, Styles.HEADING_04, Styles.MOBILE_HIDDEN]}>
              &nbsp;•&nbsp;
            </H4>
            <P variant="para-02" css={[STYLES_TEXT_GRAY_DARK, Styles.PARA_02]}>
              {time}
            </P>
          </span>
          <P css={[STYLES_TEXT_GRAY_DARK, TEXT_TRUNCATE, Styles.PARA_02]}>{action}</P>
        </div>
      </div>
    </Link>
  );
}
