/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import { Grid, Header, Image, Button, Dimmer, Loader } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import HTMLContent from "src/components/HTMLContent";
import TerritorialUnitImage from "components/TerritorialUnitImage/TerrritorialUnitImage";
import { getAppConfiguration } from "store/app/selectors";
import InfoModal from "components/InfoModal";
import { getQuestionValueText } from "helpers/questions/questionValueUtils";
import { getQuestions } from "store/questions/selectors";
import { getActiveProfile } from "store/profiles/selectors";
import questionTypes from "helpers/questions/questionTypes";
import useTerritorialCoverages from "hooks/useTerritorialCoverages";

export default ({ question, renderDescription, hideDescription }) => {
  const questions = useSelector(getQuestions);
  const activeProfile = useSelector(getActiveProfile);
  const [showHelpModel, setShowHelpModel] = useState(false);
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );
  const {
    allImages,
    loadTerritorialCoverages,
    loading: territorialCoveragesLoading,
  } = useTerritorialCoverages();
  const { help } = question;

  React.useEffect(() => {
    loadTerritorialCoverages();
  }, []);

  const _renderQuestionImage = () => {
    if (question.territorial_unit_image) {
      const useGoogleStreetImages = question.use_google_street_images;
      const use360Image = question.use_360_image;

      return (
        <TerritorialUniImageContainer>
          <TerritorialUnitImage
            image={question.territorial_unit_image}
            use360Image={use360Image}
            useGoogleStreetImages={useGoogleStreetImages}
            googleMapsApiKey={googleMapsApiKey}
          />
        </TerritorialUniImageContainer>
      );
    }
    const image = question.description_image || question.image_url;

    if (!image) return "";

    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <ImageContainer>
            <Image src={image} size="medium" bordered centered />
          </ImageContainer>
        </Grid.Column>
      </Grid.Row>
    );
  };
  const _getDescription = (desc = "") => {
    const { parent_question } = question;
    let result = {
      content: desc,
      images: [],
    };

    if (!desc) {
      return result;
    }

    const allQuestionsIdsIncludingParentQuestion = {
      parent_question,
      ...questions.reduce(
        (acc, q) => ({ ...acc, [`question_${q.id}`]: q }),
        {}
      ),
    };

    Object.keys(allQuestionsIdsIncludingParentQuestion).forEach((key) => {
      const regexString = `{${key}.(.*?)}`;
      const regex = new RegExp(regexString);
      const matches = result.content.match(regex);

      if (matches) {
        const [keyFound, property] = matches;
        const currQuestion = allQuestionsIdsIncludingParentQuestion[key];

        if (
          property &&
          (property.includes("value") || property.includes("meta")) &&
          activeProfile
        ) {
          const isImageQuestion =
            currQuestion?.question_type ===
            questionTypes.IMAGE_PAIRWISE_COMBINATIONS;
          const value = activeProfile?.profile_data[currQuestion.id];

          if (isImageQuestion) {
            result.images = [
              ...result.images,
              {
                question: currQuestion,
                name: getQuestionValueText(currQuestion, value, property),
              },
            ];
            result.content = result.content.replace(keyFound, "");
          } else {
            result.content = result.content.replace(
              keyFound,
              getQuestionValueText(currQuestion, value, property)
            );
          }
        } else {
          result.content = result.content.replace(
            keyFound,
            currQuestion[property]
          );
        }
      }
    });

    if (renderDescription) {
      result.content = renderDescription(result.content);
    }

    return result;
  };
  const _renderQuestionHelp = () => {
    if (!help) return "";

    return (
      <InfoModal
        open={showHelpModel}
        onOpen={() => setShowHelpModel(true)}
        onClose={() => setShowHelpModel(false)}
        content={<HTMLContent html={help} />}
        trigger={
          <HelpButton size="big" circular icon="question circle outline" />
        }
      />
    );
  };
  const _renderDescriptionImage = (image) => {
    const useGoogleStreetImages = image.question.use_google_street_images;
    const use360Image = image.question.use_360_image;

    const tuImage = allImages.find((i) => i.unit.name === image.name);

    return (
      <TerritorialUniImageContainer>
        <TerritorialUnitImage
          image={tuImage}
          use360Image={use360Image}
          useGoogleStreetImages={useGoogleStreetImages}
          googleMapsApiKey={googleMapsApiKey}
        />
      </TerritorialUniImageContainer>
    );
  };

  const description = _getDescription(question.description);
  const descriptionHTML = _getDescription(question.description_html);

  if (territorialCoveragesLoading) {
    return (
      <Dimmer
        active
        inverted
        style={{ background: "transparent", position: "relative" }}
      >
        <Loader size="large">Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Title size="medium" hasHelp={Boolean(help)}>
            {question.title}
          </Title>
          {_renderQuestionHelp()}
        </Grid.Column>
      </Grid.Row>
      {!hideDescription && (
        <>
          {_renderQuestionImage(question)}
          {question.description && (
            <Grid.Row style={{ paddingBottom: 0 }}>
              <Grid.Column width={16}>
                <Description>
                  <p>{description.content}</p>
                  {description.images &&
                    description.images.map(_renderDescriptionImage)}
                </Description>
              </Grid.Column>
            </Grid.Row>
          )}
          {question.description_html && (
            <Grid.Row style={{ paddingBottom: 0 }}>
              <Grid.Column width={16}>
                <Description>
                  <HTMLContent html={descriptionHTML.content} />
                  {descriptionHTML.images &&
                    descriptionHTML.images.map(_renderDescriptionImage)}
                </Description>
              </Grid.Column>
            </Grid.Row>
          )}
        </>
      )}
    </Grid>
  );
};

const ImageContainer = styled.div``;

const TerritorialUniImageContainer = styled.div`
  border: 5px solid transparent;
  min-height: 300px;
  position: relative;
  overflow: hidden;
  max-width: 460px;
  width: 100%;
  margin: 0 auto;

  > div {
    width: 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
  }
`;

const Title = styled(Header)`
  &&& {
    margin-top: -20px;

    ${({ hasHelp }) =>
      hasHelp &&
      `
        padding-right: 50px;
    `}
  }
`;

const Description = styled.div`
  table {
    width: 90%;
    border: 1px solid #333;
    border-collapse: collapse;
    margin: auto;

    th,
    td {
      border: 1px solid #333;
      padding: 6px;
    }
  }
`;

const HelpButton = styled(Button)`
  &&&& {
    position: absolute;
    right: 14px;
    top: -26px;
  }
`;
