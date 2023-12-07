// import { notification } from "antd";
import { useContext } from "react";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import parse from "html-react-parser";
import ApiService from "./ApiServices";
import { CustomerService, TokenService } from "./StorageServices";

let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

const status = {
  PENDINGFULFILLMENT: {
    message: "Order placed"
  },
  CREDITHOLD: {
    message: "Sales order approval needed"
  },
  CREDITAPPROVAL: {
    message: "Pending fulfillment approval needed"
  },
  PARTIALLYFULFILLED: {
    message: "your order items have been back ordered"
  },
  COMPLETE: {
    message: "Order has been invoiced with no back orders"
  },
  CANCELLED: {
    message: "Cancelled"
  },
}

const formatNumber = (number) => {
  //return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
};

const findInitLetters = (...value) => {
  let initLetters = "";
  value.map((val) => (initLetters += val.charAt(0).toUpperCase()));
  return initLetters;
};

const getCountry = () => {
  let country = null

  customers != null && customers[customers?.length - 1]?.addresses.map(address => {
    if (address?.isDefaultBilling) {
      // console.log(address?.country?.text);
      country = address?.country?.text
    }
  })

  return country
}

const capitalizeInitials = (string) => {
  return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatAddress = (values) => {
  // const values = getValues();
  // console.log(values.addresses);
  let v = "";

  values.addresses.map((e) => {
    if (e.shipping) {
      v = `${e.country},${e.addressee},${e.phone},\n${e.address1},\n${e.address2},\n${e.address3},\n${e.city},\n${e.state},\n${e.zip},\n
      `;
    }
  });

  return v;
};

const formatAddressByDefault = (values) => {
  // const values = getValues();

  // console.log(values.addresses);

  let v = "";

  values?.addresses?.map((e) => {
    if (e.default) {
      v = `${e.country},\n${e.addressee},\n${e.phone},\n${e.address1},\n${e.address2},\n${e.address3},\n${e.city},\n${e.state},\n${e.zip},\n`;
    }
  });

  return v;
};

const formatAddressNew = (value) => {
  // console.log(value);
  const v = `${value?.addressee && value?.addressee}\n${value?.address1 && value?.address1}\n${value?.city && value?.city}\n${value?.state && value?.state.value} ${value?.zip && value?.zip}\n${value?.country && value?.country?.text}`;

  return v.split("\n").map(ele => <p key={ele} style={{ lineHeight: "20%" }}>{ele}</p>);
};

const formatAddressForCustomer = (value) => {
  const v = `${value?.addressee && value?.addressee}\n${value?.address1 && value?.address1}\n${value?.city && value?.city}\n${value?.state && value?.state.value} ${value?.zip && value?.zip}\n${value?.country && value?.country?.text}`;

  return v;
};

const formatAddr = (value) => {
  let v = `${value.addressee && value.addressee}\n${value.address1 && value.address1}\n${value.city && value.city} ${value.state && value.state.value} ${value.zip && value.zip}\n${value.country && value.country.text}`;

  return v;
};

const formatAddressForSaveInDB = (value) => {
  const v = `${value?.addressee && value?.addressee}\n
  ${value?.address1 && value?.address1}\n
  ${value?.city && value?.city}\n
  ${value?.state && value?.state.value} ${value?.zip && value?.zip}\n
  ${value?.country && value?.country?.text}`;



  return v;
};

// const errorMessage = (err, dispatch) => {
//   if (
//     err.response?.data.message == "Logged out.please log in" ||
//     err.response?.data.message ==
//       "You are not logged in! Please log in to get access." ||
//     err.response?.data.message ==
//       "The user belonging to this token does no longer exist."
//   ) {
//     if (dispatch) dispatch({ type: "LOGOUT_USER" });
//   } else {
//     console.log(err);
//     notification.error({
//       message: err.response?.data.message,
//       style: {
//         color: "red",
//       },
//       onClick: () => {
//         console.log("Notification Clicked!");
//       },
//     });
//   }
// };

const checkBlank = (e, index, field, setValue) => {
  if (e.target.value == "") {
    setValue(`products.${index}.${field}`, 1.0);
  }
};

const showMessage = (msg, type) => {
  let toastObj = {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  switch (type) {
    case "success":
      toast.success(msg, toastObj);
      break;

    case "error":
      toast.error(msg, toastObj);
      break;

    case "warning":
      toast.warn(msg, toastObj);
      break;

    case "info":
      toast.info(msg, toastObj);
      break;

    default:
      toast(msg, toastObj);
      break;
  }
};

const convertHtmlToString = (data) => {
  return { __html: parse(data) };
};

const logout = async () => {
  const response = await ApiService.get(`shop/user/logout`)
  if (response?.data.isSuccess) {

    // TokenService.removeToken()
    TokenService.saveToken(response?.data.token)
    CustomerService.removeCustomer()
    localStorage.removeItem("PCTeRP.CUSTOMER_IDS")
    localStorage.removeItem("PCTeRP.TEST_CUSTOMER")

    // showMessage("You've successfully logged out.", "success")
  }
};

const formatArrayOfObjectToString = (data) => {
  // let array = []
  let str = ''
  data?.map(e => {
    if (e?.text) {
      str += `${e?.text},  `
      // array.push(`${e?.text},  `)
    } else {
      str += `${e?.name},  `
      // array.push(`${e?.name},  `)
    }
  })

  // console.log(str?.lastIndexOf(","));

  return str.substring(0, str?.lastIndexOf(","))
}

const getModelRoute = (user) => {
  let model, route

  if (user?.userTypes.includes("CUSTOMER")) {
    localStorage.setItem("PCTeRP.MODEL", "Customer")
    localStorage.setItem("PCTeRP.ROUTE", "Customer")
    model = "Customer"
    route = "customer"
  } else {
    localStorage.setItem("PCTeRP.MODEL", "User")
    localStorage.setItem("PCTeRP.ROUTE", "user")
    model = "User"
    route = "user"
  }

  return { model: model, route: route, userTypes: user?.userTypes }
}


export {
  formatNumber,
  findInitLetters,
  formatAddress,
  formatAddressByDefault,
  formatAddressNew,
  // errorMessage,
  checkBlank,
  showMessage,
  convertHtmlToString,
  logout,
  formatArrayOfObjectToString,
  capitalizeInitials,
  getCountry,
  formatAddressForSaveInDB,
  formatAddressForCustomer,
  status,
  formatAddr,
  getModelRoute
};
