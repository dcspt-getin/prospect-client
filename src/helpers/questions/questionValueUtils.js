import get from "lodash/get";

import questionTypes from "helpers/questions/questionTypes";
import { PAIRWISE_COMBINATIONS_TYPES } from "helpers/questions";

const getQuestionValueText = (question, profileQuestion, key = "value") => {
  if (question?.question_type === questionTypes.MULTIPLE_CHOICE) {
    const selectedoption = question.options.find(
      (o) => o.id === profileQuestion?.value
    );

    return selectedoption?.title;
  } else if (question?.question_type === questionTypes.PAIRWISE_COMBINATIONS) {
    const optionId = get(profileQuestion, key);
    const selectedoption = question.options.find((o) => o.id === +optionId);

    return selectedoption?.title;
  }

  return get(profileQuestion, key);
};

export { getQuestionValueText };
