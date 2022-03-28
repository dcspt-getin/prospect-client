/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Grid, Dropdown, Form, Radio, Checkbox } from "semantic-ui-react";
import QuestionInfo from "./common/QuestionInfo";

export default ({ question, value, onChange }) => {
  const { multiple_selection_type: selectionType, options } = question;
  const questionRef = React.useRef(question);

  questionRef.current = question;

  const sortedOptions = options.sort((a, b) => a.row_order - b.row_order);

  const _inputTypeMapper = {
    SELECT: (
      <>
        <Dropdown
          fluid
          selection
          placeholder="Select"
          options={sortedOptions.map((o) => ({ value: o.id, text: o.title }))}
          value={value}
          onChange={(e, { value }) => onChange(value, questionRef.current)}
        />
      </>
    ),
    RADIO: (
      <RadioOptions>
        {sortedOptions.map((o) => (
          <Form.Field key={o.id}>
            <Radio
              label={o.title}
              name={`radio-group-${question.id}`}
              value={o.id}
              checked={value === o.id}
              onChange={(e, { value }) => onChange(value, questionRef.current)}
            />
          </Form.Field>
        ))}
      </RadioOptions>
    ),
    MULTIPLE_VALUES: (
      <CheckboxOptions>
        {sortedOptions.map((o) => (
          <Form.Field key={o.id}>
            <Checkbox
              label={o.title}
              // name={`checkbox-group-${question.id}`}
              value={o.id}
              checked={(Array.isArray(value) ? value : []).includes(o.id)}
              onChange={() =>
                onChange(
                  (Array.isArray(value) ? value : []).includes(o.id)
                    ? value.filter((v) => v !== o.id)
                    : [...(value || []), o.id],
                  questionRef.current
                )
              }
            />
          </Form.Field>
        ))}
      </CheckboxOptions>
    ),
  };

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            {_inputTypeMapper[selectionType || "SELECT"]}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const RadioOptions = styled.div`
  padding-left: 20px;

  > div {
    margin-bottom: 10px;
  }
`;

const CheckboxOptions = styled.div`
  padding-left: 20px;

  > div {
    margin-bottom: 10px;
  }
`;
