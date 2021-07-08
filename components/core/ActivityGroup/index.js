import * as React from "react";

import { css } from "@emotion/react";

import {
  ActivityFileGroup,
  ActivityCollectionGroup,
  ActivityProfileGroup,
} from "~/components/core/ActivityGroup/components";

const STYLES_GROUP_GRID = css`
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-row-gap: 32px;
  border-bottom: 1px solid #e5e5ea;
  padding-bottom: 24px;
`;

export default function ActivityGroup({ onAction, viewer, external, group }) {
  const { type } = group;
  if (type === "CREATE_FILE" || type === "CREATE_SLATE_OBJECT" || type === "LIKE_FILE") {
    return <ActivityFileGroup viewer={viewer} onAction={onAction} group={group} />;
  }

  if (type === "CREATE_SLATE" || type === "SUBSCRIBE_SLATE") {
    return <ActivityCollectionGroup onAction={onAction} group={group} />;
  }

  if (type === "SUBSCRIBE_USER") {
    return (
      <ActivityProfileGroup onAction={onAction} viewer={viewer} external={external} group={group} />
    );
  }
  console.log(group);
  return (
    <div css={STYLES_GROUP_GRID}>
      <div>{type}</div>
    </div>
  );
}
