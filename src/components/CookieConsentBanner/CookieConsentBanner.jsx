import React, { useState } from "react";
import CookieConsent from "react-cookie-consent";
import styled from "styled-components";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";

import useTranslations from "src/hooks/useTranslations";

const buttonStyles = {
  borderRadius: 4,
  background: "#2185d0",
  color: "#fff",
  fontSize: "14px",
  padding: "6px 20px",
};
const declineButtonStyles = {
  borderRadius: 4,
  background: "rgb(193, 42, 42)",
  color: "#fff",
  fontSize: "14px",
  padding: "6px 20px",
  marginLeft: 10,
};
const bannerStyles = {};

const CookieConsentBanner = () => {
  const [t] = useTranslations("cookiesConsent");
  const [visible, setVisible] = useState(
    Cookies.get("cookieBanner") !== "true"
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Popup>
      <CookieConsent
        disableStyles
        location="none"
        buttonText={t("ACCEPT")}
        declineButtonText={t("REJECT")}
        cookieName="cookieBanner"
        overlay
        buttonStyle={buttonStyles}
        declineButtonStyle={declineButtonStyles}
        // expires={150}
        style={bannerStyles}
        overlayClasses="overlayclass"
        enableDeclineButton
        flipButtons
        onAccept={() => {
          setVisible(false);
        }}
        onDecline={() => {
          setVisible(false);
        }}
        visible={visible ? "show" : "hidden"}
      >
        <Wrapper>
          <div dangerouslySetInnerHTML={{ __html: t("COOKIE_TEXT") }} />
        </Wrapper>
      </CookieConsent>

      {!isAuthenticated && !visible && Cookies.get("cookieBanner") !== "true" && (
        <OpenCookieBanner>
          {t(
            "To accept our cookies policy please open the cookies dialog again"
          )}{" "}
          <a onClick={() => setVisible(true)}>{t("here")}</a>
        </OpenCookieBanner>
      )}
      {isAuthenticated && !visible && Cookies.get("cookieBanner") !== "true" && (
        <Modal
          open
          header={t("Cookie Consent")}
          content={t(
            "To use this app you should accept the cookies, if you dont want to accept please close the window"
          )}
          actions={[
            {
              key: "done",
              content: t("Accept Cookies"),
              positive: true,
              onClick: () => setVisible(true),
            },
          ]}
        />
      )}
    </Popup>
  );
};

const Popup = styled.div`
  .CookieConsent {
    max-width: 500px;
    border-radius: 5px;
    padding: 20px 30px;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translate3d(-50%, -50%, 9999990px);
    width: 95%;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }

  .overlayclass {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 20px;

  a {
    /* color: #fff; */
    text-decoration: underline;
  }
`;

const OpenCookieBanner = styled.div`
  position: fixed;
  height 70px;
  width: 100%;
  background-color: #333;
  bottom: 0;
  left: 0;
  color: #fff;
  padding: 20px;
  font-size: 16px;
  z-index: 1000;

  a {
    color: #fff;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default CookieConsentBanner;
