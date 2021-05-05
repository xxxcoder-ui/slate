import * as React from "react";

import { Initial, Signin, Signup, TwitterSignup } from "./components";

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
const useAuthFlow = () => {
  const [state, send] = React.useReducer(reducer, { scene: "initial", context: {} });
  const handlers = React.useMemo(
    () => ({
      goToSigninScene: ({ emailOrUsername }) =>
        send({ event: "SIGNIN", context: { emailOrUsername } }),
      goToSignupScene: ({ email }) => send({ event: "SIGNUP", context: { email } }),
      goToTwitterSignupScene: ({}) => send({ event: "SIGNUP_WITH_TWITTER" }),
    }),
    []
  );
  return { ...handlers, ...state };
};

export default function AuthFlow() {
  const {
    goToSigninScene,
    goToSignupScene,
    goToTwitterSignupScene,
    scene,
    context,
  } = useAuthFlow();

  if (scene === "signin") return <Signin emailOrUsername={context.emailOrUsername} />;
  if (scene === "signup") return <Signup email={context.email} />;
  if (scene === "twitter_signup") return <TwitterSignup />;

  return (
    <Initial
      goToSigninScene={goToSigninScene}
      goToSignupScene={goToSignupScene}
      goToTwitterSignupScene={goToTwitterSignupScene}
    />
  );
}
