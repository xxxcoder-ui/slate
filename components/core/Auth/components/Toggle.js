import * as React from "react";

import { motion, AnimateSharedLayout } from "framer-motion";
import { css } from "@emotion/react";

const STYLES_WRAPPER = (theme) => css`
  width: fit-content;
  display: flex;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 12px;
`;

const STYLES_BUTTON = (theme) => css`
  border-style: none;
  padding: 9px 24px 11px;
  border-radius: 12px;
  font-family: ${theme.font.medium};
  font-size: ${theme.typescale.lvl0};
  color: ${theme.semantic.textGray};
  background-color: transparent;
  outline-style: none;
  cursor: pointer;
  transition: 0.2 color;
`;

const STYLES_ACTIVE = (theme) => css`
  background-color: ${theme.system.white};
  color: ${theme.semantic.textBlack};
`;

const STYLES_BUTTON_ACTIVE = (theme) => css`
  color: ${theme.semantic.textBlack};
`;

export default function Toggle({ options = [], onChange, toggleValue = "signin", ...props }) {
  const initialValue = toggleValue === "signup" ? 1 : 0;
  const [currentOption, setOption] = React.useState(options[initialValue]);
  const handleChange = (nextValue) => {
    if (onChange) onChange(nextValue.value);
    setOption(nextValue);
  };
  return (
    <AnimateSharedLayout>
      <div css={STYLES_WRAPPER} {...props}>
        {options.map((option) => (
          <div key={option.label} style={{ position: "relative" }}>
            <button
              type="button"
              style={{ position: "relative", zIndex: 3 }}
              onClick={() => handleChange(option)}
              css={[STYLES_BUTTON, option.value === currentOption.value && STYLES_BUTTON_ACTIVE]}
            >
              {option.label}
            </button>
            {option.value === currentOption.value && (
              <motion.div
                layoutId="button"
                style={{
                  position: "absolute",
                  top: 0,
                  zIndex: 1,
                  left: 0,
                  width: "100%",
                  borderRadius: "12px",
                  height: "100%",
                }}
                css={STYLES_ACTIVE}
              />
            )}
          </div>
        ))}
      </div>
    </AnimateSharedLayout>
  );
}
