import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Actions from "~/common/actions";

import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";

import { Toggle, SignUpPopover } from "./components";

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

const useToggler = () => {
  const TOGGLE_OPTIONS = [
    { value: "signin", label: "Sign in" },
    { value: "signup", label: "Sign up" },
  ];
  const [state, setState] = React.useState("signin");
  const handleToggleChange = (value) => setState(value);
  return { toggleValue: state, handleToggleChange, TOGGLE_OPTIONS };
};

const useUsernameField = ({ onSubmit }) => {
  const [username, setUsername] = React.useState("");
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const getUserNameFieldProps = () => ({
    value: username,
    onChange: handleUsernameChange,
    onSubmit: () => onSubmit({ emailOrUsername: username }),
  });
  return { getUserNameFieldProps };
};

const useTwitter = ({ onTwitterAuthenticate }) => {
  const popupRef = React.useRef();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const openPopup = (authToken) => {
    popupRef.current = window.open(
      `https://api.twitter.com/oauth/authenticate?oauth_token=${authToken}`,
      "popup",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500,height:500"
    );
  };

  const getAuthTokenAndVerifier = () =>
    new Promise((resolve, reject) => {
      const popup = popupRef.current;
      const interval = setInterval(() => {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(interval);
          // TODO failure
          reject("getAuthTokenAndVerifier Error 1");
        }

        const closeDialog = () => {
          clearInterval(interval);
          popup.close();
        };
        try {
          if (
            !popup.location.hostname.includes("api.twitter.com") &&
            !popup.location.hostname == ""
          ) {
            if (popup.location.search) {
              const query = new URLSearchParams(popup.location.search);

              const authToken = query.get("oauth_token");
              const authVerifier = query.get("oauth_verifier");
              closeDialog();
              resolve({ authToken, authVerifier });
            } else {
              closeDialog();
              // TODO: failure
              reject("getAuthTokenAndVerifier Error 2");
            }
          }
        } catch (e) {}
      }, 500);
    });

  const signin = async () => {
    setIsLoggingIn(true);
    try {
      const { authToken } = await Actions.requestTwitterToken();
      openPopup(authToken);
      const { authToken: auth_token, authVerifier } = await getAuthTokenAndVerifier();
      const response = await Actions.authenticateViaTwitter({
        authToken: auth_token,
        authVerifier,
      });

      if (response.token) await onTwitterAuthenticate(response);

      setIsLoggingIn(false);
    } catch (e) {
      // TODO failure
      console.log("error", e);
      popupRef.current.close();
      setIsLoggingIn(false);
    }
  };

  return { isLoggingIn, signin };
};

export default function Initial({
  goToSigninScene,
  goToSignupScene,
  goToTwitterSignupScene,
  onTwitterAuthenticate,
}) {
  const { getFieldProps, getFormProps, isSubmitting: isCheckingEmail } = useForm({
    initialValues: { email: "" },
    onSubmit: async ({ email }) => {
      const response = await Actions.checkEmail({ email });
      if (response?.data?.email) {
        goToSigninScene({ emailOrUsername: email });
        return;
      }
      goToSignupScene({ email });
    },
  });
  const { getUserNameFieldProps } = useUsernameField({
    onSubmit: ({ emailOrUsername }) => goToSigninScene({ emailOrUsername }),
  });

  const { TOGGLE_OPTIONS, toggleValue, handleToggleChange } = useToggler();

  const { signin, isLoggingIn } = useTwitter({ onTwitterAuthenticate });

  return (
    <SignUpPopover
      title={
        <>
          Discover, experience, share files on <br /> Slate
        </>
      }
      style={{ paddingBottom: 24 }}
    >
      <div css={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Toggle options={TOGGLE_OPTIONS} onChange={handleToggleChange} />
      </div>
      {toggleValue === "signin" ? (
        <>
          <System.ButtonPrimary
            full
            style={{ backgroundColor: "rgb(29,161,242)", marginTop: "20px" }}
            onClick={signin}
            loading={isLoggingIn}
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
            name="email"
            type="text"
            {...getUserNameFieldProps()}
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
            onClick={signin}
            loading={isLoggingIn}
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

            <System.ButtonPrimary
              full
              type="submit"
              style={{ marginTop: "16px" }}
              loading={isCheckingEmail}
            >
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