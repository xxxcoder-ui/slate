import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";

export default async (req, res) => {
  let id = req.body.data.id;
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

  const following = await Data.getFollowingByUserId({ ownerId: id });

  if (!following) {
    return res
      .status(404)
      .send({ decorator: "SERVER_USER_SOCIAL_FOLLOWING_NOT_FOUND", error: true });
  }

  if (following.error) {
    return res
      .status(500)
      .send({ decorator: "SERVER_USER_SOCIAL_FOLLOWING_NOT_FOUND", error: true });
  }

  const followers = await Data.getFollowersByUserId({ userId: id });

  if (!followers) {
    return res
      .status(404)
      .send({ decorator: "SERVER_USER_SOCIAL_FOLLOWERS_NOT_FOUND", error: true });
  }

  if (followers.error) {
    return res
      .status(500)
      .send({ decorator: "SERVER_USER_SOCIAL_FOLLOWERS_NOT_FOUND", error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_USER_SOCIAL",
    following,
    followers,
    subscriptions,
  });
};
