import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
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

export default function Signup({ email }) {
  const { goToAccountCreationScene, scene } = useSignup();

  const { getFieldProps, getFormProps } = useForm({
    initialValues: { username: "", password: "" },
    onSubmit: ({ username, password }) => console.log({ username, password }),
  });

  if (scene === "verification") return <Verification onVerify={() => goToAccountCreationScene()} />;
  return (
    <SignUpPopover title="Create an account">
      <form {...getFormProps}>
        <System.Input
          autoFocus
          containerStyle={{ marginTop: 46 }}
          placeholder="username"
          type="text"
          {...getFieldProps("email")}
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
        <System.ButtonPrimary full style={{ marginTop: 16 }} type="submit">
          Create account
        </System.ButtonPrimary>
      </form>
    </SignUpPopover>
  );
}
