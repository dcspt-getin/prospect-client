import React from "react";
import useLocalSessionLogin from "hooks/useLocalSessionLogin";

import LoginComponent from "../Login/LoginComponent";

const AnonymousLogin = () => {
  const [error] = useLocalSessionLogin();

  if (error) {
    return <LoginComponent />;
  }

  return "";
};

export default AnonymousLogin;
