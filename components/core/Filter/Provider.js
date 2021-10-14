import * as React from "react";

import { useWorker } from "~/common/hooks";

const UploadContext = React.createContext({});

export const useFilterContext = () => React.useContext(UploadContext);

export const Provider = ({ children, viewer }) => {
  const [isSidebarVisible, toggleSidebar] = useFilterSidebar();

  const [filterState, { setFilterType, setFilterObjects, resetFilterState }] = useFilter({
    library: viewer.library,
  });

  const workerState = useFilterWorker({ filterState, setFilterObjects, library: viewer.library });

  const contextValue = React.useMemo(
    () => [
      { isSidebarVisible, filterState, ...workerState },
      { toggleSidebar, setFilterType, resetFilterState },
    ],
    [isSidebarVisible, filterState, workerState]
  );

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};

const useFilterSidebar = () => {
  const [isSidebarVisible, setSidebarState] = React.useState(false);
  const toggleSidebar = () => setSidebarState((prev) => !prev);
  return [isSidebarVisible, toggleSidebar];
};

const useFilter = ({ library }) => {
  const DEFAULT_STATE = {
    view: "initial",
    subview: undefined,
    type: "library",
    objects: library,
    search: {
      objects: [],
      tags: [],
      startDate: null,
      endDate: null,
    },
  };

  const [filterState, setFilterState] = React.useState(DEFAULT_STATE);

  const setFilterType = ({ view, subview = undefined, type }) =>
    setFilterState((prev) => ({ ...prev, view, subview, type }));

  const setFilterObjects = (objects) => setFilterState((prev) => ({ ...prev, objects }));

  const resetFilterState = () => setFilterState(DEFAULT_STATE);

  return [filterState, { setFilterType, resetFilterState, setFilterObjects }];
};

const useFilterWorker = ({ filterState, setFilterObjects, library }) => {
  const DEFAULT_STATE = { loading: false, error: false };
  const [workerState, setWorkerState] = React.useState(DEFAULT_STATE);

  const { view, subview, type } = filterState;

  /**
   * NOTE(amine): Web workers are usually pretty fast,
   * but if it takes more than 500ms to handle a task, we'll show a loading screen
   */
  const timeoutRef = React.useRef();

  useWorker(
    {
      onStart: (worker) => {
        worker.postMessage({ objects: library, view, subview, type });
        timeoutRef.current = setTimeout(() => {
          setWorkerState((prev) => ({ ...prev, loading: true }));
        }, 500);
      },
      onError: () => setWorkerState((prev) => ({ ...prev, error: true })),
      onMessage: (e) => {
        clearTimeout(timeoutRef.current);
        setWorkerState(DEFAULT_STATE);
        setFilterObjects(e.data);
      },
    },
    [view, subview, library, type]
  );

  return workerState;
};
