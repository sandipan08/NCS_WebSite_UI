import { createContext, useReducer, useEffect } from "react";
import constants from "../../helpers/Constants";
import CustomerReducer from "../reducers/CustomerReducer";

const initialState = {
  customer: null,
};

export const CustomerContext = createContext(initialState);

export const CustomerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CustomerReducer, initialState);
  //   const [state, dispatch] = useReducer(
  //     CustomerReducer,
  //     [],
  //     JSON.parse(localStorage.getItem(constants.CURRENT_CUSTOMER)) || initialState
  //   );

  //   useEffect(() => {
  //     localStorage.setItem(
  //       constants.CURRENT_CUSTOMER,
  //       JSON.stringify(state.customer)
  //     );
  //   }, [state.customer]);

  return (
    <CustomerContext.Provider
      value={{
        customer: state.customer,
        // state,
        dispatch,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
