/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Form, Input, Select } from "semantic-ui-react";

export default ({
  label,
  options,
  value,
  error,
  handleChange,
  textValue,
  handleTextChange,
  handleTextBlur,
  hide,
}) => {
  if (hide) return "";

  // const _renderOption = (option) => (
  //   <>
  //     <Form.Field
  //       control={Radio}
  //       label={option.text}
  //       value={option.value}
  //       checked={value === option.value}
  //       onChange={handleChange}
  //       error={error}
  //     />
  //     {value === option.value && option.textOption && (
  //       <Input
  //         style={{ width: "100%" }}
  //         value={textValue}
  //         onChange={handleTextChange}
  //         onBlur={handleTextBlur}
  //       />
  //     )}
  //   </>
  // );

  const selectedOption = options.find((o) => o.value === value);

  return (
    <Form.Group grouped>
      <label for="fruit">{label}</label>
      {/* {options.map(_renderOption)} */}
      <div>
        <Select
          placeholder="Select"
          style={{ width: "100%" }}
          onChange={handleChange}
          value={value}
          options={options.map((o) => ({
            ...o,
            key: o.value,
          }))}
        />
        {selectedOption && selectedOption.textOption && (
          <Input
            style={{ width: "100%", marginTop: 10 }}
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
          />
        )}
      </div>
    </Form.Group>
  );
};
