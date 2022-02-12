/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header } from "semantic-ui-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import HTMLContent from "components/HTMLContent";

export default () => {
  const [t] = useTranslations("home");

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Inicio")}
        </Header>
        <HTMLContent html={t("Algum conteudo aqui")} />
      </div>
    </Dashboard>
  );
};
