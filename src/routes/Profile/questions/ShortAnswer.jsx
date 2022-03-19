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
  const questionRef = React.useRef(question);

  questionRef.current = question;

  const _onChange = (val) => {
    if (
      +questionRef.current.value_min &&
      +val < +questionRef.current.value_min
    ) {
      val = questionRef.current.value_min;
    }
    if (
      +questionRef.current.value_max &&
      +val > +questionRef.current.value_max
    ) {
      val = question.value_max;
    }

    onChange(val, questionRef.current);
  };
  const inputVal = value === undefined ? question.default_value : value;

  const _renderInput = (type) => {
    const _inputField = (
      <Input
        fluid
        label={
          question.input_label && question.input_label.content
            ? { basic: true, content: question.input_label.content }
            : null
        }
        labelPosition={
          question.input_label &&
          question.input_label.content &&
          question.input_label.position
        }
        value={inputVal}
        min={parseFloat(question.value_min)}
        max={parseFloat(question.value_max)}
        step={parseFloat(question.value_interval)}
        type={INPUT_TYPES[type] || INPUT_TYPES.NUMBER}
        placeholder="Valor"
        onChange={(e) => _onChange(e.target.value, questionRef.current)}
      />
    );

    if (type === "SLIDER") {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={6} tablet={6} computer={4}>
              {_inputField}
            </Grid.Column>
            <Grid.Column mobile={10} tablet={10} computer={12}>
              <SliderContainer>
                <Slider
                  value={inputVal}
                  color="blue"
                  settings={{
                    start: 0,
                    min: parseFloat(question.value_min || 0),
                    max: parseFloat(question.value_max || 100),
                    step: parseFloat(question.value_interval || 1),
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
          <Grid.Column
            mobile={
              question.input_size ? parseInt(question.input_size) + 3 : 16
            }
            tablet={
              question.input_size ? parseInt(question.input_size) + 1 : 16
            }
            computer={parseInt(question.input_size) || 16}
          >
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
