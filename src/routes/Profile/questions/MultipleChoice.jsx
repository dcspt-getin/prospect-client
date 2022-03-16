/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Grid, Header, Dropdown, Form, Radio } from "semantic-ui-react";
import QuestionInfo from "./common/QuestionInfo";

export default ({ question, value, onChange }) => {
  const { multiple_selection_type: selectionType, options } = question;

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
          onChange={(e, { value }) => onChange(value)}
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
              onChange={(e, { value }) => onChange(value)}
            />
          </Form.Field>
        ))}
      </RadioOptions>
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
