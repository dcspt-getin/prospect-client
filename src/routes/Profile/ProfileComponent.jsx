/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Grid, Button, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  is,
  pipe,
  isEmpty,
  not,
  both,
  has,
  propEq,
  or,
  prop,
  either,
} from "ramda";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import useUserProfile from "hooks/useUserProfile";
import configurations from "helpers/configurations/index";
import questionTypes from "helpers/questions/questionTypes";
import { getAppConfiguration } from "store/app/selectors";
import { filterIterationsWithValue } from "helpers/questions/pairWiseCombinations";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";
import QuestionInfo from "./questions/common/QuestionInfo";
import ContinueProfileAlert from "./ContinueProfileAlert";

// Auxiliary functions
const isArray = is(Array);
const isNotEmpty = pipe(isEmpty, not);
const hasChildren = both(isArray, isNotEmpty);
const isParentQuestion = pipe(prop("parent_question"), not);
const questionFilled = (questionId) => has(questionId);
const questionIsSubmitted = propEq("submitted", true);
const isInfoQuestion = propEq(
  "question_type",
  questionTypes.ONLY_QUESTION_INFO
);
const isQuestionFilledOrisOnlyInfo = (userProfile, question) =>
  or(questionFilled(question.id)(userProfile), isInfoQuestion(question));
const isSubmittedOrIsInfoQuestion = (userProfile, question) =>
  or(
    isInfoQuestion(question),
    questionIsSubmitted(userProfile[question.id]?.meta)
  );

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();
  const [showAlert, setShowAlert] = React.useState(null);
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
  const showActionsButtons = () => {
    const _hasSomeChildInfoQuestion = (children = []) => {
      const _hasInfoQuestion =
        children.filter((q) => isInfoQuestion(q)).length > 0;

      if (!_hasInfoQuestion) {
        return children.some((child) =>
          _hasSomeChildInfoQuestion(child.children)
        );
      }

      return _hasInfoQuestion;
    };

    if (_hasSomeChildInfoQuestion(currentQuestion.children)) return false;

    return (
      !isInfoQuestion(currentQuestion) || hasChildren(currentQuestion?.children)
    );
  };

  React.useEffect(() => {
    const _verifyAlert = () => {
      if (!userProfile) return;
      if (!questions || questions.length === 0) return;
      if (showAlert !== null) return;

      setShowAlert(alreadyFilled);
    };

    _verifyAlert();
  }, [questions, userProfile, showAlert, alreadyFilled]);

  const _onChangeQuestion = (value, question, meta = {}) => {
    if (!question) question = currentQuestionRef.current;

    updateUserProfile({
      ...userProfile,
      [question.id]: {
        value,
        meta: {
          ...userProfile[question.id]?.meta,
          ...meta,
        },
      },
    });
  };
  const _hasValidAnswer = (q) => {
    const { value } = userProfile[q?.id] || {};

    const _validateChildrenFilled = (current) => {
      const _isValid = !!userProfile[current.id] || isInfoQuestion(current);

      if (current.children) {
        return (
          _isValid &&
          current.children?.every((child) => _validateChildrenFilled(child))
        );
      }
      return _isValid;
    };
    const childrenHaveValue = () =>
      q?.children?.every((child) => _validateChildrenFilled(child));

    if (hasChildren(q?.children)) return childrenHaveValue();
    if (isInfoQuestion(q)) return true;
    if (!value) return !!q?.default_value;

    if (q?.question_type === questionTypes.PAIRWISE_COMBINATIONS) {
      return (
        Array.isArray(value) &&
        value
          .filter(filterIterationsWithValue)
          .every((v) => v.value !== undefined)
      );
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
    setShowAlert(false);

    const anseredQuestions = questions.filter(
      (q) => questionFilled(q.id)(userProfile) && _hasValidAnswer(q)
    );

    let next = anseredQuestions.length;
    if (next === questions.length) next = next - 1;
    setCurrentQuestionIndex(next);
  };
  const _submitParentQuestion = (q) => {
    _onChangeQuestion(userProfile[q.id]?.value, q, { submitted: true });
  };

  const _renderQuestion = (q) => {
    if (!q) return "";

    switch (q.question_type) {
      case questionTypes.ONLY_QUESTION_INFO:
        return (
          <>
            <QuestionInfo question={q} />
            {!hasChildren(q.children) && (
              <Grid>
                <Grid.Column width={16}>
                  <Button onClick={_nextQuestion} floated="left">
                    Clique para continuar
                  </Button>
                </Grid.Column>
              </Grid>
            )}
          </>
        );
      case questionTypes.SHORT_ANSWER:
        return (
          <ShortAnswer
            question={q}
            value={userProfile[q.id]?.value}
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.PAIRWISE_COMBINATIONS:
        return (
          <PairwiseCombinations
            question={q}
            value={userProfile[q.id]?.value}
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            question={q}
            value={userProfile[q.id]?.value}
            onChange={_onChangeQuestion}
          />
        );

      default:
        return "";
    }
  };
  const _renderQuestionWithChildren = (q) => {
    return (
      <>
        {_renderQuestion(q)}
        {hasChildren(q.children) &&
          !isInfoQuestion(q) &&
          questionFilled(q.id)(userProfile) &&
          !questionIsSubmitted(userProfile[q.id]?.meta) && (
            <Grid>
              <Grid.Column width={16}>
                <Button onClick={() => _submitParentQuestion(q)} floated="left">
                  Submeter resposta
                </Button>
              </Grid.Column>
            </Grid>
          )}

        {q &&
          hasChildren(q.children) &&
          isQuestionFilledOrisOnlyInfo(userProfile, q) &&
          isSubmittedOrIsInfoQuestion(userProfile, q) && (
            <>{q.children.map((child) => _renderQuestionWithChildren(child))}</>
          )}
      </>
    );
  };
  const _renderProfileQuestions = () => (
    <>
      <Segment>
        <Grid verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <QuestionContainer>
                {_renderQuestionWithChildren(currentQuestion)}
              </QuestionContainer>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {showActionsButtons() && (
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
      )}
    </>
  );

  return (
    <Dashboard>
      <PageHeader size="huge" as="h1">
        {t("Questionario")}
      </PageHeader>
      {userProfile &&
        questions &&
        questions.length > 0 &&
        showAlert !== null && (
          <>
            {showAlert === true ? (
              <ContinueProfileAlert
                onClickContinue={_onContinueProfile}
                onClickReset={() => setShowAlert(false)}
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
