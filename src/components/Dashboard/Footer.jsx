/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Image, Container } from "semantic-ui-react";

import useTranslations from "hooks/useTranslations";

import FctLogo from "./images/fct-logo.png";
import Financiaments from "./images/financiamentos.png";

export default () => {
  const [t] = useTranslations("footer");

  return (
    <Grid columns={2} padded="horizontally">
      <Grid.Column>
        <Container textAlign="justified" style={{ fontSize: 12 }}>
          <div dangerouslySetInnerHTML={{ __html: t("Copyright 2022") }} />
        </Container>
      </Grid.Column>
      <Grid.Column></Grid.Column>
    </Grid>
  );
};
