import * as React from "react";

/**
 * NOTE(amine): Component used to assign Portals in client side
 */

const LayoutContext = React.createContext({});

export default function PortalsProvider({ children }) {
  const filterNavbar = React.useState();
  const contextValue = React.useMemo(() => ({ filterNavbar }), [filterNavbar]);

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
}

export const usePortals = () => React.useContext(LayoutContext);
