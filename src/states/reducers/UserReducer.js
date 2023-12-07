export const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        customer: null,
        isFetching: true,
        loginError: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        loginError: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        customer: null,
        isFetching: false,
        loginError: true,
      };
    case "LOGOUT_USER":
      return {
        user: null,
        customer: null,
        isFetching: false,
        loginError: false,
      };

    case "LOGOUT_SUCCESS":
      return {
        user: null,
        customer: null,
        isFetching: false,
        loginError: false,
      };

    case "ADD_CUSTOMER_START":
      return {
        user: null,
        customer: null,
        isFetching: true,
        loginError: false,
      };

    case "ADD_CUSTOMER_SUCCESS":
      return {
        user: action.payload.user,
        customer: action.payload.customer,
        isFetching: false,
        loginError: false,
      };

    default:
      return state;
  }
};

export default UserReducer;
