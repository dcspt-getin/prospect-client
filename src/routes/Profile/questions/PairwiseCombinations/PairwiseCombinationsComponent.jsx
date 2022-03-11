/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Button } from "semantic-ui-react";
import styled from "styled-components";

import QuestionInfo from "../common/QuestionInfo";
import Balance from "./Balance";

const shuffleArray = (array) =>
  array
    .map((x) => [Math.random(), x])
    .sort(([a], [b]) => a - b)
    .map(([_, x]) => x);

export default ({ question, value, onChange }) => {
  const { options } = question;

  const [optionsMatrix, setOptionsMatrix] = React.useState([]);
  const [iteration, setIteration] = React.useState(0);

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
        }))
      );
    }
    setOptionsMatrix(shuffleArray(_optionsMatix));
  }, [options]);

  const currentIteration = optionsMatrix[iteration];
  const currentIteratonValue =
    Array.isArray(value) &&
    value.find(
      (v) =>
        v.option1 === currentIteration?.option1?.id &&
        v.option2 === currentIteration?.option2?.id
    )?.value;
  const _onIterationValueChange = (val) => {
    onChange([
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
    ]);
  };
  const _onClickNextIteration = () => {
    if (currentIteratonValue === undefined) _onIterationValueChange(0);

    if (iteration + 1 === optionsMatrix.length) {
      setIteration(0);
      return;
    }
    setIteration(iteration + 1);
  };

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
            />
          </Grid.Column>
          <Grid.Column mobile={2} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option2?.title}
            </QuestionOptionTitle>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched only="mobile">
          <Grid.Column mobile={13}>
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
          <Grid.Column mobile={3}>
            <Balance
              value={currentIteratonValue}
              onChange={_onIterationValueChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="tablet computer large">
          <Grid.Column mobile={16} tablet={8} computer={8}>
            comparação {iteration + 1} de {optionsMatrix.length}
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
            <Button
              // disabled={iteration + 1 === optionsMatrix.length}
              onClick={_onClickNextIteration}
              floated="right"
            >
              Seguinte
            </Button>
            <Button
              // disabled={iteration === 0}
              onClick={() =>
                setIteration(
                  iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
                )
              }
              floated="right"
            >
              Anterior
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile">
          <CenteredColumn width={16}>
            comparação {iteration + 1} de {optionsMatrix.length}
          </CenteredColumn>
          <CenteredColumn width={16}>
            <div>
              <Button
                // disabled={iteration + 1 === optionsMatrix.length}
                onClick={_onClickNextIteration}
              >
                Seguinte
              </Button>
              <Button
                // disabled={iteration === 0}
                onClick={() =>
                  setIteration(
                    iteration === 0 ? optionsMatrix.length - 1 : iteration - 1
                  )
                }
              >
                Anterior
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
