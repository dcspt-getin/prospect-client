import axios from "axios";

import { API_BASE_URL } from "config";
import {
  SET_APP_CONFIGURATIONS,
  SET_APP_LOADED,
  SET_APP_TRANSLATIONS,
  SET_CURRENT_TRANSLATION,
} from "./types";

export const getAppConfigurations = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/configurations/`, {
      headers: {
        Authorization: "",
      },
    });

    dispatch({
      type: SET_APP_CONFIGURATIONS,
      payload: data.results,
    });

    return data;
  } catch (err) {
    console.log({ err });
  }
};

export const getAppTranslations = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/translations/`, {
      headers: {
        Authorization: "",
      },
    });

    dispatch({
      type: SET_APP_TRANSLATIONS,
      payload: data.results,
    });

    return data;
  } catch (err) {
    console.log({ err });
  }
};

export const setCurrentTranslation = (code) => {
  return {
    type: SET_CURRENT_TRANSLATION,
    payload: code,
  };
};

export const setAppLoaded = (code) => {
  return {
    type: SET_APP_LOADED,
  };
};
