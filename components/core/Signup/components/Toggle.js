import * as React from "react";

import { css } from "@emotion/react";

const STYLES_WRAPPER = css`
  width: fit-content;
  display: flex;
  background-color: #f2f2f7;
  border-radius: 8px;
`;

const STYLES_BUTTON = (theme) => css`
  border-style: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: ${theme.font.semiBold};
  font-size: ${theme.typescale.lvl0};
  color: ${theme.system.textGrayLight};
  background-color: transparent;
  transition: 0.25s all;
  outline-style: none;
  cursor: pointer;
`;

const STYLES_BUTTON_ACTIVE = (theme) => css`
  background-color: ${theme.system.gray};
  color: ${theme.system.textBlack};
`;

export default function ({ options = [], onChange }) {
  const [currentOption, setOption] = React.useState(options[0]);
  const handleChange = (nextValue) => {
    if (onChange) onChange(nextValue.value);
    setOption(nextValue);
  };
  return (
    <div css={STYLES_WRAPPER}>
      {options.map((option) => (
        <button
          onClick={() => handleChange(option)}
          css={[STYLES_BUTTON, option.value === currentOption.value && STYLES_BUTTON_ACTIVE]}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
