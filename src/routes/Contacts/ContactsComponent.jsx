/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header } from "semantic-ui-react";

import Dashboard from "components/Dashboard";
import useTranslations from "hooks/useTranslations";
import HTMLContent from "components/HTMLContent";

export default () => {
  const [t] = useTranslations("contacts");

  return (
    <Dashboard>
      <div class="p-4">
        <Header size="huge" as="h1">
          {t("CONTACTS_TITLE")}
        </Header>
        <HTMLContent html={t("CONTACTS_CONTENT")} />
      </div>
    </Dashboard>
  );
};
