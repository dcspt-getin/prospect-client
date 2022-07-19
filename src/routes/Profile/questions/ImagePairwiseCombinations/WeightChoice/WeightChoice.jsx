import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import configurations from "helpers/configurations/index";
import { getAppConfiguration } from "store/app/selectors";
import QuestionInfo from "../../_shared/QuestionInfo";
import WeightPairwiseCombinations from "components/WeightPairwiseCombinations/WeightPairwiseCombinations";

const WeightChoice = ({
  question,
  value,
  meta,
  onChange,
  disabled,
  imagesSet,
  renderLocationImage,
}) => {
  const allowUserRepeatQuestion = useSelector(
    (state) =>
      getAppConfiguration(
        state,
        configurations.ALLOW_USER_REPEAT_BALANCE_QUESTION
      ) === "true"
  );
  const correlationLimitValue = useSelector((state) =>
    getAppConfiguration(state, configurations.CORRELATION_LIMIT_VALUE)
  );

  const questionRef = React.useRef(question);

  questionRef.current = question;

  const _onChange = (value, meta, shouldUpdateApi = false) => {
    return onChange(value, questionRef.current, meta, shouldUpdateApi);
  };

  const _options = React.useMemo(
    () =>
      (imagesSet || []).map((image) => {
        return {
          id: Object.keys(image)[0],
          value: Object.values(image)[0],
        };
      }),
    [imagesSet]
  );

  const _renderOption = (option) => (
    <ImageContainer>{renderLocationImage(option.value)}</ImageContainer>
  );

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <WeightPairwiseCombinationsWrapper>
        <WeightPairwiseCombinations
          id={question.id}
          options={_options}
          value={value}
          meta={meta}
          onChange={_onChange}
          disabled={disabled}
          showPreviousIteration={question.show_previous_iteration}
          allowUserRepeatQuestion={allowUserRepeatQuestion}
          correlationLimitValue={correlationLimitValue}
          renderOptionInfo={_renderOption}
          showBalance={question.show_balance}
        />
      </WeightPairwiseCombinationsWrapper>
    </Wrapper>
  );
};

export default WeightChoice;

const Wrapper = styled.div``;

const ImageContainer = styled.div`
  border: 5px solid transparent;

  > div {
    width: 100%;
    min-height: 300px;
    position: inherit !important;
  }
`;

const WeightPairwiseCombinationsWrapper = styled.div`
  margin: 0 20px;
`;
