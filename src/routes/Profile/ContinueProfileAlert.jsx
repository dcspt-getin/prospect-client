/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Header, Grid, Button } from "semantic-ui-react";

export default ({ onClickContinue, onClickReset }) => {
  return (
    <Wrapper>
      <Header>
        Pretende continuar o questionário gravado anteriormente ou voltar a
        preencher de inicio?
      </Header>

      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Button onClick={onClickReset}>Voltar ao Inicio</Button>
            <Button onClick={onClickContinue}>Continuar</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
