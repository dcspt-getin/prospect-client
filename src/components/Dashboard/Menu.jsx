/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Button, Menu } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { logOutUser } from "store/auth/actions";
import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";
import useTranslations from "src/hooks/useTranslations";

export default () => {
  const [state, setState] = React.useState({ activeItem: "home" });
  // const _handleItemClick = (e, { name }) => setState({ activeItem: name });

  const history = useHistory();
  const dispatch = useDispatch();
  const { activeItem } = state;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const _onLogout = () => dispatch(logOutUser());
  const [t] = useTranslations("header");

  return (
    <MyMenu size="large">
      <Menu.Menu position="left">
        <Menu.Item
          name={t("MENU_TITLE_ABOUT")}
          active={activeItem === "About"}
          onClick={() => history.push("/about")}
        />
        <Menu.Item
          name={t("MENU_TITLE_CONTACTS")}
          active={activeItem === "Contacts"}
          onClick={() => history.push("/contacts")}
        />
      </Menu.Menu>

      <Menu.Menu position="right">
        {isAuthenticated && (
          <Menu.Item
            name={t("MENU_TITLE_PROFILE")}
            active={activeItem === "Profile"}
            onClick={() => history.push("/profile")}
          />
        )}
        <Menu.Item>
          {!isAuthenticated && (
            <Button primary onClick={() => history.push("/login")}>
              {t("LOGIN_TITLE")}
            </Button>
          )}
          {isAuthenticated && (
            <Button primary onClick={_onLogout}>
              {t("LOGOUT_TITLE")}
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
  }
`;
