import React from "react";
import CookieConsent from "react-cookie-consent";
import styled from "styled-components";

import useTranslations from "src/hooks/useTranslations";

const buttonStyles = {
  borderRadius: 4,
  background: "#2185d0",
  color: "#fff",
  fontSize: "14px",
};
const bannerStyles = { background: "#2B373B" };

const CookieConsentBanner = () => {
  const [t] = useTranslations("cookiesConsent");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("ACCEPT")}
      cookieName="cookieBanner"
      style={bannerStyles}
      buttonStyle={buttonStyles}
      expires={150}
    >
      <Wrapper>
        {t("COOKIE_TEXT")}
        <span
          style={{ fontSize: 12 }}
          dangerouslySetInnerHTML={{ __html: t("COOKIE_TEXT_WITH_LINK") }}
        />
      </Wrapper>
    </CookieConsent>
  );
};

const Wrapper = styled.div`
  span {
    color: #fff;
    margin-left: 8px;

    a {
      color: #fff;
      text-decoration: underline;
    }
  }
`;

export default CookieConsentBanner;
