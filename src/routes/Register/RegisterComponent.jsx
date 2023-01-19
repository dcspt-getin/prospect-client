/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Dashboard from "components/Dashboard";
import CookieConsentBanner from "components/CookieConsentBanner/CookieConsentBanner";

import RegisterForm from "./RegisterForm";

export default () => {
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) history.push("/");

  return (
    <>
      <Dashboard hideLeftMenu>
        <RegisterForm />
      </Dashboard>
      <CookieConsentBanner />
    </>
  );
};
