import React from "react";
import useLocalSessionLogin from "hooks/useLocalSessionLogin";

import LoginComponent from "../Login/LoginComponent";

const AnonymousLogin = () => {
  const [processing] = useLocalSessionLogin();

  if (processing) {
    return "";
  }

  return <LoginComponent />;
};

export default AnonymousLogin;
