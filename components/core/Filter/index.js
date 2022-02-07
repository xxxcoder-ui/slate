import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Search from "~/components/core/Search";
import * as Filters from "~/components/core/Filter/Filters";
import * as Constants from "~/common/constants";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

import { css } from "@emotion/react";
import { Provider } from "~/components/core/Filter/Provider";
import { Sidebar, SidebarTrigger } from "~/components/core/Filter/Sidebar";
import { Popup, PopupTrigger } from "~/components/core/Filter/Popup";
import { useSearchStore } from "~/components/core/Search/store";
import { LoaderSpinner } from "~/components/system/components/Loaders";

/* -------------------------------------------------------------------------------------------------
 *  Title
 * -----------------------------------------------------------------------------------------------*/

function Title({ page, data }) {
  const { query, results, isFetchingResults, isSearching } = useSearchStore();
  let title = React.useMemo(() => {
    if (isFetchingResults)
      return (
        <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
          <LoaderSpinner style={{ height: 16, width: 16 }} />
          <System.H5
            title={title}
            style={{ maxWidth: 400, marginLeft: 8 }}
            as="p"
            nbrOflines={1}
            color="textBlack"
          >
            Searching: {query}
          </System.H5>
        </div>
      );
    if (results && query) return `Showing results for: "${query}"`;
    if (page.id === "NAV_DATA") return "Recent";
    if (page.id === "NAV_SLATE" && data?.slatename) return "# " + data?.slatename;
    if (page.id === "NAV_PROFILE") return "@ " + data.username;
    if (page.id === "NAV_SETTINGS") return page.name;
    if (page.id === "NAV_API") return page.name;

    return null;
  }, [page, data, isFetchingResults, isSearching]);

  return typeof title === "string" ? (
    <System.H5 title={title} style={{ maxWidth: 400 }} as="p" nbrOflines={1} color="textBlack">
      {title}
    </System.H5>
  ) : (
    title
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Actions
 * -----------------------------------------------------------------------------------------------*/

function Actions() {
  return <div />;
}

const STYLES_NAVBAR = (theme) => css`
  box-sizing: border-box;
  min-height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadow.lightSmall};
  padding: 0px 24px;
  box-sizing: border-box;
  border-bottom: 0.5px solid ${theme.semantic.borderGrayLight};

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 0px 16px;
  }
`;

const STYLES_NAVBAR_BACKGROUND = (theme) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: -1;

  background-color: ${theme.semantic.bgWhite};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhite};
  }

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 9px 16px 11px;
  }
`;

const STYLES_FILTER_TITLE_WRAPPER = css`
  ${Styles.MOBILE_HIDDEN};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const STYLES_FILTER_POPUP_WRAPPER = (theme) => css`
  position: absolute;
  top: calc(100% + 4px);
  left: 4px;
  width: 100%;

  @media (max-width: ${theme.sizes.mobile}px) {
    top: 100%;
    left: 0px;
  }
`;

const STYLES_PROFILE_SECTION = (theme) => css`
  box-sizing: border-box;
  background-color: ${theme.semantic.bgLight};
  padding: 16px;
  border-bottom: 0.5px solid ${theme.semantic.borderGrayLight};
`;

/* -------------------------------------------------------------------------------------------------
 *  Filter
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_CONTENT = css`
  ${Styles.HORIZONTAL_CONTAINER};
  width: 100%;
  ${"" /* margin-top: ${theme.sizes.filterNavbar}px; */}
`;

export default function Filter({
  disabled,
  viewer,
  onAction,
  page,
  data,
  isMobile,
  children,
  isProfilePage,
}) {
  const { results, isSearching } = useSearchStore();
  const showSearchResult = isSearching && !!results;

  if (disabled) {
    return showSearchResult ? (
      <WebsitePrototypeWrapper
        title={`${page.pageTitle} • Slate`}
        url={`${Constants.hostname}${page.pathname}`}
      >
        <Search.Content viewer={viewer} page={page} onAction={onAction} isMobile={isMobile} />
      </WebsitePrototypeWrapper>
    ) : (
      children
    );
  }

  return (
    <Provider viewer={viewer}>
      {isProfilePage && isMobile ? (
        <div css={STYLES_PROFILE_SECTION}>
          <Filters.Profile page={page} data={data} viewer={viewer} onAction={onAction} />
        </div>
      ) : null}
      <div
        style={{
          position: "sticky",
          top: Constants.sizes.header,
          zIndex: Constants.zindex.header - 1, //NOTE(martina): so it doesn't cover up the ApplicationUserControls
        }}
      >
        <div css={STYLES_NAVBAR}>
          <div css={STYLES_NAVBAR_BACKGROUND} />
          <div css={STYLES_FILTER_POPUP_WRAPPER} style={{ perspective: "1000px" }}>
            <Popup
              viewer={viewer}
              onAction={onAction}
              data={data}
              page={page}
              isMobile={isMobile}
              isProfilePage={isProfilePage}
            />
          </div>

          {isProfilePage && !isMobile ? null : (
            <div css={Styles.CONTAINER_CENTERED}>
              <div css={Styles.MOBILE_HIDDEN}>
                <SidebarTrigger isMobile={isMobile} />
              </div>
              <PopupTrigger isMobile={isMobile} style={{ marginLeft: 2 }}>
                <span css={Styles.MOBILE_ONLY} style={{ marginRight: 8 }}>
                  <Title page={page} data={data} />
                </span>
              </PopupTrigger>
            </div>
          )}

          <div css={STYLES_FILTER_TITLE_WRAPPER}>
            <Title page={page} data={data} />
          </div>
          <Actions />
        </div>
      </div>
      <div css={STYLES_FILTER_CONTENT}>
        <Sidebar
          viewer={viewer}
          onAction={onAction}
          data={data}
          page={page}
          isMobile={isMobile}
          isProfilePage={isProfilePage}
        />
        <div style={{ flexGrow: 1 }}>
          {showSearchResult ? (
            <WebsitePrototypeWrapper
              title={`${page.pageTitle} • Slate`}
              url={`${Constants.hostname}${page.pathname}`}
            >
              <Search.Content viewer={viewer} page={page} onAction={onAction} isMobile={isMobile} />
            </WebsitePrototypeWrapper>
          ) : (
            children
          )}
        </div>
      </div>
    </Provider>
  );
}
