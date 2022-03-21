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
import { is, pipe, isEmpty, not, both, has, propEq, or } from "ramda";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";
import QuestionInfo from "./questions/common/QuestionInfo";
import ContinueProfileAlert from "./ContinueProfileAlert";

// Auxiliary functions
const isArray = is(Array);
const isNotEmpty = pipe(isEmpty, not);
const hasChildren = both(isArray, isNotEmpty);
const questionFilled = (questionId) => has(questionId);
const isInfoQuestion = propEq(
  "question_type",
  questionTypes.ONLY_QUESTION_INFO
);
const isQuestionFilledOrisOnlyInfo = (userProfile, question) =>
  or(questionFilled(question.id)(userProfile), isInfoQuestion(question));

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();
  const [showAlert, setShowAlert] = React.useState(false);
  const [userProfile, updateUserProfile] = useUserProfile();
  const showPreviousQuestionButton = useSelector(
    (state) =>
      getAppConfiguration(state, configurations.SHOW_PREVIOUS_QUESTION) ===
      "true"
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const currentQuestion =
    questions.length > 0 && questions[currentQuestionIndex];
  const currentQuestionRef = React.useRef(currentQuestion);

  currentQuestionRef.current = currentQuestion;
  const userProfileKeys = Object.keys(userProfile);

  React.useEffect(() => {
    if (showAlert === "reseted") return;
    if (currentQuestionIndex > 0) return;

    setShowAlert(userProfileKeys.length > 0);
  }, [userProfileKeys, currentQuestionIndex, showAlert]);

  const _onChangeQuestion = (value, question) => {
    if (!question) question = currentQuestionRef.current;

    console.log({ value, question });

    updateUserProfile({
      ...userProfile,
      [question.id]: value,
    });
  };
  const _hasValidAnswer = () => {
    const value = userProfile[currentQuestion?.id];
    const childrenHaveValue = () =>
      currentQuestion?.children?.every((child) => !!userProfile[child.id]);

    if (hasChildren(currentQuestion.children)) return childrenHaveValue();
    if (isInfoQuestion(currentQuestion)) return true;
    if (!value) return !!currentQuestion?.default_value;

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
      _onChangeQuestion(currentQuestion.default_value, currentQuestion);
    }
  };
  const _onContinueProfile = () => {
    setShowAlert("reseted");

    const anseredQuestions = questions.filter((q) =>
      questionFilled(q.id)(userProfile)
    );
    setCurrentQuestionIndex(anseredQuestions.length);
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
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.PAIRWISE_COMBINATIONS:
        return (
          <PairwiseCombinations
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            question={q}
            value={userProfile[q.id]}
            onChange={_onChangeQuestion}
          />
        );

      default:
        return "";
    }
  };
  const _renderProfileQuestions = () => (
    <>
      <Segment>
        <Grid verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionContainer>
                {_renderQuestion(currentQuestion)}

                {currentQuestion &&
                  hasChildren(currentQuestion.children) &&
                  isQuestionFilledOrisOnlyInfo(
                    userProfile,
                    currentQuestion
                  ) && (
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
          <Grid.Column floated="right" width={16}>
            <Button
              disabled={
                currentQuestionIndex + 1 === questions.length ||
                !_hasValidAnswer()
              }
              onClick={_nextQuestion}
              floated="right"
              style={{ margin: "5px" }}
            >
              Seguinte
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
                Anterior
              </Button>
            )}
          </Grid.Column>
        </ActionsRow>
      </Grid>
    </>
  );

  return (
    <Dashboard>
      <PageHeader size="huge" as="h1">
        {t("Questionario")}
      </PageHeader>
      {showAlert === true ? (
        <ContinueProfileAlert
          onClickContinue={_onContinueProfile}
          onClickReset={() => setShowAlert("reseted")}
        />
      ) : (
        _renderProfileQuestions()
      )}
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
