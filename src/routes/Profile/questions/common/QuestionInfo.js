/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Image } from "semantic-ui-react";
import HTMLContent from "src/components/HTMLContent";
import styled from "styled-components";

export default ({ question, renderDescription }) => {
  const _renderDescriptionImage = () => {
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

    if (parent_question) {
      const parentKeys = Object.keys(parent_question);
      let result = desc;

      parentKeys.forEach((key) => {
        result = result.replace(
          `{parent_question.${key}}`,
          parent_question[key]
        );
      });

      return result;
    }

    if (renderDescription) return renderDescription(desc);

    return desc;
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Title size="medium">{question.title}</Title>
        </Grid.Column>
      </Grid.Row>
      {_renderDescriptionImage(question)}
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
              <HTMLContent html={_getDescription(question.description_html)} />
            </Description>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

const ImageContainer = styled.div``;

const Title = styled(Header)`
  &&& {
    margin-top: -20px;
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
