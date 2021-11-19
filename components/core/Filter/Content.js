import * as React from "react";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";

import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";
import { TagsOnboarding } from "~/components/core/Onboarding/Tags";

import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";

const STYLES_DATAVIEWER_WRAPPER = (theme) => css`
  width: 100%;
  min-height: 100vh;
  padding: calc(20px + ${theme.sizes.filterNavbar}px) 24px 44px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: calc(31px + ${theme.sizes.filterNavbar}px) 16px 44px;
  }
`;

const STYLES_DATAVIEWER_EMPTY = (theme) => css`
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: calc(${theme.sizes.filterNavbar}px) 0px 0px;
  }
`;

const STYLES_EMPTY_STATE_WRAPPER = (theme) => css`
  // NOTE(amine): 100vh - headers' height - Dataviewer's bottom padding
  height: calc(100vh - ${theme.sizes.filterNavbar + theme.sizes.header}px - 44px);
  margin-top: 0px;
  @media (max-width: ${theme.sizes.mobile}px) {
    height: 100%;
  }
`;

const STYLES_EMPTY_STATE_DEMO = (theme) => css`
  margin-top: 36px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 65px;
  }
`;

const STYLES_UPLOAD_BUTTON = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  display: inline-flex;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 8px;
  width: 24px;
  height: 24px;
  pointer-events: auto;
  box-shadow: ${theme.shadow.lightSmall};
`;

export function Content({ viewer, onAction, isMobile, page, ...props }) {
  const [{ filterState }] = useFilterContext();
  const { objects } = filterState;

  const isOnboardingActive =
    viewer?.onboarding?.upload &&
    !viewer?.onboarding?.tags &&
    filterState?.type === "library" &&
    objects.length > 0;

  const isObjectsEmpty = objects.length === 0;

  return (
    <div css={[STYLES_DATAVIEWER_WRAPPER, isObjectsEmpty && STYLES_DATAVIEWER_EMPTY]} {...props}>
      {!isObjectsEmpty ? (
        <TagsOnboarding
          onAction={onAction}
          viewer={viewer}
          isActive={isOnboardingActive}
          isMobile={isMobile}
        >
          <DataView
            key="scene-files-folder"
            /** TODO(amine): when updating filters, update isOwner prop */
            isOwner={true}
            items={objects}
            onAction={onAction}
            viewer={viewer}
            page={page}
            isMobile={isMobile}
            view="grid"
          />
        </TagsOnboarding>
      ) : (
        <EmptyState css={STYLES_EMPTY_STATE_WRAPPER}>
          <FileTypeGroup />
          <div css={STYLES_EMPTY_STATE_DEMO}>
            <System.H5 as="p" color="textDark" style={{ textAlign: "center" }}>
              Use
              <span
                css={STYLES_UPLOAD_BUTTON}
                style={{ marginLeft: 8, marginRight: 8, position: "relative", top: 2 }}
              >
                <SVG.Plus height="16px" />
              </span>
              on the top right corner <br />
            </System.H5>
            <System.H5 as="p" color="textDark" style={{ marginTop: 4, textAlign: "center" }}>
              or drop files {isMobile ? <span> on desktop</span> : null} to save to Slate
            </System.H5>
          </div>
        </EmptyState>
      )}
    </div>
  );
}
