/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import axios from "axios";

import { API_BASE_URL } from "config";

const TIME_INTERVAL = 1000 * 60; // 1 minute

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

    // run first time
    fetchResults();

    const interval = setInterval(() => fetchResults(), TIME_INTERVAL);
    //destroy interval on unmount
    return () => clearInterval(interval);
  }, []);

  return results;
};
