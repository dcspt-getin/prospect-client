/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Menu } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import useTranslations from "src/hooks/useTranslations";

export default () => {
  const history = useHistory();
  const { location } = history;
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [t] = useTranslations("leftMenu");

  if (!currentUser) return "";

  return <Menu vertical className="left-nav-bar"></Menu>;
};
