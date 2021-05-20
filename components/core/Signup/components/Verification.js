import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Validations from "~/common/validations";

import { LoaderSpinner } from "~/components/system/components/Loaders";

import { SignUpPopover } from "./";

const useVerification = ({ onSubmit }) => {
  const [{ pin, isSubmitting }, setValues] = React.useState({ pin: "" });

  const getVerificationFieldProps = () => ({
    value: pin,
    onChange: (value) => setValues((prev) => ({ ...prev, pin: value })),
    onSubmit: async (formattedPin) => {
      if (isSubmitting) return;
      if (!Validations.verificationPin(formattedPin)) return;
      setValues((prev) => ({ ...prev, isSubmitting: true }));
      await onSubmit(formattedPin);
      setValues((prev) => ({ ...prev, isSubmitting: false }));
    },
  });
  return { getVerificationFieldProps, isSubmitting };
};

export default function Verification({ onVerify }) {
  const { getVerificationFieldProps, isSubmitting } = useVerification({
    onSubmit: (pin) => onVerify({ pin }),
  });
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
        icon={
          isSubmitting
            ? (props) => (
                <span {...props}>
                  <LoaderSpinner style={{ height: 16, width: 16 }} />
                </span>
              )
            : SVG.NavigationArrow
        }
        containerStyle={{ marginTop: "28px" }}
        style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        verification
        name="pin"
        type="text"
        {...getVerificationFieldProps()}
      />
    </SignUpPopover>
  );
}
