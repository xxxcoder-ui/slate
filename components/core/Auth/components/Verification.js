import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Validations from "~/common/validations";

import { LoaderSpinner } from "~/components/system/components/Loaders";
import { css } from "@emotion/react";

import { SignUpPopover } from "./";

const STYLES_RESEND_BUTTON = (theme) => css`
  padding: 0;
  margin: 0;
  color: inherit;
  border: none;
  background: transparent;
  &:hover {
    color: ${theme.system.black};
    cursor: pointer;
  }
`;

const getResendText = ({ status, timeLeft }) => {
  if (status === "ready") return "Resend code.";
  if (status === "sending") return "Sending code...";
  if (status === "sent") return "Code sent.";
  return `${timeLeft}s left to retry`;
};

const ResendButton = ({ onResend }) => {
  // NOTE(amine): we have 4 status: ready, sending, sent, timeout
  const [status, setStatus] = React.useState("ready");
  const [timer, setTimer] = React.useState(35);

  const handleResend = async () => {
    if (status === "ready") {
      setStatus("sending");
      await onResend();
      setStatus("sent");
      return;
    }

    if (status === "sent") {
      setStatus("timeout");
    }
  };

  // NOTE(amine): when the timer hits 0,
  React.useEffect(() => {
    if (timer === 0) setStatus("ready");
  }, [timer]);

  React.useEffect(() => {
    let interval;
    // NOTE(amine): start a timer when the email is sent
    if (status === "sent") {
      // NOTE(amine): reset timer to 35s
      setTimer(35);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        //NOTE(amine): clear interval when the timer is over.
        if (timer === 0) clearInterval(interval);
      }, 1000);
    }
  }, [status]);

  return (
    <button css={STYLES_RESEND_BUTTON} onClick={handleResend}>
      {getResendText({ status, timeLeft: timer })}
    </button>
  );
};

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

export default function Verification({ onVerify, onResend }) {
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
            Didn’t receive an email? <ResendButton onResend={onResend} />
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
        name="pin"
        type="pin"
        {...getVerificationFieldProps()}
      />
    </SignUpPopover>
  );
}
