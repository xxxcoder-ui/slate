import * as React from "react";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { motion } from "framer-motion";

const STYLES_BUTTON_HOVER = (theme) => css`
  display: flex;
  :hover .button_path {
    stroke: ${theme.system.brand};
  }
`;

export default function SaveButton(props) {
  const [toggle, setToggle] = React.useState(false);

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
        height={20}
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <motion.path
          className="button_path"
          d="M18.3333 16.3333C18.3333 16.7754 18.1577 17.1993 17.8452 17.5118C17.5326 17.8244 17.1087 18 16.6667 18H3.33332C2.8913 18 2.46737 17.8244 2.15481 17.5118C1.84225 17.1993 1.66666 16.7754 1.66666 16.3333V4.66667C1.66666 4.22464 1.84225 3.80072 2.15481 3.48816C2.46737 3.17559 2.8913 3 3.33332 3H7.49999L9.16666 5.5H16.6667C17.1087 5.5 17.5326 5.67559 17.8452 5.98816C18.1577 6.30072 18.3333 6.72464 18.3333 7.16667V16.3333Z"
          stroke={Constants.system.textGrayDark}
          animate={{
            fill: toggle ? "rgba(0, 132, 255, 1)" : "rgba(0, 132, 255, 0)",
            stroke: toggle ? Constants.system.brand : Constants.system.black,
          }}
          strokeWidth={1.25}
          whileHover={{ stroke: Constants.system.brand }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: toggle ? 1 : 0,
            stroke: "#fff",
          }}
          style={{ y: 1, x: -0.3 }}
          d="M13 9l-3.438 3.438L8 10.874"
          strokeDashoffset="-1px"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          transition={{ delay: toggle ? 0.1 : 0 }}
        />
        <motion.path
          className="button_path"
          animate={{ y: toggle ? 2 : 0, opacity: toggle ? 0 : 1 }}
          d="M10 9.66665V14.6666"
          stroke="#48484A"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          className="button_path"
          animate={{ x: toggle ? 2 : 0, opacity: toggle ? 0 : 1 }}
          d="M7.5 12.1666H12.5"
          stroke="#48484A"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );
}
