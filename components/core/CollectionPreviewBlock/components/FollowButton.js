import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { motion, useAnimation } from "framer-motion";
import { P3 } from "~/components/system";
import { useMounted } from "~/common/hooks";

const STYLES_BUTTON = (theme) => css`
  display: flex;
  background-color: ${theme.semantic.bgBlurWhite};
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.semantic.borderGrayLight};

  transition: box-shadow 0.3s;
  :hover {
    box-shadow: 0 0 0 1px ${theme.system.blue}, ${theme.shadow.lightLarge};
  }

  path {
    transition: stroke 0.3s;
  }

  :hover path {
    stroke: ${theme.system.blue};
  }
`;

const STYLES_DISABLED = (theme) => css`
  display: flex;
  background-color: ${theme.semantic.bgBlurWhite};
  padding: 8px;
  border-radius: 8px;
  ${"" /* box-shadow: 0 0 0 1px ${theme.system.gray}, ${theme.shadow.lightLarge}; */}
  box-shadow: 0 0 0 1px ${theme.semantic.borderGrayLight};
  transition: box-shadow 0.3s;
  cursor: not-allowed;

  path {
    transition: stroke 0.3s;
  }

  path {
    stroke: ${theme.system.gray};
  }
`;

const animate = async (controls) => {
  await controls.start({ x: -2, y: 2 });
  await controls.start({ x: 0, y: 0 });
};

export default function FollowButton({ onFollow, isFollowed, disabled, followCount, ...props }) {
  const controls = useAnimation();

  useMounted(() => {
    if (isFollowed) {
      animate(controls);
      return;
    }
  }, [isFollowed]);

  return (
    <motion.button
      css={[Styles.BUTTON_RESET, disabled ? STYLES_DISABLED : STYLES_BUTTON]}
      initial={{
        backgroundColor: isFollowed ? Constants.system.blueLight6 : Constants.semantic.bgBlurWhite,
      }}
      animate={{
        backgroundColor: isFollowed ? Constants.system.blueLight6 : Constants.semantic.bgBlurWhite,
      }}
      onClick={(e) => {
        if (disabled) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (onFollow) onFollow();
      }}
    >
      <span css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <svg
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <motion.path
            d="M3.33334 9.66669C5.32247 9.66669 7.23012 10.4569 8.63664 11.8634C10.0432 13.2699 10.8333 15.1776 10.8333 17.1667"
            initial={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            animate={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M3.33334 3.83331C6.86956 3.83331 10.2609 5.23807 12.7614 7.73856C15.2619 10.239 16.6667 13.6304 16.6667 17.1666"
            initial={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            animate={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M4.16668 17.1667C4.62691 17.1667 5.00001 16.7936 5.00001 16.3333C5.00001 15.8731 4.62691 15.5 4.16668 15.5C3.70644 15.5 3.33334 15.8731 3.33334 16.3333C3.33334 16.7936 3.70644 17.1667 4.16668 17.1667Z"
            initial={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            animate={{ stroke: isFollowed ? Constants.system.blue : Constants.system.black }}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <P3
          as={motion.p}
          style={{ marginLeft: 4, y: -0.5 }}
          initial={{
            color: disabled
              ? Constants.system.gray
              : isFollowed
              ? Constants.system.blue
              : Constants.semantic.textGrayDark,
          }}
          animate={{
            color: disabled
              ? Constants.system.gray
              : isFollowed
              ? Constants.system.blue
              : Constants.semantic.textGrayDark,
          }}
        >
          {followCount}
        </P3>
      </span>
    </motion.button>
  );
}
