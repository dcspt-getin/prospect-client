import normalizeArray from "utils/normalizeArray";

import { SET_QUESTIONS } from "./types";

const initialState = {
  data: {},
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTIONS:
      const { payload } = action;

      // should not show questions with parent id
      const questions = payload.filter((q) => !q.parent_question);

      return {
        ...state,
        data: normalizeArray(questions, "id"),
      };
    default:
      return state;
  }
}
