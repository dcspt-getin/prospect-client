/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from "react";
import { Header } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Dashboard from "components/Dashboard";
import { getCurrentTranslation } from "store/app/selectors";
import { API_BASE_URL } from "config";

export default () => {
  let { pageId } = useParams();
  const currentTranslation = useSelector(getCurrentTranslation);

  const [{ title, content }, setPage] = useState({});

  useEffect(() => {
    if (!pageId) return;

    axios.get(`${API_BASE_URL}/pages/?slug=${pageId}`).then((res) => {
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
    });
  }, [pageId, currentTranslation?.language_code]);

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
