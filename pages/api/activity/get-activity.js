import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";

/**
 * This endpoint is used to get the activity feed items that involve the users in FOLLOWING or slates in SUBSCRIPTIONS, paginated 100 at a time.
 *
 * Including the timestamp for the earliest activity item shown as EARLIESTTIMESTAMP will give you the next "page" of results (the next 100 results dated prior to that timestamp).
 * Including the timestamp for the latest activity item shown as LATESTTIMESTAMP will give you any activity updates that have happened since that time.
 * If both timestamps are omitted, this function will get the first "page" of 100 results
 * FOLLOWING is the ids of the users that the querying user is following
 * SUBSCRIPTIONS is the ids of the slates that the querying user is following
 */

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);

  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  let following = req.body.data?.following;
  let subscriptions = req.body.data?.subscriptions;
  if (!following || !subscriptions) {
    const fetchedSubscriptions = await Data.getSubscriptionsByUserId({ ownerId: id });

    if (fetchedSubscriptions && !fetchedSubscriptions.error) {
      subscriptions = fetchedSubscriptions.map((sub) => sub.id);
    }

    const fetchedFollowing = await Data.getFollowingByUserId({ ownerId: id });

    console.log(fetchedFollowing);

    if (fetchedFollowing && !fetchedFollowing.error) {
      following = fetchedFollowing.map((sub) => sub.id);
    }
  }

  if (!following.length && !subscriptions.length) {
    return res.status(200).send({ decorator: "SERVER_GET_ACTIVITY", activity: [] });
  }

  let earliestTimestamp;
  let latestTimestamp;
  if (req.body.data) {
    earliestTimestamp = req.body.data.earliestTimestamp;
    latestTimestamp = req.body.data.latestTimestamp;
  }

  let response = await Data.getActivity({
    earliestTimestamp,
    latestTimestamp,
    following,
    subscriptions,
  });

  if (!response || response.error) {
    return res.status(400).send({ decorator: "SERVER_GET_ACTIVITY_NOT_FOUND", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_GET_ACTIVITY", data: response });
};
