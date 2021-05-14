import * as React from "react";
import * as UserBehaviors from "~/common/user-behaviors";

import { css } from "@emotion/react";
import { Initial, Signin, Signup, TwitterSignup } from "~/components/core/Signup";

import { useAuthFlow, useTwitter } from "./hooks";

const background_image =
  "https://slate.textile.io/ipfs/bafybeiddgkvf5ta6y5b7wamrxl33mtst4detegleblw4gfduhwm3sdwdra";

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 1rem;

  min-height: 100vh;
  width: 100vw;
  position: absolute;
  overflow: hidden;
  background-image: url(${background_image});
  background-repeat: no-repeat;
  background-size: cover;
`;

const STYLES_MIDDLE = css`
  position: relative;
  min-height: 10%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: left;
  padding: 24px;
`;

const SigninScene = ({ withAuthenticationBehavior, ...props }) => {
  const {
    goToSigninScene,
    goToSignupScene,
    goToTwitterSignupScene,
    scene,
    context,
  } = useAuthFlow();

  const handleAuthenticate = withAuthenticationBehavior(UserBehaviors.authenticate);
  const handleAuthenticateViaTwitter = withAuthenticationBehavior(
    UserBehaviors.authenticateViaTwitter
  );

  const twitterProvider = useTwitter({
    onAuthenticate: handleAuthenticateViaTwitter,
    goToTwitterSignupScene,
  });

  if (scene === "signin")
    return (
      <Signin
        {...props}
        onAuthenticate={handleAuthenticate}
        emailOrUsername={context.emailOrUsername}
      />
    );
  if (scene === "signup") return <Signup initialEmail={context.email} />;
  if (scene === "twitter_signup")
    return <TwitterSignup initialEmail={context.twitterEmail} onSignup={twitterProvider.signup} />;

  return (
    <Initial
      isSigninViaTwitter={twitterProvider.isLoggingIn}
      onTwitterSignin={twitterProvider.signin}
      goToSigninScene={goToSigninScene}
      goToSignupScene={goToSignupScene}
    />
  );
};

const WithCustomWrapper = (Component) => (props) => (
  <div css={STYLES_ROOT}>
    <div css={STYLES_MIDDLE}>
      <Component {...props} />
    </div>
  </div>
);

export default WithCustomWrapper(SigninScene);
