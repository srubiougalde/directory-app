import React from "react";

import { Route, Router, Switch } from "react-router";
import { Routes } from "../providers/routes";

import history from "../dom-history";
import Login from "./Login";
import Home from "./Home";
import PrivateRoute from "../components/protected-route/ProtectedRoute.component";

export enum UserType {
  SuperAdmin = "super_admin",
  Admin = "admin",
  Client = "client",
}

const anyRole = [UserType.SuperAdmin, UserType.Admin];

const Main: React.FC = () => {
  return (
    <Router  history={history as any}>
      <Switch>
        <Route path={Routes.LOGIN} exact={true}>
          <Login />
        </Route>
        <PrivateRoute path={Routes.LANDING} roles={anyRole}>
          <Home />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

export default Main;
