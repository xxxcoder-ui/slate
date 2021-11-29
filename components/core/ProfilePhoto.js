import * as React from "react";
import * as Constants from "~/common/constants";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { useMemoCompare } from "~/common/hooks";
import isEqual from "lodash/isEqual";

import Dismissible from "~/components/core/Dismissible";

const STYLES_AVATAR = css`
  background-size: cover;
  background-position: 50% 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  border-radius: 8px;
  background-color: ${Constants.system.black};
  display: block;
`;

const STYLES_AVATAR_ONLINE = css`
  height: 16px;
  width: 16px;
  background-color: ${Constants.system.green};
  border: 2px solid ${Constants.system.white};
  position: absolute;
  bottom: -4px;
  right: -4px;
  border-radius: 16px;
`;

function BoringAvatar({ avatarCss, ...props }) {
  let colors = ["A9B9C1", "5B6B74", "3C444A", "D4DBDF", "293137"];
  let avatarUrl = `https://source.boringavatars.com/marble/${props.size}/${props.userId}?square&colors=${colors}`;
  return (
    <Dismissible captureResize={false} captureScroll={true}>
      <img
        src={avatarUrl}
        css={[avatarCss, STYLES_AVATAR]}
        style={props.style}
        alt="profile preview"
      />
    </Dismissible>
  );
}

function UploadedAvatar({ avatarCss, ...props }) {
  return (
    <Dismissible
      css={[avatarCss, STYLES_AVATAR]}
      captureResize={false}
      captureScroll={true}
      style={{
        ...props.style,
        backgroundImage: `url('${props.url}')`,
      }}
    >
      {props.visible ? props.popover : null}
      {props.online ? <span css={STYLES_AVATAR_ONLINE} /> : null}
    </Dismissible>
  );
}

export default function ProfilePhoto({ size, style, ...props }) {
  // NOTE(amine): will calculate only when the size prop changes
  const memoizedSizeProp = useMemoCompare(size, isEqual);
  const STYLES_SIZE = React.useMemo(() => {
    const responsiveStyles = Utilities.mapResponsiveProp(size, (size) => ({
      width: size,
      height: size,
    }));
    return css(responsiveStyles);
  }, [memoizedSizeProp]);

  return (
    <>
      {props.user.photo ? (
        <UploadedAvatar url={props.user.photo} style={style} avatarCss={STYLES_SIZE} />
      ) : (
        <BoringAvatar userId={props.user.id} style={style} avatarCss={STYLES_SIZE} />
      )}
    </>
  );
}
