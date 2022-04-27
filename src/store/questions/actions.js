import axios from "axios";

import { API_BASE_URL } from "config";
import { SET_QUESTIONS } from "./types";

export const fetchQuestions = (allQuestions) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/questions/${allQuestions ? "all/" : ""}`,
      {
        params: { limit: 1000 },
      }
    );

    dispatch({
      type: SET_QUESTIONS,
      payload: data.results,
    });

    return data;
  } catch (err) {
    console.log({ err });
  }
};
