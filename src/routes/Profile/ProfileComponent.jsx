/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header } from "semantic-ui-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import HTMLContent from "components/HTMLContent";
import useQuestions from "hooks/useQuestions";

export default () => {
  const [t] = useTranslations("profile");
  const [questions] = useQuestions();

  console.log({ questions });

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Questionario")}
        </Header>
        <HTMLContent html={t("aaa")} />
      </div>
    </Dashboard>
  );
};
