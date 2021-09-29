import * as React from "react";
import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { css } from "@emotion/react";
import { FILTER_VIEWS_IDS, FILTER_TYPES } from "~/common/filter-utilities";
import { Show } from "~/components/utility/Show";

const STYLES_BREADCRUMB_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  :hover {
    color: ${theme.semantic.textBlack};
  }
`;

function Item({ children, color, includeDelimiter, ...props }) {
  return (
    <>
      {includeDelimiter && (
        <System.P2 as="span" color="textGray">
          {" "}
          /{" "}
        </System.P2>
      )}
      <button css={STYLES_BREADCRUMB_BUTTON} {...props}>
        <System.P2 color={color}>{children}</System.P2>
      </button>
    </>
  );
}

export function Breadcrumb(props) {
  const [{ filterState }, { setFilterType, resetFilterState }] = useFilterContext();
  const isCurrentViewInitial = filterState.view === FILTER_VIEWS_IDS.initial;

  const changeFilterToBrowerView = () =>
    setFilterType({
      view: FILTER_VIEWS_IDS.browser,
      type: FILTER_TYPES[FILTER_VIEWS_IDS.browser].filters.initial,
    });

  return (
    <div {...props}>
      <Show when={!isCurrentViewInitial}>
        <Item onClick={resetFilterState} color="textGray">
          All
        </Item>
        <Item
          includeDelimiter
          color={filterState.subview ? "textGray" : "textBlack"}
          onClick={changeFilterToBrowerView}
        >
          {Strings.capitalize(filterState.view)}
        </Item>
      </Show>
      <Show when={filterState.subview}>
        <Item includeDelimiter>{Strings.capitalize(filterState.subview)}</Item>
      </Show>
    </div>
  );
}
