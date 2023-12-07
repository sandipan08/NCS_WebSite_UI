export const MobileMenuReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        isOpen: action.payload,
      };

    case "TOGGLE_CATEGORY":
      return {
        isOpenCategory: action.payload,
      };

    default:
      return state;
  }
};

export default MobileMenuReducer;
