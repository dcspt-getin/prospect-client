/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Dashboard from "components/Dashboard";
import usePasswordlessLogin from "hooks/usePasswordlessLogin";
import useSessionLogin from "hooks/useSessionLogin";

import LoginForm from "./LoginForm";

export default () => {
  const history = useHistory();
  useSessionLogin();
  usePasswordlessLogin();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    const query = new URLSearchParams(window.location.search);

    if (query.get("next")) {
      history.push(query.get("next"));
    } else {
      history.push("/questionario");
    }
  }

  return (
    <Dashboard hideLeftMenu>
      <LoginForm />
    </Dashboard>
  );
};
