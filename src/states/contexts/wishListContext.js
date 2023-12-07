import { createContext, useReducer, useEffect, useContext } from "react";
import ApiService from "../../helpers/ApiServices";
import constants from "../../helpers/Constants";
import { showMessage } from "../../helpers/Utils";
import WishListReducer from "../reducers/wishListReducer";

const initialState = {
    quantity: 0,
};

export const WishListContext = createContext(initialState);

export const WishListContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(WishListReducer, initialState);
    // const [state, dispatch] = useReducer(
    //   UserReducer,
    //   [],
    //   JSON.parse(localStorage.getItem(constants.CURRENT_USER)) || initialState
    // );



    useEffect(() => {
        //   localStorage.setItem(constants.CURRENT_USER, JSON.stringify(state.user));

    }, []);

    return (
        <WishListContext.Provider
            value={{
                quantity: state.quantity,
                // state,
                dispatch,
            }}
        >
            {children}
        </WishListContext.Provider>
    );
};
