/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header } from "semantic-ui-react";
import styled from "styled-components";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import HTMLContent from "components/HTMLContent";
import useQuestions from "hooks/useQuestions";

import MultipleChoice from "./questions/MultipleChoice";
import ShortAnswer from "./questions/ShortAnswer";
import PairwiseCombinations from "./questions/PairwiseCombinations";

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();

  console.log({ questions });

  const _renderQuestion = (q) => {
    console.log({ q });
    switch (q.question_type) {
      case "SHORT_ANSWER":
        return <ShortAnswer question={q} />;

      case "PAIRWISE_COMBINATIONS":
        return <PairwiseCombinations question={q} />;

      case "MULTIPLE_CHOICE":
        return <MultipleChoice question={q} />;

      default:
        return "";
    }
  };

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Questionario")}
        </Header>
        {questions.map((question) => (
          <QuestionContainer>{_renderQuestion(question)}</QuestionContainer>
        ))}
      </div>
    </Dashboard>
  );
};

const QuestionContainer = styled.div`
  margin: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
`;
