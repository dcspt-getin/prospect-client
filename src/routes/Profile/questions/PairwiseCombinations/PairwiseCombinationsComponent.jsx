/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import configurations from "helpers/configurations/index";
import { getAppConfiguration } from "store/app/selectors";
import QuestionInfo from "../_shared/QuestionInfo";
import WeightPairwiseCombinations from "components/WeightPairwiseCombinations/WeightPairwiseCombinations";

export default ({ question, value, meta, onChange, disabled }) => {
  const { options } = question;

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

  const _onChange = (value, meta, shouldUpdateApi = false) =>
    onChange(value, questionRef.current, meta, shouldUpdateApi);

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <WeightPairwiseCombinations
        key={question.id}
        options={options}
        value={value}
        meta={meta}
        onChange={_onChange}
        disabled={disabled}
        showPreviousIteration={question.show_previous_iteration}
        allowUserRepeatQuestion={allowUserRepeatQuestion}
        correlationLimitValue={correlationLimitValue}
        showBalance={question.show_balance}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div``;
