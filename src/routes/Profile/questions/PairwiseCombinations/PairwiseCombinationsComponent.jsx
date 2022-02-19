/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Button } from "semantic-ui-react";
import styled from "styled-components";

import QuestionInfo from "../common/QuestionInfo";
import Balance from "./Balance";

export default ({ question, value, onChange }) => {
  const { options } = question;

  const [optionsMatrix, setOptionsMatrix] = React.useState({});
  const [iteration, setIteration] = React.useState(0);

  React.useEffect(() => {
    if (options.length < 2) return;

    const sortedOptions = options.sort((a, b) => a.row_order - b.row_order);
    const _optionsMatix = sortedOptions.reduce((acc, curr) => {
      return [
        ...acc,
        ...sortedOptions
          .filter((o) => o.id !== curr.id)
          .map((o) => ({
            option1: curr,
            option2: o,
          })),
      ];
    }, []);

    setOptionsMatrix(_optionsMatix);
  }, [options]);

  const currentIteration = optionsMatrix[iteration];
  const _onClickNextIteration = () => {
    if (iteration + 1 === optionsMatrix.length) return;
    setIteration(iteration + 1);
  };
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

  if (!currentIteration) return "";

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <Grid verticalAlign="middle">
        <Grid.Row stretched>
          <Grid.Column mobile={16} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option1?.title}
            </QuestionOptionTitle>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Balance
              value={
                value &&
                value.find(
                  (v) =>
                    v.option1 === currentIteration?.option1?.id &&
                    v.option2 === currentIteration?.option2?.id
                )?.value
              }
              onChange={_onIterationValueChange}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option2?.title}
            </QuestionOptionTitle>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            comparação {iteration + 1} de {optionsMatrix.length}
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
            <Button
              disabled={iteration + 1 === optionsMatrix.length}
              onClick={_onClickNextIteration}
              floated="right"
            >
              Seguinte
            </Button>
            <Button
              disabled={iteration === 0}
              onClick={() => setIteration(iteration - 1)}
              floated="right"
            >
              Anterior
            </Button>
          </Grid.Column>
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
