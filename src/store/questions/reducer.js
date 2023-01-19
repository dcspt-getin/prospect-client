import normalizeArray from "utils/normalizeArray";

import { SET_QUESTIONS, SET_QUESTIONS_LOADING } from "./types";

const initialState = {
  data: {},
  loading: false,
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTIONS:
      const { payload } = action;
      const { data, allQuestions } = payload;

      let questions = data;

      // should not show questions with parent id
      if (!allQuestions) {
        questions = questions.filter((q) => !q.parent_question);
      }

      return {
        ...state,
        loading: false,
        data: normalizeArray(questions, "id"),
      };
    case SET_QUESTIONS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
