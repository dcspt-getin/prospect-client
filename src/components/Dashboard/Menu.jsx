/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from "react";
import { Button, Menu } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { logOutUser } from "store/auth/actions";
import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";
import useTranslations from "src/hooks/useTranslations";
import configurations from "helpers/configurations";
import {
  getAppConfiguration,
  getCurrentTranslation,
} from "store/app/selectors";
import { API_BASE_URL } from "config";

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state && state.auth.currentUser);
  const _onLogout = () => dispatch(logOutUser());
  const [t] = useTranslations("header");
  const showResultsAfter = useSelector((state) =>
    getAppConfiguration(state, configurations.SHOW_RESULTS_AFTER)
  );
  const showResultsBefore = useSelector((state) =>
    getAppConfiguration(state, configurations.SHOW_RESULTS_BEFORE)
  );
  const currentTranslation = useSelector(getCurrentTranslation);

  const [menuPages, setMenuPages] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/pages/`).then((res) => {
      const {
        data: { results },
      } = res;

      const pages = results.filter(
        (r) =>
          r.language.language_code === currentTranslation?.language_code &&
          r.header_menu === true
      );

      setMenuPages(pages);
    });
  }, [currentTranslation?.language_code]);

  const isTodayBetewweenResultsBeforeAndAfter =
    new Date() > new Date(showResultsAfter) &&
    new Date() < new Date(showResultsBefore);
  const showResults =
    currentUser?.is_staff || isTodayBetewweenResultsBeforeAndAfter;

  return (
    <MyMenu size="large">
      <Menu.Menu position="left">
        {menuPages.map((p) => (
          <Menu.Item
            name={p.title}
            active={history.location === `/${p.slug}`}
            onClick={() => history.push(`/${p.slug}`)}
          />
        ))}
      </Menu.Menu>

      <Menu.Menu position="right">
        {isAuthenticated && showResults && (
          <Menu.Item
            name={t("Resultados")}
            active={history.location === "/results"}
            onClick={() => history.push("/results")}
          />
        )}
        <Menu.Item>
          {!isAuthenticated && (
            <Button primary onClick={() => history.push("/login")}>
              {t("Entrar")}
            </Button>
          )}
          {isAuthenticated && (
            <Button primary onClick={_onLogout}>
              {t("Sair")}
            </Button>
          )}
        </Menu.Item>
        <LanguageSelector />
      </Menu.Menu>
    </MyMenu>
  );
};

const MyMenu = styled(Menu)`
  &&&& {
    margin-top: 0;
    box-shadow: none;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;

    @media only screen and (max-width: 768px) {
      .languageSelector {
        margin-top: 6px;
        min-width: 80px;
      }

      .item,
      .dropdown,
      button {
        font-size: 12px !important;
      }
    }
  }
`;
