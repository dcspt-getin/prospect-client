/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Button, Icon, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";

import { getAppConfiguration } from "store/app/selectors";
import GoogleStreetView from "components/GoogleStreetView";
import InfoModal from "components/InfoModal";
import HTMLContent from "components/HTMLContent";
import InllineHelpTextDiv from "components/InllineHelpTextDiv";
import useTranslations from "hooks/useTranslations";

import localReducer from "./localReducer";
import QuestionInfo from "../../_shared/QuestionInfo";

const _getRandomImageFromStack = (stack, exclude = []) => {
  const filteredStack = stack.filter((i) => !exclude.includes(i));
  if (!filteredStack.length) return;

  const randomImage =
    filteredStack[Math.floor(Math.random() * filteredStack.length)];

  return randomImage;
};

export default ({ question, value, onChange, meta, disabled, imagesSet }) => {
  const [t] = useTranslations("urbanShapes");
  const [imagesCoordinates, setImagesCoordinates] = React.useState([]);

  const questionRef = React.useRef(question);

  const questionValue = value || {};
  const updateProfileData = (data) =>
    onChange(data, questionRef.current, {}, false);

  const [isSelecting, setIsSelecting] = React.useState();
  const [selectedImage, setSelectedImage] = React.useState();
  const [image1, setImage1] = React.useState();
  const [image2, setImage2] = React.useState();
  const [images, setImages] = React.useState();
  const [showHelpText, setShowHelpText] = React.useState();
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
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );

  React.useEffect(() => {
    if (!questionValue) return;

    if (!isEqual(localState, questionValue.comparisionsModel)) {
      updateProfileData({
        comparisionsModel: localState,
      });
    }
  }, [localState]);

  React.useEffect(() => {
    if (!questionValue) return;

    let currentImagesCoordinates = imagesSet;

    if (!currentImagesCoordinates) return;

    const result = currentImagesCoordinates.reduce((acc, cur) => {
      const [key] = Object.keys(cur);
      const [coord] = Object.values(cur);

      return {
        ...acc,
        [key]: coord,
      };
    }, {});
    const initialStack = currentImagesCoordinates.reduce(
      (acc, cur) => [...acc, Object.keys(cur)[0]],
      []
    );

    setImages(result);
    setImagesCoordinates(currentImagesCoordinates);
    if (!questionValue.comparisionsModel || !currentIterationStack) {
      startNewIteration("1");
      startNewIterationStack("1.1", initialStack);
    }
    setIsSelecting(true);
  }, [questionValue && !questionValue.comparisionsModel]);

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
    <LeftImageContainer
      // onClick={() => setSelectedImage(image1)}
      selected={selectedImage === image1}
    >
      {image1 && (
        <GoogleStreetView
          apiKey={googleMapsApiKey}
          streetViewPanoramaOptions={{
            position: images[image1],
          }}
        />
      )}

      {debugIterations && image1}
    </LeftImageContainer>
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
  const _renderRightImage = () => (
    <RightmageContainer
      // onClick={() => setSelectedImage(image2)}
      selected={selectedImage === image2}
    >
      {image2 && (
        <GoogleStreetView
          apiKey={googleMapsApiKey}
          streetViewPanoramaOptions={{
            position: images[image2],
          }}
        />
      )}
      {debugIterations && image2}
    </RightmageContainer>
  );

  return (
    <>
      <QuestionInfo question={question} />

      <div className="p-4">
        {completed && (
          <>
            <p>{t("COMPLETED")}!</p>
            <Button
              size="small"
              onClick={async () => {
                await updateProfileData({
                  comparisionsModel: null,
                  calibrations: [],
                  calibrationIndex: 0,
                  calibrationsCompleted: false,
                });
                resetState({});
                // window.location.reload();
              }}
            >
              {t("RESET")}
            </Button>
          </>
        )}
        {currentIterationStack && imagesCoordinates.length > 0 && (
          <>
            <Header size="huge" as="h1">
              {t("COMPARISIONS_TITLE")}
              <InllineHelpTextDiv>
                <InfoModal
                  open={showHelpText === "help1"}
                  onOpen={() => setShowHelpText("help1")}
                  onClose={() => setShowHelpText(null)}
                  content={<HTMLContent html={t("HELP_TEXT_5")} />}
                  trigger={<Icon circular name="info" />}
                />
              </InllineHelpTextDiv>
            </Header>
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
              onClick={() => _selectImage(selectedImage)}
            >
              {t("NEXT_COMPARISION")}
              <Icon name="right arrow" />
            </Button>
          </>
        )}

        {debugIterations && (
          <div>
            <DebugContainer>
              {intermediateOrder.map((imageKey) => (
                <DebugImageContainer
                  comparing={[image1, image2].includes(imageKey)}
                  selected={
                    currentIterationStack &&
                    currentIterationStack.selectedImage === imageKey
                  }
                  better={
                    currentIterationStack &&
                    currentIterationStack.better.includes(imageKey)
                  }
                  worst={
                    currentIterationStack &&
                    currentIterationStack.worst.includes(imageKey)
                  }
                >
                  <span>{imageKey}</span>
                  {/* <Image src={images[imageKey]} size="small" /> */}
                </DebugImageContainer>
              ))}
            </DebugContainer>

            {iterations.map((iteration) => (
              <>
                {iteration.stacks.map((iterationStack) => (
                  <DebugContainer
                    style={{
                      ...(currentIterationStack &&
                      iterationStack.key === currentIterationStack.key
                        ? { border: "1px solid red" }
                        : {}),
                    }}
                  >
                    <span>{iterationStack.key}</span>
                    {iterationStack.stack.map((imageKey) => (
                      <DebugImageContainer
                        comparing={[image1, image2].includes(imageKey)}
                        selected={iterationStack.selectedImage === imageKey}
                        better={iterationStack.better.includes(imageKey)}
                        worst={iterationStack.worst.includes(imageKey)}
                      >
                        <span>{imageKey}</span>
                        {/* <Image src={images[imageKey]} size="small" /> */}
                      </DebugImageContainer>
                    ))}
                  </DebugContainer>
                ))}
              </>
            ))}
          </div>
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

const DebugContainer = styled.div`
  display: flex;
  margin-top: 70px;
`;

const DebugImageContainer = styled.div`
  margin: 5px 5px;
  position: relative;
  width: 50px;
  height: 50px;

  span {
    position: absolute;
    z-index: 1;
  }

  &:after {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.6;
    width: 100%;
    height: 100%;

    ${({ comparing }) =>
      comparing &&
      `
      content: '';
      background: yellow;
    `}
    ${({ better }) =>
      better &&
      `
      content: '';
      background: green;
    `}
    ${({ worst }) =>
      worst &&
      `
      content: '';
      background: red;
    `}
    ${({ selected }) =>
      selected &&
      `
      content: '';
      background: blue;
    `}
  }

  img {
    width: 80px !important;
  }
`;
