export const WishListReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_WISHLIST_QUANTITY":
            return {
                quantity: action.payload,
            };

        default:
            return state;
    }
};

export default WishListReducer;
