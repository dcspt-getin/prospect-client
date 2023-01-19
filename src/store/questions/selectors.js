import { createSelector } from "reselect";
import omit from "lodash/omit";

import { QUESTION_ACTIVE } from "helpers/questions";
import sortBy from "lodash/sortBy";

const getState = (state) => state.questions;

export const makeGetQuestions = () => {
  return createSelector(getState, (state, status = QUESTION_ACTIVE) => {
    return sortBy(Object.values(state.data), ["rank", "id"])
      .filter((q) => q.status === status)
      .map((q) => {
        const _getQuestionWithChildren = (parent) => {
          const children = parent?.children || [];

          return {
            ...parent,
            children: children.map((c) => {
              const _c = { ...c, parent_question: omit(parent, ["children"]) };

              return _getQuestionWithChildren(_c);
            }),
          };
        };

        return _getQuestionWithChildren(q);
      });
  });
};

export const makeGetAllQuestions = () => {
  return createSelector(getState, (state) => {
    return sortBy(Object.values(state.data), ["rank", "id"]);
  });
};

export const getQuestionsLoading = createSelector(
  getState,
  (state) => state.loading
);

export const getQuestions = makeGetQuestions();

export const getAllQuestions = makeGetAllQuestions();
