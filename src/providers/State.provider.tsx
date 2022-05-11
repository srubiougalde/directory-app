import React, { useReducer, useContext, Dispatch } from "react";
import { StateReducer, Action } from "./State.reducer";

const initialState = {
  loggedIn: false,
  user: {},
  expiresIn: null,
  token: '',
  userId: '',
  rememberMe: false,
};

export type AppState = {
  loggedIn: boolean;
  user: AppUser;
  expiresIn?: Date;
  userId: string;
  token: string;
  rememberMe: boolean;
};

export type AppUser ={
  aud: string;
  exp: number;
  iat: number;
  id: string;
  iss: string;
  jti:string;
  nbf: number;
  roles: string;
  sub: string;
  given_name: string;
  family_name: string;
}

export type AppContextState = {
  state: AppState;
  dispatch: Dispatch<Action>
};

const contextDefaultValues: AppContextState = {
  state: {} as AppState,
  dispatch: () => {}
};

const AppStateContext = React.createContext<AppContextState>(contextDefaultValues);

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("NO CONTEXT");
  }
  return context;
};

const useAppUser = () => {
  const {state} = useAppState();
  if (!state.loggedIn) {
    throw new Error("NO AUTH");
  }
  return state.loggedIn
};
// eslint-disable-next-line react/prop-types
const AppStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(StateReducer, initialState);
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export { initialState, AppStateContext, useAppUser, useAppState };
