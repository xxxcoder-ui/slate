import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { Symbol } from "~/common/logo";
import { css } from "@emotion/react";

import { useAuth } from "./hooks";

const STYLES_POPOVER = css`
  box-sizing: border-box;
  max-width: 432px;
  height: 528px;
  width: 95vw;
  border-radius: 8px;
  padding: 36px 32px;

  background: radial-gradient(
    80.79% 80.79% at 50% 50%,
    rgba(242, 242, 247, 0.5) 0%,
    rgba(242, 242, 247, 0) 100%
  );
  /* background-blur */

  backdrop-filter: blur(75px);

  @keyframes authentication-popover-fade-in {
    from {
      transform: translateY(-8px);
      opacity: 0;
    }

    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  animation: authentication-popover-fade-in 400ms ease;
`;

const STYLES_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  text-align: center;
  color: ${theme.system.textGrayDark};
  max-width: 228px;
  margin: 0 auto;
`;

const STYLES_LINK_ITEM = (theme) => css`
  display: block;
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
  font-family: ${theme.font.medium};
  user-select: none;
  cursor: pointer;
  margin-top: 2px;
  color: ${theme.system.black};
  transition: 200ms ease all;
  word-wrap: break-word;

  :visited {
    color: ${theme.system.black};
  }

  :hover {
    color: ${theme.system.brand};
  }
`;

const STYLES_LINK = (theme) => css`
  font-family: ${theme.font.text};
  color: ${theme.system.blue};
  font-size: ${theme.typescale.lvl0};
  text-align: center;
  a:hover {
    cursor: pointer;
  }
`;

const STYLES_TYPOGRAPHY_SMALL = (theme) => css`
  font-family: ${theme.font.medium};
  font-size: ${theme.typescale.lvl0};
  a {
    font-family: ${theme.font.semiBold};
    color: ${theme.system.black};
  }
`;

const STYLES_TERMS_AND_SERVICES = (theme) => css`
  padding: 16px 0px;
  max-width: 228px;
  text-align: center;
  margin: 16px auto 0px;
  a {
    color: ${theme.system.blue};
  }
`;

const Devider = ({ width = "100%", height = "1px", color, ...props }) => (
  <div
    css={(theme) => ({
      height,
      width,
      backgroundColor: theme.system?.[color] || color,
    })}
    {...props}
  />
);

const SignUpPopover = ({ children, title, logoStyle, titleStyle, props }) => {
  return (
    <div css={STYLES_POPOVER} {...props}>
      <div style={{ textAlign: "center" }}>
        <Symbol style={{ width: "40px", marginBottom: "8px", ...logoStyle }} />
      </div>
      <System.H3 style={{ textAlign: "center", lineHeight: "30px", ...titleStyle }}>
        {title}{" "}
      </System.H3>
      {children}
    </div>
  );
};

export default function Signup() {
  const { currentState, send } = useAuth();
  if (currentState === "initial") {
    return (
      <SignUpPopover title="Discover, experience, share files on Slate">
        <System.Input
          autoFocus
          label="Email address or username"
          containerStyle={{ marginTop: 41 }}
          placeholder="email"
          icon={SVG.NavigationArrow}
          name="email"
          onSubmit={() => {
            send("SIGNIN");
          }}
          type="email"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary
          onClick={() => send("SIGNIN_WITH_TWITTER")}
          full
          style={{ backgroundColor: "rgb(29,161,242)", marginTop: "32px" }}
        >
          Sign in with Twitter
        </System.ButtonPrimary>
        <Devider color="#AEAEB2" width="45px" height="0.5px" style={{ margin: "16px auto" }} />
        <System.ButtonSecondary
          onClick={() => {
            send("SIGNUP");
          }}
          full
        >
          Sign up
        </System.ButtonSecondary>
        <div style={{ marginTop: 48 }}>
          <a css={STYLES_LINK_ITEM} href="/terms" target="_blank">
            ⭢ Terms of service
          </a>

          <a css={STYLES_LINK_ITEM} href="/guidelines" target="_blank">
            ⭢ Community guidelines
          </a>
        </div>
      </SignUpPopover>
    );
  }

  if (currentState === "signin") {
    return (
      <SignUpPopover title="Discover, experience, share files on Slate">
        <System.Input
          autoFocus
          label="Email address or username"
          containerStyle={{ marginTop: 41 }}
          placeholder="username"
          name="username"
          type="username"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          label="Password"
          containerStyle={{ marginTop: 16 }}
          placeholder="password"
          name="password"
          type="password"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary full style={{ marginTop: 16 }}>
          Sign in
        </System.ButtonPrimary>
        <div css={STYLES_LINK} style={{ marginTop: 16 }}>
          <a onClick={() => send("MAGIC_LINK")}>Password too long? Use sign in link</a>
        </div>
      </SignUpPopover>
    );
  }
  if (currentState === "magic_signin") {
    return (
      <SignUpPopover
        logoStyle={{ width: 56 }}
        title={
          <>
            Sign in link sent, <br /> please check your inbox.
          </>
        }
      >
        <System.P css={[STYLES_SMALL, { textAlign: "center", marginTop: 28 }]}>
          Didn’t receive an email?
        </System.P>
        <System.ButtonDisabled full disabled style={{ marginTop: 12 }}>
          Resend Link (23s)
        </System.ButtonDisabled>
      </SignUpPopover>
    );
  }

  if (currentState === "signup") {
    return (
      <SignUpPopover title="Sign up for Slate">
        <System.ButtonPrimary
          full
          style={{ backgroundColor: "rgb(29,161,242)", marginTop: "54px" }}
          onClick={() => {
            send("SIGNUP_WITH_TWITTER");
          }}
        >
          Sign up with Twitter
        </System.ButtonPrimary>
        <Devider color="#AEAEB2" width="45px" height="0.5px" style={{ margin: "16px auto" }} />
        <System.Input
          autoFocus
          label="Sign up with email"
          placeholder="email"
          name="email"
          type="email"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary
          full
          style={{ marginTop: "16px" }}
          onClick={() => {
            send("VERIFY");
          }}
        >
          Send verification link
        </System.ButtonPrimary>
        <div css={STYLES_TERMS_AND_SERVICES}>
          <span>
            <System.P>
              By continuing, you’re agree to our{" "}
              <a href="/terms" target="_blank">
                terms of services
              </a>
              .
            </System.P>
          </span>
        </div>
        <System.P css={STYLES_TYPOGRAPHY_SMALL} style={{ marginTop: 16 }}>
          ⭢ Already have an account? <a onClick={() => send("SIGNIN")}>Sign in</a>
        </System.P>
      </SignUpPopover>
    );
  }
  if (currentState === "verification") {
    return (
      <SignUpPopover
        logoStyle={{ width: 56 }}
        title="Verification link sent,please check your inbox."
      >
        <System.P css={[STYLES_SMALL, { textAlign: "center", marginTop: 28 }]}>
          Didn’t receive an email?
        </System.P>
        <System.ButtonDisabled full disabled style={{ marginTop: 12 }}>
          Resend Link (23s)
        </System.ButtonDisabled>
      </SignUpPopover>
    );
  }
  if (currentState === "email_signup")
    return (
      <SignUpPopover title="Create an account">
        <System.Input
          autoFocus
          label="Username"
          containerStyle={{ marginTop: 41 }}
          placeholder="username"
          name="username"
          type="username"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          label="Password"
          containerStyle={{ marginTop: 16 }}
          placeholder="password"
          name="password"
          type="password"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary full style={{ marginTop: 16 }}>
          Create account
        </System.ButtonPrimary>
      </SignUpPopover>
    );

  if (currentState === "social_signup") {
    return (
      <SignUpPopover title="Create an account">
        <System.Input
          autoFocus
          label="Username"
          containerStyle={{ marginTop: 41 }}
          placeholder="username"
          name="username"
          type="username"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          label="Email address"
          containerStyle={{ marginTop: 16 }}
          placeholder="email"
          name="email"
          type="email"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary
          full
          style={{ marginTop: 16 }}
          onClick={() => {
            send("VERIFY");
          }}
        >
          Create account
        </System.ButtonPrimary>
        <System.P css={STYLES_SMALL} style={{ marginTop: 16 }}>
          You will receive an email verification link when you create account.
        </System.P>
      </SignUpPopover>
    );
  }

  return <div>signed in</div>;
}
