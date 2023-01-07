import React from "react";
import CookieConsent from "react-cookie-consent";
import styled from "styled-components";

import useTranslations from "src/hooks/useTranslations";

const buttonStyles = {
  borderRadius: 4,
  background: "#2185d0",
  color: "#fff",
  fontSize: "14px",
  padding: "6px 20px",
};
const bannerStyles = {};

const CookieConsentBanner = () => {
  const [t] = useTranslations("cookiesConsent");

  return (
    <Popup>
      <CookieConsent
        disableStyles
        location="none"
        buttonText={t("ACCEPT")}
        cookieName="cookieBanner"
        overlay
        buttonStyle={buttonStyles}
        // expires={150}
        style={bannerStyles}
        overlayClasses="overlayclass"
      >
        <Wrapper>
          {t("COOKIE_TEXT")}
          <span
            style={{ fontSize: 12 }}
            dangerouslySetInnerHTML={{ __html: t("COOKIE_TEXT_WITH_LINK") }}
          />
        </Wrapper>
      </CookieConsent>
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

  span {
    /* color: #fff; */
    margin-left: 8px;

    a {
      /* color: #fff; */
      text-decoration: underline;
    }
  }
`;

export default CookieConsentBanner;
