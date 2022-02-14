/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Input } from "semantic-ui-react";
import styled from "styled-components";

export default ({ question }) => {
  return (
    <Wrapper>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header size="medium">{question.title}</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Input fluid placeholder="Value" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
