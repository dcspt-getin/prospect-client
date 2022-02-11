import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = useSelector(state => state && state.auth.isAuthenticated);
  const currentUser = useSelector(state => state && state.auth.currentUser);

  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!currentUser) return '';

  return <Route {...rest}>{children}</Route>;
}

export default PrivateRoute;
