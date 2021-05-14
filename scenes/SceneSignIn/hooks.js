import * as React from "react";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

const AUTH_STATE_GRAPH = {
  initial: {
    SIGNIN: "signin",
    SIGNUP: "signup",
    SIGNUP_WITH_TWITTER: "twitter_signup",
  },
  signin: {},
  signup: {},
  twitter_signup: {},
};

const reducer = (state, { event, context }) => {
  const { scene, context: prevContext } = state;
  const nextScene = AUTH_STATE_GRAPH[scene][event];
  return {
    context: { ...prevContext, ...context },
    scene: nextScene !== undefined ? nextScene : scene,
  };
};

export const useAuthFlow = () => {
  const [state, send] = React.useReducer(reducer, { scene: "initial", context: {} });
  const handlers = React.useMemo(
    () => ({
      goToSigninScene: ({ emailOrUsername }) =>
        send({ event: "SIGNIN", context: { emailOrUsername } }),
      goToSignupScene: ({ email }) => send({ event: "SIGNUP", context: { email } }),
      goToTwitterSignupScene: ({ twitterEmail }) =>
        send({ event: "SIGNUP_WITH_TWITTER", context: { twitterEmail } }),
    }),
    []
  );
  return { ...handlers, ...state };
};

export const useTwitter = ({ onAuthenticate, goToTwitterSignupScene }) => {
  const popupRef = React.useRef();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // NOTE(amine): will be used when signing up a user via twitter
  const tokens = React.useRef({
    authToken: "",
    authVerifier: "",
  });

  const openPopup = (authToken) => {
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    popupRef.current = window.open(
      `https://api.twitter.com/oauth/authenticate?oauth_token=${authToken}`,
      "popup",
      ` width=${width},height=${height},left=${left},top=${top},toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`
    );
  };

  const _getAuthTokenAndVerifier = () =>
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
              if (popup) closeDialog();
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
      const responseVerifier = await _getAuthTokenAndVerifier();
      if (Events.hasError(responseVerifier)) {
        return;
      }

      // NOTE(amine): update tokens
      tokens.current = {
        authToken: responseVerifier.authToken,
        authVerifier: responseVerifier.authVerifier,
      };
      const response = await Actions.authenticateViaTwitter({
        authToken: responseVerifier.authToken,
        authVerifier: responseVerifier.authVerifier,
      });

      if (Events.hasError(response)) {
        setIsLoggingIn(false);
        return;
      }

      if (response.token) {
        await onAuthenticate(response);
        setIsLoggingIn(false);
        return;
      }
      setIsLoggingIn(false);
      goToTwitterSignupScene({ twitterEmail: response.email });
    } catch (e) {
      // TODO failure
      console.log("error", e);
      popupRef.current.close();
      setIsLoggingIn(false);
    }
  };

  const signup = async ({ email = "", username = "" }) => {
    const { authToken, authVerifier } = tokens.current;
    const response = await Actions.createUserViaTwitter({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      authToken,
      authVerifier,
    });
    if (Events.hasError(response)) return;
    if (response.token) {
      await onAuthenticate(response);
      return;
    }
    return response;
  };

  // TODO
  const signupWithValidations = () => {};

  return { isLoggingIn, signin, signup };
};
