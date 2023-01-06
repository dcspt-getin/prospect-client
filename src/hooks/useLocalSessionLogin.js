import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { sessionLogin } from "store/auth/actions";

const generateSessionId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const useLocalSessionLogin = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [error, setError] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const query = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const userGroup = query.get("GROUP");
    let sessionId = Cookies.get("localSessionId");

    if (!userGroup) {
      return;
    }

    if (!sessionId) {
      sessionId = generateSessionId();

      Cookies.set("localSessionId", sessionId);
    }

    try {
      dispatch(sessionLogin("LOCAL_SESSION", sessionId, userGroup, {}));
    } catch (e) {
      setError(true);
    }
  }, [query]);

  return [error];
};

export default useLocalSessionLogin;
