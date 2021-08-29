import * as React from "react";
import * as Events from "~/common/custom-events";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { P3 } from "~/components/system/components/Typography";
import { Divider } from "~/components/system";
import { motion } from "framer-motion";
import { useEventListener, useTimeout } from "~/common/hooks";
import { ShareModalPrimitive } from "~/components/core/ShareModals/ShareModalPrimitive";

const STYLES_COPY_ACTIONS_WRAPPER = css`
  border-radius: 12px;
  overflow: hidden;
`;

const STYLES_COPY_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  background-color: ${theme.system.white};
  width: 100%;
  padding: 9px 12px 11px;
`;

const formatDataSafely = ({ collection, user }) => {
  if (typeof window === "undefined" || !collection || !user) return {};
  const rootUrl = window?.location?.origin;
  return {
    id: collection.id,
    title: collection?.name || collection?.slatename,
    link: `${rootUrl}/${user.username}/${collection.slatename}`,
  };
};

export const CollectionSharingModal = () => {
  const [state, handlers] = useModalState();
  const { open, user, collection, view, preview } = state;
  const { closeModal, changeView, handleModalVisibility } = handlers;

  const { id, title, link } = React.useMemo(() => formatDataSafely({ collection, user }), [
    user,
    collection,
  ]);

  useEventListener("collection-sharing-modal", handleModalVisibility, []);

  const handleTwitterSharing = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${title} by ${user.username} on Slate%0D&url=${link}`,
      "_blank"
    );

  const handleEmailSharing = () => {
    window.open(`mailto: ?subject=${title} by ${user.username} on Slate&body=${link}`, "_b");
  };

  const handleLinkCopy = () => (Utilities.copyToClipboard(link), changeView("LINK_COPIED"));
  const handleIdCopy = () => (Utilities.copyToClipboard(id), changeView("ID_COPIED"));

  return (
    <ShareModalPrimitive
      isOpen={open}
      closeModal={closeModal}
      title={title}
      preview={preview}
      description={`Collection @${user.username}`}
      onEmailSharing={handleEmailSharing}
      includeSocialSharing={!(view === "LINK_COPIED" || view === "ID_COPIED")}
      onTwitterSharing={handleTwitterSharing}
    >
      {view === "initial" ? (
        <div css={STYLES_COPY_ACTIONS_WRAPPER}>
          <button css={STYLES_COPY_BUTTON} onClick={handleLinkCopy}>
            <span css={Styles.HORIZONTAL_CONTAINER}>
              <SVG.Link width={16} height={16} />
              <P3 style={{ marginLeft: 8 }}>Copy Link</P3>
            </span>
          </button>
          <Divider height={1} color="bgGrayLight" />
          <button css={STYLES_COPY_BUTTON} onClick={handleIdCopy}>
            <span css={Styles.HORIZONTAL_CONTAINER}>
              <SVG.Hash width={16} height={16} />
              <P3 style={{ marginLeft: 8 }}>Copy ID</P3>
            </span>
          </button>
        </div>
      ) : (
        <LinkCopiedScene closeModal={closeModal}>
          {view === "LINK_COPIED" ? "Link copied to clipboard" : "ID copied to clipboard"}
        </LinkCopiedScene>
      )}
    </ShareModalPrimitive>
  );
};

const LinkCopiedScene = ({ closeModal, children }) => {
  useTimeout(closeModal, 3000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut", duration: 0.3, delay: 0.4 }}
      style={{ marginTop: 24 }}
      css={Styles.CONTAINER_CENTERED}
    >
      <SVG.Clipboard />
      <P3 style={{ marginLeft: 8 }} color="textBlack">
        {children}
      </P3>
    </motion.div>
  );
};

const useModalState = () => {
  const [state, setState] = React.useState({
    open: false,
    // NOTE(amine): INITIAL || LINK_COPIED || ID_COPIED
    view: "initial",
    user: {},
    data: {},
    preview: {},
  });

  const handlers = React.useMemo(
    () => ({
      closeModal: () => setState((prev) => ({ ...prev, open: false })),
      changeView: (view) => setState((prev) => ({ ...prev, view })),
      handleModalVisibility: (e) =>
        setState(() => ({
          view: "initial",
          open: e.detail.open,
          user: e.detail.user,
          collection: e.detail.collection,
          preview: e.detail.preview,
        })),
    }),
    []
  );
  return [state, handlers];
};

export const useCollectionSharingModal = () => {
  const openModal = ({ user, collection, preview }) =>
    Events.dispatchCustomEvent({
      name: "collection-sharing-modal",
      detail: { open: true, user, collection, preview },
    });
  const closeModal = () =>
    Events.dispatchCustomEvent({
      name: "collection-sharing-modal",
      detail: { open: false },
    });
  return { openModal, closeModal };
};
