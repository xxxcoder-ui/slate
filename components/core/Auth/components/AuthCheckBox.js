import * as React from "react";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";
import { css } from "@emotion/react";

const STYLES_CHECKBOX_LABEL = (theme) => css`
  padding-left: 8px;
  a,
  a:link,
  a:visited {
    color: ${theme.system.blue};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const STYLES_CHECKBOX_INPUT = css`
  background-color: rgba(242, 242, 247, 0.5);
  height: 16px;
  width: 16px;
`;

const STYLES_CHECKBOX_ERROR = (theme) => css`
  background-color: rgba(242, 242, 247, 0.5);
  border: 1px solid ${theme.system.red};
  height: 16px;
  width: 16px;
`;

const STYLES_CHECKBOX_SUCCESS = (theme) => css`
  background-color: rgba(242, 242, 247, 0.5);
  border: 1px solid ${theme.system.green};
  height: 16px;
  width: 16px;
`;

const STYLES_CHECKBOX_WRAPPER = css`
  align-items: center;
`;

export default function AuthCheckBox({ touched, error, ...props }) {
  const showError = touched && error;
  const showSuccess = touched && !error;

  const STYLES_CHECKBOX = React.useMemo(() => {
    if (showError) return STYLES_CHECKBOX_ERROR;
    return STYLES_CHECKBOX_INPUT;
  }, [touched, error]);

  return (
    <System.CheckBox
      containerStyles={STYLES_CHECKBOX_WRAPPER}
      labelStyles={STYLES_CHECKBOX_LABEL}
      inputStyles={STYLES_CHECKBOX}
      boxStyle={
        props.value
          ? {
              backgroundColor: Constants.system.blue,
              boxShadow: `0 0 0 1px ${Constants.system.blue}`,
            }
          : { backgroundColor: Constants.semantic.bgBlurWhiteTRN }
      }
      {...props}
    >
      I agree to the Slate{" "}
      <a href="/terms" target="_blank" style={{ textDecoration: "none" }}>
        terms of service
      </a>
    </System.CheckBox>
  );
}
