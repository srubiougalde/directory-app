import React from "react";
import axios from "axios";
import JwtDecode from "jwt-decode";
import { Redirect, Route } from "react-router";
import { Routes } from "../../providers/routes";
import { AppUser, useAppState } from "../../providers/State.provider";
import { StateActions } from "../../providers/State.reducer";
import { REFRESH } from "../../Endpoints";
import { storeLogin } from "../../pages/Login";
import { UserType } from "../../pages/Main";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403 || error.response.status === 400) {
      localStorage.removeItem("userData");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("params");
      localStorage.removeItem("userId");
      localStorage.removeItem("rememberMe");
      if (window.location.pathname === "/" || window.location.pathname === "/altas") {
        return
      }
      window.location.replace("/");
    }
    return error;
  }
);

export const useAuth = () => {
  const { state, dispatch } = useAppState();
  if (
    state.loggedIn &&
    state.user &&
    state.expiresIn &&
    new Date() < new Date(state.expiresIn)
  ) {
    return true;
  } else if (
    JSON.parse(localStorage.getItem("userData") || "{}") &&
    new Date() < new Date(JSON.parse(localStorage.getItem("expiresIn") || "{}"))
  ) {
    axios.defaults.headers.common.Authorization =
      "Bearer " + JSON.parse(localStorage.getItem("userData") || "{}");
    // TODO: THIS IS A HORRIBLE FIX https://github.com/WordPress/gutenberg/issues/21049
    try {
      const parsedUser = JwtDecode(
        JSON.parse(localStorage.getItem("userData") || "{}")
      ) as AppUser;
      if (parsedUser.roles === UserType.Client) {
        return false
      }
    } catch (error) {
      return false;
    }
    setTimeout(() => {
      dispatch({
        type: StateActions.LOGIN,
        payload: {
          loggedIn: true,
          user: JwtDecode(JSON.parse(localStorage.getItem("userData") || "{}")),
          token: JSON.parse(localStorage.getItem("userData") || "{}"),
          expiresIn: JSON.parse(localStorage.getItem("expiresIn") || "{}"),
          userId: localStorage.getItem("userId") || "{}",
          rememberMe: localStorage.getItem("rememberMe") || "{}",
        },
      });
    });
    return true;
  } else if (
    JSON.parse(localStorage.getItem("userData") || "{}") &&
    localStorage.getItem("rememberMe") == "true" &&
    new Date() > new Date(JSON.parse(localStorage.getItem("expiresIn") || "{}"))
  ) {
    try {
      axios.post(REFRESH).then((data: any) => {
        var now = new Date();
        axios.defaults.headers.common.Authorization = "Bearer " + data.accessToken;
        now.setSeconds(now.getSeconds() + data.expiresIn);
        storeLogin(data, now, true);
        dispatch({
          type: StateActions.LOGIN,
          payload: {
            loggedIn: true,
            user: JwtDecode(data.accessToken),
            userId: data.userId,
            token: data.accessToken,
            expiresIn: now,
            rememberMe: true,
          },
        });
      });
      return true;
    } catch (error) {
      return false;
    }
  } else {
    localStorage.removeItem("userData");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("params");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    // TODO: THIS IS A HORRIBLE FIX https://github.com/WordPress/gutenberg/issues/21049
    setTimeout(() => {
      dispatch({ type: StateActions.LOGOUT, payload: {} });
    });
    return false;
  }
};

const PrivateRoute = ({ children, roles, ...rest }: any) => {
  const isLogged = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isLogged === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: Routes.LOGIN,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
