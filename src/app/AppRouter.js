/* eslint-disable import/no-anonymous-default-export */
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

import Login from "routes/Login";
import Register from "routes/Register";
// import Home from "routes/Home";
// import About from "routes/About";
import Results from "routes/Results";
import Profile from "routes/Profile";
import TriggerError from "components/TriggerError";
import TermsAndConditions from "routes/TermsAndConditions";
import AnonymousLogin from "routes/AnonymousLogin/AnonymousLogin";

import PrivateRoute from "./PrivateRoute";

export default () => {
  const isLoading = useSelector((state) => state && state.auth.isLoading);
  const appLoaded = useSelector((state) => state && state.app.loaded);

  if (isLoading || !appLoaded)
    return (
      <Segment>
        <Dimmer active inverted style={{ height: "100vh" }}>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      </Segment>
    );

  return (
    <Switch>
      <Route path="/sentry-error">
        <TriggerError />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/anonymous-login">
        <AnonymousLogin />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/terms-conditions">
        <TermsAndConditions />
      </Route>
      <PrivateRoute path="/questionario">
        <Profile />
      </PrivateRoute>
      <PrivateRoute path="/results">
        <Results />
      </PrivateRoute>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  );
};
