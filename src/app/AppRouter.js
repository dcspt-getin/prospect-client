/* eslint-disable import/no-anonymous-default-export */
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

import Login from "routes/Login";
import Register from "routes/Register";
import Home from "routes/Home";
import About from "routes/About";
import Contacts from "routes/Contacts";
import TriggerError from "components/TriggerError";

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
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/contacts">
        <Contacts />
      </Route>
      <Route path="/">
        <Home />
      </Route>
      <PrivateRoute path="/private">
        <span>this is private</span>
      </PrivateRoute>
    </Switch>
  );
};
