import * as Data from "~/node_common/data";

export default async (req, res) => {
  const email = await Data.getUserByEmail({
    email: req.body.data.email.toLowerCase(),
  });

  if (!email) {
    return res.status(200).send({ decorator: "SERVER_USER_NOT_FOUND" });
  }

  if (email.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_CHECK_EMAIL", data: email });
};
