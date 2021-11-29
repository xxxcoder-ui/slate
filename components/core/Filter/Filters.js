import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";

import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";
import { Link } from "~/components/core/Link";

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
  padding: 5px 8px 3px;
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
    <Link {...props}>
      <span as="span" css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}>
        <Icon height={16} width={16} style={{ flexShrink: 0 }} />
        <Typography.P2 as="span" nbrOflines={1} style={{ marginLeft: 6 }}>
          {children}
        </Typography.P2>
      </span>
    </Link>
  </li>
);

const FilterSection = ({ title, children, ...props }) => (
  <div {...props}>
    {title && (
      <Typography.H6 style={{ paddingLeft: 8, marginBottom: 4 }} color="textGray">
        {title}
      </Typography.H6>
    )}
    <ul css={STYLES_FILTERS_GROUP}>{children}</ul>
  </div>
);

/* -------------------------------------------------------------------------------------------------
 *  InitialFilters
 * -----------------------------------------------------------------------------------------------*/

function Library({ page, onAction }) {
  const [, { hidePopup }] = useFilterContext();

  const isSelected = page.id === "NAV_DATA";

  return (
    <>
      <FilterSection>
        <FilterButton
          href="/_/data"
          isSelected={isSelected}
          onAction={onAction}
          Icon={SVG.Clock}
          onClick={hidePopup}
        >
          My Library
        </FilterButton>
      </FilterSection>
    </>
  );
}

function Tags({ viewer, data, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  return (
    <FilterSection title="Tags" {...props}>
      {viewer.slates.map((slate) => (
        <FilterButton
          key={slate.id}
          href={`/$/slate/${slate.id}`}
          isSelected={slate.id === data?.id}
          onAction={onAction}
          Icon={slate.isPublic ? SVG.Hash : SVG.SecurityLock}
          onClick={hidePopup}
        >
          {slate.slatename}
        </FilterButton>
      ))}
    </FilterSection>
  );
}

export { Library, Tags };
