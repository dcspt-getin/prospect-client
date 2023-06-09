/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Container, Card, Divider } from "semantic-ui-react";

import Menu from "./Menu";
import Footer from "./Footer";
import useTranslations from "src/hooks/useTranslations";

export default ({ children }) => {
  const [t] = useTranslations("header");

  return (
    <Container className="p-4 w-full">
      <Card fluid className="shadow-xl">
        <Card.Content>
          <Card.Header
            // content={}
            onClick={() => (window.location = `${process.env.PUBLIC_URL}/`)}
          />
          <Card.Description
            style={{ cursor: "pointer" }}
            onClick={() => (window.location = `${process.env.PUBLIC_URL}/`)}
            content={
              <>
                <b style={{ fontSize: 16 }}>{t("HEADER_TITLE")}</b> <br />
                <small>{t("HEADER_SUB_TITLE")}</small>
              </>
            }
          />
        </Card.Content>
        <Menu />
      </Card>
      <div className="flex" style={{ minHeight: "calc(100vh - 230px)" }}>
        <div className="w-full">{children}</div>
      </div>

      <Divider />
      <Footer />
    </Container>
  );
};
