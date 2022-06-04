/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Button, Header } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import configurations from "helpers/configurations/index";
import { getAppConfiguration } from "store/app/selectors";
import { filterIterationsWithValue } from "helpers/questions/pairWiseCombinations";
import QuestionInfo from "../_shared/QuestionInfo";
import Balance from "./Balance";
import calcEigenVector from "./helpers/calcEigenVector";

const shuffleArray = (array) =>
  array
    .map((x) => [Math.random(), x])
    .sort(([a], [b]) => a - b)
    .map(([_, x]) => x);

export default ({ question, value, meta, onChange, disabled }) => {
  const { options } = question;

  const questionRef = React.useRef(question);

  questionRef.current = question;
  const [optionsMatrix, setOptionsMatrix] = React.useState([]);
  const [iterationsToRepeat, setIterationsToRepeat] = React.useState([]);
  const [iteration, setIteration] = React.useState(null);
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

  React.useEffect(() => {
    if (iterationsToRepeat.length === 0) return;

    setIteration(iterationsToRepeat[0]);
  }, [iterationsToRepeat]);

  React.useEffect(() => {
    if (options.length < 2) return;

    const sortedOptions = options.sort((a, b) => a.row_order - b.row_order);
    const _optionsMatix = sortedOptions.reduce((acc, curr) => {
      return [
        ...acc,
        ...sortedOptions
          .filter(
            (o) =>
              !acc.find(
                (_o) =>
                  (_o.option1.id === curr.id && _o.option2.id === o.id) ||
                  (_o.option2.id === curr.id && _o.option1.id === o.id)
              ) && curr.id !== o.id
          )
          .map((o) => ({
            option1: curr,
            option2: o,
            value: undefined,
          })),
      ];
    }, []);

    if (!Array.isArray(value)) {
      onChange(
        _optionsMatix.map((o) => ({
          option1: o.option1.id,
          option2: o.option2.id,
        })),
        questionRef.current
      );
    }
    setOptionsMatrix(shuffleArray(_optionsMatix));
  }, [options, question?.id]);

  React.useEffect(() => {
    setIteration(null);
    setIterationsToRepeat([]);
  }, [question?.id]);

  React.useEffect(() => {
    const allInterationsDone =
      value &&
      value
        .filter(filterIterationsWithValue)
        .every((v) => v.value !== undefined && v.value !== null);

    if (allInterationsDone && iteration === null) {
      setIteration(-1);
    } else if (iteration === null) {
      setIteration(0);
    }
  }, [value, iteration]);

  const currentIteration = optionsMatrix[iteration];
  const currentIteratonValue =
    Array.isArray(value) &&
    value.find(
      (v) =>
        v.option1 === currentIteration?.option1?.id &&
        v.option2 === currentIteration?.option2?.id
    )?.value;
  const _onIterationValueChange = async (val) => {
    let _newValue = [
      ...(value || []).filter(
        (v) =>
          v.option1 !== currentIteration.option1.id ||
          v.option2 !== currentIteration.option2.id
      ),
      {
        option1: currentIteration.option1.id,
        option2: currentIteration.option2.id,
        value: val,
      },
    ];

    onChange(_newValue, questionRef.current, {}, false);
  };
  const _onClickNextIteration = async () => {
    const _next = iteration + 1;
    const _isTheLastOne =
      (iterationsToRepeat.length &&
        iterationsToRepeat.findIndex((i) => i === iteration) ===
          iterationsToRepeat.length - 1) ||
      _next === optionsMatrix.length;

    if (_isTheLastOne) {
      const egeinVectorData = await calcEigenVector(options, value, meta, {
        correlationLimitValue,
      });
      const _meta = egeinVectorData;
      const _newValue = [
        ...value.filter(filterIterationsWithValue),
        {
          key: "eigenVector",
          value: egeinVectorData.eigenVector,
        },
      ];
      onChange(_newValue, questionRef.current, _meta);

      setIteration(-1);
      return;
    }

    if (iterationsToRepeat.length && iterationsToRepeat.includes(iteration)) {
      const _currentIndex = iterationsToRepeat.findIndex(
        (i) => i === iteration
      );

      setIteration(iterationsToRepeat[_currentIndex + 1]);
      return;
    }
    setIteration(_next);
  };
  const _onRepeatQuestion = () => {
    const { valuesByColumn, comparisionsMatrix, hasValidR2 } = meta;

    if (!comparisionsMatrix || hasValidR2) {
      setIteration(0);
      setIterationsToRepeat([]);
      return;
    }
    let max = [0, 0];
    let maxCoord = [];
    const colsIds = Object.keys(valuesByColumn);
    const rowsValues = Object.values(valuesByColumn);

    for (let colIndex = 0; colIndex < comparisionsMatrix.length; colIndex++) {
      const col = comparisionsMatrix[colIndex];

      for (let rowIndex = 0; rowIndex < col.length; rowIndex++) {
        const value = col[rowIndex];
        const rowIds = Object.keys(rowsValues[rowIndex]);

        if (value > max[0]) {
          max[0] = value;
          maxCoord[0] = [colsIds[colIndex], rowIds[rowIndex]];
        } else if (value > max[1] && max[1] < max[0]) {
          if (
            maxCoord[0] &&
            maxCoord[0][0] !== colsIds[colIndex] &&
            maxCoord[0][0] !== rowIds[rowIndex]
          ) {
            max[1] = value;
            maxCoord[1] = [colsIds[colIndex], rowIds[rowIndex]];
          }
        }
      }
    }

    const toRepeat = maxCoord.reduce((acc, cur) => {
      return [
        ...acc,
        value.findIndex(
          (o) =>
            (o.option1 === +cur[0] && o.option2 === +cur[1]) ||
            (o.option2 === +cur[0] && o.option1 === +cur[1])
        ),
      ];
    }, []);

    setIterationsToRepeat(toRepeat);
  };

  if (iteration === -1)
    return (
      <>
        <QuestionInfo question={question} hideDescription={!meta?.isValid} />
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <br />
              <b>
                <Header size="medium">
                  {meta?.isValid ? (
                    "Terminou esta escolha par-a-par, passe para a questão seguinte"
                  ) : (
                    <>
                      <strong style={{ color: "darkred" }}>
                        As suas respostas têm problemas de transitividade. Para
                        resolver, reconsidere as seguintes respostas.
                      </strong>
                    </>
                  )}
                </Header>
              </b>
            </Grid.Column>
          </Grid.Row>

          {(allowUserRepeatQuestion || (meta && !meta.isValid)) && (
            <Grid.Row>
              <Grid.Column width={16}>
                <Button onClick={_onRepeatQuestion} floated="left">
                  Voltar a Preencher
                </Button>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </>
    );
  if (!currentIteration) return "";

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <Grid verticalAlign="middle">
        <Grid.Row stretched only="tablet computer large">
          <Grid.Column mobile={2} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option1?.title}
            </QuestionOptionTitle>
          </Grid.Column>
          <Grid.Column mobile={12} tablet={6} computer={6}>
            <Balance
              value={currentIteratonValue}
              onChange={_onIterationValueChange}
              disabled={disabled}
            />
          </Grid.Column>
          <Grid.Column mobile={2} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option2?.title}
            </QuestionOptionTitle>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched only="mobile">
          <Grid.Column mobile={12}>
            <Grid style={{ height: 200 }}>
              <Grid.Row>
                <Grid.Column width={16}>
                  <QuestionOptionTitle style={{ justifyContent: "right" }}>
                    {currentIteration?.option1?.title}
                  </QuestionOptionTitle>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <QuestionOptionTitle
                    style={{
                      height: "100%",
                      alignItems: "end",
                      justifyContent: "right",
                    }}
                  >
                    {currentIteration?.option2?.title}
                  </QuestionOptionTitle>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column mobile={4}>
            <Balance
              value={currentIteratonValue}
              onChange={_onIterationValueChange}
              disabled={disabled}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="tablet computer large">
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <strong>
              comparação {iteration + 1} de {optionsMatrix.length}
            </strong>
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
            <Button
              disabled={currentIteratonValue === undefined}
              onClick={_onClickNextIteration}
              floated="right"
            >
              Seguinte
            </Button>
            {question.show_previous_iteration && (
              <Button
                disabled={iteration === 0}
                onClick={() =>
                  setIteration(
                    iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
                  )
                }
                floated="right"
              >
                Anterior
              </Button>
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile">
          <CenteredColumn width={16}>
            <strong>
              comparação {iteration + 1} de {optionsMatrix.length}
            </strong>
          </CenteredColumn>
          <CenteredColumn width={16}>
            <div>
              {question.show_previous_iteration && (
                <Button
                  disabled={iteration === 0}
                  onClick={() =>
                    setIteration(
                      iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
                    )
                  }
                >
                  Anterior
                </Button>
              )}
              <Button
                disabled={currentIteratonValue === undefined}
                onClick={_onClickNextIteration}
              >
                Seguinte
              </Button>
            </div>
          </CenteredColumn>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const QuestionOptionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredColumn = styled(Grid.Column)`
  &&&& {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
`;
