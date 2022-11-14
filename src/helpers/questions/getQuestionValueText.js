import questionTypes from "helpers/questions/questionTypes";

const getQuestionValueText = (question, value) => {
  if (question?.question_type === questionTypes.MULTIPLE_CHOICE) {
    const selectedoption = question.options.find((o) => o.id === value);

    return selectedoption?.title;
  }

  return value;
};

export default getQuestionValueText;
