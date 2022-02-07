/* eslint-disable jsx-a11y/no-autofocus */
import * as React from "react";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as Actions from "~/common/actions";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";

import { AnimateSharedLayout, motion } from "framer-motion";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";

import {
  SignUpPopover,
  Verification,
  AuthCheckBox,
  AuthField,
} from "~/components/core/Auth/components";

const STYLES_LINK = (theme) => css`
  padding: 0;
  margin: 0;
  max-width: 224px;
  text-align: center;
  color: ${theme.semantic.textGrayDark};
  max-width: 228px;
  margin: 0 auto;
  background-color: unset;
  border: none;
`;

const useTwitterSignup = () => {
  const [scene, setScene] = React.useState("accountCreation");
  const handlers = React.useMemo(() => ({ goToVerification: () => setScene("verification") }), []);
  return { ...handlers, scene };
};

const useCheckUser = () => {
  const MESSAGE = "The username is taken";

  const usernamesAllowed = React.useRef([]);
  const usernamesTaken = React.useRef([]);

  return async ({ username }, errors) => {
    if (usernamesAllowed.current.some((value) => value === username)) {
      return;
    }

    if (usernamesTaken.current.some((value) => value === username)) {
      errors.username = MESSAGE;
      return;
    }

    const response = await Actions.checkUsername({
      username,
    });
    if (response.data) {
      errors.username = "The username is taken";
      usernamesTaken.current.push(username);
      return;
    }
    usernamesAllowed.current.push(username);
  };
};

const createValidations =
  (validateUsername) =>
  async ({ username, acceptTerms }, errors) => {
    await validateUsername({ username }, errors);

    if (!Validations.username(username)) errors.username = "Invalid username";
    // Note(amine): username should not be an email
    if (Validations.email(username)) errors.username = "Username shouldn't be an email";

    if (!acceptTerms) errors.acceptTerms = "Must accept terms and conditions";

    return errors;
  };

const MotionLayout = ({ children, ...props }) => (
  <motion.div layout {...props}>
    {children}
  </motion.div>
);

export default function TwitterSignup({
  initialEmail,
  onSignup,
  goToTwitterLinkingScene,
  resendEmailVerification,
  createVerification,
  onSignupWithVerification,
}) {
  const { scene, goToVerification } = useTwitterSignup();

  const validateUsername = useCheckUser();

  const {
    getFieldProps,
    getFormProps,
    values: { username },
    isSubmitting,
    isValidating,
  } = useForm({
    initialValues: { username: "", email: initialEmail, acceptTerms: false },
    format: { username: Strings.createUsername },
    validate: createValidations(validateUsername),
    onSubmit: async ({ username, email }) => {
      if (email !== initialEmail) {
        const response = await createVerification({ email });
        if (!response) return;
        goToVerification();
        return;
      }
      await onSignup({ email, username });
    },
  });

  if (scene === "verification") {
    const handleVerification = async ({ pin }) => {
      await onSignupWithVerification({ username, pin });
    };
    return <Verification onVerify={handleVerification} onResend={resendEmailVerification} />;
  }

  return (
    <SignUpPopover title="Create an account">
      <form {...getFormProps()}>
        <AuthField
          autoFocus
          containerStyle={{ marginTop: 41 }}
          placeholder="Username"
          name="username"
          type="text"
          success="The username is available"
          icon={
            isValidating
              ? () => (
                  <LoaderSpinner
                    style={{
                      height: 16,
                      width: 16,
                      marginLeft: 16,
                      position: "relative",
                      right: 12,
                    }}
                  />
                )
              : null
          }
          {...getFieldProps("username")}
          full
        />
        <AnimateSharedLayout>
          <AuthField
            containerStyle={{ marginTop: 16 }}
            containerAs={MotionLayout}
            errorAs={MotionLayout}
            placeholder="Email"
            name="email"
            type="email"
            full
            {...getFieldProps("email")}
          />

          <motion.div layout>
            <AuthCheckBox style={{ marginTop: 16 }} {...getFieldProps("acceptTerms")} />
            <System.ButtonPrimary
              full
              style={{ marginTop: 36 }}
              loading={isSubmitting}
              type="submit"
            >
              Create account
            </System.ButtonPrimary>
          </motion.div>

          <motion.div layout>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                type="button"
                onClick={goToTwitterLinkingScene}
                css={[Styles.LINK, STYLES_LINK]}
              >
                Already have an account? Connect your account to Twitter.
              </button>
            </div>
          </motion.div>
        </AnimateSharedLayout>
      </form>
    </SignUpPopover>
  );
}
