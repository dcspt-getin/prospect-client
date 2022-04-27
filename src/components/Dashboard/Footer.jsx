/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Grid, Container } from "semantic-ui-react";

import useTranslations from "hooks/useTranslations";

export default () => {
  const [t] = useTranslations("footer");

  return (
    <Footer>
      <Grid columns={1} padded="horizontally">
        <Grid.Column>
          <Container textAlign="justified" style={{ fontSize: 12 }}>
            <span dangerouslySetInnerHTML={{ __html: t("Copyright 2022") }} />
          </Container>
        </Grid.Column>
      </Grid>
    </Footer>
  );
};

const Footer = styled.footer``;
