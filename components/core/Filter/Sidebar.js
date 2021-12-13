import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";
import * as Constants from "~/common/constants";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * Sidebar trigger
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_TRIGGER = (theme) => css`
  ${Styles.BUTTON_RESET};
  color: ${theme.semantic.textBlack};
  border-radius: 6px;
  padding: 2px;
  transition: background-color 0.3s;
  :hover {
    background-color: ${theme.semantic.bgGrayLight};
  }
`;

export function SidebarTrigger({ css }) {
  const [{ sidebarState }, { toggleSidebar }] = useFilterContext();
  return (
    <button
      onClick={toggleSidebar}
      css={[STYLES_SIDEBAR_TRIGGER, css]}
      style={{
        backgroundColor: sidebarState.isVisible ? Constants.semantic.bgGrayLight : "unset",
        color: sidebarState.isVisible ? Constants.semantic.textBlack : Constants.semantic.textGray,
      }}
    >
      <SVG.Sidebar style={{ display: "block" }} />
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Sidebar
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: fixed;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 300px;
  height: calc(100vh - ${theme.sizes.header + theme.sizes.filterNavbar}px);
  overflow-y: auto;
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
        <Filters.Tags
          page={page}
          onAction={onAction}
          data={data}
          viewer={viewer}
          style={{ marginTop: 12 }}
        />
        <Filters.Following
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
