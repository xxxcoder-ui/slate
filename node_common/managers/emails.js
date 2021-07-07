import * as Logging from "~/common/logging";
import * as Environment from "~/node_common/environment";

import sgMail from "@sendgrid/mail";

import "isomorphic-fetch";

sgMail.setApiKey(Environment.SENDGRID_API_KEY);

//NOTE(toast): please see https://sendgrid.com/docs/api-reference/
//for sendgrid request structure, see what's optional
//also see https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail

export const sendEmail = async ({
  personalizations,
  to,
  from,
  subject,
  content,
  optionalData = {},
}) => {
  const msg = {
    personalizations: personalizations,
    to: to,
    from: from,
    subject: subject,
    content: content,
    optionalData: optionalData,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    return { decorator: "SEND_EMAIL_FAILURE", error: true };
  }
};

//NOTE(toast): templates override content, subject, etc.
//properties that are defined in the template take priority
export const sendTemplate = async ({ to, from, templateId, templateData }) => {
  const msg = {
    to: to,
    from: from,
    templateId: templateId,
    dynamic_template_data: { ...templateData },
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    Logging.error(error);
    return { decorator: "SEND_TEMPLATE_EMAIL_FAILURE", error: true };
  }
};

//NOTE(toast): only available to upgraded sendgrid accounts
//uses their validation service to make sure an email is legit
export const validateEmail = async ({ email }) => {
  const msg = { email: email };
  const request = await fetch("https://api.sendgrid.com/v3/validations/email", {
    method: "POST",
    headers: {
      Authorization: Environment.SENDGRID_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  });

  try {
    await request();
  } catch (e) {
    return { decorator: "VALIDATE_EMAIL_FAILURE", error: true };
  }
};
