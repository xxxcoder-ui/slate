import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";

const STYLES_BUTTON = css`
  box-sizing: border-box;
  border-radius: 12px;
  outline: 0;
  border: 0;
  padding: 9px 24px 11px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  font-family: ${Constants.font.medium};
  transition: 200ms ease all;
  overflow-wrap: break-word;
  user-select: none;
`;

const STYLES_BUTTON_PRIMARY = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  background-color: ${Constants.system.blue};
  color: ${Constants.system.white};
  text-decoration: none;

  :hover {
    background-color: #0079eb;
  }

  :focus {
    outline: 0;
    border: 0;
  }
`;

const STYLES_BUTTON_PRIMARY_DISABLED = css`
  ${STYLES_BUTTON}
  cursor: not-allowed;
  background-color: ${Constants.semantic.bgBlue};
  color: ${Constants.system.white};
`;

const STYLES_BUTTON_PRIMARY_TRANSPARENT = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  background-color: transparent;
  color: ${Constants.system.blue};
`;

export const ButtonPrimary = React.forwardRef(
  ({ children, css, style, full, transparent, loading, label, type, ...props }, ref) => {
    if (loading) {
      return (
        <button
          css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          <LoaderSpinner style={{ height: 16, width: 16, color: Constants.system.white }} />
        </button>
      );
    }

    if (type === "label") {
      return (
        <label
          css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={label}
          ref={ref}
          {...props}
        >
          {children}
        </label>
      );
    }

    if (type === "link") {
      return (
        <a
          css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </a>
      );
    }

    if (props.disabled) {
      return (
        <button
          css={[STYLES_BUTTON_PRIMARY_DISABLED, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
        style={{ width: full ? "100%" : "auto", ...style }}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonPrimaryFull = React.forwardRef((props, ref) => {
  return <ButtonPrimary full ref={ref} {...props} />;
});

const STYLES_BUTTON_SECONDARY = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  color: ${Constants.system.black};
  background-color: ${Constants.system.grayLight5};
  box-shadow: 0 0 0 1px ${Constants.semantic.bgLight} inset;
  text-decoration: none;

  :hover {
    background-color: ${Constants.system.grayLight4};
  }

  :focus {
    outline: 0;
    border: 0;
  }
`;

const STYLES_BUTTON_SECONDARY_TRANSPARENT = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  background-color: transparent;
  color: ${Constants.system.grayLight2};
`;

export const ButtonSecondary = React.forwardRef(
  ({ children, css, style, full, transparent, loading, label, type, ...props }, ref) => {
    if (loading) {
      return (
        <button
          css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          <LoaderSpinner style={{ height: 16, width: 16 }} />
        </button>
      );
    }

    if (type === "label") {
      return (
        <label
          css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={label}
          ref={ref}
          {...props}
        >
          {children}
        </label>
      );
    }

    if (type === "link") {
      return (
        <a
          css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
        style={{ width: full ? "100%" : "auto", ...style }}
        type={type}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonSecondaryFull = (props) => {
  return <ButtonSecondary full {...props} />;
};

const STYLES_BUTTON_TERTIARY = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  color: ${Constants.system.black};
  background-color: ${Constants.system.white};
  box-shadow: 0 0 0 1px ${Constants.semantic.borderGrayLight} inset;
  text-decoration: none;

  :hover {
    background-color: #fcfcfc;
  }
`;

const STYLES_BUTTON_TERTIARY_TRANSPARENT = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  background-color: transparent;
  text-decoration: none;
  color: ${Constants.system.grayLight2};
`;

export const ButtonTertiary = React.forwardRef(
  ({ children, css, style, full, transparent, loading, label, type, ...props }, ref) => {
    if (loading) {
      return (
        <button
          css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          <LoaderSpinner style={{ height: 16, width: 16 }} />
        </button>
      );
    }

    if (type === "label") {
      return (
        <label
          css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </label>
      );
    }

    if (type === "link") {
      return (
        <a
          css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
        style={{ width: full ? "100%" : "auto", ...style }}
        type={type}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonTertiaryFull = React.forwardRef((props, ref) => {
  return <ButtonTertiary full {...props} ref={ref} />;
});

const STYLES_BUTTON_DISABLED = css`
  ${STYLES_BUTTON}
  cursor: not-allowed;
  background-color: ${Constants.system.white};
  color: ${Constants.semantic.textGrayLight};
  box-shadow: 0 0 0 1px ${Constants.semantic.bgGrayLight} inset;

  :focus {
    outline: 0;
    border: 0;
  }
`;

const STYLES_BUTTON_DISABLED_TRANSPARENT = css`
  ${STYLES_BUTTON}
  cursor: not-allowed;
  background-color: transparent;
  color: ${Constants.system.gray};
`;

export const ButtonDisabled = React.forwardRef(
  ({ children, css, style, full, label, ...props }, ref) => {
    return (
      <button
        css={[props.transparent ? STYLES_BUTTON_DISABLED_TRANSPARENT : STYLES_BUTTON_DISABLED, css]}
        type={label}
        style={{ width: full ? "100%" : "auto", ...style }}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonDisabledFull = React.forwardRef((props, ref) => {
  return <ButtonDisabled full ref={ref} {...props} />;
});

const STYLES_BUTTON_WARNING = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  color: ${Constants.system.white};
  background-color: ${Constants.system.red};

  :hover {
    background-color: #b51111;
  }

  :focus {
    outline: 0;
    border: 0;
  }
`;

const STYLES_BUTTON_WARNING_DISABLED = css`
  ${STYLES_BUTTON}
  cursor: not-allowed;
  color: ${Constants.system.white};
  background-color: ${Constants.semantic.bgRed};
  box-shadow: 0 0 0 1px ${Constants.semantic.bgLight} inset;
`;

const STYLES_BUTTON_WARNING_TRANSPARENT = css`
  ${STYLES_BUTTON}
  cursor: pointer;
  background-color: transparent;
  color: ${Constants.system.red};
`;

export const ButtonWarning = React.forwardRef(
  ({ children, css, style, full, transparent, type, disabled, loading, label, ...props }, ref) => {
    if (loading) {
      return (
        <button
          css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          <LoaderSpinner style={{ height: 16, width: 16, color: Constants.system.white }} />
        </button>
      );
    }

    if (type === "label") {
      return (
        <label
          css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={label}
          ref={ref}
          {...props}
        >
          {children}
        </label>
      );
    }

    if (disabled) {
      return (
        <button
          css={[STYLES_BUTTON_WARNING_DISABLED, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
        style={{ width: full ? "100%" : "auto", ...style }}
        type={type}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const ButtonWarningFull = React.forwardRef((props, ref) => {
  return <ButtonWarning full ref={ref} {...props} />;
});
