/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import styled from "styled-components";

export default ({ html }) => {
  return (
    <Wrapper
      className="html-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const Wrapper = styled.div`
  ul {
    list-style: circle;
    margin: 0 0 1em;

    li {
      margin-left: 20px;
    }
  }
`;
