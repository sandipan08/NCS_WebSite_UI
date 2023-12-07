import { createContext, useReducer, useEffect } from "react";

import BrandIconReducer from "../reducers/BrandIconReducer";

const initialState = {
  isNorthchott: true,
  isBanyan: false,
  isPatrick: false,
  isDefault: true,
  isFigo: false,
  color: "#ffce30",
  textColor: "#000000",
  division: "NORTHCOTT",
  backgroundColor: "#e3a856",
  darkBackgroundColor: "#7d5402",
};

export const BrandIconContext = createContext(initialState);

export const BrandIconContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BrandIconReducer, initialState);

  //   useEffect(() => {
  //     localStorage.setItem(constants.CURRENT_USER, JSON.stringify(state.user));
  //   }, [state.user]);

  return (
    <BrandIconContext.Provider
      value={{
        isNorthchott: state.isNorthchott,
        isBanyan: state.isBanyan,
        isPatrick: state.isPatrick,
        isDefault: state.isDefault,
        isFigo: state.isFigo,
        color: state.color,
        textColor: state.textColor,
        division: state.division,
        backgroundColor: state.backgroundColor,
        darkBackgroundColor: state.darkBackgroundColor,
        dispatch,
      }}
    >
      {children}
    </BrandIconContext.Provider>
  );
};
