/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header } from "semantic-ui-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";

export default () => {
  const [t] = useTranslations("termsAndConditions");

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("Termos e Condições")}
        </Header>

        <div
          dangerouslySetInnerHTML={{
            __html: t("conteudo"),
          }}
        />
      </div>
    </Dashboard>
  );
};
