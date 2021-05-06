import * as React from "react";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";

import { useForm } from "~/common/hooks";

import { SignUpPopover } from "./";

const handleValidation = ({ username, password }) => {
  if (!Validations.username(username)) return "Invalid username";

  if (!Validations.password(password)) return "Incorrect password";
};

export default function Signin({ onAuthenticate, emailOrUsername = "" }) {
  const { getFieldProps, getFormProps, isSubmitting } = useForm({
    initialValues: { username: emailOrUsername, password: "" },
    validate: handleValidation,
    onSubmit: async ({ username, password }) =>
      await onAuthenticate({
        username: username.toLowerCase(),
        password: password,
      }),
  });

  return (
    <SignUpPopover title="Discover, experience, share files on Slate">
      <form {...getFormProps()}>
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 41 }}
          placeholder="email address or username"
          type="text"
          {...getFieldProps("username")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 16 }}
          placeholder="password"
          type="password"
          {...getFieldProps("password")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary full type="submit" loading={isSubmitting} style={{ marginTop: 16 }}>
          Sign in
        </System.ButtonPrimary>
      </form>
    </SignUpPopover>
  );
}
