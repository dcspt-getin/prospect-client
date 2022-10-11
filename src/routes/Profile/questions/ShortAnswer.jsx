/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid, Input } from "semantic-ui-react";
import styled from "styled-components";
// import { Slider } from "react-semantic-ui-range";
import QuestionInfo from "./_shared/QuestionInfo";
import MuiSlider from "@material-ui/core/Slider";

const INPUT_TYPES = {
  NUMBER: "number",
  TEXT: "text",
};

export default ({ question, value, onChange, disabled }) => {
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

    onChange(val, questionRef.current, {}, false);
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
        disabled={disabled}
        onChange={(e) => _onChange(e.target.value, questionRef.current)}
      />
    );

    if (type === "SLIDER") {
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={8} tablet={6} computer={4}>
              {_inputField}
            </Grid.Column>
            <Grid.Column mobile={8} tablet={10} computer={12}>
              <SliderContainer>
                <MuiSlider
                  disabled={disabled}
                  marks={[
                    ...(question.slider_label.left
                      ? [
                          {
                            value: question.value_min || 0,
                            label: question.slider_label.left,
                          },
                        ]
                      : []),
                    ...(question.slider_label.right
                      ? [
                          {
                            value: question.value_max || 100,
                            label: question.slider_label.right,
                          },
                        ]
                      : []),
                  ]}
                  color="primary"
                  value={inputVal}
                  min={parseFloat(question.value_min || 0)}
                  max={parseFloat(question.value_max || 100)}
                  step={parseFloat(question.value_interval || 1)}
                  onChange={(e, val) => _onChange(val)}
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
              question.input_size ? parseInt(question.input_size) + 2 : 16
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

  .MuiSlider-root {
    .MuiSlider-markLabel {
      transform: inherit;

      @media only screen and (max-width: 600px) {
        font-size: 12px !important;
      }
    }

    span:nth-child(7) {
      right: 0;
      left: auto !important;

      @media only screen and (max-width: 600px) {
        top: -15px;
      }
    }
  }
`;
