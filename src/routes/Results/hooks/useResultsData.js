/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import axios from "axios";

import { API_BASE_URL } from "config";

const TIME_INTERVAL = 1000 * 60; // 1 minute
let interval;

export default (selectedGroup) => {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const fetchResults = async () => {
      const { data } = await axios.get(`${API_BASE_URL}/profiles/results/`, {
        params: { group: selectedGroup },
      });

      setResults(data);
    };

    if (!selectedGroup) return;

    // run first time
    fetchResults();

    if (interval) clearInterval(interval);
    interval = setInterval(() => fetchResults(), TIME_INTERVAL);
    //destroy interval on unmount
    return () => clearInterval(interval);
  }, [selectedGroup]);

  return results;
};
