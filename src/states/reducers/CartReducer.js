export const CartReducer = (state, action) => {
    // console.log(action.payload);
    switch (action.type) {
        case "ADD_TO_CART_QUANTITY":
            return {
                quantity: action.payload,
            };

        case "CHANGE_SHIP_TYPE":

            return {
                shipType: action.payload,
            };

        default:
            return state;
    }
};

export default CartReducer;
