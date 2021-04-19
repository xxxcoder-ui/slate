import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

import { Toggle, Devider, SignUpPopover } from "./";

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

const STYLES_TYPOGRAPHY_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvl0};
`;

const STYLES_TERMS_AND_SERVICES = (theme) => css`
  padding: 16px 0px;
  max-width: 228px;
  text-align: center;
  margin: 16px auto 0px;
  a {
    color: ${theme.system.blue} !important;
  }
`;

export default function Initial({ onTwitterSignin, onSignin, onTwitterSignup, onVerify }) {
  const TOGGLE_OPTIONS = [
    { value: "signin", label: "Sign in" },
    { value: "signup", label: "Sign up" },
  ];
  const [state, setState] = React.useState("signin");
  const handleToggleChange = (value) => setState(value);
  return (
    <div>
      <SignUpPopover
        title="Discover, experience, share files on Slate"
        style={{ paddingBottom: 24 }}
      >
        <div css={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Toggle options={TOGGLE_OPTIONS} onChange={handleToggleChange} />
        </div>
        {state === "signin" ? (
          <>
            <System.ButtonPrimary
              onClick={onTwitterSignin}
              full
              style={{ backgroundColor: "rgb(29,161,242)", marginTop: "20px" }}
            >
              Continue with Twitter
            </System.ButtonPrimary>
            <Devider
              color="#AEAEB2"
              width="45px"
              height="0.5px"
              style={{ margin: "0px auto", marginTop: "20px" }}
            />
            <System.Input
              autoFocus
              label="Email address or username"
              placeholder="email"
              icon={SVG.NavigationArrow}
              containerStyle={{ marginTop: "4px" }}
              name="email"
              onSubmit={onSignin}
              type="email"
              style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
            />

            <div style={{ marginTop: "auto" }}>
              <a css={STYLES_LINK_ITEM} href="/terms" target="_blank">
                ⭢ Terms of service
              </a>

              <a css={STYLES_LINK_ITEM} href="/guidelines" target="_blank">
                ⭢ Community guidelines
              </a>
            </div>
          </>
        ) : (
          <>
            <System.ButtonPrimary
              full
              style={{ backgroundColor: "rgb(29,161,242)", marginTop: 20 }}
              onClick={onTwitterSignup}
            >
              Continue with Twitter
            </System.ButtonPrimary>
            <Devider
              color="#AEAEB2"
              width="45px"
              height="0.5px"
              style={{ margin: "20px auto 0px auto" }}
            />
            <System.Input
              autoFocus
              label="Sign up with email"
              placeholder="email"
              name="email"
              type="email"
              style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
            />
            <System.ButtonPrimary full style={{ marginTop: "16px" }} onClick={onVerify}>
              Send verification link
            </System.ButtonPrimary>
            <div css={STYLES_TERMS_AND_SERVICES}>
              <span>
                <System.P css={STYLES_TYPOGRAPHY_SMALL}>
                  By continuing, you’re agree to our{" "}
                  <a href="/terms" target="_blank">
                    terms of services
                  </a>
                  .
                </System.P>
              </span>
            </div>
          </>
        )}
      </SignUpPopover>
    </div>
  );
}
