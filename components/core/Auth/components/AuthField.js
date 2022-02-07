import * as React from "react";

import Field from "~/components/core/Field";

import { css } from "@emotion/react";

const STYLES_INPUT = (theme) => css`
  background-color: rgba(242, 242, 247, 0.5);
  box-shadow: ${theme.shadow.lightLarge};
  border-radius: 12px;
`;

export default function AuthField({ css, ...props }) {
  return <Field inputCss={[STYLES_INPUT, css]} {...props} />;
}
