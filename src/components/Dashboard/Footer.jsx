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
          <div
            dangerouslySetInnerHTML={{ __html: t("PLATAFORM_DESCRIPTION") }}
          />
        </Container>
      </Grid.Column>
      <Grid.Column>
        <Image src={FctLogo} style={{ width: 175, display: "inline-block" }} />
        <Image
          src={Financiaments}
          style={{
            width: "calc(100% - 175px)",
            display: "inline-block",
            border: "1px solid #ccc",
          }}
        />
      </Grid.Column>
    </Grid>
  );
};
