import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import { sessionLogin } from "store/auth/actions";

const generateSessionId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const useLocalSessionLogin = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [processing, setProcessing] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();

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

    setProcessing(true);

    if (!sessionId) {
      sessionId = generateSessionId();

      Cookies.set("localSessionId", sessionId);
    }

    try {
      dispatch(
        sessionLogin("LOCAL_SESSION", sessionId, userGroup, {
          ...Object.fromEntries(query),
        })
      );

      history.push("/questionario");
    } catch (e) {
      setProcessing(false);
    }
  }, [query]);

  return [processing];
};

export default useLocalSessionLogin;
