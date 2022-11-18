import get from "lodash/get";

import questionTypes from "helpers/questions/questionTypes";
import { PAIRWISE_COMBINATIONS_TYPES } from ".";

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
  } else if (
    question?.question_type === questionTypes.IMAGE_PAIRWISE_COMBINATIONS
  ) {
    const optionId = get(profileQuestion, key);

    console.log({ optionId });

    if (
      question?.image_pairwise_type ===
      PAIRWISE_COMBINATIONS_TYPES.BINARY_CHOICE
    ) {
    } else if (
      question?.image_pairwise_type ===
      PAIRWISE_COMBINATIONS_TYPES.WEIGHT_BASED_CHOICE
    ) {
    }
  }

  return get(profileQuestion, key);
};

export default getQuestionValueText;
