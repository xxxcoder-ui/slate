import * as React from "react";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { motion } from "framer-motion";

const STYLES_DATAMETER_WRAPPER = (theme) => css`
  width: 100%;
  height: 8px;
  background-color: ${theme.semantic.bgBlurWhiteTRN};
  border: 1px solid ${theme.semantic.borderGrayLight4};
  border-radius: 4px;
  overflow: hidden;
`;

const STYLES_DATAMETER = (theme) => css`
  position: relative;
  left: -100%;
  height: 100%;
  background-color: ${theme.system.blue};
  border-radius: 4px;
`;

export default function DataMeter({ bytes = 1000, maximumBytes = 4000, css, ...props }) {
  const percentage = Utilities.clamp((bytes / maximumBytes) * 100, 0, 100);
  return (
    <div css={[STYLES_DATAMETER_WRAPPER, css]} {...props}>
      <motion.div
        initial={false}
        css={STYLES_DATAMETER}
        animate={{ x: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 170, damping: 26 }}
      />
    </div>
  );
}
