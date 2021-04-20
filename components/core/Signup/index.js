import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

import { useAuth } from "./hooks";
import { Initial, SignUpPopover } from "./components";

const STYLES_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  text-align: center;
  color: ${theme.system.textGrayDark};
  max-width: 228px;
  margin: 0 auto;
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

const STYLES_SMALL_DESCRIPTION = (theme) => css`
  font-size: ${theme.typescale.lvl0};
  color: ${theme.system.textGrayDark};
`;

export default function Signup() {
  const { currentState, send } = useAuth();

  if (currentState === "initial") {
    return (
      <Initial
        onTwitterSignin={() => send("SIGNIN_WITH_TWITTER")}
        onSignin={() => send("SIGNIN")}
        onTwitterSignup={() => send("SIGNUP_WITH_TWITTER")}
        onVerify={() => send("VERIFY_EMAIL")}
      />
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
    return <SignUpPopover title="Sign up for Slate"></SignUpPopover>;
  }
  if (currentState === "verification") {
    return (
      <SignUpPopover
        logoStyle={{ width: 56 }}
        title={
          <>
            Verification link sent,
            <br />
            please check your inbox.
          </>
        }
      >
        <System.Input
          autoFocus
          label="Input 6 digits code"
          icon={SVG.NavigationArrow}
          containerStyle={{ marginTop: "28px" }}
          name="email"
          type="email"
          onSubmit={() => {
            //TODO
            send("CONTINUE_EMAIL_SIGNUP");
          }}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.P css={STYLES_SMALL_DESCRIPTION} style={{ marginTop: 8 }}>
          Didn’t receive an email? Resend code.
        </System.P>
      </SignUpPopover>
    );
  }
  if (currentState === "email_signup")
    return (
      <SignUpPopover title="Create an account">
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 46 }}
          placeholder="username"
          name="username"
          type="username"
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
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
