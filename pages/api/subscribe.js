import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as Monitor from "~/node_common/monitor";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (!req.body.data || (!req.body.data.userId && !req.body.data.slateId)) {
    return res.status(500).send({
      decorator: "SERVER_SUBSCRIBE_MUST_PROVIDE_SLATE_OR_USER",
      error: true,
    });
  }

  if (user.id === req.body.data.userId) {
    return res.status(500).send({
      decorator: "SERVER_SUBSCRIBE_CAN_NOT_SUBSCRIBE_TO_YOURSELF",
      error: true,
    });
  }

  let targetUser;
  if (req.body.data.userId) {
    targetUser = await Data.getUserById({
      id: req.body.data.userId,
    });

    if (!targetUser) {
      return res.status(404).send({
        decorator: "SERVER_SUBSCRIBE_TARGET_USER_NOT_FOUND",
        error: true,
      });
    }

    if (targetUser.error) {
      return res.status(500).send({
        decorator: "SERVER_SUBSCRIBE_TARGET_USER_NOT_FOUND",
        error: true,
      });
    }
  }

  let targetSlate;
  if (req.body.data.slateId) {
    targetSlate = await Data.getSlateById({ id: req.body.data.slateId });

    if (!targetSlate) {
      return res.status(404).send({
        decorator: "SERVER_SUBSCRIBE_TARGET_SLATE_NOT_FOUND",
        error: true,
      });
    }

    if (targetSlate.error) {
      return res.status(500).send({
        decorator: "SERVER_SUBSCRIBE_TARGET_SLATE_NOT_FOUND",
        error: true,
      });
    }
  }

  const existingResponse = await Data.getSubscription({
    ownerId: user.id,
    slateId: targetSlate ? targetSlate.id : null,
    userId: targetUser ? targetUser.id : null,
  });

  if (existingResponse && existingResponse.error) {
    return res.status(500).send({
      decorator: "SERVER_SUBSCRIBE_SUBSCRIPTION_CHECK_ERROR",
      error: true,
    });
  }

  let response;

  // NOTE(jim): If it exists, we unsubscribe instead.
  if (existingResponse) {
    response = await Data.deleteSubscriptionById({
      id: existingResponse.id,
      ownerId: user.id,
      slateId: targetSlate ? targetSlate.id : null,
      userId: targetUser ? targetUser.id : null,
    });

    if (!response) {
      return res.status(404).send({ decorator: "SERVER_UNSUBSCRIBE_FAILED", error: true });
    }

    if (response.error) {
      return res.status(500).send({ decorator: "SERVER_UNSUBSCRIBE_FAILED", error: true });
    }
  } else {
    response = await Data.createSubscription({
      ownerId: user.id,
      slateId: targetSlate ? targetSlate.id : null,
      userId: targetUser ? targetUser.id : null,
    });

    if (!response) {
      return res.status(404).send({ decorator: "SERVER_SUBSCRIBE_FAILED", error: true });
    }

    if (response.error) {
      return res.status(500).send({ decorator: "SERVER_SUBSCRIBE_FAILED", error: true });
    }
  }

  if (targetUser) {
    ViewerManager.hydratePartial(id, { following: true });

    targetUser = await Data.getUserById({
      id: req.body.data.userId,
    });
    SearchManager.updateUser(targetUser);

    Monitor.subscribeUser({ user, targetUser });
  }

  if (targetSlate) {
    ViewerManager.hydratePartial(id, { subscriptions: true });

    targetSlate = await Data.getSlateById({ id: req.body.data.slateId });
    SearchManager.updateSlate(targetSlate);

    Monitor.subscribeSlate({ user, targetSlate });
  }

  return res.status(200).send({
    decorator: "SERVER_SUBSCRIBE",
    data: response,
  });
};
