import * as Data from "~/node_common/data";

export default async (req, res) => {
  const user = await Data.getUserByEmail({
    username: req.body.data.email.toLowerCase(),
  });

  if (!user) {
    return res.status(200).send({ decorator: "SERVER_USER_NOT_FOUND" });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_CHECK_EMAIL", data: user });
};
