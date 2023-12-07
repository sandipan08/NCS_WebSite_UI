import { createContext, useReducer, useEffect, useContext } from "react";
import ApiService from "../../helpers/ApiServices";
import constants from "../../helpers/Constants";
import { showMessage } from "../../helpers/Utils";
import CartReducer from "../reducers/CartReducer";

const initialState = {
    quantity: 0,
    shipType: ""
};

export const CartContext = createContext(initialState);

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);
    // const [state, dispatch] = useReducer(
    //   UserReducer,
    //   [],
    //   JSON.parse(localStorage.getItem(constants.CURRENT_USER)) || initialState
    // );



    useEffect(() => {
        //   localStorage.setItem(constants.CURRENT_USER, JSON.stringify(state.user));

    }, []);

    return (
        <CartContext.Provider
            value={{
                quantity: state.quantity,
                shipType: state.shipType,
                // state,
                dispatch,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
