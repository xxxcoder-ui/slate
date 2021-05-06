import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

import { SignUpPopover } from "./";

export default function Verification({ onVerify }) {
  const [token, setToken] = React.useState("");
  const handleOnChange = (code) => setToken(code);
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
        icon={SVG.NavigationArrow}
        containerStyle={{ marginTop: "28px" }}
        style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        verification
        name="token"
        type="text"
        value={token}
        onChange={handleOnChange}
        onSubmit={(token) => {
          //TODO
          if (!token) return;
          onVerify({ token });
        }}
      />
    </SignUpPopover>
  );
}
