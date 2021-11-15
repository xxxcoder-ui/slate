import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";

import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";

/* -------------------------------------------------------------------------------------------------
 *  Shared components between filters
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_BUTTON_HIGHLIGHTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_FILTER_BUTTON = (theme) => css`
  display: flex;
  align-items: center;
  width: 100%;
  ${Styles.BUTTON_RESET};
  padding: 4px 8px;
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:disabled {
    color: ${theme.semantic.textGray};
    pointer-events: none;
    cursor: not-allowed;
  }
`;

const STYLES_FILTERS_GROUP = css`
  & > * + * {
    margin-top: 4px !important;
  }
  li {
    list-style: none;
  }
`;

const FilterButton = ({ children, Icon, isSelected, ...props }) => (
  <li>
    <Typography.P2
      as="button"
      css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}
      {...props}
    >
      <Icon height={16} width={16} />
      <span style={{ marginLeft: 6 }}>{children}</span>
    </Typography.P2>
  </li>
);

const FilterSection = ({ title, children, ...props }) => (
  <div {...props}>
    {title && (
      <Typography.H6 style={{ paddingLeft: 8, paddingBottom: 4 }} color="textGray">
        {title}
      </Typography.H6>
    )}
    <ul css={STYLES_FILTERS_GROUP}>{children}</ul>
  </div>
);

/* -------------------------------------------------------------------------------------------------
 *  InitialFilters
 * -----------------------------------------------------------------------------------------------*/

function Initial({ filters, goToBrowserView }) {
  const [{ filterState }, { setFilterType, resetFilterState }] = useFilterContext();
  const currentFilterType = filterState.type;
  const currentFilterView = filterState.view;

  const changeFilter = ({ type }) => setFilterType({ view: currentFilterView, type });

  return (
    <>
      {/** Breadcrumb All */}
      <FilterSection>
        <FilterButton
          Icon={SVG.Clock}
          isSelected={currentFilterType === filters.library}
          onClick={resetFilterState}
        >
          My Library
        </FilterButton>
      </FilterSection>
      <FilterSection title="Connected" style={{ marginTop: 16 }}>
        <FilterButton Icon={SVG.Layout} onClick={goToBrowserView}>
          Browser
        </FilterButton>
      </FilterSection>
      <FilterSection style={{ marginTop: 16 }} title="Types">
        <FilterButton
          Icon={SVG.Image}
          isSelected={currentFilterType === filters.images}
          onClick={() => changeFilter({ type: filters.images })}
        >
          Images
        </FilterButton>
        <FilterButton
          Icon={SVG.Radio}
          isSelected={currentFilterType === filters.audios}
          onClick={() => changeFilter({ type: filters.audios })}
        >
          Audios
        </FilterButton>
        <FilterButton
          Icon={SVG.Video}
          isSelected={currentFilterType === filters.videos}
          onClick={() => changeFilter({ type: filters.videos })}
        >
          Videos
        </FilterButton>
        <FilterButton
          Icon={SVG.FileText}
          isSelected={currentFilterType === filters.documents}
          onClick={() => changeFilter({ type: filters.documents })}
        >
          Documents
        </FilterButton>
      </FilterSection>
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Browser Filters
 * -----------------------------------------------------------------------------------------------*/

function Browser({ filters, goToSavedSubview }) {
  const [{ filterState }] = useFilterContext();
  const currentFilterType = filterState.type;

  return (
    <FilterSection>
      <FilterButton Icon={SVG.Clock} isSelected={currentFilterType === filters.all}>
        All
      </FilterButton>
      <FilterButton disabled Icon={SVG.Clock}>
        History
      </FilterButton>
      <FilterButton disabled Icon={SVG.Bookmark}>
        Bookmarks
      </FilterButton>
      <FilterButton Icon={SVG.FilePlus} onClick={goToSavedSubview}>
        Saved
      </FilterButton>
    </FilterSection>
  );
}

const BrowserSaved = ({ filters }) => {
  const [{ filterState }, { setFilterType }] = useFilterContext();
  const currentFilterType = filterState.type;

  const changeSavedFilterType = (type) =>
    setFilterType({ view: filterState.view, subview: filterState.subview, type });

  return (
    <FilterSection>
      <FilterButton
        Icon={SVG.Clock}
        isSelected={currentFilterType === filters.all}
        onClick={() => changeSavedFilterType(filters.all)}
      >
        All
      </FilterButton>
      <FilterButton
        Icon={SVG.Twitter}
        isSelected={currentFilterType === filters.twitter}
        onClick={() => changeSavedFilterType(filters.twitter)}
      >
        Twitter
      </FilterButton>
      <FilterButton
        Icon={SVG.Youtube}
        isSelected={currentFilterType === filters.youtube}
        onClick={() => changeSavedFilterType(filters.youtube)}
      >
        Youtube
      </FilterButton>
      <FilterButton
        Icon={SVG.Github}
        isSelected={currentFilterType === filters.github}
        onClick={() => changeSavedFilterType(filters.github)}
      >
        Github
      </FilterButton>
      <FilterButton
        Icon={SVG.Twitch}
        isSelected={currentFilterType === filters.twitch}
        onClick={() => changeSavedFilterType(filters.twitch)}
      >
        Twitch
      </FilterButton>
      <FilterButton
        Icon={SVG.Instagram}
        isSelected={currentFilterType === filters.instagram}
        onClick={() => changeSavedFilterType(filters.instagram)}
      >
        Instagram
      </FilterButton>
    </FilterSection>
  );
};

export { Initial, Browser, BrowserSaved };
