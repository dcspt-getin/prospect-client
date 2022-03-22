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
  const userProfileKeys = userProfile && Object.keys(userProfile);
  const alreadyFilled = userProfile && userProfileKeys.length > 0;

  React.useEffect(() => {
    if (!userProfile) return;
    if (!questions || questions.length === 0) return;
    if ([true, "reseted"].includes(showAlert)) return;

    setShowAlert(alreadyFilled);
  }, [userProfile, questions?.length]);

  const _onChangeQuestion = (value, question) => {
    if (!question) question = currentQuestionRef.current;

    updateUserProfile({
      ...userProfile,
      [question.id]: value,
    });
  };
  const _hasValidAnswer = (q) => {
    const value = userProfile[q?.id];
    const childrenHaveValue = () =>
      q?.children?.every((child) => !!userProfile[child.id]);

    if (hasChildren(q?.children)) return childrenHaveValue();
    if (isInfoQuestion(q)) return true;
    if (!value) return !!q?.default_value;

    if (q?.question_type === questionTypes.PAIRWISE_COMBINATIONS) {
      return Array.isArray(value) && value.every((v) => v.value !== undefined);
    }

    return !!userProfile[q?.id];
  };
  const _nextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);

    if (currentQuestion?.default_value && !userProfile[currentQuestion.id]) {
      _onChangeQuestion(currentQuestion.default_value, currentQuestion);
    }
  };
  const _onContinueProfile = () => {
    setShowAlert("reseted");

    const anseredQuestions = questions.filter(
      (q) => questionFilled(q.id)(userProfile) && _hasValidAnswer(q)
    );

    let next = anseredQuestions.length;
    if (next === questions.length) next = next - 1;
    setCurrentQuestionIndex(next);
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
                !_hasValidAnswer(currentQuestion)
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
      {userProfile && questions && questions.length > 0 && (
        <>
          {showAlert === true ? (
            <ContinueProfileAlert
              onClickContinue={_onContinueProfile}
              onClickReset={() => setShowAlert("reseted")}
            />
          ) : (
            _renderProfileQuestions()
          )}
        </>
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
