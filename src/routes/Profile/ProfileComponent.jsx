/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import {
  Loader,
  Dimmer,
  Grid,
  Button,
  Segment,
  Breadcrumb,
  Progress,
  Divider,
} from "semantic-ui-react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { is, pipe, isEmpty, not, both, has, propEq, or } from "ramda";
import Cookies from "js-cookie";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import useQuestions from "hooks/useQuestions";
import useUserProfile from "hooks/useUserProfile";
import configurations from "helpers/configurations/index";
import questionTypes from "helpers/questions/questionTypes";
import { getAppConfiguration } from "store/app/selectors";
import { logOutUser } from "store/auth/actions";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations/index";
import CitizenGeneralProfile from "./questions/CitizenGeneralProfile";
import QuestionInfo from "./questions/_shared/QuestionInfo";
import ContinueProfileAlert from "./ContinueProfileAlert";
import TerritorialCoverage from "./questions/TerritorialCoverage/TerritorialCoverage";
import ImagePairwiseCombinations from "./questions/ImagePairwiseCombinations/ImagePairwiseCombinations";
import GeoLocation from "./questions/GeoLocation/GeoLocation";
import { getValidationByQuestionType } from "./helpers/validations";
import { getQuestionEndTime, getQuestionStartTime } from "./helpers/helpers";

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
  const dispatch = useDispatch();
  const [t] = useTranslations("userProfile");
  const {
    questions,
    currentQuestion,
    // groups,
    hasPrevQuestion,
    // hasNextQuestion,
    gotoNextQuestion,
    goToPrevQuestion,
    goToQuestionIndex,
    currentQuestionIndex,
    loading: loadingQuestions,
  } = useQuestions();
  const [showAlert, setShowAlert] = React.useState(null);
  const [userProfile, updateUserProfile] = useUserProfile();
  const showPreviousQuestionButton = useSelector(
    (state) =>
      getAppConfiguration(state, configurations.SHOW_PREVIOUS_QUESTION) ===
      "true"
  );
  const prolificCompletionUrl = useSelector((state) =>
    getAppConfiguration(state, configurations.PROLIFIC_COMPLETION_URL)
  );
  const currentQuestionRef = React.useRef(currentQuestion);

  currentQuestionRef.current = currentQuestion;
  const userProfileKeys = userProfile && Object.keys(userProfile);
  const alreadyFilled = userProfile && userProfileKeys.length > 0;
  const questionIsNotQuestionInfo =
    currentQuestion?.question_type !== questionTypes.ONLY_QUESTION_INFO;
  const totalQuestions = questions.length;
  const isCompleted = currentQuestionIndex + 1 === totalQuestions + 1;

  const _validateChildMatchWithConditionalValue = (q) => {
    const parentValue = userProfile[q.parent_question?.id]?.value;
    const parentValueMatch = q.show_only_on_parent_value.includes(parentValue);

    return parentValueMatch;
  };

  const filterChildren = (q) => {
    if (q.show_only_on_parent_value) {
      return _validateChildMatchWithConditionalValue(q);
    }

    return true;
  };

  const showActionsButtons = () => {
    const _hasSomeChildInfoQuestion = (children = []) => {
      const _hasInfoQuestion =
        children.filter(filterChildren).filter((q) => isInfoQuestion(q))
          .length > 0;

      if (!_hasInfoQuestion) {
        return children
          .filter(filterChildren)
          .some((child) => _hasSomeChildInfoQuestion(child.children));
      }

      return _hasInfoQuestion;
    };

    if (isCompleted) return false;

    if (_hasSomeChildInfoQuestion(currentQuestion.children)) return false;

    return (
      !isInfoQuestion(currentQuestion) || hasChildren(currentQuestion?.children)
    );
  };

  const _onChangeQuestion = React.useCallback(
    (value, question, meta = {}, updateServer = true) => {
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
    },
    [currentQuestionRef.current, updateUserProfile]
  );

  React.useEffect(() => {
    const _verifyAlert = () => {
      if (!userProfile) return;
      if (!questions || questions.length === 0) return;
      if (showAlert !== null) return;

      setShowAlert(alreadyFilled);
    };

    _verifyAlert();
  }, [questions, userProfile, showAlert, alreadyFilled]);

  React.useEffect(() => {
    if (!currentQuestion) return;
    if (!userProfile) return;
    const { meta } = userProfile[currentQuestion.id] || {};
    const metaStartTime = getQuestionStartTime(meta);

    if (metaStartTime?.startTime) {
      _onChangeQuestion(
        userProfile[currentQuestion.id]?.value,
        currentQuestion,
        metaStartTime
      );
    }
  }, [currentQuestion]);

  const _hasValidAnswer = (q, validateChildren = true) => {
    if (!q.is_required) return true;

    const { value } = userProfile[q?.id] || {};

    const _validateChildrenFilled = (current) => {
      const _isValid = _hasValidAnswer(current);
      const currentChildren = current.children?.filter(filterChildren);

      if (currentChildren) {
        return (
          _isValid &&
          currentChildren.every((child) => _validateChildrenFilled(child))
        );
      }
      return _isValid;
    };
    const children = q?.children?.filter(filterChildren);
    const childrenHaveValue = () =>
      children.every((child) => _validateChildrenFilled(child));

    if (hasChildren(children) && validateChildren) return childrenHaveValue();
    if (isInfoQuestion(q)) return true;
    if (!value) return !!q?.default_value;

    const questionValidation = getValidationByQuestionType(
      q,
      value,
      userProfile
    );

    if (!questionValidation) return false;

    return !!userProfile[q?.id];
  };
  const _nextQuestion = () => {
    const { meta } = userProfile[currentQuestion.id] || {};
    const metaEndTime = getQuestionEndTime(meta);

    const newMeta = {
      ...metaEndTime,
      isValid: _hasValidAnswer(currentQuestion),
    };

    if (currentQuestion?.default_value && !userProfile[currentQuestion.id]) {
      _onChangeQuestion(
        currentQuestion.default_value,
        currentQuestion,
        newMeta
      );
    } else {
      const val = userProfile[currentQuestion.id]?.value;

      _onChangeQuestion(val, currentQuestion, newMeta);

      if (+currentQuestion.option_to_finish === +val) {
        goToQuestionIndex(totalQuestions);

        return;
      }
    }
    gotoNextQuestion();
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

    const _renderDivider = () => {
      if (q.parent_question)
        return (
          <>
            <br />
            <Divider />
            <br />
          </>
        );
    };
    const questionProps = {
      question: q,
      value: userProfile[q.id]?.value,
      meta: userProfile[q.id]?.meta,
      disabled:
        hasChildren(q.children) &&
        userProfile[q.id]?.meta?.submitted &&
        q.disabled_after_filled,
      onChange: _onChangeQuestion,
    };

    switch (q.question_type) {
      case questionTypes.ONLY_QUESTION_INFO:
        return (
          <>
            {_renderDivider()}
            <QuestionInfo {...questionProps} />
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
          <>
            {_renderDivider()}
            <ShortAnswer {...questionProps} />
          </>
        );

      case questionTypes.PAIRWISE_COMBINATIONS:
        return (
          <>
            {_renderDivider()}
            <PairwiseCombinations {...questionProps} />
          </>
        );

      case questionTypes.MULTIPLE_CHOICE:
        return (
          <>
            {_renderDivider()}
            <MultipleChoice {...questionProps} />
          </>
        );

      case questionTypes.CITIZEN_PROFILE:
        return (
          <>
            {_renderDivider()}
            <CitizenGeneralProfile {...questionProps} />
          </>
        );

      case questionTypes.IMAGE_PAIRWISE_COMBINATIONS:
        return (
          <>
            {_renderDivider()}
            <ImagePairwiseCombinations {...questionProps} />
          </>
        );
      case questionTypes.TERRITORIAL_COVERAGE:
        return (
          <>
            {_renderDivider()}
            <TerritorialCoverage {...questionProps} />
          </>
        );
      case questionTypes.GEOLOCATION:
        return (
          <>
            {_renderDivider()}
            <GeoLocation {...questionProps} />
          </>
        );

      default:
        return "";
    }
  };
  const _renderQuestionWithChildren = (q, isChild = false) => {
    if (!q) return "";

    if (isChild && q.show_only_on_parent_value) {
      if (!_validateChildMatchWithConditionalValue(q)) {
        return "";
      }
    }

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
                  {t("Submeter resposta")}
                </Button>
              </Grid.Column>
            </Grid>
          )}

        {q &&
          hasChildren(q?.children) &&
          isQuestionFilledOrisOnlyInfo(userProfile, q) &&
          isSubmittedOrIsInfoQuestion(userProfile, q) && (
            <>
              {q.children.map((child) =>
                _renderQuestionWithChildren(child, true)
              )}
            </>
          )}
      </>
    );
  };
  const _renderBreadcrumbs = () => {
    return <Breadcrumb size="large">{t("Questionário")}</Breadcrumb>;
  };
  const _renderProfileQuestions = () => {
    return (
      <>
        {currentQuestion && _renderBreadcrumbs()}
        <Segment>
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <QuestionContainer>
                  {!currentQuestion && (
                    <>
                      <h3>{t("Questionario Completo")}</h3>
                      <br />
                      <p>{t("Obrigado pela sua participação")}</p>
                      <br />
                      {Cookies.get("prolificPid") && prolificCompletionUrl && (
                        <Button
                          onClick={() => {
                            dispatch(logOutUser());

                            window.location = prolificCompletionUrl;
                          }}
                          floated="left"
                        >
                          {t("Terminar Questionário")}
                        </Button>
                      )}
                    </>
                  )}
                  {_renderQuestionWithChildren(currentQuestion)}
                </QuestionContainer>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid verticalAlign="middle">
          <ActionsRow>
            <Grid.Column floated="left" mobile={16} tablet={8} computer={8}>
              {questionIsNotQuestionInfo && !isCompleted && (
                <Grid style={{ marginTop: 0 }}>
                  <Grid.Row>
                    <Grid.Column mobile={12}>
                      <Progress
                        percent={
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }
                      />
                    </Grid.Column>
                    <Grid.Column floated="right" mobile={4}>
                      <MobileRightAligned>
                        {currentQuestionIndex + 1} / {totalQuestions}
                      </MobileRightAligned>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              )}
            </Grid.Column>
            <Grid.Column floated="right" mobile={16} tablet={8} computer={8}>
              {showActionsButtons(currentQuestionIndex, totalQuestions) && (
                <Button
                  disabled={!_hasValidAnswer(currentQuestion)}
                  onClick={_nextQuestion}
                  floated="right"
                  style={{ margin: "5px" }}
                >
                  {t("Seguinte")}
                </Button>
              )}
              {isCompleted && (
                <Button
                  onClick={() => goToQuestionIndex(0)}
                  floated="right"
                  style={{ margin: "5px" }}
                >
                  {t("Voltar ao inicio")}
                </Button>
              )}
              {showPreviousQuestionButton && (
                <Button
                  disabled={!hasPrevQuestion}
                  onClick={goToPrevQuestion}
                  floated="right"
                  style={{ margin: "5px" }}
                >
                  {t("Anterior")}
                </Button>
              )}
            </Grid.Column>
          </ActionsRow>
        </Grid>
      </>
    );
  };

  if (loadingQuestions) {
    return (
      <Dashboard>
        <Dimmer
          active
          inverted
          style={{ background: "transparent", position: "relative" }}
        >
          <Loader size="large">Loading</Loader>
        </Dimmer>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <br />
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

const MobileRightAligned = styled.div`
  @media only screen and (max-width: 600px) {
    text-align: right;
  }
`;
