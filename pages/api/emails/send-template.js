import * as Environment from "~/node_common/environment";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Environment.SENDGRID_API_KEY);

//NOTE(toast): templates override content, subject, etc.
//properties that are defined in the template take priority
export default async (req, res) => {
  const msg = {
    to: req.body.to,
    from: req.body.from,
    templateId: req.body.templateId,
    dynamic_template_data: { ...req.body.templateData },
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    res.status(500).send({ decorator: "SEND_EMAIL_FAILURE", error: true });
  }
};
