import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";

import { SignUpPopover, Verification } from "./components";

const STYLES_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  text-align: center;
  color: ${theme.system.textGrayDark};
  max-width: 228px;
  margin: 0 auto;
`;

const useTwitterSignup = () => {
  const [scene, setScene] = React.useState("accountCreation");
  const handlers = React.useMemo(() => ({ goToVerification: () => setScene("verification") }), []);
  return { ...handlers, scene };
};

export default function Signup({}) {
  const { scene, goToVerification } = useTwitterSignup();
  const { getFieldProps, getFormProps } = useForm({
    initialValues: { username: "", email: "" },
    onSubmit: ({ username, email }) => {
      goToVerification();
    },
  });

  if (scene === "verification") return <Verification onVerify={() => goToAccountCreationScene()} />;
  return (
    <SignUpPopover title="Create an account">
      <form {...getFormProps}>
        <System.Input
          autoFocus
          label="Username"
          containerStyle={{ marginTop: 41 }}
          placeholder="username"
          type="username"
          {...getFieldProps("username")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.Input
          autoFocus
          label="Email address"
          containerStyle={{ marginTop: 16 }}
          placeholder="email"
          type="email"
          {...getFieldProps("email")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <System.ButtonPrimary full style={{ marginTop: 16 }} type="submit">
          Create account
        </System.ButtonPrimary>
        <System.P css={STYLES_SMALL} style={{ marginTop: 16 }}>
          You will receive an email verification link when you create account.
        </System.P>
      </form>
    </SignUpPopover>
  );
}
