/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Grid, Button, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import useUserProfile from "hooks/useUserProfile";
import configurations from "helpers/configurations/index";
import questionTypes from "helpers/questions/questionTypes";
import { getAppConfiguration } from "store/app/selectors";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";
import QuestionInfo from "./questions/common/QuestionInfo";

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();
  const [userProfile, updateUserProfile] = useUserProfile();
  const showPreviousQuestionButton = useSelector(
    (state) =>
      getAppConfiguration(state, configurations.SHOW_PREVIOUS_QUESTION) ===
      "true"
  );

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
    const hasChildren = currentQuestion?.children?.length > 0;
    const childrenHaveValue = () =>
      currentQuestion?.children?.every((child) => !!userProfile[child.id]);

    if (currentQuestion.question_type === questionTypes.ONLY_QUESTION_INFO)
      return true;
    if (!value) return !!currentQuestion?.default_value;
    if (hasChildren) return childrenHaveValue();

    if (
      currentQuestion?.question_type === questionTypes.PAIRWISE_COMBINATIONS
    ) {
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
      case questionTypes.ONLY_QUESTION_INFO:
        return <QuestionInfo question={q} />;
      case questionTypes.SHORT_ANSWER:
        return (
          <ShortAnswer
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion(q)}
          />
        );

      case questionTypes.PAIRWISE_COMBINATIONS:
        return (
          <PairwiseCombinations
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion(q)}
          />
        );

      case questionTypes.MULTIPLE_CHOICE:
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
      <Segment>
        <Grid verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionContainer>
                {_renderQuestion(currentQuestion)}

                {currentQuestion &&
                  currentQuestion.children.length > 0 &&
                  userProfile[currentQuestion.id] && (
                    <>
                      {currentQuestion.children.map((child) =>
                        _renderQuestion(child)
                      )}
                    </>
                  )}
              </QuestionContainer>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
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
            {showPreviousQuestionButton && (
              <Button
                disabled={currentQuestionIndex === 0}
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                floated="right"
                style={{ margin: "5px" }}
              >
                Pergunta Anterior
              </Button>
            )}
          </Grid.Column>
        </ActionsRow>
      </Grid>
    </Dashboard>
  );
};

const QuestionContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem 0;
`;

const ActionsRow = styled(Grid.Row)`
  &&&& {
    padding-top: 1.5rem;
  }
`;

const PageHeader = styled(Header)`
  &&&& {
    margin-bottom: 2rem;
    margin-top: 1rem;
  }
`;
