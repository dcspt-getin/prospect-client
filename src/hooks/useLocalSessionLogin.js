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

    const _start = async () => {
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
        await dispatch(
          sessionLogin("LOCAL_SESSION", sessionId, userGroup, {
            ...Object.fromEntries(query),
          })
        );

        window.location.reload();
      } catch (e) {
        setProcessing(false);
      }
    };

    _start();
  }, [query]);

  return [processing];
};

export default useLocalSessionLogin;
