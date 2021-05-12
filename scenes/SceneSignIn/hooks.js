import * as React from "react";

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
