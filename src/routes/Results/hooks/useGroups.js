/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import axios from "axios";

import { API_BASE_URL } from "config";

export default () => {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const fetchResults = async () => {
      const { data } = await axios.get(`${API_BASE_URL}/groups-questions/all/`);

      setResults(
        data.results
          .filter((g) => g.is_visible_on_results === true)
          .sort((a, b) => a.id - b.id)
      );
    };

    fetchResults();
  }, []);

  return results;
};
