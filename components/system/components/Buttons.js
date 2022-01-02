import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { jsx } from "@emotion/react";
import { FocusRing } from "~/components/core/FocusRing";

export const ButtonPrimitive = React.forwardRef(
  ({ as = "button", children, css, ...props }, ref) => {
    return (
      <FocusRing>{jsx(as, { ...props, css: [Styles.BUTTON_RESET, css], ref }, children)}</FocusRing>
    );
  }
);

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
  transition: 200ms ease background-color;
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
        <FocusRing>
          <button
            css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            <LoaderSpinner style={{ height: 16, width: 16, color: Constants.system.white }} />
          </button>
        </FocusRing>
      );
    }

    if (type === "label") {
      return (
        <FocusRing>
          <label
            css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={label}
            ref={ref}
            {...props}
          >
            {children}
          </label>
        </FocusRing>
      );
    }

    if (type === "link") {
      return (
        <FocusRing>
          <a
            css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            ref={ref}
            {...props}
          >
            {children}
          </a>
        </FocusRing>
      );
    }

    if (props.disabled) {
      return (
        <FocusRing>
          <button
            css={[STYLES_BUTTON_PRIMARY_DISABLED, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            {children}
          </button>
        </FocusRing>
      );
    }

    return (
      <FocusRing>
        <button
          css={[transparent ? STYLES_BUTTON_PRIMARY_TRANSPARENT : STYLES_BUTTON_PRIMARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          {...props}
        >
          {children}
        </button>
      </FocusRing>
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
        <FocusRing>
          <button
            css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            <LoaderSpinner style={{ height: 16, width: 16 }} />
          </button>
        </FocusRing>
      );
    }

    if (type === "label") {
      return (
        <FocusRing>
          <label
            css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={label}
            ref={ref}
            {...props}
          >
            {children}
          </label>
        </FocusRing>
      );
    }

    if (type === "link") {
      return (
        <FocusRing>
          <a
            css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            ref={ref}
            {...props}
          >
            {children}
          </a>
        </FocusRing>
      );
    }

    return (
      <FocusRing>
        <button
          css={[transparent ? STYLES_BUTTON_SECONDARY_TRANSPARENT : STYLES_BUTTON_SECONDARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </FocusRing>
    );
  }
);

export const ButtonSecondaryFull = (props) => {
  return (
    <FocusRing>
      <ButtonSecondary full {...props} />
    </FocusRing>
  );
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
        <FocusRing>
          <button
            css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            <LoaderSpinner style={{ height: 16, width: 16 }} />
          </button>
        </FocusRing>
      );
    }

    if (type === "label") {
      return (
        <FocusRing>
          <label
            css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            ref={ref}
            {...props}
          >
            {children}
          </label>
        </FocusRing>
      );
    }

    if (type === "link") {
      return (
        <FocusRing>
          <a
            css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            ref={ref}
            {...props}
          >
            {children}
          </a>
        </FocusRing>
      );
    }

    return (
      <FocusRing>
        <button
          css={[transparent ? STYLES_BUTTON_TERTIARY_TRANSPARENT : STYLES_BUTTON_TERTIARY, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </FocusRing>
    );
  }
);

export const ButtonTertiaryFull = React.forwardRef((props, ref) => {
  return (
    <FocusRing>
      <ButtonTertiary full {...props} ref={ref} />
    </FocusRing>
  );
});

const STYLES_BUTTON_DISABLED = css`
  ${STYLES_BUTTON}
  cursor: not-allowed;
  background-color: ${Constants.system.white};
  color: ${Constants.semantic.textGrayLight};
  box-shadow: 0 0 0 1px ${Constants.semantic.bgGrayLight} inset;
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
      <FocusRing>
        <button
          css={[
            props.transparent ? STYLES_BUTTON_DISABLED_TRANSPARENT : STYLES_BUTTON_DISABLED,
            css,
          ]}
          type={label}
          style={{ width: full ? "100%" : "auto", ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </FocusRing>
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
        <FocusRing>
          <button
            css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            <LoaderSpinner style={{ height: 16, width: 16, color: Constants.system.white }} />
          </button>
        </FocusRing>
      );
    }

    if (type === "label") {
      return (
        <FocusRing>
          <label
            css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={label}
            ref={ref}
            {...props}
          >
            {children}
          </label>
        </FocusRing>
      );
    }

    if (disabled) {
      return (
        <FocusRing>
          <button
            css={[STYLES_BUTTON_WARNING_DISABLED, css]}
            style={{ width: full ? "100%" : "auto", ...style }}
            type={type}
            ref={ref}
            {...props}
          >
            {children}
          </button>
        </FocusRing>
      );
    }

    return (
      <FocusRing>
        <button
          css={[transparent ? STYLES_BUTTON_WARNING_TRANSPARENT : STYLES_BUTTON_WARNING, css]}
          style={{ width: full ? "100%" : "auto", ...style }}
          type={type}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </FocusRing>
    );
  }
);

export const ButtonWarningFull = React.forwardRef((props, ref) => {
  return (
    <FocusRing>
      <ButtonWarning full ref={ref} {...props} />
    </FocusRing>
  );
});
