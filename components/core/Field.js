import * as React from "react";

import { P } from "~/components/system/components/Typography";
import { Input } from "~/components/system";
import { css } from "@emotion/react";

const STYLES_SMALL_TEXT = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  line-height: 15.6px;
`;

const STYLES_PASSWORD_VALIDATIONS = (theme) => css`
  margin-top: 16px;
  border: 1px solid ${theme.system.white};
  background-color: white;
  @supports ((-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px))) {
    background-color: ${theme.system.bgBlurWhiteTRN};
    backdrop-filter: blur(75px);
  }
  padding: 8px 12px;
  border-radius: 8px;
`;

const STYLES_PASSWORD_VALIDATION = css`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 8px;
  }
`;

const STYLES_CIRCLE = (theme) => css`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  border: 1.25px solid ${theme.system.grayLight2};
`;

const STYLES_CIRCLE_SUCCESS = (theme) => css`
  border: 1.25px solid ${theme.system.green};
`;

const STYLES_INPUT = (theme) => css`
  background-color: rgba(242, 242, 247, 0.7);
  box-shadow: ${theme.shadow.large};
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.system.white};
  &::placeholder {
    color: ${theme.semantic.textGrayDark};
  }
`;
const STYLES_INPUT_ERROR = (theme) => css`
  box-shadow: 0 0 0 1px ${theme.system.red};
`;

const STYLES_INPUT_SUCCESS = (theme) => css`
  box-shadow: 0 0 0 1px ${theme.system.green};
`;

const PasswordValidations = ({ validations, full, color }) => {
  return (
    <div
      css={STYLES_PASSWORD_VALIDATIONS}
      style={{ backgroundColor: color === "white" && "white", maxWidth: !full && "480px" }}
    >
      <P css={STYLES_SMALL_TEXT}>Passwords should</P>
      <div css={STYLES_PASSWORD_VALIDATION}>
        <div css={[STYLES_CIRCLE, validations.validLength && STYLES_CIRCLE_SUCCESS]} />
        <P css={STYLES_SMALL_TEXT}>Be at least 8 characters long</P>
      </div>
      <div css={STYLES_PASSWORD_VALIDATION}>
        <div
          css={[
            STYLES_CIRCLE,
            validations.containsLowerCase && validations.containsUpperCase && STYLES_CIRCLE_SUCCESS,
          ]}
        />
        <P css={STYLES_SMALL_TEXT}>Contain both uppercase and lowercase letters</P>
      </div>
      <div css={STYLES_PASSWORD_VALIDATION}>
        <div css={[STYLES_CIRCLE, validations.containsNumbers && STYLES_CIRCLE_SUCCESS]} />
        <P css={STYLES_SMALL_TEXT}>Contain at least 1 number</P>
      </div>
      <div css={STYLES_PASSWORD_VALIDATION}>
        <div css={[STYLES_CIRCLE, validations.containsSymbol && STYLES_CIRCLE_SUCCESS]} />
        <P css={STYLES_SMALL_TEXT}>Contain at least 1 symbol</P>
      </div>
    </div>
  );
};

export default function Field({
  touched,
  error,
  success,
  validations,
  errorAs,
  containerAs,
  full,
  color = "transparent",
  ...props
}) {
  const showError = touched && error;
  const showSuccess = touched && !error;

  const STYLES_STATUS = React.useMemo(() => {
    if (showError) return STYLES_INPUT_ERROR;
    if (showSuccess) return STYLES_INPUT_SUCCESS;
  }, [touched, error]);

  const ContainerComponent = containerAs || "div";
  const ErrorWrapper = errorAs || "div";
  return (
    <div>
      <ContainerComponent>
        <Input
          inputCss={[color === "transparent" && STYLES_INPUT, STYLES_STATUS]}
          full={full}
          {...props}
        />
      </ContainerComponent>
      {props.name === "password" && validations && (
        <PasswordValidations color={color} full={full} validations={validations} />
      )}
      {props.name !== "password" && (showError || showSuccess) && (
        <ErrorWrapper>
          <P css={STYLES_SMALL_TEXT} style={{ marginTop: "8px" }}>
            {(showError && error) || (showSuccess && success)}
          </P>
        </ErrorWrapper>
      )}
    </div>
  );
}
