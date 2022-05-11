import { AppState, initialState } from "./State.provider";

enum StateActions {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export type Action =
  | { type: StateActions.LOGIN; payload: any }
  | { type: StateActions.LOGOUT; payload: any };

function StateReducer(state: AppState, action: Action) {
  switch (action.type) {
    case StateActions.LOGIN: {
      const { payload } = action;
      return { ...state, ...payload };
    }
    case StateActions.LOGOUT: {
      return initialState;
    }
    default: {
      return initialState;
    }
  }
}

export { StateActions, StateReducer };
