import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Search from "~/components/core/Search";

import { css } from "@emotion/react";
import { NavbarPortal } from "~/components/core/Filter/Navbar";
import { Provider } from "~/components/core/Filter/Provider";
import { Sidebar, SidebarTrigger } from "~/components/core/Filter/Sidebar";
import { Popup, PopupTrigger } from "~/components/core/Filter/Popup";
import { useSearchStore } from "~/components/core/Search/store";

/* -------------------------------------------------------------------------------------------------
 *  Title
 * -----------------------------------------------------------------------------------------------*/

function Title({ page, data }) {
  const { query, isSearching } = useSearchStore();
  let title = React.useMemo(() => {
    if (isSearching) return `Searching for ${query}`;
    if (page.id === "NAV_DATA") return "My library";
    if (page.id === "NAV_SLATE" && data?.slatename) return "# " + data?.slatename;
  }, [page, data, query, isSearching]);

  return (
    <System.H5 title={title} style={{ maxWidth: 400 }} as="p" nbrOflines={1} color="textBlack">
      {title}
    </System.H5>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Actions
 * -----------------------------------------------------------------------------------------------*/

function Actions() {
  return <div />;
}

const STYLES_FILTER_TITLE_WRAPPER = css`
  ${Styles.MOBILE_HIDDEN};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const STYLES_FILTER_POPUP_WRAPPER = (theme) => css`
  position: absolute;
  top: calc(${theme.sizes.filterNavbar}px + 4px);
  left: 4px;
  width: 100%;
  @media (max-width: ${theme.sizes.mobile}px) {
    top: ${theme.sizes.filterNavbar}px;
    left: 0px;
  }
`;

/* -------------------------------------------------------------------------------------------------
 *  Filter
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_CONTENT = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER};
  width: 100%;
  margin-top: ${theme.sizes.filterNavbar}px;
`;

export default function Filter({ isActive, viewer, onAction, page, data, isMobile, children }) {
  const { results, isSearching } = useSearchStore();
  const showSearchResult = isSearching && !!results;

  if (!isActive) {
    return showSearchResult ? (
      <Search.Content viewer={viewer} page={page} onAction={onAction} />
    ) : (
      children
    );
  }

  return (
    <>
      <Provider>
        <NavbarPortal>
          <div css={STYLES_FILTER_POPUP_WRAPPER}>
            <Popup viewer={viewer} onAction={onAction} data={data} page={page} />
          </div>

          <div css={Styles.CONTAINER_CENTERED}>
            <div css={Styles.MOBILE_HIDDEN}>
              <SidebarTrigger />
            </div>
            <PopupTrigger isMobile={isMobile} style={{ marginLeft: 2 }}>
              <span css={Styles.MOBILE_ONLY} style={{ marginRight: 8 }}>
                <Title page={page} data={data} />
              </span>
            </PopupTrigger>
          </div>

          <div css={STYLES_FILTER_TITLE_WRAPPER}>
            <Title page={page} data={data} />
          </div>
          <Actions />
        </NavbarPortal>
        <div css={STYLES_FILTER_CONTENT}>
          <Sidebar
            viewer={viewer}
            onAction={onAction}
            data={data}
            page={page}
            isMobile={isMobile}
          />
          <div style={{ flexGrow: 1 }}>
            {showSearchResult ? (
              <Search.Content viewer={viewer} page={page} onAction={onAction} />
            ) : (
              children
            )}
          </div>
        </div>
      </Provider>
    </>
  );
}
