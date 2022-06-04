/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Button, Icon, TextArea, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { getAppConfiguration } from "store/app/selectors";
import GoogleStreetView from "components/GoogleStreetView";
import UrbanShapesSteps from "components/UrbanShapesSteps";
import useTranslations from "hooks/useTranslations";
import InfoModal from "components/InfoModal";
import HTMLContent from "components/HTMLContent";
import InllineHelpTextDiv from "components/InllineHelpTextDiv";

export default () => {
  const [t] = useTranslations("urbanShapes");
  const [notes, setNotes] = React.useState({});
  const [showHelpText, setShowHelpText] = React.useState();

  const profile = {};
  const updateProfileData = () => {};

  const { imagesSet, comparisionsModel, calibrations, calibrationIndex } =
    profile || {};
  const currentCalibration = calibrations && calibrations[calibrationIndex];
  const updateCalibrations = (data, index = 0, completed = false) => {
    const newCalibrations = calibrations || [];
    let calibrationToUpdate = newCalibrations[index];

    calibrationToUpdate = { ...(calibrationToUpdate || {}), ...data };
    newCalibrations[index] = calibrationToUpdate;

    updateProfileData({
      calibrations: newCalibrations,
      calibrationIndex: index,
      calibrationsCompleted: completed,
    });
  };
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );

  React.useEffect(() => {
    if (!comparisionsModel) return;
    if (currentCalibration && currentCalibration.image1) return;
    if (currentCalibration && currentCalibration.image2) return;

    const itermediateOrderLength = comparisionsModel.intermediateOrder.length;
    const itermediateOrderHalf = itermediateOrderLength / 2;

    const _generateImage1 = () => {
      const _generate1 = () => {
        const result =
          comparisionsModel.intermediateOrder[
            Math.floor(Math.random() * itermediateOrderHalf)
          ];

        if (calibrations.some((c) => c.image1 === result)) return _generate1();

        return result;
      };

      return _generate1();
    };
    const _generateImage2 = () => {
      const _generate2 = () => {
        const result =
          comparisionsModel.intermediateOrder[
            Math.floor(
              Math.random() * (itermediateOrderLength - itermediateOrderHalf) +
                itermediateOrderHalf
            )
          ];

        if (calibrations.some((c) => c.image2 === result)) return _generate2();

        return result;
      };

      return _generate2();
    };

    if (calibrations.length > itermediateOrderHalf) {
      updateCalibrations({}, 0, true);
      return;
    }

    const image1 = _generateImage1();
    const image2 = _generateImage2();

    updateCalibrations(
      {
        image1,
        image2,
      },
      calibrationIndex
    );
    setNotes({});
  }, [!profile, !currentCalibration, calibrationIndex]);

  const image1 =
    imagesSet &&
    currentCalibration &&
    imagesSet.find((img) =>
      Object.keys(img).includes(currentCalibration.image1)
    );
  const image2 =
    imagesSet &&
    currentCalibration &&
    imagesSet.find((img) =>
      Object.keys(img).includes(currentCalibration.image2)
    );
  const setPreferableRank = (rank) => () =>
    updateCalibrations({ preferableRank: rank }, calibrationIndex);
  const saveImagesNotes = (image) => (e) => {
    updateCalibrations(
      {
        notes: {
          ...(currentCalibration.notes || {}),
          [image]: e.target.value,
        },
      },
      calibrationIndex
    );
  };

  // if (!profile || !comparisionsModel)
  //   return <Redirect to="/territorial-settings" />;

  const image1Comp = image1 && (
    <GoogleStreetView
      apiKey={googleMapsApiKey}
      streetViewPanoramaOptions={{
        position: image1[currentCalibration.image1],
      }}
    />
  );
  const image2Comp = image2 && (
    <GoogleStreetView
      apiKey={googleMapsApiKey}
      streetViewPanoramaOptions={{
        position: image2[currentCalibration.image2],
      }}
    />
  );
  const _nextComparision = () => {
    let nextIndex = calibrationIndex + 1;
    if (calibrationIndex === 3) {
      updateCalibrations({}, 0, true);
      return;
    }

    updateCalibrations({}, nextIndex);
  };

  if (!comparisionsModel?.completed) {
    return (
      <>
        <UrbanShapesSteps activeIndex={3} />
        <div className="p-4">{t("PLEASE_COMPLETE_COMPARISIONS")}</div>
      </>
    );
  }

  if (profile?.calibrationsCompleted) {
    return (
      <>
        <UrbanShapesSteps activeIndex={3} />
        <div className="p-4">
          <p>{t("CALIBRATIONS_COMPLETED")}</p>
          <Button
            size="small"
            onClick={() => {
              updateProfileData({
                calibrations: [],
                calibrationIndex: 0,
                calibrationsCompleted: false,
              });
            }}
          >
            {t("RESET")}
          </Button>
        </div>
      </>
    );
  }

  const _renderLeftImageTextArea = () => (
    <TextArea
      placeholder="Tell us more"
      style={{ minHeight: 100 }}
      onBlur={saveImagesNotes(currentCalibration && currentCalibration.image1)}
      value={currentCalibration ? notes[currentCalibration.image1] || "" : ""}
      onChange={(e) =>
        setNotes({
          ...(notes || {}),
          [currentCalibration.image1]: e.target.value,
        })
      }
    ></TextArea>
  );
  const _renderRightImageTextArea = () => (
    <TextArea
      placeholder="Tell us more"
      style={{ minHeight: 100 }}
      onBlur={saveImagesNotes(currentCalibration && currentCalibration.image2)}
      value={currentCalibration ? notes[currentCalibration.image2] || "" : ""}
      onChange={(e) =>
        setNotes({
          ...(notes || {}),
          [currentCalibration.image2]: e.target.value,
        })
      }
    ></TextArea>
  );

  return (
    <>
      <UrbanShapesSteps activeIndex={3} />
      <div className="p-4">
        {t("ADITIONAL_CALIBRATIONS")}: <b>{calibrationIndex + 1}/4</b>
        <br />
        <Header size="huge" as="h1">
          {t("CALIBRATIONS_QUESTION_1")}

          <InllineHelpTextDiv>
            <InfoModal
              open={showHelpText === "help1"}
              onOpen={() => setShowHelpText("help1")}
              onClose={() => setShowHelpText(null)}
              content={<HTMLContent html={t("HELP_TEXT_6")} />}
              trigger={<Icon circular name="info" />}
            />
          </InllineHelpTextDiv>
        </Header>
        <div style={{ marginBottom: 80 }}>
          <ImagesContainer>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <LeftImageContainer>{image1Comp}</LeftImageContainer>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <RightmageContainer>{image2Comp}</RightmageContainer>
              </Grid.Column>
            </Grid>
          </ImagesContainer>

          <ButtonsContainer>
            <Grid>
              <Grid.Column mobile={16} tablet={3} computer={3}>
                <ButtonGroupLabel>
                  {t("CALIBRATIONS_QUESTION_1_LEFT")}
                </ButtonGroupLabel>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={10} computer={10}>
                <ButtonsGroup basic size="small">
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === -5
                    }
                    onClick={setPreferableRank(-5)}
                  >
                    5
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === -4
                    }
                    onClick={setPreferableRank(-4)}
                  >
                    4
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === -3
                    }
                    onClick={setPreferableRank(-3)}
                  >
                    3
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === -2
                    }
                    onClick={setPreferableRank(-2)}
                  >
                    2
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === -1
                    }
                    onClick={setPreferableRank(-1)}
                  >
                    1
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 0
                    }
                    onClick={setPreferableRank(0)}
                  >
                    0
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 1
                    }
                    onClick={setPreferableRank(1)}
                  >
                    1
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 2
                    }
                    onClick={setPreferableRank(2)}
                  >
                    2
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 3
                    }
                    onClick={setPreferableRank(3)}
                  >
                    3
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 4
                    }
                    onClick={setPreferableRank(4)}
                  >
                    4
                  </Button>
                  <Button
                    active={
                      currentCalibration &&
                      currentCalibration.preferableRank === 5
                    }
                    onClick={setPreferableRank(5)}
                  >
                    5
                  </Button>
                </ButtonsGroup>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={3} computer={3}>
                <ButtonGroupLabel>
                  {t("CALIBRATIONS_QUESTION_1_RIGHT")}
                </ButtonGroupLabel>
              </Grid.Column>
            </Grid>
          </ButtonsContainer>
          {/* <Button
            style={{ marginTop: 12 }}
            labelPosition="right"
            icon
            floated="right"
            onClick={_nextComparision}
          >
            Next comparison
            <Icon name="right arrow" />
          </Button> */}
        </div>
        <Header size="huge" as="h1">
          {t("CALIBRATIONS_QUESTION_2")}

          <InllineHelpTextDiv>
            <InfoModal
              open={showHelpText === "help2"}
              onOpen={() => setShowHelpText("help2")}
              onClose={() => setShowHelpText(null)}
              content={<HTMLContent html={t("HELP_TEXT_7")} />}
              trigger={<Icon circular name="info" />}
            />
          </InllineHelpTextDiv>
        </Header>
        <div style={{ marginBottom: 80 }}>
          <ImagesContainer>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <LeftImageContainer>{image1Comp}</LeftImageContainer>
              </Grid.Column>
              <Grid.Column mobile={16} only="mobile">
                {_renderLeftImageTextArea()}
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <RightmageContainer>{image2Comp}</RightmageContainer>
              </Grid.Column>
            </Grid>
          </ImagesContainer>
          <ImagesContainer>
            <Grid>
              <Grid.Column tablet={8} computer={8} only="tablet computer">
                {_renderLeftImageTextArea()}
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                {_renderRightImageTextArea()}
              </Grid.Column>
            </Grid>
          </ImagesContainer>
          <Button
            style={{ marginTop: 12 }}
            labelPosition="right"
            icon
            floated="right"
            onClick={_nextComparision}
          >
            {t("NEXT_COMPARISION")}
            <Icon name="right arrow" />
          </Button>
        </div>
      </div>
    </>
  );
};

const ButtonsContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const ImagesContainer = styled.div`
  textarea {
    border: 1px solid #333;
    min-width: calc(50% - 16px);
    padding: 8px;
    width: 100%;
  }
`;

const LeftImageContainer = styled.div`
  > div {
    width: 100%;
    min-height: 300px;
  }
`;

const RightmageContainer = styled.div`
  > div {
    width: 100%;
    min-height: 300px;
  }
`;

const ButtonGroupLabel = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsGroup = styled(Button.Group)`
  &&&& {
    display: flex;

    .button {
      flex-basis: fit-content;
      display: flex;
      padding: 12px 0;
      justify-content: center;
    }
  }
`;
