/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Input } from "semantic-ui-react";
import styled from "styled-components";
import { Slider } from "react-semantic-ui-range";

const INPUT_TYPES = {
  NUMBER: "number",
  TEXT: "text",
};

export default ({ question, defaultValue, value, onChange }) => {
  const _onChange = (val) => {
    if (+question.value_min && +val < +question.value_min) {
      val = question.value_min;
    }
    if (+question.value_max && +val > +question.value_max) {
      val = question.value_max;
    }

    onChange(val);
  };
  const inputVal = value || defaultValue;

  const _renderInput = (type) => {
    const _inputField = (
      <Input
        fluid
        value={inputVal}
        min={+question.value_min}
        max={+question.value_max}
        type={INPUT_TYPES[type]}
        placeholder="Valor"
        onChange={(e) => _onChange(e.target.value)}
      />
    );

    if (type === "SLIDER") {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>{_inputField}</Grid.Column>
            <Grid.Column width={14}>
              <SliderContainer>
                <Slider
                  value={inputVal}
                  color="blue"
                  settings={{
                    start: 0,
                    min: +question.value_min,
                    max: +question.value_max,
                    step: 1,
                    onChange: (_val) => {
                      _onChange(_val);
                    },
                  }}
                />
              </SliderContainer>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }

    return _inputField;
  };

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
            {_renderInput(question.input_type)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const SliderContainer = styled.div`
  margin-top: 10px;
`;
