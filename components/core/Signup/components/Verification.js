import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Validations from "~/common/validations";

import { SignUpPopover } from "./";

export default function Verification({ onVerify }) {
  const [pin, setPin] = React.useState("");
  const handleOnChange = (code) => setPin(code);
  return (
    <SignUpPopover
      logoStyle={{ width: 56, height: 56 }}
      title={
        <>
          Verification code sent,
          <br />
          please check your inbox.
        </>
      }
    >
      <System.Input
        autoFocus
        label="Input 6 digits code"
        helper={
          <>
            Didn’t receive an email? <a style={{ color: "inherit" }}>Resend code.</a>
          </>
        }
        full
        icon={SVG.NavigationArrow}
        containerStyle={{ marginTop: "28px" }}
        style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        verification
        name="pin"
        type="text"
        value={pin}
        onChange={handleOnChange}
        onSubmit={(pin) => {
          //TODO: Handle errors
          console.log(pin, Validations.verificationPin(pin));
          if (!Validations.verificationPin(pin)) return;
          onVerify({ pin });
        }}
      />
    </SignUpPopover>
  );
}
