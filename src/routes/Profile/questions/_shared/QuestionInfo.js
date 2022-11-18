/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import { Grid, Header, Image, Button } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import HTMLContent from "src/components/HTMLContent";
import TerritorialUnitImage from "components/TerritorialUnitImage/TerrritorialUnitImage";
import { getAppConfiguration } from "store/app/selectors";
import InfoModal from "components/InfoModal";
import getQuestionValueText from "helpers/questions/getQuestionValueText";
import { getQuestions } from "store/questions/selectors";
import { getActiveProfile } from "store/profiles/selectors";

export default ({ question, renderDescription, hideDescription }) => {
  const questions = useSelector(getQuestions);
  const activeProfile = useSelector(getActiveProfile);
  const [showHelpModel, setShowHelpModel] = useState(false);
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );
  const { help } = question;

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
  const _getDescription = (desc) => {
    const { parent_question } = question;
    let result = desc;
    const allQuestionsIdsIncludingParentQuestion = {
      parent_question,
      ...questions.reduce(
        (acc, q) => ({ ...acc, [`question_${q.id}`]: q }),
        {}
      ),
    };

    Object.keys(allQuestionsIdsIncludingParentQuestion).forEach((key) => {
      const regexString = `{${key}.([^)]+)}`;
      const regex = new RegExp(regexString);
      const matches = result.match(regex);

      if (matches) {
        const [keyFound, property] = matches;
        const currQuestion = allQuestionsIdsIncludingParentQuestion[key];

        if (
          property &&
          (property.includes("value") || property.includes("meta")) &&
          activeProfile
        ) {
          const value = activeProfile?.profile_data[currQuestion.id];

          result = result.replace(
            keyFound,
            getQuestionValueText(currQuestion, value, property)
          );
        } else {
          result = result.replace(keyFound, currQuestion[property]);
        }
      }
    });

    if (renderDescription) return renderDescription(result);

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
                  <p>{_getDescription(question.description)}</p>
                </Description>
              </Grid.Column>
            </Grid.Row>
          )}
          {question.description_html && (
            <Grid.Row style={{ paddingBottom: 0 }}>
              <Grid.Column width={16}>
                <Description>
                  <HTMLContent
                    html={_getDescription(question.description_html)}
                  />
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
