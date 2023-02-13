/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { Header } from "semantic-ui-react";
import { useSelector } from "react-redux";
import axios from "axios";

import Dashboard from "components/Dashboard";
import { getCurrentTranslation } from "store/app/selectors";
import { API_BASE_URL } from "config";
import LoginComponent from "../Login/LoginComponent";

export default () => {
  const currentTranslation = useSelector(getCurrentTranslation);

  const [showLogin, setShowLogin] = useState(false);
  const [{ title, content }, setPage] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/pages/?is_homepage=true`).then((res) => {
      const {
        data: { results },
      } = res;

      const page = results.find(
        (r) => r.language.language_code === currentTranslation?.language_code
      );

      if (!page && results.length > 0) {
        setPage(results[0]);
        return;
      }
      if (page) setPage(page);

      if (!page) {
        setShowLogin(true);
      }
    });
  }, [currentTranslation?.language_code]);

  if (showLogin) {
    return <LoginComponent />;
  }

  return (
    <Dashboard>
      <div className="p-4">
        <Header size="huge" as="h1">
          {title}
        </Header>

        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </div>
    </Dashboard>
  );
};
