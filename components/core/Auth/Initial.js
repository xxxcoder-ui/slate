import * as React from "react";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";
import * as Validations from "~/common/validations";
import * as Events from "~/common/custom-events";
import * as Strings from "~/common/strings";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { useField, useForm, useIsomorphicLayoutEffect } from "~/common/hooks";
import { Toggle, SignUpPopover, ArrowButton, AuthField } from "~/components/core/Auth/components";
import { AnimateSharedLayout, motion } from "framer-motion";
import { LoaderSpinner } from "~/components/system/components/Loaders";

const STYLES_INITIAL_CONTAINER = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
`;

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
    color: ${theme.system.blue};
  }
`;

const STYLES_MESSAGE = (theme) => css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 16px;
  border: 1px solid ${theme.system.white};
  background-color: white;
  @supports ((-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px))) {
    background-color: ${theme.semantic.bgBlurWhiteTRN};
    backdrop-filter: blur(75px);
  }
  padding: 8px 12px;
  border-radius: 8px;
  & > * + * {
    margin-left: 16px;
  }
`;

const STYLES_MESSAGE_PARAGRAPH = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  color: ${theme.system.blue};
`;

const STYLES_MESSAGE_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  color: ${theme.semantic.textGray};
`;

// NOTE(amine): used to remove content jumping
// when switching between signin/signup in mobile
const STYLES_SPACER = css`
  height: 40px;
`;

const useToggler = ({ params, onAction }) => {
  const TOGGLE_OPTIONS = [
    { value: "signin", label: "Sign in" },
    { value: "signup", label: "Sign up" },
  ];
  const [state, setState] = React.useState(params?.tab || "signin");
  const handleToggleChange = (value) => {
    setState(value);
    onAction?.({ type: "UPDATE_PARAMS", params: { ...params, tab: value } });
  };
  return { toggleValue: state, handleToggleChange, TOGGLE_OPTIONS };
};

function Initial(
  {
    isSigninViaTwitter,
    goToSigninScene,
    onTwitterSignin,
    goToSignupScene,
    createVerification,
    initialEmail,
    showTermsAndServices = false,
    page,
    onAction,
  },
  ref
) {
  const { TOGGLE_OPTIONS, toggleValue, handleToggleChange } = useToggler({
    params: page.params,
    onAction,
  });

  const [signinMessage, setSigninMessage] = React.useState(null);
  const showSigninMessage = (message) => setSigninMessage(message);
  const hideSigninMessage = () => setSigninMessage(null);

  // NOTE(amine): Signup view form
  const {
    getFieldProps: getSignupFielProps,
    getFormProps: getSigninFormProps,
    setFormValues: setSignupFormValues,
    submitForm: submitSignupForm,
    isSubmitting: isCheckingSignupEmail,
    values: signupFormValues,
  } = useForm({
    validateOnBlur: false,
    initialValues: { email: initialEmail || "" },
    validate: ({ email }, errors) => {
      if (Strings.isEmpty(email)) errors.email = "Please provide an email";
      else if (!Validations.email(email)) errors.email = "Invalid email address";
      return errors;
    },
    onSubmit: async ({ email }) => {
      const response = await Actions.checkEmail({ email });
      if (response?.data?.twitter) {
        Events.dispatchMessage({
          message: "This email is associated with a Twitter account, please log in with Twitter",
        });
        return;
      }
      if (response?.data?.email) {
        goToSigninScene({
          emailOrUsername: email,
          message: `There is already an account associated with ${email}`,
        });
        return;
      }

      if (createVerification) {
        const verificationResponse = await createVerification({ email });
        if (!verificationResponse) return;
      }
      goToSignupScene({ email });
    },
  });

  // NOTE(amine): Signin view form
  const {
    getFieldProps: getSigninFieldProps,
    setFieldValue: setSigninFieldValue,
    submitField: submitSigninField,
    value: signinFormValue,
    isSubmitting: isCheckingSigninEmail,
  } = useField({
    validateOnBlur: false,
    onSubmit: async (emailOrUsername) => {
      let response;
      if (Validations.email(emailOrUsername)) {
        response = await Actions.checkEmail({ email: emailOrUsername });
      } else {
        response = await Actions.checkUsername({
          username: emailOrUsername,
        });
      }
      if (response?.data) {
        goToSigninScene({ emailOrUsername });
        return;
      }
      const message = (
        <>
          There isn't an account associated with this{" "}
          {Validations.email(emailOrUsername) ? "email" : "username"}, <br /> please choose sign up
          instead.
        </>
      );
      showSigninMessage(message);
    },
    validate: (emailOrUsername) => {
      if (Strings.isEmpty(emailOrUsername)) return "Please enter a username or email";
      if (!Validations.username(emailOrUsername) && !Validations.email(emailOrUsername))
        return "Invalid email/username";
    },
    initialValue: initialEmail,
  });

  // NOTE(amine): sync signup and signin values
  useIsomorphicLayoutEffect(() => {
    if (toggleValue === "signup") {
      setSignupFormValues({ name: "email", value: signinFormValue });
    } else {
      setSigninFieldValue(signupFormValues.email);
    }
    hideSigninMessage();
  }, [toggleValue]);

  // NOTE(amine): allow other components to submit this form via a ref
  React.useImperativeHandle(ref, () => ({
    submitSignupForm,
    submitSigninField,
  }));

  return (
    <SignUpPopover title={<>Your personal search engine</>} style={{ paddingBottom: 24 }}>
      <div css={STYLES_INITIAL_CONTAINER}>
        <div css={STYLES_SPACER} />
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItem: "center",
            justifyContent: "center",
          }}
        >
          <System.ButtonPrimary
            full
            style={{ backgroundColor: "rgb(29,161,242)", minHeight: 40 }}
            onClick={onTwitterSignin}
            loading={isSigninViaTwitter}
          >
            Continue with Twitter
          </System.ButtonPrimary>
          <System.Divider
            color="#AEAEB2"
            width="45px"
            height="0.5px"
            style={{ margin: "0px auto", marginTop: "20px" }}
          />
          <Toggle
            toggleValue={toggleValue}
            options={TOGGLE_OPTIONS}
            style={{ margin: "20px auto 8px" }}
            onChange={handleToggleChange}
          />
        </div>
        {signinMessage && (
          <div css={STYLES_MESSAGE}>
            <System.P1 css={STYLES_MESSAGE_PARAGRAPH}>{signinMessage}</System.P1>
            <button
              css={STYLES_MESSAGE_BUTTON}
              style={{ marginTop: 4 }}
              onClick={hideSigninMessage}
            >
              <SVG.Dismiss height={16} width={16} />
            </button>
          </div>
        )}
        {toggleValue === "signup" ? (
          <form {...getSigninFormProps()}>
            <AuthField
              autoFocus
              label="Sign up with email"
              placeholder="Email"
              type="text"
              name="email"
              full
              style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
              // NOTE(amine): the input component internally is using 16px margin top
              containerStyle={{ marginTop: "4px" }}
              {...getSignupFielProps("email")}
            />
            <AnimateSharedLayout>
              <motion.div
                layoutId="auth_initial_button_primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <System.ButtonPrimaryFull
                  type="submit"
                  style={{ marginTop: 8, minHeight: 40 }}
                  loading={isCheckingSignupEmail}
                >
                  Get verification code
                </System.ButtonPrimaryFull>
              </motion.div>
            </AnimateSharedLayout>
          </form>
        ) : (
          <AnimateSharedLayout>
            <motion.div layoutId="auth_signin_field">
              <AuthField
                autoFocus
                label="Email address or username"
                placeholder="Email/username"
                icon={
                  isCheckingSigninEmail
                    ? ({ style, ...props }) => (
                        <div
                          style={{ width: 20, height: 20, ...style }}
                          css={Styles.CONTAINER_CENTERED}
                          {...props}
                        >
                          <LoaderSpinner height="16px" />
                        </div>
                      )
                    : ArrowButton
                }
                name="email/username"
                type="text"
                full
                {...getSigninFieldProps()}
                // NOTE(amine): the input component internally is using 16px margin top
                containerStyle={{ marginTop: "4px" }}
              />
            </motion.div>
          </AnimateSharedLayout>
        )}

        {showTermsAndServices && (
          <div style={{ marginTop: "auto" }}>
            <a css={STYLES_LINK_ITEM} href="/terms" target="_blank">
              <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
                <SVG.RightArrow height="16px" style={{ marginRight: 4 }} /> Terms of service
              </div>
            </a>

            <a css={STYLES_LINK_ITEM} style={{ marginTop: 4 }} href="/guidelines" target="_blank">
              <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
                <SVG.RightArrow height="16px" style={{ marginRight: 4 }} /> Community guidelines
              </div>
            </a>
          </div>
        )}
      </div>
    </SignUpPopover>
  );
}

export default React.forwardRef(Initial);
