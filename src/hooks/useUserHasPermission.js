import { useSelector } from "react-redux";

export default (permission, redirectTo = `${process.env.PUBLIC_URL}/`) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const userHasPermission =
    currentUser && currentUser.permissions.some((p) => p.includes(permission));

  if (!userHasPermission && redirectTo) {
    window.location = redirectTo;
    return;
  }

  return [userHasPermission];
};
