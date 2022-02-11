/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Container, Card, Image, Divider } from "semantic-ui-react";

import Menu from "./Menu";
import LeftMenuBar from "./LeftMenuBar";
import Footer from "./Footer";
import Logo from "./images/logo.png";
import useTranslations from "src/hooks/useTranslations";

export default ({ children, hideLeftMenu }) => {
  const [t] = useTranslations("header");

  return (
    <Container className="p-4 w-full">
      <Card fluid>
        <Card.Content>
          <Card.Header
            content={
              <Image
                src={Logo}
                style={{ width: 150, height: 85, cursor: "pointer" }}
              />
            }
            onClick={() => (window.location = `${process.env.PUBLIC_URL}/`)}
          />
          <Card.Description content={t("HEADER_TITLE")} />
        </Card.Content>
        <Menu />
      </Card>
      <div class="flex" style={{ minHeight: "calc(100vh - 430px)" }}>
        {!hideLeftMenu && <LeftMenuBar />}
        <div class="w-full">{children}</div>
      </div>

      <Divider />
      <Footer />
    </Container>
  );
};
