/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import {
  Header,
  Grid,
  Button,
  Segment,
  Breadcrumb,
  Progress,
} from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { is, pipe, isEmpty, not, both, has, propEq, or } from "ramda";

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
  const {
    questions,
    currentQuestion,
    groups,
    hasPrevQuestion,
    hasNextQuestion,
    gotoNextQuestion,
    goToPrevQuestion,
    goToQuestionIndex,
    currentQuestionIndex,
  } = useQuestions();
  const [showAlert, setShowAlert] = React.useState(null);
  const [userProfile, updateUserProfile] = useUserProfile();
  const showPreviousQuestionButton = useSelector(
    (state) =>
      getAppConfiguration(state, configurations.SHOW_PREVIOUS_QUESTION) ===
      "true"
  );
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

  const _onChangeQuestion = (
    value,
    question,
    meta = {},
    updateServer = true
  ) => {
    if (!question) question = currentQuestionRef.current;

    updateUserProfile(
      {
        ...userProfile,
        [question.id]: {
          value,
          meta: {
            ...userProfile[question.id]?.meta,
            ...meta,
          },
        },
      },
      updateServer
    );
  };
  const _hasValidAnswer = (q, validateChildren = true) => {
    const { value } = userProfile[q?.id] || {};

    const _validateChildrenFilled = (current) => {
      const _isValid = _hasValidAnswer(current);

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

    if (hasChildren(q?.children) && validateChildren)
      return childrenHaveValue();
    if (isInfoQuestion(q)) return true;
    if (!value) return !!q?.default_value;

    if (
      q?.question_type === questionTypes.MULTIPLE_CHOICE &&
      q?.multiple_selection_type === "MULTIPLE_VALUES" &&
      q?.checkbox_min_options
    ) {
      return (
        Array.isArray(value) && value.length >= parseInt(q.checkbox_min_options)
      );
    }
    if (q?.question_type === questionTypes.PAIRWISE_COMBINATIONS) {
      return (
        Array.isArray(value) &&
        userProfile[q?.id]?.meta?.isValid &&
        value
          .filter(filterIterationsWithValue)
          .every((v) => v.value !== undefined)
      );
    }

    return !!userProfile[q?.id];
  };
  const _nextQuestion = () => {
    gotoNextQuestion();

    if (currentQuestion?.default_value && !userProfile[currentQuestion.id]) {
      _onChangeQuestion(currentQuestion.default_value, currentQuestion);
    } else {
      _onChangeQuestion(
        userProfile[currentQuestion.id]?.value,
        currentQuestion
      );
    }
  };
  const _onContinueProfile = () => {
    setShowAlert(false);

    const anseredQuestions = questions.filter(
      (q) => questionFilled(q.id)(userProfile) && _hasValidAnswer(q)
    );

    let next = anseredQuestions.length;
    if (next === questions.length) next = next - 1;
    goToQuestionIndex(next);
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
            disabled={
              hasChildren(q.children) && userProfile[q.id]?.meta?.submitted
            }
            value={userProfile[q.id]?.value}
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.PAIRWISE_COMBINATIONS:
        return (
          <PairwiseCombinations
            question={q}
            disabled={
              hasChildren(q.children) && userProfile[q.id]?.meta?.submitted
            }
            value={userProfile[q.id]?.value}
            meta={userProfile[q.id]?.meta}
            onChange={_onChangeQuestion}
          />
        );

      case questionTypes.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            question={q}
            disabled={
              hasChildren(q.children) && userProfile[q.id]?.meta?.submitted
            }
            value={userProfile[q.id]?.value}
            onChange={_onChangeQuestion}
          />
        );

      default:
        return "";
    }
  };
  const _renderQuestionWithChildren = (q) => {
    if (!q) return "";

    return (
      <>
        {_renderQuestion(q)}
        {hasChildren(q?.children) &&
          !isInfoQuestion(q) &&
          _hasValidAnswer(q, false) &&
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
          hasChildren(q?.children) &&
          isQuestionFilledOrisOnlyInfo(userProfile, q) &&
          isSubmittedOrIsInfoQuestion(userProfile, q) && (
            <>{q.children.map((child) => _renderQuestionWithChildren(child))}</>
          )}
      </>
    );
  };
  const _renderBreadcrumbs = () => {
    const _getQuestionGroup = () => {
      return (currentQuestion?.groups || []).reduce((acc, group, i) => {
        const g = groups[group.id];

        if (i === currentQuestion.groups.length - 1) return g;
        if (!g.parent) return acc;

        return g;
      }, null);
    };
    const _renderGroup = (g, divider = true) => {
      if (!g) return "";
      const breadcrumb = (
        <>
          <Breadcrumb.Section>{g.group.name}</Breadcrumb.Section>
          {divider && <Breadcrumb.Divider icon="right chevron" />}
        </>
      );
      if (g.parent) {
        return (
          <>
            {_renderGroup(g.parent)}
            {breadcrumb}
          </>
        );
      }

      return breadcrumb;
    };

    return (
      <Breadcrumb size="large">
        <Breadcrumb.Divider icon="right chevron" />{" "}
        {_renderGroup(_getQuestionGroup(), false)}
      </Breadcrumb>
    );
  };
  const _renderProfileQuestions = () => {
    if (!currentQuestion) return "";

    return (
      <>
        {_renderBreadcrumbs()}
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
        <Grid verticalAlign="middle">
          <ActionsRow>
            <Grid.Column floated="left" mobile={16} tablet={8} computer={8}>
              <Grid style={{ marginTop: 0 }}>
                <Grid.Row>
                  <Grid.Column mobile={8}>
                    <Progress
                      percent={(currentQuestionIndex / questions.length) * 100}
                    />
                  </Grid.Column>
                  <Grid.Column floated="right" mobile={8}>
                    Questão {currentQuestionIndex + 1} de {questions.length}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
              {showActionsButtons() && (
                <Button
                  disabled={
                    !hasNextQuestion || !_hasValidAnswer(currentQuestion)
                  }
                  onClick={_nextQuestion}
                  floated="right"
                  style={{ margin: "5px" }}
                >
                  Seguinte
                </Button>
              )}
              {showPreviousQuestionButton && (
                <Button
                  disabled={!hasPrevQuestion}
                  onClick={goToPrevQuestion}
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
  };

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
