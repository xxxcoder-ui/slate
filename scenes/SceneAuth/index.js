import * as React from "react";
import * as Utilities from "common/utilities";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

import { css } from "@emotion/react";
import {
  Initial,
  Signin,
  Signup,
  TwitterSignup,
  TwitterLinking,
  ResetPassword,
} from "~/components/core/Auth";

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

  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
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
    goToTwitterLinkingScene,
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
    onTwitterAuthenticate: onTwitterAuthenticate,
    onAuthenticate,
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
        resendEmailVerification={twitterProvider.resendVerification}
        goToTwitterLinkingScene={goToTwitterLinkingScene}
        onSignupWithVerification={twitterProvider.signupWithVerification}
        onSignup={twitterProvider.signup}
      />
    );

  if (scene === "twitter_linking") {
    return (
      <TwitterLinking
        linkAccount={twitterProvider.linkAccount}
        linkAccountWithVerification={twitterProvider.linkAccountWithVerification}
        resendEmailVerification={twitterProvider.resendVerification}
        createVerification={twitterProvider.createVerification}
      />
    );
  }
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
const BackgroundGenerator = ({ children, ...props }) => {
  const background = React.useMemo(() => {
    const backgroundIdx = Utilities.getRandomNumberBetween(0, AUTH_BACKGROUNDS.length - 1);
    return AUTH_BACKGROUNDS[backgroundIdx];
  }, []);

  // NOTE(amine): fix for 100vh overflowing in mobile
  //              https://bugs.webkit.org/show_bug.cgi?id=141832
  const [height, setHeight] = React.useState();
  React.useLayoutEffect(() => {
    if (!window) return;
    const windowInnerHeight = window.innerHeight;
    setHeight(windowInnerHeight);
  }, []);

  return (
    <div style={{ backgroundImage: `url(${background})`, height }} {...props}>
      {children}
    </div>
  );
};

const WithCustomWrapper = (Component) => (props) => {
  return (
    <WebsitePrototypeWrapper>
      <BackgroundGenerator css={STYLES_ROOT}>
        <div css={STYLES_MIDDLE}>
          <Component {...props} />
        </div>
      </BackgroundGenerator>
    </WebsitePrototypeWrapper>
  );
};

export default WithCustomWrapper(SigninScene);
