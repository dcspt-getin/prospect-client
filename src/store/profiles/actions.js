import axios from "axios";

import { API_BASE_URL } from "config";
import {
  GET_USER_PROFILES,
  SET_USER_PROFILES,
  CREATE_USER_PROFILE,
  CREATE_USER_PROFILE_FULFILLED,
  UPDATE_USER_PROFILE,
  GET_USER_PROFILE_QUESTION_INFO,
  SET_USER_PROFILE_QUESTION_INFO,
} from "./types";

export const getUserProfiles = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_PROFILES,
    });

    const { data } = await axios.get(`${API_BASE_URL}/profiles/`);

    dispatch({
      type: SET_USER_PROFILES,
      payload: data.results,
    });

    return data;
  } catch (err) {}
};

export const getUserProfileQuestionInfo =
  (profileId, questionId) => async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_PROFILE_QUESTION_INFO,
      });

      const { data } = await axios.get(
        `${API_BASE_URL}/profiles/${profileId}/question_info/?id=${questionId}`
      );

      dispatch({
        type: SET_USER_PROFILE_QUESTION_INFO,
        payload: data,
        meta: { profileId, questionId },
      });

      return data;
    } catch (err) {}
  };

export const createNewUserProfile = (profile) => async (dispatch, getState) => {
  try {
    const state = getState();

    console.log({ state });

    if (state.urbanShapes.isCreating) return;

    dispatch({
      type: CREATE_USER_PROFILE,
    });

    const { data } = await axios.post(`${API_BASE_URL}/profiles/`, {
      profile_data: profile,
      status: "NOT_COMPLETED",
    });

    dispatch({
      type: CREATE_USER_PROFILE_FULFILLED,
      payload: data,
    });

    return data;
  } catch (err) {}
};

export const updateUserProfile = (id, update) => async (dispatch) => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/profiles/${id}/`, update);

    dispatch({
      type: UPDATE_USER_PROFILE,
      payload: data,
    });

    return Promise.resolve(data);
  } catch (err) {}
};
