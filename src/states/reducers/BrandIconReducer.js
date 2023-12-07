export const BrandIconReducer = (state, action) => {
  switch (action.type) {
    case "IS_NORTHCOTT":
      return {
        isNorthchott: true,
        isBanyan: false,
        isPatrick: false,
        isDefault: false,
        isFigo: false,
        color: "#ffce30",
        textColor: "#000000",
        division: "NORTHCOTT",
        backgroundColor: "#e3a856",
        darkBackgroundColor: "#7d5402"
      };

    case "IS_BANYAN":
      return {
        isNorthchott: false,
        isBanyan: true,
        isPatrick: false,
        isDefault: false,
        isFigo: false,
        color: "#00cc66",
        // textColor: "#000000",
        textColor: "#ffffff",
        division: "BANYAN BATIKS",
        backgroundColor: "#006371",
        darkBackgroundColor: "#004f5a"
      };

    case "IS_PATRICK":
      return {
        isNorthchott: false,
        isBanyan: false,
        isPatrick: true,
        isDefault: false,
        isFigo: false,
        color: "#000000",
        textColor: "#ffffff",
        division: "PATRICK LOSE",
        backgroundColor: "#413f3d",
        darkBackgroundColor: "#000000"
      };
    case "IS_FIGO":
      return {
        isNorthchott: false,
        isBanyan: false,
        isPatrick: false,
        isDefault: false,
        isFigo: true,
        color: "#000000",
        textColor: "#ffffff",
        division: "FIGO",
        backgroundColor: ""
      };

    default:
      return state;
  }
};

export default BrandIconReducer;
