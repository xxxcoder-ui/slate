import * as React from "react";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as Utilities from "~/common/utilities";
import * as Logging from "~/common/logging";

const AUTH_STATE_GRAPH = {
  initial: {
    SIGNIN: "signin",
    SIGNUP: "signup",
    SIGNUP_WITH_TWITTER: "twitter_signup",
  },
  signin: {
    BACK: "initial",
    RESET_PASSWORD: "password_reset",
  },
  signup: {},
  twitter_signup: {
    LINK_EXISTING_ACCOUNT: "twitter_linking",
  },
  twitter_linking: {},
  password_reset: { BACK: "signin" },
};

const reducer = (state, { event, context }) => {
  const { scene, context: prevContext } = state;
  const nextScene = AUTH_STATE_GRAPH[scene][event];
  return {
    context: { ...prevContext, ...context },
    scene: nextScene !== undefined ? nextScene : scene,
  };
};

// NOTE(amine): handles switching between signup/signin states
export const useAuthFlow = () => {
  const [state, send] = React.useReducer(reducer, { scene: "initial", context: {} });
  const prevScene = React.useRef("initial");
  const handlers = React.useMemo(
    () => ({
      goToSigninScene: ({ emailOrUsername, message = "" }) =>
        send({ event: "SIGNIN", context: { emailOrUsername, message } }),
      goToSignupScene: ({ email }) => send({ event: "SIGNUP", context: { email } }),
      goToTwitterSignupScene: ({ twitterEmail }) =>
        send({ event: "SIGNUP_WITH_TWITTER", context: { twitterEmail } }),
      goToResetPassword: () => send({ event: "RESET_PASSWORD" }),
      goToTwitterLinkingScene: () => send({ event: "LINK_EXISTING_ACCOUNT" }),
      goBack: () => send({ event: "BACK" }),
      clearMessages: () => send({ ...state, context: { ...state.context, message: "" } }),
    }),
    []
  );

  React.useEffect(() => {
    prevScene.current = state.scene;
  }, [state.scene]);

  return { ...handlers, ...state, prevScene: prevScene.current };
};

export const useSignin = ({ onAuthenticate }) => {
  const verificationToken = React.useRef();
  const credentialsRef = React.useRef({ username: "", password: "" });

  const signin = async ({ username, password }) => {
    const response = await Actions.getUserVersion({ username });
    if (Events.hasError(response)) return;

    // NOTE(amine): handling client hash if the user is v2
    let hashedPassword = await Utilities.encryptPasswordClient(password);

    credentialsRef.current = { username, password: hashedPassword };

    //NOTE(amine): the onAuthenticate function will return early
    //             if there is shouldMigrate in the response payload
    const passwordSentToServer = response?.data?.version === 1 ? password : hashedPassword;
    const authResponse = await onAuthenticate({
      username: username.toLowerCase(),
      password: passwordSentToServer,
    });

    if (authResponse.shouldMigrate) return authResponse;
  };

  const createVerification = async (data) => {
    const response = await Actions.createLegacyVerification({
      ...credentialsRef.current,
      ...data,
    });
    if (Events.hasError(response)) {
      return;
    }
    verificationToken.current = response.token;
    return response;
  };

  const migrateAccount = async ({ pin }) => {
    const response = await Actions.migrateUser({ token: verificationToken.current, pin });
    if (Events.hasError(response)) return;
    const authResponse = await onAuthenticate(credentialsRef.current);
    if (Events.hasError(authResponse)) return;
  };

  const resendVerification = async () => {
    const response = await Actions.resendVerification({
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
  };

  return { signin, createVerification, migrateAccount, resendVerification };
};

export const usePasswordReset = ({ onAuthenticate }) => {
  const verificationToken = React.useRef();
  const emailRef = React.useRef();

  const createVerification = async ({ email }) => {
    const response = await Actions.createPasswordResetVerification({ email });
    if (Events.hasError(response)) return;

    emailRef.current = email;
    verificationToken.current = response.token;
    return response;
  };

  const verifyEmail = async ({ pin }) => {
    const response = await Actions.verifyPasswordResetEmail({
      pin,
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
    return response;
  };

  const resendVerification = async () => {
    const response = await Actions.resendPasswordResetVerification({
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
  };

  const resetPassword = async ({ password }) => {
    const hashPassword = await Utilities.encryptPasswordClient(password);
    const response = await Actions.resetPassword({
      password: hashPassword,
      token: verificationToken.current,
    });

    if (Events.hasError(response)) {
      return;
    }

    await onAuthenticate({ username: emailRef.current, password: hashPassword });
  };

  return { createVerification, resendVerification, verifyEmail, resetPassword };
};

export const useSignup = ({ onAuthenticate }) => {
  const verificationToken = React.useRef();

  const createVerification = async (data) => {
    const response = await Actions.createVerification(data);
    if (Events.hasError(response)) {
      return;
    }
    verificationToken.current = response.token;
    return response;
  };

  const verifyEmail = async ({ pin }) => {
    const response = await Actions.verifyEmail({ pin, token: verificationToken.current });
    if (Events.hasError(response)) {
      return;
    }
    return response;
  };

  const createUser = async ({ username, password }) => {
    const hashPassword = await Utilities.encryptPasswordClient(password);

    const response = await Actions.createUser({
      username,
      password: hashPassword,
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
    const authResponse = await onAuthenticate({ username, password: hashPassword });
    if (Events.hasError(authResponse)) return;
    return authResponse;
  };

  const resendVerification = async () => {
    const response = await Actions.resendVerification({
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
  };

  return { createVerification, verifyEmail, createUser, resendVerification };
};

export const useTwitter = ({ onAuthenticate, onTwitterAuthenticate, goToTwitterSignupScene }) => {
  const verificationToken = React.useRef();
  const credentialsRef = React.useRef();
  const popupRef = React.useRef();

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // NOTE(amine): will be used when signing up a user via twitter
  const twitterTokens = React.useRef({
    authToken: "",
    authVerifier: "",
  });

  const openPopup = () => {
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    popupRef.current = window.open(
      "",
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
        } catch (e) {
          Logging.error(e);
        }
      }, 500);
    });

  const signin = async () => {
    setIsLoggingIn(true);
    openPopup();
    const popup = popupRef.current;
    try {
      const { authToken } = await Actions.requestTwitterToken();
      popup.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${authToken}`;
      const responseVerifier = await _getAuthTokenAndVerifier();
      if (Events.hasError(responseVerifier)) {
        return;
      }

      // NOTE(amine): update tokens
      twitterTokens.current = {
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
        await onTwitterAuthenticate(response);
        setIsLoggingIn(false);
        return;
      }
      setIsLoggingIn(false);
      goToTwitterSignupScene({ twitterEmail: response.email });
    } catch (e) {
      // TODO failure
      Logging.error("error", e);
      if (popup) popup.close();
      setIsLoggingIn(false);
    }
  };

  const linkAccount = async ({ username, password }) => {
    const { authToken } = twitterTokens.current;
    credentialsRef.current = { username, password };

    const userVersionResponse = await Actions.getUserVersion({ username });
    if (Events.hasError(userVersionResponse)) return;

    let hashedPassword;
    if (userVersionResponse?.data?.version === 2) {
      hashedPassword = await Utilities.encryptPasswordClient(password);
    } else {
      hashedPassword = password;
    }
    // NOTE(amine): handling client hash if the user is v2

    const response = await Actions.linkTwitterAccount({
      username,
      password: hashedPassword,
      token: authToken,
    });

    if (response.shouldMigrate) {
      return response;
    }

    if (Events.hasError(response)) {
      return;
    }

    const authResponse = await onAuthenticate({ username, password: hashedPassword });
    if (Events.hasError(authResponse)) {
      return;
    }
  };

  const linkAccountWithVerification = async ({ pin }) => {
    const { username, password } = credentialsRef.current;

    const userVersionResponse = await Actions.getUserVersion({ username });
    if (Events.hasError(userVersionResponse)) return;

    let hashedPassword;
    if (userVersionResponse?.data?.version === 2) {
      hashedPassword = await Utilities.encryptPasswordClient(password);
    } else {
      hashedPassword = password;
    }

    // NOTE(amine): handling client hash if the user is v2
    const response = await Actions.linkTwitterAccountWithVerification({
      username,
      password: hashedPassword,
      token: verificationToken.current,
      pin,
    });

    if (Events.hasError(response)) {
      return;
    }

    const authResponse = await onAuthenticate({ username, password: hashedPassword });
    if (Events.hasError(authResponse)) {
      return;
    }
  };

  const signup = async ({ email = "", username = "" }) => {
    const { authToken } = twitterTokens.current;
    const response = await Actions.createUserViaTwitter({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      authToken,
    });
    if (Events.hasError(response)) return;
    if (response.token) {
      await onTwitterAuthenticate(response);
      return;
    }
    return response;
  };

  const signupWithVerification = async ({ username = "", pin }) => {
    const response = await Actions.createUserViaTwitterWithVerification({
      username: username.toLowerCase(),
      pin,
      token: verificationToken.current,
    });

    if (Events.hasError(response)) return;
    if (response.token) {
      await onTwitterAuthenticate(response);
      return;
    }
    return response;
  };

  const createVerification = async (data) => {
    const response = await Actions.createTwitterEmailVerification({
      ...data,
      twitterToken: twitterTokens.current.authToken,
    });
    if (Events.hasError(response)) {
      return;
    }
    verificationToken.current = response.token;
    return response;
  };

  const resendVerification = async ({ email }) => {
    const response = await Actions.resendVerification({
      email,
      token: verificationToken.current,
    });
    if (Events.hasError(response)) {
      return;
    }
  };

  return {
    isLoggingIn,
    signin,
    linkAccount,
    linkAccountWithVerification,
    signup,
    signupWithVerification,
    createVerification,
    resendVerification,
  };
};
