import * as React from "react";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";

import { useForm } from "~/common/hooks";

import { SignUpPopover, Verification } from "./components";

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

const handleValidation = ({ username, password }) => {
  if (!Validations.username(username)) return "Invalid username";

  if (!Validations.password(password)) return "Incorrect password";
};

export default function Signup({ verifyEmail, createUser }) {
  const { goToAccountCreationScene, scene } = useSignup();

  const { getFieldProps, getFormProps, isSubmitting } = useForm({
    initialValues: { username: "", password: "" },
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
    return <Verification onVerify={handleVerification} />;
  }
  return (
    <SignUpPopover title="Create an account">
      <form {...getFormProps()}>
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 46 }}
          placeholder="username"
          type="text"
          full
          {...getFieldProps("username")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 16 }}
          placeholder="password"
          type="password"
          full
          {...getFieldProps("password")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary full style={{ marginTop: 16 }} loading={isSubmitting} type="submit">
          Create account
        </System.ButtonPrimary>
      </form>
    </SignUpPopover>
  );
}
