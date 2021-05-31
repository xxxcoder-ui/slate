import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({ id });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (!req.body.data?.id) {
    return res.status(500).send({ decorator: "SERVER_LIKE_FILE_NO_FILE_PROVIDED", error: true });
  }

  const existingResponse = await Data.getLikeByFile({ userId: user.id, fileId: file.id });

  if (existingResponse && existingResponse.error) {
    return res.status(500).send({
      decorator: "SERVER_LIKE_FILE_CHECK_ERROR",
      error: true,
    });
  }

  let response;

  // NOTE(martina): If it exists, we unlike instead.
  if (existingResponse) {
    response = await Data.deleteLikeByFile({
      userId: user.id,
      fileId: file.id,
    });

    if (!response) {
      return res.status(404).send({ decorator: "SERVER_UNLIKE_FILE_FAILED", error: true });
    }

    if (response.error) {
      return res.status(500).send({ decorator: "SERVER_UNLIKE_FILE_FAILED", error: true });
    }
  } else {
    response = await Data.createLike({ userId: user.id, fileId: file.id });

    if (!response) {
      return res.status(404).send({ decorator: "SERVER_LIKE_FILE_FAILED", error: true });
    }

    if (response.error) {
      return res.status(500).send({ decorator: "SERVER_LIKE_FILE_FAILED", error: true });
    }
  }

  return res.status(200).send({
    decorator: "SERVER_LIKE_FILE",
    data: response,
  });
};
