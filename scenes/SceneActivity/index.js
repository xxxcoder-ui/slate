import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { SecondaryTabGroup } from "~/components/core/TabGroup";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { useIntersection } from "common/hooks";
import { useActivity } from "./hooks";

import ScenePage from "~/components/core/ScenePage";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import ActivityGroup from "~/components/core/ActivityGroup";

const STYLES_GROUPS_CONTAINER = css`
  margin-top: 32px;
  & > * + * {
    margin-top: 32px;
  }
`;

const STYLES_LOADING_CONTAINER = css`
  height: 48px;
  margin-top: 32px;
  ${Styles.CONTAINER_CENTERED}
`;

export default function SceneActivity({ page, viewer, external, onAction }) {
  const { feed, tab, isLoading, updateFeed } = useActivity({
    page,
    viewer,
    onAction,
  });

  const divRef = React.useRef();
  useIntersection({
    ref: divRef,
    onIntersect: () => {
      if (feed?.length === 0 || isLoading[tab]) return;
      updateFeed();
    },
  });

  return (
    <WebsitePrototypeWrapper
      title={`${page.pageTitle} • Slate`}
      url={`${Constants.hostname}${page.pathname}`}
    >
      <ScenePage>
        {viewer && (
          <SecondaryTabGroup
            tabs={[
              { title: "My network", value: { tab: "activity" } },
              { title: "Explore", value: { tab: "explore" } },
            ]}
            value={tab}
            onAction={onAction}
            style={{ marginTop: 0 }}
          />
        )}
        <div css={STYLES_GROUPS_CONTAINER}>
          {feed?.map((group) => (
            <ActivityGroup
              key={group.id}
              viewer={viewer}
              external={external}
              onAction={onAction}
              group={group}
            />
          ))}
        </div>
        <div ref={divRef} css={STYLES_LOADING_CONTAINER}>
          {isLoading[tab] && <LoaderSpinner />}
        </div>
      </ScenePage>
    </WebsitePrototypeWrapper>
  );
}
