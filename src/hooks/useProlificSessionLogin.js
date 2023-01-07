import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { sessionLogin } from "store/auth/actions";

const useProlificSessionLogin = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [processing, setProcessing] = useState(false);

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
    setProcessing(true);

    try {
      dispatch(
        sessionLogin("PROLIFIC", sessionId, userGroup, {
          ...Object.fromEntries(query),
        })
      );

      Cookies.set("prolificPid", prolificPid);
    } catch (e) {
      console.log({ e });
      setProcessing(false);
    }
  }, [query]);

  return [processing];
};

export default useProlificSessionLogin;
