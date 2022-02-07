/* eslint-disable jsx-a11y/no-autofocus */
import * as React from "react";
import * as Validations from "~/common/validations";
import * as System from "~/components/system";
import * as Strings from "~/common/strings";

import { AnimateSharedLayout, motion } from "framer-motion";
import { useForm } from "~/common/hooks";

import {
  SignUpPopover,
  Verification,
  AuthCheckBox,
  AuthField,
} from "~/components/core/Auth/components";

const useTwitterLinking = () => {
  // NOTE(amine): can be either 'account' | 'email' | 'verificatiom'
  const [scene, setScene] = React.useState("account");
  const handlers = React.useMemo(
    () => ({
      goToEmailScene: () => setScene("email"),
      goToVerificationScene: () => setScene("verification"),
    }),
    []
  );
  return { ...handlers, scene };
};

const MotionLayout = ({ children, ...props }) => (
  <motion.div layout {...props}>
    {children}
  </motion.div>
);

const handleValidation = async ({ username, password, acceptTerms }, errors) => {
  if (!Validations.username(username) && !Validations.email(username))
    errors.username = "Invalid username";

  if (!Validations.legacyPassword(password)) errors.password = "Incorrect password";

  if (!acceptTerms) errors.acceptTerms = "Must accept terms and conditions";
  return errors;
};

export default function TwitterLinking({
  linkAccount,
  linkAccountWithVerification,
  resendEmailVerification,
  createVerification,
}) {
  const { scene, goToVerificationScene, goToEmailScene } = useTwitterLinking();

  const {
    getFieldProps,
    getFormProps,
    values: { username },
    isSubmitting,
  } = useForm({
    initialValues: { username: "", password: "", acceptTerms: false },
    validate: handleValidation,
    onSubmit: async ({ username, password }) => {
      const response = await linkAccount({ username, password });
      if (response.shouldMigrate) {
        goToEmailScene();
      }
    },
  });

  const {
    getFormProps: getEmailFormProps,
    getFieldProps: getEmailFieldProps,
    isSubmitting: isEmailFormSubmitting,
  } = useForm({
    initialValues: { email: "" },
    validate: ({ email }, errors) => {
      if (Strings.isEmpty(email)) {
        errors.email = "Please provide an email";
      } else if (!Validations.email(email)) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
    onSubmit: async ({ email }) => {
      const response = await createVerification({ email });
      if (!response) return;
      goToVerificationScene();
    },
  });

  if (scene === "verification") {
    const handleVerification = async ({ pin }) => {
      await linkAccountWithVerification({ pin });
    };
    return <Verification onVerify={handleVerification} onResend={resendEmailVerification} />;
  }

  if (scene === "email") {
    return (
      <div>
        <SignUpPopover title={`Please add an email address for ${username}`}>
          <form {...getEmailFormProps()} style={{ marginTop: 72 }}>
            <AuthField
              autoFocus
              containerStyle={{ marginTop: 16 }}
              placeholder="Email"
              name="email"
              type="email"
              full
              {...getEmailFieldProps("email")}
            />
            <AnimateSharedLayout>
              <motion.div layout>
                <System.ButtonPrimary
                  full
                  type="submit"
                  loading={isEmailFormSubmitting}
                  style={{ marginTop: 16 }}
                >
                  Send verification code
                </System.ButtonPrimary>
              </motion.div>
            </AnimateSharedLayout>
          </form>
        </SignUpPopover>
      </div>
    );
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
          full
          {...getFieldProps("username")}
        />
        <AnimateSharedLayout>
          <AuthField
            containerStyle={{ marginTop: 16 }}
            containerAs={MotionLayout}
            errorAs={MotionLayout}
            placeholder="password"
            name="password"
            type="password"
            full
            {...getFieldProps("password")}
          />

          <motion.div layout>
            <AuthCheckBox style={{ marginTop: 16 }} {...getFieldProps("acceptTerms")} />
            <System.ButtonPrimary
              full
              style={{ marginTop: 36 }}
              loading={isSubmitting}
              type="submit"
            >
              Connect to Twitter
            </System.ButtonPrimary>
          </motion.div>
        </AnimateSharedLayout>
      </form>
    </SignUpPopover>
  );
}
