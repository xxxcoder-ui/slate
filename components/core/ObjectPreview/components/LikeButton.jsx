import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";

import { motion, useAnimation } from "framer-motion";

const STYLES_BUTTON_HOVER = (theme) => css`
  :hover path {
    stroke: ${theme.system.brand};
  }
`;

const animate = async (controls) => {
  await controls.start({ scale: 1.3, rotateY: 180, fill: Constants.system.brand });
  await controls.start({ scale: 1 });
  controls.set({ rotateY: 0 });
};

export default function LikeButton(props) {
  const [toggle, setToggle] = React.useState(false);
  const controls = useAnimation();

  React.useLayoutEffect(() => {
    if (toggle) {
      animate(controls);
      return;
    }
    controls.start({ fill: "#fff", scale: 1 });
  }, [toggle]);

  return (
    <button
      css={[Styles.BUTTON_RESET, STYLES_BUTTON_HOVER]}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setToggle((prev) => !prev);
      }}
    >
      <motion.svg
        width={20}
        height={21}
        initial={{ fill: "white" }}
        animate={{ fill: toggle ? Constants.system.black : Constants.system.white, ...controls }}
        transition={{ duration: 0.3 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <motion.path
          d="M17.367 4.342a4.584 4.584 0 00-6.484 0L10 5.225l-.883-.883a4.584 4.584 0 00-6.484 6.483l.884.883L10 18.192l6.483-6.484.884-.883a4.584 4.584 0 000-6.483v0z"
          animate={{ stroke: toggle ? Constants.system.brand : Constants.system.textGrayDark }}
          whileHover={{ stroke: Constants.system.brand }}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );
}
