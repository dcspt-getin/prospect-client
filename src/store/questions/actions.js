import axios from "axios";

import { API_BASE_URL } from "config";
import { SET_QUESTIONS } from "./types";

export const fetchQuestions = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/questions/`);

    dispatch({
      type: SET_QUESTIONS,
      payload: data.results,
    });

    return data;
  } catch (err) {
    console.log({ err });
  }
};
