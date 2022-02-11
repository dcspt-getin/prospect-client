import normalizeArray from "utils/normalizeArray";
import { DEFAULT_SELECTED_LANG } from "config";

import {
  SET_APP_CONFIGURATIONS,
  SET_APP_TRANSLATIONS,
  SET_CURRENT_TRANSLATION,
  SET_APP_LOADED,
} from "./types";

const initialState = {
  configurations: {},
  visibleMenus: [],
  loaded: false,
  currentTranslation: DEFAULT_SELECTED_LANG,
  translations: [],
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_APP_CONFIGURATIONS:
      const { payload } = action;

      return {
        ...state,
        configurations: normalizeArray(payload, "key"),
      };
    case SET_APP_LOADED: {
      return {
        ...state,
        loaded: true,
      };
    }
    case SET_APP_TRANSLATIONS: {
      const { payload } = action;

      return {
        ...state,
        translations: payload,
        loadingTranslations: false,
      };
    }
    case SET_CURRENT_TRANSLATION: {
      const { payload } = action;
      localStorage.setItem("currentTranslation", payload);

      return {
        ...state,
        currentTranslation: payload,
      };
    }
    default:
      return state;
  }
}
