/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import axios from "axios";

import { API_BASE_URL } from "config";

export default () => {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const fetchResults = async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/groups-questions/?limit=1000`
      );

      setResults(data.results.filter((g) => g.is_visible_on_results === true));
    };

    fetchResults();
  }, []);

  return results;
};
