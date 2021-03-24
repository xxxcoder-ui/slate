import * as React from "react";
import * as Events from "~/common/custom-events";

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
      prevName.current = name;
      setLoading(false);

      window.$SLATES_LOADED_FONTS.push(name);
    });
  }, deps);

  return { isFontLoading: loading, fontName: alreadyLoaded ? name : prevName.current };
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
      lineHeight: 100,
      tracking: 0,
    },
  },
  view: "paragraph",
};

const reducer = (state, action) => {
  const updateSettingsField = (field, newValue) => ({
    ...state,
    context: {
      ...state.context,
      settings: { ...state.context.settings, [field]: newValue },
    },
  });
  switch (action.type) {
    case "SET_DARK_MODE":
      return { ...state, context: { ...state.context, darkmode: true } };
    case "SET_LIGHT_MODE":
      return { ...state, context: { ...state.context, darkmode: false } };
    case "TOGGLE_SETTINGS_VISIBILITY":
      return { ...state, context: { ...state.context, showSettings: !state.context.showSettings } };
    case "UPDATE_FONT_SIZE":
      return updateSettingsField("fontSize", action.value);
    case "UPDATE_LINE_HEIGHT":
      return updateSettingsField("lineHeight", action.value);
    case "UPDATE_TRACKING":
      return updateSettingsField("tracking", action.value);
    case "UPDATE_COLUMN":
      return updateSettingsField("column", action.value);
    case "UPDATE_TEXT_ALIGN":
      return updateSettingsField("textAlign", action.value);
    case "UPDATE_VERTICAL_ALIGN":
      return updateSettingsField("valign", action.value);
    default:
      return state;
  }
};

export const useFontControls = () => {
  const [current, send] = React.useReducer(reducer, initialState);
  const handleDarkMode = (state) =>
    Events.dispatchCustomEvent({
      name: "set-slate-theme",
      detail: { fontPreviewDarkMode: state },
    });
  const handlers = React.useMemo(() => ({
    setDarkMode: () => handleDarkMode(true),
    setLightMode: () => handleDarkMode(false),
    toggleSettings: () => send({ type: "TOGGLE_SETTINGS_VISIBILITY" }),
    updateFontSize: (v) => send({ type: "UPDATE_FONT_SIZE", value: v }),
    updateLineHeight: (v) => send({ type: "UPDATE_LINE_HEIGHT", value: v }),
    updateTracking: (v) => send({ type: "UPDATE_TRACKING", value: v }),
    updateColumn: (v) => send({ type: "UPDATE_COLUMN", value: v }),
    updateTextAlign: (v) => send({ type: "UPDATE_TEXT_ALIGN", value: v }),
    updateVerticalAlign: (v) => send({ type: "UPDATE_VERTICAL_ALIGN", value: v }),
  }));
  return [current, handlers];
};
