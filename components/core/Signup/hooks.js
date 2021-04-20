import * as React from "react";
import { useRouter } from "next/router";

const AUTH_STATE_GRAPH = {
  initial: {
    SIGNIN: "signin",
    SIGNIN_WITH_TWITTER: "final",
    SIGNUP: "signup",
    // NOTE(Amine): if user comes from link verification, go to account creation
    VERIFY_EMAIL: "verification",
  },

  signin: {
    MAGIC_LINK: "magic_signin",
    FINISH: "final",
  },
  magic_signin: { RESEND: "magic_signin" },

  signup: {
    SIGNUP_WITH_TWITTER: "social_signup",
    VERIFY: "verification",
    SIGNIN: "signin",
  },
  email_signup: {
    FINISH: "final",
  },
  social_signup: {
    VERIFY: "verification",
  },

  verification: {
    // after  60s allow to resend
    RESEND: "verification",
    CONTINUE_EMAIL_SIGNUP: "email_signup",
  },

  final: {},
};

const reducer = (state, event) => {
  const nextState = AUTH_STATE_GRAPH[state][event];
  return nextState !== undefined ? nextState : state;
};

export const useAuth = () => {
  const [state, send] = React.useReducer(reducer, "initial");

  console.log(state);
  React.useLayoutEffect(() => {
    if (!window) return;
    const urlParams = new URLSearchParams(window.location.search);
    const emailtoken = urlParams.get("emailtoken");
    if (emailtoken) send("VERIFY_EMAIL");
  }, []);

  return { currentState: state, send };
};

export const useForm = ({ onSubmit, initialValues }) => {
  const [values, setValue] = React.useState(initialValues);

  const handleFieldChange = (e) =>
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const getFieldProps = (name) => ({
    name: name,
    value: values[name],
    onChange: handleFieldChange,
  });

  const handleFormOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };
  const getFormProps = () => ({
    onSubmit: handleFormOnSubmit,
  });

  return { getFieldProps, getFormProps };
};
