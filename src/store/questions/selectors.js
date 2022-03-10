import { createSelector } from "reselect";
import omit from "lodash/omit";

import { QUESTION_ACTIVE } from "helpers/questions";
import sortBy from "lodash/sortBy";

const getState = (state) => state.questions;

export const makeGetQuestions = () => {
  return createSelector(getState, (state, status = QUESTION_ACTIVE) => {
    return sortBy(Object.values(state.data), ["rank", "id"])
      .filter((q) => q.status === status)
      .map((q) => ({
        ...q,
        children: q.children.map((child) => ({
          ...child,
          parent_question: omit(q, ["children"]),
        })),
      }));
  });
};

export const getQuestions = makeGetQuestions();
