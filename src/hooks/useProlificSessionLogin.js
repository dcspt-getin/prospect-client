import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { sessionLogin } from "store/auth/actions";

const useProlificSessionLogin = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const query = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const sessionId = query.get("SESSION_ID");
    const userGroup = query.get("GROUP");

    if (!sessionId || !userGroup) {
      return;
    }

    const prolificPid = query.get("PROLIFIC_PID");

    try {
      dispatch(
        sessionLogin("PROLIFIC", sessionId, userGroup, {
          prolific_pid: prolificPid,
        })
      );

      Cookies.set("prolificPid", prolificPid);
    } catch (e) {
      console.log({ e });
    }
  }, [query]);

  return [];
};

export default useProlificSessionLogin;
