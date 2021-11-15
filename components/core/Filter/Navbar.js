import * as React from "react";
import * as ReactDOM from "react-dom";

import { usePortals } from "~/components/core/PortalsProvider";
import { css } from "@emotion/react";
import { Divider } from "~/components/system";

/* -------------------------------------------------------------------------------------------------
 *  Navbar Portal
 * -----------------------------------------------------------------------------------------------*/

export function NavbarPortal({ children }) {
  const { filterNavbar } = usePortals();
  const [filterNavbarElement] = filterNavbar;

  return filterNavbarElement
    ? ReactDOM.createPortal(
        <>
          <Divider height="0.5px" />
          <div css={STYLES_NAVBAR}>{children}</div>
        </>,
        filterNavbarElement
      )
    : null;
}

/* -------------------------------------------------------------------------------------------------
 *  Navbar
 * -----------------------------------------------------------------------------------------------*/

const STYLES_NAVBAR = (theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.semantic.bgWhite};
  padding: 9px 24px 11px;
  box-shadow: ${theme.shadow.lightSmall};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
    background-color: ${theme.semantic.bgBlurWhite};
  }

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 9px 16px 11px;
  }
`;

export function Navbar({ children }) {
  const { filterNavbar } = usePortals();
  const [, setFilterElement] = filterNavbar;
  return <div ref={setFilterElement}>{children}</div>;
}
