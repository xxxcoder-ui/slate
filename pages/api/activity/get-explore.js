import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";

/**
 * This endpoint is used to get explore feed items, paginated 100 at a time.
 *
 * Including the timestamp for the earliest activity item shown as EARLIESTTIMESTAMP will give you the next "page" of results (the next 100 results dated prior to that timestamp).
 * Including the timestamp for the latest activity item shown as LATESTTIMESTAMP will give you any activity updates that have happened since that time.
 * If both timestamps are omitted, this function will get the first "page" of 100 results
 */

export default async (req, res) => {
  let earliestTimestamp;
  let latestTimestamp;

  if (req.body.data) {
    earliestTimestamp = req.body.data.earliestTimestamp;
    latestTimestamp = req.body.data.latestTimestamp;
  }

  let response = await Data.getExplore({
    earliestTimestamp,
    latestTimestamp,
  });

  if (!response || response.error) {
    return res.status(400).send({ decorator: "SERVER_GET_EXPLORE_NOT_FOUND", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_GET_EXPLORE", data: response });
};
