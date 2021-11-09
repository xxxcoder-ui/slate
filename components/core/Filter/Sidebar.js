import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";

import * as FilterUtilities from "~/common/filter-utilities";
import { useFilterContext } from "~/components/core/Filter/Provider";
import { Show } from "~/components/utility/Show";
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

export function SidebarTrigger() {
  const [{ isSidebarVisible }, { toggleSidebar }] = useFilterContext();
  return (
    <button
      onClick={toggleSidebar}
      css={[
        STYLES_SIDEBAR_TRIGGER,
        (theme) =>
          css({
            backgroundColor: isSidebarVisible ? theme.semantic.bgGrayLight : "none",
            color: isSidebarVisible ? theme.semantic.textBlack : theme.semantic.textGray,
          }),
      ]}
    >
      <SVG.Sidebar style={{ display: "block" }} />
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Sidebar
 * -----------------------------------------------------------------------------------------------*/

export function Sidebar() {
  const [{ isSidebarVisible }] = useFilterContext();
  return (
    <Show when={isSidebarVisible}>
      <div css={STYLES_SIDEBAR_FILTER_WRAPPER}>
        <SidebarContent />
      </div>
    </Show>
  );
}

const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: sticky;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 236px;
  height: 100vh;
  max-height: calc(100vh - ${theme.sizes.header + theme.sizes.filterNavbar}px);
  padding: 20px;
  background-color: ${theme.semantic.bgLight};

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 12px;
  }
`;

/* -------------------------------------------------------------------------------------------------
 *  SidebarContent
 * -----------------------------------------------------------------------------------------------*/

function SidebarContent() {
  const [{ filterState }, { setFilterType }] = useFilterContext();
  const currentView = filterState.view;
  const currentSubview = filterState.subview;

  const { FILTER_VIEWS_IDS, FILTER_SUBVIEWS_IDS } = FilterUtilities;
  const { filters, subviews } = FilterUtilities.getViewData(currentView);

  const changeFilterView = (view) => {
    const { filters } = FilterUtilities.getViewData(view);
    setFilterType({ view: view, type: filters.initial });
  };

  const changeFilterSubview = (subview) => {
    const initialType = subviews[subview].filters.initial;
    setFilterType({ view: currentView, subview, type: initialType });
  };

  if (currentView === FILTER_VIEWS_IDS.browser) {
    if (currentSubview === FILTER_SUBVIEWS_IDS.browser.saved) {
      const { filters } = subviews[currentSubview];
      return <Filters.BrowserSaved filters={filters} />;
    }

    return (
      <Filters.Browser
        filters={filters}
        goToSavedSubview={() => changeFilterSubview(FILTER_SUBVIEWS_IDS.browser.saved)}
      />
    );
  }

  return (
    <Filters.Initial
      filters={filters}
      goToBrowserView={() => changeFilterView(FILTER_VIEWS_IDS.browser)}
    />
  );
}
