import * as React from "react";
import * as Events from "~/common/custom-events";

import { generateNumberByStep } from "~/common/utilities";

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

  return {
    isFontLoading: loading,
    // NOTE(Amine): show previous font while we load the new one.
    fontName: alreadyLoaded ? name : prevName.current,
  };
};

const initialState = {
  context: {
    darkmode: true,
    showSettings: true,
    customViewContent: "",
    shouldUpdateView: false,
    settings: {
      valign: "center",
      textAlign: "left",
      fontSize: 24,
      column: 2,
      lineHeight: 100,
      tracking: 0,
    },
  },
  view: "sentence",
  customView: "sentence",
};

const VIEW_OPTIONS = ["custom", "glyphs", "sentence", "paragraph"];
const VALIGN_OPTIONS = ["top", "center", "bottom"];
const ALIGN_OPTIONS = ["left", "center", "right"];
const SIZE_OPTIONS = { min: 12, max: 72, step: 2 };
const LINE_HEIGHT_OPTIONS = { min: 40, max: 400, step: 20 };
const TRACKING_OPTIONS = { min: -1, max: 1.5, step: 0.05 };
const COLUMN_OPTIONS = { min: 1, max: 6, step: 1 };

const reducer = (state, action) => {
  const updateSettingsField = (field, newValue) => ({
    ...state,
    context: {
      ...state.context,
      settings: { ...state.context.settings, [field]: newValue },
    },
  });
  switch (action.type) {
    case "INITIATE_STATE": {
      return action.value;
    }
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
    case "UPDATE_VIEW":
      return {
        ...state,
        view: action.value,
        context: { ...state.context, shouldUpdateView: true },
      };
    case "UPDATE_CUSTOM_VIEW":
      return {
        ...state,
        view: "custom",
        customView: action.payload.customView,
        context: {
          ...state.context,
          customViewContent: action.payload.customViewContent,
          shouldUpdateView: false,
        },
      };
    case "RESET":
      return { ...initialState };
    case "FEELING_LUCKY":
      const generateOption = (options) =>
        options[generateNumberByStep({ min: 0, max: options.length - 1, step: 1 })];
      const generatedView = generateOption(VIEW_OPTIONS.slice(1));
      if (generatedView === "glyphs") {
        return { ...state, view: generatedView };
      }
      return {
        ...state,
        view: generatedView,
        context: {
          ...state.context,
          settings: {
            valign: generateOption(VALIGN_OPTIONS),
            textAlign: generateOption(ALIGN_OPTIONS),
            fontSize: generateNumberByStep(SIZE_OPTIONS),
            column: generateNumberByStep(COLUMN_OPTIONS),
            lineHeight: generateNumberByStep(LINE_HEIGHT_OPTIONS),
            tracking: generateNumberByStep(TRACKING_OPTIONS).toPrecision(2),
          },
        },
      };
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
  const handlers = React.useMemo(
    () => ({
      setDarkMode: () => handleDarkMode(true),
      setLightMode: () => handleDarkMode(false),
      initialState: (state) => send({ type: "INITIATE_STATE", value: state }),
      toggleSettings: () => send({ type: "TOGGLE_SETTINGS_VISIBILITY" }),
      updateFontSize: (v) => send({ type: "UPDATE_FONT_SIZE", value: v }),
      updateLineHeight: (v) => send({ type: "UPDATE_LINE_HEIGHT", value: v }),
      updateTracking: (v) => send({ type: "UPDATE_TRACKING", value: v }),
      updateColumn: (v) => send({ type: "UPDATE_COLUMN", value: v }),
      updateTextAlign: (v) => send({ type: "UPDATE_TEXT_ALIGN", value: v }),
      updateVerticalAlign: (v) => send({ type: "UPDATE_VERTICAL_ALIGN", value: v }),
      updateView: (v) => send({ type: "UPDATE_VIEW", value: v }),
      updateCustomView: ({ customView, customViewContent }) =>
        send({ type: "UPDATE_CUSTOM_VIEW", payload: { customView, customViewContent } }),
      resetLayout: () => send({ type: "RESET" }),
      getRandomLayout: () => send({ type: "FEELING_LUCKY" }),
    }),
    []
  );

  const FONT_PREVIEW_STORAGE_TOKEN = "SLATE_FONT_PREVIEW_SETTINGS";

  React.useLayoutEffect(() => {
    const initialState = JSON.parse(localStorage.getItem(FONT_PREVIEW_STORAGE_TOKEN));
    console.log("initialstaate", initialState);
    if (initialState) handlers.initialState(initialState);
  }, []);

  React.useEffect(() => {
    localStorage.setItem(FONT_PREVIEW_STORAGE_TOKEN, JSON.stringify(current));
  }, [current]);

  return [
    {
      ...current,
      defaultOptions: {
        VIEW_OPTIONS,
        VALIGN_OPTIONS,
        ALIGN_OPTIONS,
        SIZE_OPTIONS,
        LINE_HEIGHT_OPTIONS,
        TRACKING_OPTIONS,
        COLUMN_OPTIONS,
      },
    },
    handlers,
  ];
};
