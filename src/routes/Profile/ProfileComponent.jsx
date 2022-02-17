/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Grid, Button, Segment } from "semantic-ui-react";
import styled from "styled-components";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  console.log({ questions });

  const currentQuestion =
    questions.length > 0 && questions[currentQuestionIndex];

  const _onChangeQuestion = (value) => {};

  const _renderQuestion = (q) => {
    if (!q) return "";

    switch (q.question_type) {
      case "SHORT_ANSWER":
        return <ShortAnswer question={q} onChange={_onChangeQuestion} />;

      case "PAIRWISE_COMBINATIONS":
        return (
          <PairwiseCombinations question={q} onChange={_onChangeQuestion} />
        );

      case "MULTIPLE_CHOICE":
        return <MultipleChoice question={q} onChange={_onChangeQuestion} />;

      default:
        return "";
    }
  };

  return (
    <Dashboard>
      <PageHeader size="huge" as="h1">
        {t("Questionario")}
      </PageHeader>
      <Grid verticalAlign="middle">
        <ActionsRow>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            questão {currentQuestionIndex + 1} de {questions.length}
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
            <Button
              disabled={currentQuestionIndex + 1 === questions.length}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              floated="right"
            >
              Pergunta Seguinte
            </Button>
            <Button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              floated="right"
            >
              Pergunta Anterior
            </Button>
          </Grid.Column>
        </ActionsRow>
      </Grid>
      <Segment>
        <Grid verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionContainer>
                {_renderQuestion(currentQuestion)}
              </QuestionContainer>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Dashboard>
  );
};

const QuestionContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem 0;
`;

const ActionsRow = styled(Grid.Row)`
  &&&& {
    padding-top: 3rem;
  }
`;

const PageHeader = styled(Header)`
  &&&& {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
`;
