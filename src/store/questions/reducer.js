import normalizeArray from "utils/normalizeArray";

import { SET_QUESTIONS } from "./types";

const initialState = {
  data: {},
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTIONS:
      const { payload } = action;

      return {
        ...state,
        data: normalizeArray(payload, "id"),
      };
    default:
      return state;
  }
}
