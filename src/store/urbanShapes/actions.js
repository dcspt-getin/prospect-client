import axios from "axios";

import { API_BASE_URL } from "config";
import { SET_TERRITORIAL_COVERAGES } from "./types";

export const fetchTerritorialCoverages = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/territorial-coverage/`);

    dispatch({
      type: SET_TERRITORIAL_COVERAGES,
      payload: data.results,
    });

    return data;
  } catch (err) {}
};
