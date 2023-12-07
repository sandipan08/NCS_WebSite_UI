import { createContext, useReducer, useEffect } from "react";

import MobileMenuReducer from "../reducers/MobileMenuReducer";

const initialState = {
  isOpen: false,
  isOpenCategory: false,
};

export const MobileMenuContext = createContext(initialState);

export const MobileMenuContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MobileMenuReducer, initialState);

  //   useEffect(() => {
  //     localStorage.setItem(constants.CURRENT_USER, JSON.stringify(state.user));
  //   }, [state.user]);

  return (
    <MobileMenuContext.Provider
      value={{
        isOpen: state.isOpen,
        isOpenCategory: state.isOpenCategory,
        dispatch,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
};
