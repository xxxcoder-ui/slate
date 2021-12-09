import { has } from "lodash";
import * as React from "react";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

const UploadContext = React.createContext({});
export const useFilterContext = () => React.useContext(UploadContext);

export const Provider = ({ children, viewer }) => {
  const [isSidebarVisible, toggleSidebar] = useFilterSidebar({ viewer });

  const [isPopupVisible, { hidePopup, togglePopup }] = useFilterPopup();

  const contextValue = React.useMemo(
    () => [
      {
        sidebarState: { isVisible: isSidebarVisible },
        popupState: { isVisible: isPopupVisible },
      },
      { toggleSidebar, hidePopup, togglePopup },
    ],
    [isSidebarVisible, isPopupVisible]
  );

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};

const useFilterSidebar = ({ viewer }) => {
  const initialState =
    typeof viewer?.settings?.isSidebarVisible === "undefined"
      ? true
      : viewer.settings.isSidebarVisible;

  const [isSidebarVisible, setSidebarState] = React.useState(initialState);
  const toggleSidebar = async () => {
    setSidebarState((prev) => !prev);
    const response = await Actions.updateViewer({
      user: { settings: { isSidebarVisible: !isSidebarVisible } },
    });
    Events.hasError(response);
  };

  return [isSidebarVisible, toggleSidebar];
};

const useFilterPopup = () => {
  const [isPopupVisible, setPopupVisibility] = React.useState(false);

  const hidePopup = () => setPopupVisibility(false);
  const togglePopup = () => setPopupVisibility((prev) => !prev);
  return [isPopupVisible, { hidePopup, togglePopup }];
};
