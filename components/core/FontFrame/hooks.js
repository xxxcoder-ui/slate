import * as React from "react";

export const useFont = ({ url, name }, deps) => {
  const [loading, setLoading] = React.useState(false);
  const prevName = React.useRef(name);

  if (!window.$SLATES_LOADED_FONTS) window.$SLATES_LOADED_FONTS = [];
  const alreadyLoaded = window.$SLATES_LOADED_FONTS.includes(name);

  React.useEffect(() => {
    if (alreadyLoaded) return;

    setLoading(true);
    const customFonts = new FontFace(name, `url(${url})`);
    customFonts.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setLoading(false);
      window.$SLATES_LOADED_FONTS.push(name);
    });
  }, deps);
  return { isFontLoading: loading, fontName: alreadyLoaded || !loading ? name : prevName.current };
};

const initialState = {
  context: {
    darkmode: true,
    showSettings: true,
    settings: {
      valign: "center",
      textAlign: "left",
      fontSize: 24,
      column: 1,
      lineHeight: 1,
      tracking: 0,
      leading: 0,
    },
  },
  view: "paragraph",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DARK_MODE":
      return { ...state, context: { ...state.context, darkmode: true } };
    case "SET_LIGHT_MODE":
      return { ...state, context: { ...state.context, darkmode: false } };
    case "TOGGLE_SETTINGS_VISIBILITY":
      return { ...state, context: { ...state.context, showSettings: !state.context.showSettings } };
    default:
      return state;
  }
};

export const useFontControls = () => {
  const [current, send] = React.useReducer(reducer, initialState);
  const handlers = React.useMemo(
    () => ({
      setDarkMode: () => send({ type: "SET_DARK_MODE" }),
      setLightMode: () => send({ type: "SET_LIGHT_MODE" }),
      toggleSettings: () => send({ type: "TOGGLE_SETTINGS_VISIBILITY" }),
    }),
    []
  );
  return [current, handlers];
};
