import * as React from "react";

const UploadContext = React.createContext({});
export const useFilterContext = () => React.useContext(UploadContext);

export const Provider = ({ children }) => {
  const [isSidebarVisible, toggleSidebar] = useFilterSidebar();

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

const useFilterSidebar = () => {
  const [isSidebarVisible, setSidebarState] = React.useState(false);
  const toggleSidebar = () => setSidebarState((prev) => !prev);
  return [isSidebarVisible, toggleSidebar];
};

const useFilterPopup = () => {
  const [isPopupVisible, setPopupVisibility] = React.useState(false);

  const hidePopup = () => setPopupVisibility(false);
  const togglePopup = () => setPopupVisibility((prev) => !prev);
  return [isPopupVisible, { hidePopup, togglePopup }];
};
