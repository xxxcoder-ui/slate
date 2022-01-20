import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as Tooltip from "~/components/system/components/fragments/Tooltip";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { css } from "@emotion/react";
import { useEventListener } from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 * Sidebar trigger
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_TRIGGER = (theme) => css`
  color: ${theme.semantic.textBlack};
  border-radius: 6px;
  padding: 2px;
  transition: background-color 0.3s;
  :hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

export const SidebarTrigger = React.forwardRef(({ css, isMobile, ...props }, ref) => {
  const [{ sidebarState }, { toggleSidebar }] = useFilterContext();

  const handleKeyDown = (e) => {
    const targetTagName = e.target.tagName;
    if (targetTagName === "INPUT" || targetTagName === "TEXTAREA" || targetTagName === "SELECT")
      return;

    if (e.key === "\\" || e.code === "Backslash") toggleSidebar();
  };
  useEventListener({ type: "keydown", handler: handleKeyDown, enabled: !isMobile });

  return (
    <Tooltip.Root vertical="below" horizontal="right">
      <Tooltip.Trigger aria-describedby="filter-sidebar-trigger-tooltip">
        <System.ButtonPrimitive
          onClick={toggleSidebar}
          css={[STYLES_SIDEBAR_TRIGGER, css]}
          style={{
            backgroundColor: sidebarState.isVisible ? Constants.semantic.bgGrayLight : "unset",
            color: sidebarState.isVisible
              ? Constants.semantic.textBlack
              : Constants.semantic.textGray,
          }}
          ref={ref}
          {...props}
        >
          <SVG.Sidebar style={{ display: "block" }} />
        </System.ButtonPrimitive>
      </Tooltip.Trigger>
      <Tooltip.Content
        style={{ marginTop: 4.5, marginLeft: -8 }}
        css={Styles.HORIZONTAL_CONTAINER_CENTERED}
      >
        <System.H6 id="filter-sidebar-trigger-tooltip" as="p" color="textGrayDark">
          Click to toggle the sidebar
        </System.H6>
      </Tooltip.Content>
    </Tooltip.Root>
  );
});

/* -------------------------------------------------------------------------------------------------
 *  Sidebar
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: fixed;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 300px;
  height: calc(100vh - ${theme.sizes.header + theme.sizes.filterNavbar}px);
  overflow: auto;
  overflow: overlay;
  padding: 20px 24px calc(16px + ${theme.sizes.intercomWidget}px + ${theme.sizes.filterNavbar}px);
  background-color: ${theme.semantic.bgLight};

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 12px;
  }
`;

export function Sidebar({ viewer, onAction, data, page, isMobile, isProfilePage }) {
  const [{ sidebarState }] = useFilterContext();

  if ((!isProfilePage || isMobile) && (!sidebarState.isVisible || isMobile)) return null;

  if (isProfilePage) {
    return (
      <div style={{ width: 300 }}>
        <div css={STYLES_SIDEBAR_FILTER_WRAPPER}>
          <Filters.Profile
            page={page}
            data={data}
            viewer={viewer}
            onAction={onAction}
            style={{ marginBottom: 24 }}
          />
          <Filters.ProfileTags
            page={page}
            onAction={onAction}
            data={data}
            viewer={viewer}
            style={{ marginTop: 12 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 300 }}>
      <div css={STYLES_SIDEBAR_FILTER_WRAPPER}>
        <Filters.Library page={page} onAction={onAction} />
        <Filters.PrivateTags
          page={page}
          onAction={onAction}
          data={data}
          viewer={viewer}
          style={{ marginTop: 12 }}
        />
        <Filters.PublicTags
          page={page}
          onAction={onAction}
          data={data}
          viewer={viewer}
          style={{ marginTop: 12 }}
        />
        <Filters.Following
          onAction={onAction}
          data={data}
          viewer={viewer}
          style={{ marginTop: 12 }}
        />
      </div>
    </div>
  );
}
