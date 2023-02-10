import React from "react";
import { useDispatch, useSelector } from "react-redux";
import omit from "lodash/omit";

import { fetchQuestions } from "src/store/questions/actions";
import {
  getQuestions,
  getQuestionsLoading,
  getAllQuestions,
} from "store/questions/selectors";
import { getCurrentTranslation } from "store/app/selectors";

/* eslint-disable import/no-anonymous-default-export */
export default (allQuestions) => {
  const dispatch = useDispatch();
  const questionsLoading = useSelector(getQuestionsLoading);
  const questions = useSelector((state) =>
    allQuestions ? getAllQuestions(state) : getQuestions(state)
  );
  // debug proposes
  // .filter((q) => [299, 300, 285, 293].includes(q.id));
  const currentTranslation = useSelector(getCurrentTranslation);

  const questionsByTranslation = React.useMemo(() => {
    const filterQuestionByLanguage = (q) =>
      !q.language ||
      q.language?.language_code === currentTranslation?.language_code;

    const parentQuestions = questions.filter(filterQuestionByLanguage);

    const filterChildrenByTranslation = (questions) => {
      return questions.map((q) => {
        if (q.children?.length) {
          const children = q.children.filter(filterQuestionByLanguage);

          return {
            ...q,
            children: filterChildrenByTranslation(children),
          };
        }

        return q;
      });
    };

    return filterChildrenByTranslation(parentQuestions);
  }, [questions, currentTranslation]);

  React.useEffect(() => {
    dispatch(fetchQuestions(allQuestions));
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const groups = React.useMemo(() => {
    const allGroups = questionsByTranslation.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr.groups.reduce((accGroup, currGroup) => {
          return {
            ...accGroup,
            [currGroup.id]: {
              group: currGroup,
            },
          };
        }, {}),
      };
    }, {});

    const _buildGroupTree = (level) => (acc, curr) => {
      const { group } = curr;

      if (acc[group.id]) return acc;

      const newAcc = {
        ...acc,
        [group.id]: {
          group,
          level,
          parent: group.parent ? omit(acc[group.parent], ["questions"]) : null,
          questions: questionsByTranslation
            .filter((q) => q.groups.some((g) => g.id === group.id))
            .sort((a, b) => a.row_order - b.row_order)
            .map((g) => g.id),
        },
      };

      return {
        ...newAcc,
        ...Object.values(allGroups)
          .filter((g) => g.group.parent === group.id)
          .reduce(_buildGroupTree(level + 1), newAcc),
      };
    };
    const groupTree = Object.values(allGroups).reduce(_buildGroupTree(0), {});

    return groupTree;
  }, [questionsByTranslation]);

  const currentQuestion =
    questionsByTranslation.length > 0 &&
    questionsByTranslation[currentQuestionIndex];
  const hasNextQuestion =
    currentQuestionIndex < questionsByTranslation.length - 1;
  const hasPrevQuestion = currentQuestionIndex > 0;
  const gotoNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  const goToPrevQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  const goToQuestionIndex = (index) => {
    setCurrentQuestionIndex(index);
  };

  return {
    questions: questionsByTranslation,
    loading: questionsLoading,
    groups,
    currentQuestion,
    hasPrevQuestion,
    hasNextQuestion,
    gotoNextQuestion,
    goToPrevQuestion,
    goToQuestionIndex,
    currentQuestionIndex,
  };
};
