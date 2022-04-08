/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { passwordlessLogin } from "store/auth/actions";

export default () => {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const query = React.useMemo(() => new URLSearchParams(search), [search]);
  const token = query.get("token");
  const email = query.get("email");

  React.useEffect(() => {
    if (!token && !email) return;

    dispatch(passwordlessLogin({ token, email }));
  }, [token, email]);
};
