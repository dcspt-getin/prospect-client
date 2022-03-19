/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Dashboard from "components/Dashboard";

import LoginForm from "./LoginForm";

export default () => {
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) history.push("/questionario");

  return (
    <Dashboard hideLeftMenu>
      <LoginForm />
    </Dashboard>
  );
};
