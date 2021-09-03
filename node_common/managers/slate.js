import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Numbers from "~/common/numbers";

export const getRandomSlateElementURL = async ({ id, fallback = "" }) => {
  if (Strings.isEmpty(id)) {
    return fallback;
  }

  const query = await Data.getSlateById({ id, includeFiles: true });

  if (!query || query.error) {
    return fallback;
  }

  if (!query.objects.length) {
    return fallback;
  }

  const index = Numbers.getRandomInt(0, query.objects.length - 1);
  return Strings.getURLfromCID(query.objects[index].cid);
};
