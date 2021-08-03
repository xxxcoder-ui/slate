import * as Data from "~/node_common/data";

export default async (req, res) => {
  let { id } = req.body.data;
  if (!id) {
    return res.status(404).send({ decorator: "SERVER_USER_SOCIAL_NO_USER_ID", error: true });
  }

  const subscriptions = await Data.getSubscriptionsByUserId({ ownerId: id });

  if (!subscriptions) {
    return res
      .status(404)
      .send({ decorator: "SERVER_USER_SOCIAL_SUBSCRIPTIONS_NOT_FOUND", error: true });
  }

  if (subscriptions.error) {
    return res
      .status(500)
      .send({ decorator: "SERVER_USER_SOCIAL_SUBSCRIPTIONS_NOT_FOUND", error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_USER_SOCIAL",
    subscriptions,
  });
};
