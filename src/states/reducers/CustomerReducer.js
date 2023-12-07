export const CustomerReducer = (state, action) => {
    switch (action.type) {
        case "SELECT_CUSTOMER":
            return {
                customer: action.payload,
            };

        default:
            return state;
    }
};

export default CustomerReducer;
