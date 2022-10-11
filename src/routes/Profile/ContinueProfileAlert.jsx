/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Header, Grid, Button } from "semantic-ui-react";
import useTranslations from "../../hooks/useTranslations";

export default ({ onClickContinue, onClickReset }) => {
  const [t] = useTranslations("userProfile");

  return (
    <Wrapper>
      <Header>
        {t(
          "Pretende continuar o questionário gravado anteriormente ou voltar a preencher de inicio?"
        )}
      </Header>

      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Button onClick={onClickReset}>{t("Voltar ao Inicio")}</Button>
            <Button onClick={onClickContinue}>{t("Continuar")}</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
