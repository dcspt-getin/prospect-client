import questionTypes from "helpers/questions/questionTypes";
import { PAIRWISE_COMBINATIONS_TYPES } from "helpers/questions";
import { filterIterationsWithValue } from "helpers/questions/pairWiseCombinations";

const _multipleChoiceValidation = (q, value) => {
  if (
    q?.multiple_selection_type === "MULTIPLE_VALUES" &&
    q?.checkbox_min_options
  ) {
    return (
      Array.isArray(value) && value.length >= parseInt(q.checkbox_min_options)
    );
  }

  return true;
};

const _pairWiseCombinationsValidation = (q, value, userProfile) => {
  return (
    Array.isArray(value) &&
    userProfile[q?.id]?.meta?.isValid &&
    value.filter(filterIterationsWithValue).every((v) => v.value !== undefined)
  );
};

const _imagePairWiseCombinationsValidation = (q, value, userProfile) => {
  if (q?.image_pairwise_type === PAIRWISE_COMBINATIONS_TYPES.BINARY_CHOICE) {
    return userProfile[q?.id]?.meta?.isValid;
  }

  return _pairWiseCombinationsValidation(q, value, userProfile);
};

const _shortAnswerValidation = (q, value, userProfile) => {
  const minChars = parseInt(q?.min_chars);
  const maxChars = parseInt(q?.max_chars);

  if (minChars && value.length < minChars) {
    return false;
  }

  if (maxChars && value.length > maxChars) {
    return false;
  }

  return value.length > 0;
};

const validationsByQuestionType = {
  [questionTypes.SHORT_ANSWER]: _shortAnswerValidation,
  [questionTypes.MULTIPLE_CHOICE]: _multipleChoiceValidation,
  [questionTypes.PAIRWISE_COMBINATIONS]: _pairWiseCombinationsValidation,
  [questionTypes.IMAGE_PAIRWISE_COMBINATIONS]:
    _imagePairWiseCombinationsValidation,
};

const getValidationByQuestionType = (q, value, userProfile) => {
  const validation = validationsByQuestionType[q?.question_type];

  return validation ? validation(q, value, userProfile) : true;
};

export { validationsByQuestionType, getValidationByQuestionType };
