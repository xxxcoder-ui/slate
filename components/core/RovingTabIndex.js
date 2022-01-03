import * as React from "react";

import { mergeRefs } from "~/common/utilities";
import { useEventListener, useMounted } from "~/common/hooks";

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex Provider
 * -----------------------------------------------------------------------------------------------*/

const rovingIndexContext = React.createContext({});
const useRovingIndexContext = () => React.useContext(rovingIndexContext);

export function Provider({ axis, children }) {
  const focusedElementsRefs = React.useRef({});
  const initialIndex = 0;
  const [focusedIndex, setFocusedIndex] = React.useState(initialIndex);

  const registerItem = ({ index, ref }) => (focusedElementsRefs.current[index] = ref);
  const cleanupItem = (index) => delete focusedElementsRefs.current[index];

  const setIndexToNextElement = () => {
    const nextIndex = focusedIndex + 1;
    const elementsExists = focusedElementsRefs.current[nextIndex];
    setFocusedIndex(elementsExists ? nextIndex : initialIndex);
  };
  const setIndexPreviousElement = () => {
    const prevIndex = focusedIndex - 1;
    if (prevIndex >= initialIndex) {
      setFocusedIndex(prevIndex);
      return;
    }
    const lastIndex = Math.max(...Object.keys(focusedElementsRefs.current));
    setFocusedIndex(lastIndex);
  };

  useMounted(() => {
    const focusedElementRef = focusedElementsRefs.current[focusedIndex];
    focusedElementRef?.current?.focus();
  }, [focusedIndex]);

  const contextValue = React.useMemo(
    () => [
      { focusedIndex, axis },
      { registerItem, cleanupItem, setIndexToNextElement, setIndexPreviousElement },
    ],
    [focusedIndex]
  );

  return <rovingIndexContext.Provider value={contextValue}>{children}</rovingIndexContext.Provider>;
}

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex List
 * -----------------------------------------------------------------------------------------------*/
const useRovingHandler = ({ ref }) => {
  const [{ axis }, { setIndexToNextElement, setIndexPreviousElement }] = useRovingIndexContext();

  const keydownHandler = (e) => {
    if (axis === "vertical") {
      if (e.key === "ArrowUp") e.preventDefault(), setIndexPreviousElement();
      if (e.key === "ArrowDown") e.preventDefault(), setIndexToNextElement();
      return;
    }
    if (e.key === "ArrowLeft") e.preventDefault(), setIndexPreviousElement();
    if (e.key === "ArrowRight") e.preventDefault(), setIndexToNextElement();
  };
  useEventListener({
    type: "keydown",
    handler: keydownHandler,
    ref,
  });
};

export const List = React.forwardRef(({ children }, forwardedRef) => {
  const ref = React.useRef();
  useRovingHandler({ ref });

  return React.cloneElement(React.Children.only(children), {
    ref: mergeRefs([ref, children.ref, forwardedRef]),
  });
});

/* -------------------------------------------------------------------------------------------------
 * RovingTabIndex Item
 * -----------------------------------------------------------------------------------------------*/

export const Item = React.forwardRef(({ children, index, ...props }, forwardedRef) => {
  const [{ focusedIndex }, { registerItem, cleanupItem }] = useRovingIndexContext();
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    if (!ref.current) return;
    registerItem({ index, ref });
    return () => cleanupItem(index);
  }, [index]);

  return React.cloneElement(React.Children.only(children), {
    ...props,
    tabIndex: focusedIndex === index ? 0 : -1,
    ref: mergeRefs([ref, forwardedRef, children.ref]),
  });
});
