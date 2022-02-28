/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Grid, Button, Segment } from "semantic-ui-react";
import styled from "styled-components";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import useUserProfile from "hooks/useUserProfile";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();
  const [userProfile, updateUserProfile] = useUserProfile();

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const currentQuestion =
    questions.length > 0 && questions[currentQuestionIndex];

  const _onChangeQuestion = (question) => (value) => {
    updateUserProfile({
      ...userProfile,
      [question.id]: value,
    });
  };
  const _hasValidAnswer = () => {
    const value = userProfile[currentQuestion?.id];

    if (!value) return !!currentQuestion?.default_value;

    if (currentQuestion?.question_type === "PAIRWISE_COMBINATIONS") {
      return Array.isArray(value) && value.every((v) => v.value !== undefined);
    }
    return !!userProfile[currentQuestion?.id];
  };
  const _nextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);

    if (currentQuestion?.default_value && !userProfile[currentQuestion.id]) {
      _onChangeQuestion(currentQuestion)(currentQuestion.default_value);
    }
  };

  const _renderQuestion = (q) => {
    if (!q) return "";

    switch (q.question_type) {
      case "SHORT_ANSWER":
        return (
          <ShortAnswer
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion(q)}
          />
        );

      case "PAIRWISE_COMBINATIONS":
        return (
          <PairwiseCombinations
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion(q)}
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoice
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion(q)}
          />
        );

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
          <Grid.Column mobile={16} tablet={6} computer={8}>
            questão {currentQuestionIndex + 1} de {questions.length}
          </Grid.Column>
          <Grid.Column floated="right" mobile={16} tablet={10} computer={8}>
            <Button
              disabled={
                currentQuestionIndex + 1 === questions.length ||
                !_hasValidAnswer()
              }
              onClick={_nextQuestion}
              floated="right"
              style={{ margin: "5px" }}
            >
              Pergunta Seguinte
            </Button>
            <Button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              floated="right"
              style={{ margin: "5px" }}
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
