import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useSessionLogin = () => {
  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const sessionId = query.get("SESSION_ID");
  const userGroup = query.get("USER_GROUP");

  console.log({ sessionId, userGroup });

  return {};
};

export default useSessionLogin;
