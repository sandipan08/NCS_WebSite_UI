import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { React, useContext } from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "react-step-progress-bar/styles.css";
import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/themes/light.css"; // optional
import "tippy.js/animations/scale.css";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/animations/scale-extreme.css";
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import 'react-loading-skeleton/dist/skeleton.css'
import "./index.css"
import AppRoutes from "./routes/AppRoutes";
import {
  UserContext,
  UserContextProvider,
} from "./states/contexts/UserContext";
import ApiService from "./helpers/ApiServices";
import {
  CustomerContext,
  CustomerContextProvider,
} from "./states/contexts/CustomerContext";
import { BrandIconContextProvider } from "./states/contexts/BrandIconContext";
import { showMessage } from "./helpers/Utils";
import { CustomerService, TokenService } from "./helpers/StorageServices";
import { CartContextProvider } from "./states/contexts/CartContext";
import { WishListContextProvider } from "./states/contexts/wishListContext";

ApiService.init();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <UserContextProvider>
    <CustomerContextProvider>
      <BrandIconContextProvider>
        <CartContextProvider>
          <WishListContextProvider>
            <AppRoutes />
          </WishListContextProvider>
        </CartContextProvider>
      </BrandIconContextProvider>
    </CustomerContextProvider>
  </UserContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
