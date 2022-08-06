/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { setCurrentTranslation } from "src/store/app/actions";
import styled from "styled-components";

export default () => {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.app.translations);
  const value = useSelector((state) => state.app.currentTranslation);

  const handleChange = (e, { value }) => {
    dispatch(setCurrentTranslation(value));
  };

  return (
    <Wrapper className="languageSelector">
      <Dropdown
        button
        className="icon"
        floating
        value={value}
        onChange={handleChange}
        options={translations.map((t) => ({
          key: t.language_code,
          value: t.language_code,
          flag: t.language_code,
          text: t.language,
        }))}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 30px;
  margin-top: 8px;
  margin-right: 10px;
  font-size: 14px;

  > div {
    padding: 8px;
  }

  .text {
    margin-right: 5px;
  }
`;
