import * as SVG from "~/common/svg";
import * as React from "react";

import { css } from "@emotion/react";
import { P } from "~/components/system/components/Typography";

export default function Select({
  options = [],
  value,
  placeholderSuffix = "",
  inputStyle,
  ...props
}) {
  const label =
    options.find((option) => option.value === value)?.name || `${value} ${placeholderSuffix}`;
  return (
    <div
      css={css`
        position: relative;
        min-width: 69px;
      `}
    >
      <div
        css={[
          (theme) => css`
            display: flex;
            padding: 4px 0px;
            color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.textGrayDark};
            align-items: center;
            & > * + * {
              margin-left: 8px;
            }
          `,
          inputStyle,
        ]}
      >
        <P
          dark
          css={css`
            font-size: 14px;
            white-space: pre;
            line-height: 21px;
          `}
        >
          {label}
        </P>
        <SVG.ChevronDown height="16px" display="block" />
      </div>
      <select
        css={css`
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        `}
        value={value}
        name="fontSize"
        {...props}
      >
        {options.map((item) => (
          <option value={item.value}>{item.name}</option>
        ))}
      </select>
    </div>
  );
}
