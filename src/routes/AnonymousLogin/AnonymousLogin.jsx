import React from "react";
import useLocalSessionLogin from "hooks/useLocalSessionLogin";

import LoginComponent from "../Login/LoginComponent";

const AnonymousLogin = () => {
  useLocalSessionLogin();

  return <LoginComponent />;
};

export default AnonymousLogin;
