import * as React from "react";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as SVG from "~/common/svg";

import Field from "~/components/core/Field";

import { AnimateSharedLayout, motion } from "framer-motion";
import { useForm } from "~/common/hooks";
import { SignUpPopover, Verification, AuthCheckBox } from "~/components/core/Auth/components";

const useSignup = () => {
  const [scene, setScene] = React.useState("verification");
  const handlers = React.useMemo(
    () => ({
      goToAccountCreationScene: () => setScene("accountCreation"),
    }),
    []
  );
  return { ...handlers, scene };
};

const handleValidation = ({ username, password, acceptTerms }, errors) => {
  if (!Validations.username(username)) errors.username = "Invalid username";
  // Note(amine): username should not be an email
  if (Validations.email(username)) errors.username = "Username shouldn't be an email";

  if (!Validations.password(password)) errors.password = "Incorrect password";

  if (!acceptTerms) errors.acceptTerms = "Must accept terms and conditions";
  return errors;
};

export default function Signup({ verifyEmail, createUser, resendEmailVerification }) {
  const [passwordValidations, setPasswordValidations] = React.useState(
    Validations.passwordForm("")
  );
  const [showPassword, toggleShowPassword] = React.useState(false);
  const { goToAccountCreationScene, scene } = useSignup();

  const { getFieldProps, getFormProps, isSubmitting } = useForm({
    initialValues: { username: "", password: "", acceptTerms: false },
    validate: handleValidation,
    onSubmit: async ({ username, password }) => await createUser({ username, password }),
  });

  if (scene === "verification") {
    const handleVerification = async ({ pin }) => {
      const response = await verifyEmail({ pin });
      if (response) {
        goToAccountCreationScene();
      }
    };
    return <Verification onVerify={handleVerification} onResend={resendEmailVerification} />;
  }

  return (
    <SignUpPopover title="Create an account">
      <AnimateSharedLayout>
        <form {...getFormProps()}>
          <Field
            autoFocus
            containerStyle={{ marginTop: 46 }}
            placeholder="Username"
            type="text"
            full
            {...getFieldProps("username")}
            style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
          />

          <motion.div layout>
            <Field
              containerStyle={{ marginTop: 16 }}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              full
              validations={passwordValidations}
              {...getFieldProps("password", {
                onChange: (e) => {
                  const validations = Validations.passwordForm(e.target.value);
                  setPasswordValidations(validations);
                },
              })}
              style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
              onClickIcon={() => toggleShowPassword(!showPassword)}
              icon={showPassword ? SVG.EyeOff : SVG.Eye}
            />

            <AuthCheckBox style={{ marginTop: "16px" }} {...getFieldProps("acceptTerms")} />

            <System.ButtonPrimary
              full
              style={{ marginTop: "36px" }}
              loading={isSubmitting}
              type="submit"
            >
              Create account
            </System.ButtonPrimary>
          </motion.div>
        </form>
      </AnimateSharedLayout>
    </SignUpPopover>
  );
}
