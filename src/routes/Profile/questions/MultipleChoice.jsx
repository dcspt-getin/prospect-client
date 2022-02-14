/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";
import { Grid, Header, Dropdown, Form, Radio } from "semantic-ui-react";

export default ({ question }) => {
  const { multiple_selection_type: selectionType, options } = question;

  const _inputTypeMapper = {
    SELECT: (
      <>
        <Dropdown
          fluid
          selection
          placeholder="Select"
          options={options.map((o) => ({ value: o.id, text: o.title }))}
        />
      </>
    ),
    RADIO: (
      <>
        {options.map((o) => (
          <Form.Field key={o.id}>
            <Radio
              label={o.title}
              name={`radio-group-${question.id}`}
              value={o.id}
              // checked={this.state.value === 'this'}
              // onChange={this.handleChange}
            />
          </Form.Field>
        ))}
      </>
    ),
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
            {_inputTypeMapper[selectionType]}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
