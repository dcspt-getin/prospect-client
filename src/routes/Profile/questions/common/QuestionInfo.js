/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Image } from "semantic-ui-react";
import styled from "styled-components";

export default ({ question }) => {
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

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Header size="medium">{question.title}</Header>
        </Grid.Column>
      </Grid.Row>
      {_renderDescriptionImage(question)}
      {question.description && (
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Grid.Column width={16}>
            <p>{question.description}</p>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

const ImageContainer = styled.div``;
