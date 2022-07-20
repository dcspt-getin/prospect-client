/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Button, Icon, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";

import { getAppConfiguration } from "store/app/selectors";
import useTranslations from "hooks/useTranslations";
import configurations from "helpers/configurations/index";

import localReducer from "./localReducer";
import QuestionInfo from "../../_shared/QuestionInfo";
import IterationsDebugger from "./IterationsDebugger";

const _getRandomImageFromStack = (stack, exclude = []) => {
  const filteredStack = stack.filter((i) => !exclude.includes(i));
  if (!filteredStack.length) return;

  const randomImage =
    filteredStack[Math.floor(Math.random() * filteredStack.length)];

  return randomImage;
};

export default ({
  question,
  value,
  onChange,
  meta,
  disabled,
  imagesSet,
  renderLocationImage,
}) => {
  const [t] = useTranslations("urbanShapes");
  const [imagesCoordinates, setImagesCoordinates] = React.useState([]);

  const questionRef = React.useRef(question);

  const allowUserRepeatQuestion = useSelector(
    (state) =>
      getAppConfiguration(
        state,
        configurations.ALLOW_USER_REPEAT_BALANCE_QUESTION
      ) === "true"
  );

  const questionValue = value || {};
  const updateProfileData = (data, meta = {}) =>
    onChange(data, questionRef.current, meta, false);

  const [isSelecting, setIsSelecting] = React.useState();
  const [selectedImage, setSelectedImage] = React.useState();
  const [image1, setImage1] = React.useState();
  const [image2, setImage2] = React.useState();
  const [localState, localActions] = localReducer(
    questionValue && questionValue.comparisionsModel
  );

  const {
    intermediateOrder,
    currentIterationIndex,
    currentIterationStackIndex,
    iterations,
    completed,
  } = localState;
  const {
    selectImageAsBetter,
    selectImageAsWorst,
    startNewIteration,
    startNewIterationStack,
    setCurrentIterationStackIndex,
    resetState,
  } = localActions;
  const currentIteration = iterations[currentIterationIndex];
  const currentIterationStack =
    currentIteration && currentIteration.stacks[currentIterationStackIndex];
  const debugIterations = useSelector(
    (state) => getAppConfiguration(state, "DEBUG_COMPARISIONS_MODEL") === "true"
  );

  const images = React.useMemo(() => {
    if (!imagesSet) return {};

    return imagesSet.reduce((acc, cur) => {
      const [key] = Object.keys(cur);
      const [value] = Object.values(cur);

      return {
        ...acc,
        [key]: value,
      };
    }, {});
  }, [imagesSet]);

  React.useEffect(() => {
    if (!questionValue) return;

    if (!isEqual(localState, questionValue.comparisionsModel)) {
      updateProfileData(
        {
          comparisionsModel: localState,
        },
        {
          ...(completed ? { isValid: true } : {}),
        }
      );
    }
  }, [localState]);

  React.useEffect(() => {
    if (!questionValue) return;
    if (!images) return;

    const initialStack = imagesSet.reduce(
      (acc, cur) => [...acc, Object.keys(cur)[0]],
      []
    );

    setImagesCoordinates(imagesSet);
    if (!questionValue.comparisionsModel || !currentIterationStack) {
      startNewIteration("1");
      startNewIterationStack("1.1", initialStack);
    }
    setIsSelecting(true);
  }, [questionValue && !questionValue.comparisionsModel, imagesSet]);

  React.useEffect(() => {
    if (!questionValue) return;
    if (!currentIteration || !currentIterationStack) return;

    const newImage1 = !currentIterationStack.selectedImage
      ? _getRandomImageFromStack(currentIterationStack.stack)
      : currentIterationStack.selectedImage;
    let newImage2 = _getRandomImageFromStack(currentIterationStack.stack, [
      newImage1,
      ...currentIterationStack.better,
      ...currentIterationStack.worst,
    ]);
    setImage1(newImage1);
    setImage2(newImage2);
    if (!newImage2) {
      if (currentIteration.stacks.length - 1 === currentIterationStackIndex) {
        startNewIteration(`${iterations.length + 1}`);
      } else {
        setCurrentIterationStackIndex(currentIterationStackIndex + 1);
      }
    }

    setIsSelecting(true);
  }, [isSelecting, !currentIteration, !currentIterationStack]);

  const _selectImage = (imageKey) => {
    setIsSelecting(false);
    setSelectedImage(null);
    if (!currentIterationStack.selectedImage) selectImageAsBetter(imageKey);
    else {
      if (imageKey !== currentIterationStack.selectedImage) {
        selectImageAsBetter(imageKey);
      } else if (imageKey === currentIterationStack.selectedImage) {
        selectImageAsWorst(
          image1 === currentIterationStack.selectedImage ? image2 : image1
        );
      }
    }
  };

  const _renderLeftImage = () => (
    <LeftImageContainer selected={selectedImage === image1}>
      {image1 && renderLocationImage(images[image1])}

      {debugIterations && image1}
    </LeftImageContainer>
  );
  const _renderRightImage = () => (
    <RightmageContainer selected={selectedImage === image2}>
      {image2 && renderLocationImage(images[image2])}
      {debugIterations && image2}
    </RightmageContainer>
  );
  const _renderControls = () => (
    <ControlsContainer>
      <Button
        size="large"
        icon="left arrow"
        onClick={() => setSelectedImage(image1)}
      />
      <Button
        size="large"
        icon="right arrow"
        onClick={() => setSelectedImage(image2)}
      />
    </ControlsContainer>
  );
  const _onClickResetButton = async () => {
    await updateProfileData(
      {
        comparisionsModel: null,
        calibrations: [],
        calibrationIndex: 0,
        calibrationsCompleted: false,
      },
      { isValid: false }
    );
    resetState({});
  };
  const _onClickNextButton = () => _selectImage(selectedImage);

  return (
    <>
      <QuestionInfo question={question} />

      <div className="p-4">
        {completed && (
          <>
            <p>
              Terminou esta escolha par-a-par, passe para a questão seguinte
            </p>
            {allowUserRepeatQuestion && (
              <Button onClick={_onClickResetButton} floated="left">
                Voltar a Preencher
              </Button>
            )}
          </>
        )}
        {currentIterationStack && imagesCoordinates.length > 0 && (
          <>
            <PageContent>
              <Grid>
                <Grid.Column mobile={16} tablet={7} computer={7}>
                  {_renderLeftImage()}
                </Grid.Column>
                <Grid.Column mobile={16} tablet={2} computer={2}>
                  {_renderControls()}
                </Grid.Column>
                <Grid.Column mobile={16} tablet={7} computer={7}>
                  {_renderRightImage()}
                </Grid.Column>
              </Grid>
            </PageContent>
            <Button
              style={{ marginTop: 12 }}
              labelPosition="right"
              icon
              floated="right"
              disabled={!selectedImage}
              onClick={_onClickNextButton}
            >
              {t("NEXT_COMPARISION")}
              <Icon name="right arrow" />
            </Button>
          </>
        )}
        {debugIterations && (
          <IterationsDebugger
            iterations={iterations}
            intermediateOrder={intermediateOrder}
            image1={image1}
            image2={image2}
            currentIterationStack={currentIterationStack}
          />
        )}
      </div>
    </>
  );
};

const PageContent = styled.div``;

const ControlsContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeftImageContainer = styled.div`
  border: 5px solid transparent;

  > div {
    width: 100%;
    min-height: 300px;
  }

  ${({ selected }) =>
    selected &&
    `
      border: 5px solid green;
    `}
`;

const RightmageContainer = styled.div`
  border: 5px solid transparent;

  > div {
    width: 100%;
    min-height: 300px;
  }

  ${({ selected }) =>
    selected &&
    `
      border: 5px solid green;
    `}
`;
