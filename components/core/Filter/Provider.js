import * as React from "react";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

const UploadContext = React.createContext({});
export const useFilterContext = () => React.useContext(UploadContext);

export const Provider = ({ children, viewer }) => {
  const [isSidebarCollapsed, toggleSidebar] = useFilterSidebar({ viewer });

  const [isPopupVisible, { hidePopup, togglePopup }] = useFilterPopup();

  const contextValue = React.useMemo(
    () => [
      {
        sidebarState: { isVisible: !isSidebarCollapsed },
        popupState: { isVisible: isPopupVisible },
      },
      { toggleSidebar, hidePopup, togglePopup },
    ],
    [isSidebarCollapsed, isPopupVisible]
  );

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};

const useFilterSidebar = ({ viewer }) => {
  const initialState = viewer?.isFilterSidebarCollapsed;

  const [isSidebarCollapsed, setSidebarState] = React.useState(initialState);
  const toggleSidebar = async () => {
    const nextState = !isSidebarCollapsed;
    setSidebarState(nextState);
    const response = await Actions.updateViewer({
      user: { isFilterSidebarCollapsed: nextState },
    });
    Events.hasError(response);
  };

  return [isSidebarCollapsed, toggleSidebar];
};

const useFilterPopup = () => {
  const [isPopupVisible, setPopupVisibility] = React.useState(false);

  const hidePopup = () => setPopupVisibility(false);
  const togglePopup = () => setPopupVisibility((prev) => !prev);
  return [isPopupVisible, { hidePopup, togglePopup }];
};
