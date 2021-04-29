import "isomorphic-fetch";
import * as Environment from "~/node_common/environment";

export default async (req, res) => {
  const msg = { email: req.body.email };
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
    res.status(500).send({ decorator: "VALIDATE_EMAIL_FAILURE", error: true });
  }
};
