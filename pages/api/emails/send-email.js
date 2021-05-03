import * as Environment from "~/node_common/environment";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Environment.SENDGRID_API_KEY);

//NOTE(toast): please see https://sendgrid.com/docs/api-reference/
//for sendgrid request structure, see what's optional
//also see https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail

export default async (req, res) => {
  const msg = {
    personalizations: req.body.personalizations,
    to: req.body.to,
    from: req.body.from,
    subject: req.body.subject,
    content: req.body.content,
    optionalData: req.body.optionalData || null,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    res.status(500).send({ decorator: "SEND_EMAIL_FAILURE", error: true });
  }
};
