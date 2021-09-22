import * as React from "react";
import * as ReactDOM from "react-dom";

export const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted ? ReactDOM.createPortal(children, document.getElementById("modals_portal")) : null;
};
