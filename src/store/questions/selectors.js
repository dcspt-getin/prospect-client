import { createSelector } from "reselect";

const getState = (state) => state.questions;

export const makeGetQuestions = () => {
  return createSelector(getState, (state) => {
    return Object.values(state.data);
  });
};

export const getQuestions = makeGetQuestions();
