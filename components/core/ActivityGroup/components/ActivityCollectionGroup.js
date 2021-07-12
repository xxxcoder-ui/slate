import * as React from "react";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { Link } from "~/components/core/Link";
import { motion } from "framer-motion";
import { ViewMoreContent, ProfileInfo } from "~/components/core/ActivityGroup/components";

import CollectionPreviewBlock from "~/components/core/CollectionPreviewBlock";

const STYLES_GROUP_GRID = (theme) => css`
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-row-gap: 32px;
  border-bottom: 1px solid ${theme.system.bgGray};
  padding-bottom: 24px;
  @media (max-width: ${theme.sizes.mobile}px) {
    grid-row-gap: 24px;
    grid-template-columns: 1fr;
  }
`;

const STYLES_VIEWMORE_CONTAINER = (theme) => css`
  @media (max-width: ${theme.sizes.mobile}px) {
    display: flex;
    justify-content: center;
  }
`;

export default function ActivityCollectionGroup({ onAction, viewer, group, ...props }) {
  const { owner, slate, type, createdAt } = group;
  const { elements, restElements } = React.useMemo(() => {
    if (!Array.isArray(slate)) {
      return { elements: [slate] };
    }
    return { elements: slate.slice(0, 2), restElements: slate.slice(2) };
  }, [slate]);

  const [showMore, setShowMore] = React.useState(false);
  const viewMoreFiles = () => setShowMore(true);

  const timeSinceUploaded = Utilities.getTimeDifferenceFromNow(createdAt);
  // const timeSinceUploaded = Utilities.getTimeDifferenceFromNow(elements[0].createdAt);
  const nbrOfFilesUploaded = elements.length + (restElements?.length || 0);
  const action = React.useMemo(() => {
    if (type === "SUBSCRIBE_SLATE") {
      return "started following";
    }
    return `created ${nbrOfFilesUploaded} ${Strings.pluralize("collection", nbrOfFilesUploaded)}`;
  }, []);

  return (
    <div css={STYLES_GROUP_GRID} {...props}>
      <ProfileInfo
        time={timeSinceUploaded}
        owner={owner}
        viewer={viewer}
        action={action}
        onAction={onAction}
      />
      <div>
        <div css={Styles.COLLECTIONS_PREVIEW_GRID}>
          {elements.map((collection) => (
            <Link key={collection.id} href={`/$/slate/${collection.id}`} onAction={onAction}>
              <CollectionPreviewBlock collection={collection} viewer={viewer} />
            </Link>
          ))}
          {showMore &&
            restElements.map((collection, i) =>
              // NOTE(amine): animate only the first 8 elements
              i < 8 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={collection.id}
                >
                  <Link key={collection.id} href={`/$/slate/${collection.id}`} onAction={onAction}>
                    <CollectionPreviewBlock collection={collection} viewer={viewer} />
                  </Link>
                </motion.div>
              ) : (
                <Link key={collection.id} href={`/$/slate/${collection.id}`} onAction={onAction}>
                  <CollectionPreviewBlock collection={collection} viewer={viewer} />
                </Link>
              )
            )}
        </div>
        <div css={STYLES_VIEWMORE_CONTAINER}>
          {!showMore && restElements?.length ? (
            <ViewMoreContent onClick={viewMoreFiles}>
              View {restElements.length} more {Strings.pluralize("collection", restElements.length)}
            </ViewMoreContent>
          ) : null}
        </div>
      </div>
    </div>
  );
}
