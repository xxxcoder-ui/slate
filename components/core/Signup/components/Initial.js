import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

import { Toggle, SignUpPopover } from "./";
import { useForm } from "../hooks";

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
  margin: 16px auto auto;
  a {
    color: ${theme.system.blue} !important;
  }
`;

export default function Initial({ onTwitterSignin, onSignin, onTwitterSignup, onSignup }) {
  const TOGGLE_OPTIONS = [
    { value: "signin", label: "Sign in" },
    { value: "signup", label: "Sign up" },
  ];
  const [state, setState] = React.useState("signin");
  const handleToggleChange = (value) => setState(value);

  const { getFieldProps, getFormProps } = useForm({
    initialValues: { email: "" },
    onSubmit: ({ email }) => onSignup({ emailToVerify: email }),
  });

  const [username, setUsername] = React.useState("");
  const handleUsernameChange = (e) => setUsername(e.target.value);
  return (
    <SignUpPopover title="Discover, experience, share files on Slate" style={{ paddingBottom: 24 }}>
      <div css={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
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
          <System.Devider
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
            value={username}
            onChange={handleUsernameChange}
            onSubmit={() => onSignin({ emailOrUsername: username })}
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
          <System.Devider
            color="#AEAEB2"
            width="45px"
            height="0.5px"
            style={{ margin: "20px auto 0px auto" }}
          />
          <form {...getFormProps()}>
            <System.Input
              required
              autoFocus
              label="Sign up with email"
              placeholder="email"
              type="email"
              style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
              {...getFieldProps("email")}
            />

            <System.ButtonPrimary full type="submit" style={{ marginTop: "16px" }}>
              Send verification link
            </System.ButtonPrimary>
          </form>
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
  );
}
