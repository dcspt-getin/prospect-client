import React from "react";
import { useDispatch, useSelector } from "react-redux";
import omit from "lodash/omit";

import { fetchQuestions } from "src/store/questions/actions";
import { getQuestions } from "store/questions/selectors";

/* eslint-disable import/no-anonymous-default-export */
export default () => {
  const dispatch = useDispatch();
  const questions = useSelector(getQuestions);

  React.useEffect(() => {
    dispatch(fetchQuestions());
  }, []);

  const [currentGroupId, setCurrentGroupId] = React.useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const currentQuestion =
    questions.length > 0 && questions[currentQuestionIndex];

  /*
    create group tree to add questions to each group and subgroup

    {
      [group_id]: {
        group: {...},
        questions: [...],
        parent: null,
      },
      [group_id]: {
        group: {...},
        parent: {...},
        questions: [...],
      },
    }
  */
  const groups = React.useMemo(() => {
    const allGroups = questions.reduce((acc, curr) => {
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
          questions: questions
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
  }, [questions]);

  React.useEffect(() => {
    const groupsValues = Object.values(groups);

    if (!groupsValues.length) return;

    const _getFirstGroupChildren = (g) => {
      const childrenGroups = Object.values(groups).filter(
        (g1) => g1.group.parent === g.group.id
      );
      if (childrenGroups.length > 0) {
        return _getFirstGroupChildren(childrenGroups[0]);
      }

      return g.group.id;
    };

    setCurrentGroupId(_getFirstGroupChildren(groupsValues[0]));
  }, [Object.keys(groups)]);

  const hasNextQuestion = currentQuestionIndex < questions.length - 1;
  const gotoNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  const goToPrevQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  const goToQuestionIndex = (index) => {
    setCurrentQuestionIndex(index);
  };
  const currentGroup = groups[currentGroupId];

  return {
    questions,
    groups,
    currentQuestion,
    currentGroup,
    hasNextQuestion,
    gotoNextQuestion,
    goToPrevQuestion,
    goToQuestionIndex,
  };
};
