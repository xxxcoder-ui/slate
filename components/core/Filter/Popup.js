import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Filters from "~/components/core/Filter/Filters";
import * as System from "~/components/system";

import { useFilterContext } from "~/components/core/Filter/Provider";
import { motion } from "framer-motion";
import { css } from "@emotion/react";

/* -------------------------------------------------------------------------------------------------
 * Popup trigger
 * -----------------------------------------------------------------------------------------------*/

const STYLES_POPUP_TRIGGER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  perspective: 1000px;
  color: ${theme.semantic.textBlack};
`;

export function PopupTrigger({ children, isMobile, ...props }) {
  const [{ sidebarState, popupState }, { hidePopup, togglePopup }] = useFilterContext();

  React.useEffect(() => {
    if (sidebarState.isVisible) {
      hidePopup();
    }
  }, [sidebarState.isVisible]);

  if (sidebarState.isVisible && !isMobile) return null;

  return (
    <System.ButtonPrimitive
      onClick={togglePopup}
      css={STYLES_POPUP_TRIGGER}
      //NOTE(amine): fix to a bug where elements using rotate disappear in safari https://stackoverflow.com/questions/22621544/webkit-transform-breaks-z-index-on-safari
      {...props}
    >
      {children}
      <motion.div
        style={{ color: "inherit" }}
        initial={{ rotateX: popupState.isVisible ? 0 : 180 }}
        animate={{ rotateX: popupState.isVisible ? 0 : 180 }}
      >
        <SVG.ChevronUp style={{ display: "block" }} />
      </motion.div>
    </System.ButtonPrimitive>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Popup
 * -----------------------------------------------------------------------------------------------*/
const STYLES_SIDEBAR_FILTER_WRAPPER = (theme) => css`
  position: sticky;
  top: ${theme.sizes.header + theme.sizes.filterNavbar}px;
  width: 236px;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: ${theme.shadow.lightLarge};
  border: 1px solid ${theme.semantic.borderGrayLight};

  background-color: ${theme.semantic.bgLight};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.semantic.bgBlurWhite};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }

  @media (max-width: ${theme.sizes.mobile}px) {
    border-radius: unset;
    width: 100%;
    max-height: 375px;
    padding: 15px 8px;
  }
`;

export function Popup({ viewer, onAction, css, data, page, isMobile, isProfilePage, ...props }) {
  const [{ popupState }] = useFilterContext();

  if (isProfilePage && !isMobile) {
    return null;
  }

  if (!popupState.isVisible) return null;

  if (isProfilePage) {
    return (
      <div css={[STYLES_SIDEBAR_FILTER_WRAPPER, css]} {...props}>
        <Filters.ProfileTags
          page={page}
          onAction={onAction}
          data={data}
          viewer={viewer}
          style={{ marginTop: 12 }}
        />
      </div>
    );
  }

  return (
    <div css={[STYLES_SIDEBAR_FILTER_WRAPPER, css]} {...props}>
      <Filters.Library page={page} onAction={onAction} />
      <Filters.PrivateTags
        viewer={viewer}
        data={data}
        page={page}
        onAction={onAction}
        style={{ marginTop: 12 }}
      />
      <Filters.PublicTags
        viewer={viewer}
        data={data}
        page={page}
        onAction={onAction}
        style={{ marginTop: 12 }}
      />
      <Filters.Following
        viewer={viewer}
        data={data}
        page={page}
        onAction={onAction}
        style={{ marginTop: 12 }}
      />
    </div>
  );
}
