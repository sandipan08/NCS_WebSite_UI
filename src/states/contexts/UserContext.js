import { createContext, useReducer, useEffect } from "react";
import constants from "../../helpers/Constants";
import UserReducer from "../reducers/UserReducer";

const initialState = {
  user: null,
  customer: null,
  isFetching: false,
  loginError: false,
};

export const UserContext = createContext(initialState);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  // const [state, dispatch] = useReducer(
  //   UserReducer,
  //   [],
  //   JSON.parse(localStorage.getItem(constants.CURRENT_USER)) || initialState
  // );

  // useEffect(() => {
  //   localStorage.setItem(constants.CURRENT_USER, JSON.stringify(state.user));
  // }, [state.user]);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        customer: state.customer,
        isFetching: state.isFetching,
        loginError: state.loginError,
        // state,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
