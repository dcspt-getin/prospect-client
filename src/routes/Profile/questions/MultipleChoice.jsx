/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import { Grid, Dropdown, Form, Radio, Checkbox } from "semantic-ui-react";
import QuestionInfo from "./common/QuestionInfo";

export default ({ question, value, onChange }) => {
  const {
    multiple_selection_type: selectionType,
    options,
    description_html,
    // checkbox_min_options,
    checkbox_max_options,
  } = question;
  const questionRef = React.useRef(question);
  const [optionsToIgnore, setOptionsToIgnore] = React.useState([]);

  const _onChangeCheckbox = (o) => {
    onChange(
      (Array.isArray(value) ? value : []).includes(o.id)
        ? value.filter((v) => v !== o.id)
        : [...(Array.isArray(value) ? value : []), o.id],
      questionRef.current
    );
  };
  const _onChangeRadio = (e, { value }) => onChange(value, questionRef.current);

  React.useEffect(() => {
    const renderedOptionsOnDesc = [];

    if (!["RADIO", "MULTIPLE_VALUES"].includes(selectionType)) return;

    options.forEach((option, i) => {
      const shouldRender = description_html.includes(`{option_${i + 1}}`);
      if (shouldRender) {
        if (document.querySelector(`input[id="input-option-${option.id}"]`)) {
          document
            .querySelectorAll(`input[id="input-option-${option.id}"]`)
            .forEach((elem) => {
              elem.addEventListener("change", function (event) {
                if (selectionType === "RADIO") {
                  return _onChangeRadio(event, { value: option.id });
                } else if (selectionType === "MULTIPLE_VALUES") {
                  return _onChangeCheckbox(option);
                }
              });
            });
        }

        renderedOptionsOnDesc.push(option.id);
      }
    });

    setOptionsToIgnore(renderedOptionsOnDesc);
  }, [options, description_html, value]);

  questionRef.current = question;

  const sortedOptions = options
    .filter((o) => !optionsToIgnore.includes(o.id))
    .sort((a, b) => a.row_order - b.row_order);

  const _renderRadioOption = (o, showLabel = true) => (
    <Radio
      label={showLabel ? o.title : ""}
      id={`input-option-${o.id}`}
      name={`radio-group-${question.id}`}
      value={o.id}
      checked={value === o.id}
      onChange={_onChangeRadio}
    />
  );
  const _renderCheckboxOption = (o, showLabel = true) => (
    <Checkbox
      label={showLabel ? o.title : ""}
      id={`input-option-${o.id}`}
      // name={`checkbox-group-${question.id}`}
      value={o.id}
      disabled={
        !(Array.isArray(value) ? value : []).includes(o.id) &&
        (value || []).length >= parseInt(checkbox_max_options)
      }
      checked={(Array.isArray(value) ? value : []).includes(o.id)}
      onChange={() => _onChangeCheckbox(o)}
    />
  );
  const _renderDescription = (description) => {
    let result = description;
    const _renderOption = (o) => {
      if (selectionType === "RADIO") {
        return _renderRadioOption(o, false);
      } else if (selectionType === "MULTIPLE_VALUES") {
        return _renderCheckboxOption(o, false);
      }
    };

    options.forEach((option, i) => {
      const shouldRender = result.includes(`{option_${i + 1}}`);
      if (shouldRender) {
        result = result.replace(
          `{option_${i + 1}}`,
          ReactDOMServer.renderToString(_renderOption(option))
        );
        result = result.replace(`{option_${i + 1}_title}`, option.title);

        if (selectionType === "RADIO" && option.id === value) {
          setTimeout(() => {
            const radiobtn = document.getElementById(
              `input-option-${option.id}`
            );
            radiobtn.checked = true;
          }, 100);
        }
      }
    });

    return result;
  };

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
          <Form.Field key={o.id}>{_renderRadioOption(o)}</Form.Field>
        ))}
      </RadioOptions>
    ),
    MULTIPLE_VALUES: (
      <CheckboxOptions>
        {sortedOptions.map((o) => (
          <Form.Field key={o.id}>{_renderCheckboxOption(o)}</Form.Field>
        ))}
      </CheckboxOptions>
    ),
  };

  return (
    <Wrapper>
      <QuestionInfo
        question={question}
        renderDescription={_renderDescription}
      />
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
