/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import Balance from "./Balance";

export default ({ question }) => {
  const { options } = question;

  const [optionsValues, setOptionsValues] = React.useState({});
  const [iteration, setIteration] = React.useState(0);

  React.useEffect(() => {
    if (options.length < 2) return;

    const sortedOptions = options.sort((a, b) => a.row_order - b.row_order);
    const optionsMatix = sortedOptions.reduce((acc, curr) => {
      return [
        ...acc,
        ...sortedOptions
          .filter((o) => o.id !== curr.id)
          .map((o) => ({
            option1: curr,
            option2: o,
            value: null,
          })),
      ];
    }, []);

    console.log({ optionsMatix });

    setOptionsValues(optionsMatix);
  }, [options]);

  const currentIteration = optionsValues[iteration];
  const _onClickNextIteration = () => {
    if (iteration + 1 === optionsValues.length) return;
    setIteration(iteration + 1);
  };

  if (!currentIteration) return "";

  return (
    <Wrapper>
      <Grid verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={16}>
            <Header size="medium">{question.title}</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column mobile={16} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option1?.title}
            </QuestionOptionTitle>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Balance />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={5} computer={5}>
            <QuestionOptionTitle>
              {currentIteration?.option2?.title}
            </QuestionOptionTitle>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            comparação {iteration + 1} de {optionsValues.length}
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
            <Button
              disabled={iteration + 1 === optionsValues.length}
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
