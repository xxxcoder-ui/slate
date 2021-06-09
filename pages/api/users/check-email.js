import * as Data from "~/node_common/data";

export default async (req, res) => {
  const userByEmail = await Data.getUserByEmail({
    email: req.body.data.email.toLowerCase(),
  });

  if (!userByEmail) {
    return res.status(200).send({ decorator: "SERVER_USER_NOT_FOUND" });
  }

  if (userByEmail.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_CHECK_EMAIL",
    data: { email: !!userByEmail.email, twitter: !!!userByEmail.password },
  });
};
