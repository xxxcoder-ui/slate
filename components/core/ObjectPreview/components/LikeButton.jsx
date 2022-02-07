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
  box-shadow: 0 0 0 1px ${theme.system.grayLight5}, ${theme.shadow.lightLarge};
  transition: box-shadow 0.3s;
  color: ${theme.semantic.textBlack};
  :hover {
    box-shadow: 0 0 0 1px ${theme.system.pink}, ${theme.shadow.lightLarge};
  }

  svg {
    transition: fill 0.1s;
  }
  :hover svg {
    fill: ${theme.system.pink};
  }

  path {
    transition: stroke 0.3s;
  }
  :hover path {
    stroke: ${theme.system.pink};
  }
`;

export default function LikeButton({ onClick, isLiked, likeCount }) {
  const { heartAnimation, backgroundAnimation } = useAnimations({ isLiked });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <motion.button
      css={[Styles.BUTTON_RESET, STYLES_BUTTON]}
      initial={{
        backgroundColor: isLiked ? Constants.system.redLight6 : Constants.semantic.bgBlurWhite,
      }}
      animate={backgroundAnimation}
      onClick={handleClick}
    >
      <span css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <motion.svg
          width={16}
          height={16}
          initial={{ fill: isLiked ? Constants.system.pink : Constants.semantic.bgBlurWhite }}
          animate={heartAnimation}
          transition={{ duration: 0.3 }}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M13.893 3.073a3.667 3.667 0 00-5.186 0L8 3.78l-.707-.707A3.667 3.667 0 102.107 8.26l.706.707L8 14.153l5.187-5.186.706-.707a3.667 3.667 0 000-5.187v0z"
            stroke={Constants.semantic.textBlack}
            initial={{ stroke: isLiked ? Constants.system.pink : Constants.semantic.textGrayDark }}
            animate={{ stroke: isLiked ? Constants.system.pink : Constants.semantic.textGrayDark }}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <P3
          as={motion.p}
          style={{ marginLeft: 4, y: -0.5 }}
          initial={{ color: isLiked ? Constants.system.pink : Constants.semantic.textGrayDark }}
          animate={{ color: isLiked ? Constants.system.pink : Constants.semantic.textGrayDark }}
        >
          {likeCount}
        </P3>
      </span>
    </motion.button>
  );
}

const animateButton = async (heartAnimation, backgroundAnimation) => {
  await heartAnimation.start({ scale: 1.3, rotateY: 180, fill: Constants.system.pink });
  heartAnimation.start({ scale: 1, transition: { duration: 0.2 } });
  backgroundAnimation.start({ backgroundColor: Constants.system.redLight6 });
  heartAnimation.set({ rotateY: 0 });
};

const useAnimations = ({ isLiked }) => {
  const backgroundAnimation = useAnimation();
  const heartAnimation = useAnimation();

  useMounted(() => {
    if (isLiked) {
      animateButton(heartAnimation, backgroundAnimation);
      return;
    }
    // NOTE(amine): reset values to default
    heartAnimation.start({ fill: Constants.semantic.bgBlurWhite, scale: 1 });
    backgroundAnimation.start({ backgroundColor: Constants.semantic.bgBlurWhite });
  }, [isLiked]);

  return { heartAnimation, backgroundAnimation };
};
