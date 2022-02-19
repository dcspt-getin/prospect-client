/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Header, Input, Image } from "semantic-ui-react";
import styled from "styled-components";
import { Slider } from "react-semantic-ui-range";
import QuestionInfo from "./common/QuestionInfo";

const INPUT_TYPES = {
  NUMBER: "number",
  TEXT: "text",
};

export default ({ question, value, onChange }) => {
  const _onChange = (val) => {
    if (+question.value_min && +val < +question.value_min) {
      val = question.value_min;
    }
    if (+question.value_max && +val > +question.value_max) {
      val = question.value_max;
    }

    onChange(val);
  };
  const inputVal = value === undefined ? question.default_value : value;

  const _renderInput = (type) => {
    const _inputField = (
      <Input
        fluid
        value={inputVal}
        min={+question.value_min}
        max={+question.value_max}
        type={INPUT_TYPES[type] || INPUT_TYPES.NUMBER}
        placeholder="Valor"
        onChange={(e) => _onChange(e.target.value)}
      />
    );

    if (type === "SLIDER") {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={6} tablet={4} computer={2}>
              {_inputField}
            </Grid.Column>
            <Grid.Column mobile={10} tablet={12} computer={14}>
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
      <QuestionInfo question={question} />
      <Grid>
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
