import axios from "axios";

import { API_BASE_URL } from "config";
import { getUserProfiles } from "store/profiles/actions";
import {
  AUTHENTICATE_USER,
  LOGOUT_USER,
  AUTHENTICATE_USER_PENDING,
  AUTHENTICATE_USER_FAILED,
  SET_CURRENT_USER,
} from "./types";

export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      const { data: tokenData } = await axios.post(`${API_BASE_URL}/token/`, {
        username,
        password,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokenData.access}`;
      localStorage.setItem("jwtToken", tokenData.access);

      dispatch({
        type: AUTHENTICATE_USER,
        payload: tokenData,
      });

      await dispatch(getCurrentUser());

      return [true];
    } catch (err) {
      dispatch({
        type: AUTHENTICATE_USER_FAILED,
      });

      if (!err.response) {
        alert("Server is down! Please try again later");
        return [];
      }

      const { data } = err.response;

      return [false, data];
    }
  };

export const verifyCurrentToken = (token) => async (dispatch) => {
  try {
    dispatch({
      type: AUTHENTICATE_USER_PENDING,
    });

    await axios.post(`${API_BASE_URL}/token/verify/`, { token });

    dispatch({
      type: AUTHENTICATE_USER,
    });

    dispatch(getCurrentUser());

    return true;
  } catch (err) {
    dispatch({
      type: LOGOUT_USER,
    });
  }
};

export const getCurrentUser = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/me/`);

    dispatch({
      type: SET_CURRENT_USER,
      payload: data,
    });

    dispatch(getUserProfiles());

    return true;
  } catch (err) {
    dispatch({
      type: LOGOUT_USER,
    });
  }
};

export const logOutUser = () => {
  localStorage.removeItem("jwtToken");

  return {
    type: LOGOUT_USER,
    payload: {},
  };
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    await axios.post(`${API_BASE_URL}/users/`, userData);

    return true;
  } catch (err) {
    console.log({ err });
  }

  return false;
};
