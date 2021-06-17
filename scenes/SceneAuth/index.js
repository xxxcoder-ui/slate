import * as React from "react";
import * as UserBehaviors from "~/common/user-behaviors";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

import { css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import { Initial, Signin, Signup, TwitterSignup, ResetPassword } from "~/components/core/Auth";

import {
  useAuthFlow,
  useTwitter,
  useSignup,
  useSignin,
  usePasswordReset,
} from "~/scenes/SceneAuth/hooks";

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 1rem;

  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
`;

const STYLES_ROOT_BACKGROUND = css`
  position: absolute;
  object-fit: cover;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
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

const AUTH_BACKGROUNDS = [
  "https://slate.textile.io/ipfs/bafybeigostprfkuuvuqlehutki32fnvshm2dyy4abqotmlffsca4f7qs7a",
  "https://slate.textile.io/ipfs/bafybeicmokw3bl5six6u7eflbxcdblpgbx3fat24djrqg6n3hmbleidks4",
  "https://slate.textile.io/ipfs/bafybeibkttaavlkjxgtafqndyrbgvwqcng67zvd4v36w7fvpajwmdgmxcu",
  "https://slate.textile.io/ipfs/bafybeicpk7hkbeqdgbwkx3dltlz3akf3qbjpqgfphbnry4b6txnailtlpq",
  "https://slate.textile.io/ipfs/bafybeibb2xknh3iwwetrro73hw3xfzjgwbi4n4c63wqmwt5hvaloqnh33u",
  "https://slate.textile.io/ipfs/bafybeig4mij32vyda2jbh6zua3r2rkdpby6wtvninwgxvsejjdnls4wpc4",
  "https://slate.textile.io/ipfs/bafybeihmoycn4a6zafd2k3fjcadskrxwvri5cwhabatzbyzteouh3s7igi",
  "https://slate.textile.io/ipfs/bafybeigxssjsv3tmdhz4bj6vl2ca5c6rrhdkepw3mifvlllb7orpx5cfou",
];

const SigninScene = ({ onAuthenticate, onTwitterAuthenticate, page, ...props }) => {
  const {
    goToSigninScene,
    goToSignupScene,
    goToTwitterSignupScene,
    goToResetPassword,
    clearMessages,
    goBack,
    prevScene,
    scene,
    context,
  } = useAuthFlow();

  const signinProvider = useSignin({
    onAuthenticate,
  });
  const twitterProvider = useTwitter({
    onAuthenticate: onTwitterAuthenticate,
    goToTwitterSignupScene,
  });

  const signupProvider = useSignup({ onAuthenticate });

  const passwordResetProvider = usePasswordReset({
    onAuthenticate,
  });

  if (scene === "signin")
    return (
      <Signin
        {...props}
        emailOrUsername={context.emailOrUsername}
        message={context.message}
        signin={signinProvider.signin}
        createVerification={signinProvider.createVerification}
        migrateAccount={signinProvider.migrateAccount}
        resendEmailVerification={signinProvider.resendVerification}
        goToResetPassword={goToResetPassword}
        goBack={goBack}
        clearMessages={clearMessages}
      />
    );

  if (scene === "password_reset") {
    return (
      <ResetPassword
        goBack={goBack}
        createVerification={passwordResetProvider.createVerification}
        verifyEmail={passwordResetProvider.verifyEmail}
        resetPassword={passwordResetProvider.resetPassword}
        resendEmailVerification={passwordResetProvider.resendVerification}
      />
    );
  }

  if (scene === "signup")
    return (
      <Signup
        verifyEmail={signupProvider.verifyEmail}
        resendEmailVerification={signupProvider.resendVerification}
        createUser={signupProvider.createUser}
      />
    );

  if (scene === "twitter_signup")
    return (
      <TwitterSignup
        initialEmail={context.twitterEmail}
        createVerification={twitterProvider.createVerification}
        resendEmailVerification={twitterProvider.resendEmailVerification}
        onSignupWithVerification={twitterProvider.signupWithVerification}
        onSignup={twitterProvider.signup}
      />
    );

  // NOTE(amine): if the user goes back, we should prefill the email
  const initialEmail =
    prevScene === "signin" && context.emailOrUsername ? context.emailOrUsername : "";
  return (
    <Initial
      createVerification={signupProvider.createVerification}
      isSigninViaTwitter={twitterProvider.isLoggingIn}
      onTwitterSignin={twitterProvider.signin}
      initialEmail={initialEmail}
      goToSigninScene={goToSigninScene}
      goToSignupScene={goToSignupScene}
      page={page}
    />
  );
};

const BackgroundRotate = ({ children }) => {
  const [backgroundState, setbackgroundState] = React.useState({
    current: 0,
    next: 1,
  });

  const currentBackground = AUTH_BACKGROUNDS[backgroundState.current];
  const nextBackground = AUTH_BACKGROUNDS[backgroundState.next];

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setbackgroundState((prev) => {
        const { next } = prev;
        const backgroundsTotal = AUTH_BACKGROUNDS.length;
        return { current: next % backgroundsTotal, next: (next + 1) % backgroundsTotal };
      });
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div css={STYLES_ROOT}>
      <div style={{ opacity: 0 }}>
        <img src={nextBackground} alt="background" css={STYLES_ROOT_BACKGROUND} />
      </div>
      <AnimatePresence>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={currentBackground}
          src={currentBackground}
          alt="background"
          css={STYLES_ROOT_BACKGROUND}
        />
      </AnimatePresence>
      {children}
    </div>
  );
};
const WithCustomWrapper = (Component) => (props) => {
  return (
    <WebsitePrototypeWrapper>
      <BackgroundRotate>
        <div css={STYLES_MIDDLE}>
          <Component {...props} />
        </div>
      </BackgroundRotate>
    </WebsitePrototypeWrapper>
  );
};

export default WithCustomWrapper(SigninScene);
