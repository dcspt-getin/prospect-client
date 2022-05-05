/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Button, Menu } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { logOutUser } from "store/auth/actions";
import styled from "styled-components";
// import LanguageSelector from "./LanguageSelector";
import useTranslations from "src/hooks/useTranslations";
import configurations from "helpers/configurations";
import { getAppConfiguration } from "store/app/selectors";

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

  const isTodayBetewweenResultsBeforeAndAfter =
    new Date() > new Date(showResultsAfter) &&
    new Date() < new Date(showResultsBefore);
  const showResults =
    currentUser?.is_staff || isTodayBetewweenResultsBeforeAndAfter;

  return (
    <MyMenu size="large">
      <Menu.Menu position="left"></Menu.Menu>

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
        {/* <LanguageSelector /> */}
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
  }
`;
