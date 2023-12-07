import React, { useContext } from 'react'
import { CustomerContext } from '../../../states/contexts/CustomerContext';
import { UserContext } from '../../../states/contexts/UserContext'
import { Button } from 'react-bootstrap'

import NorthcottIcon from '../../../assets/images/northcott.png'
import BanyanBatiks from '../../../assets/images/banyan-batiks.png'
import PatrikLose from '../../../assets/images/patrik-lose.png'
import Figo from '../../../assets/images/figo.jpg'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext';
import { ToastContainer, toast, cssTransition } from "react-toastify";
import ApiService from '../../../helpers/ApiServices';
import { CustomerService, TokenService } from '../../../helpers/StorageServices';
import { logout, showMessage } from '../../../helpers/Utils';

import DesktopNavigation from '../navigations/DesktopNavigation'
import MobileBottomNavigation from '../navigations/MobileBottomNavigation'
import MobileNavigation from '../navigations/MobileNavigation'
import InnerHeader from './InnerHeader'
import TopHeader from './TopHeader'
import { Link, useNavigate } from 'react-router-dom'

export default function AppHeader() {
    const { dispatch, user } = useContext(UserContext);
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext);
    const { dispatch: iconDispatch, ...rest } = useContext(BrandIconContext)

    const navigate = useNavigate();

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

    const changeToNortncott = () => { iconDispatch({ type: "IS_NORTHCOTT" }) }
    const changeToBanyan = () => { iconDispatch({ type: "IS_BANYAN" }) }
    const changeToPatrick = () => { iconDispatch({ type: "IS_PATRICK" }) }
    const changeToFigo = () => { iconDispatch({ type: "IS_FIGO" }) }

    const bounce = cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut',
        appendPosition: false,
        collapse: true,
        collapseDuration: 300
    });

    const handleLogout = async () => {
        // try {
        //     const response = await ApiService.get(`shop/user/logout`)
        //     if (response?.data.isSuccess) {

        //         dispatch({ type: "LOGOUT_SUCCESS" });
        //         customerDispatch({ type: "SELECT_CUSTOMER", payload: null })

        //         // TokenService.removeToken()
        //         TokenService.saveToken(response?.data.token)
        //         CustomerService.removeCustomer()
        //         localStorage.removeItem("PCTeRP.CUSTOMER_IDS")
        //         localStorage.removeItem("PCTeRP.TEST_CUSTOMER")

        //         showMessage("You've successfully logged out.", "success")
        //     }

        // } catch (error) {
        //     dispatch({ type: "LOGIN_FAILURE" });

        // }
        // navigate(`/`)


        try {
            await logout()
            dispatch({ type: "LOGOUT_SUCCESS" });
            customerDispatch({ type: "SELECT_CUSTOMER", payload: null })
        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE" });
        }
        navigate(`/`)
    }




    return (
        <div>
            <TopHeader >
            </TopHeader>
            <InnerHeader />
            <DesktopNavigation />
            {/* <div className="">
                <div className="app-container">
                    <ul className="header-social-container">
                        <li>
                            <a href="#" className="social-link">
                                <img src={NorthcottIcon} size={40} height={40} onClick={changeToNortncott} />
                            </a>
                        </li>
                        <li>
                            <a href="#" className="social-link">
                                <img src={BanyanBatiks} size={40} height={40} onClick={changeToBanyan} />
                            </a>
                        </li>
                        <li>
                            <a href="#" className="social-link">
                                <img src={PatrikLose} size={40} height={40} onClick={changeToPatrick} />
                            </a>
                        </li>
                        <li>
                            <a href="http://localhost:3002/" className="social-link" target="_blank">
                                <img src={Figo} size={40} height={40} />
                            </a>
                        </li>
                    </ul>
                    <div className="header-alert-news">
                        {!user ? "" : <p>
                            <b>Free Shipping </b>
                            This Week Order Over - $55
                        </p>}
                    </div>
                    <div className="header-top-actions">


                        {user && <div style={{ display: 'flex', flexDirection: 'column', fontSize: 'small' }}>
                            {user.userTypes.includes("CUSTOMER") && <span> <span style={{ fontWeight: '600' }}>{`Logged in as: ${user?.companyName} ${user?.customerId} ${user?.city} ${user?.state} `}</span></span>}
                            {(customer && !user.userTypes.includes("CUSTOMER")) && <span> <span style={{ fontWeight: '600' }}>{customer?.companyName ? `Logged in as: ${customer?.companyName} ${customer?.customerId} ${customer?.city} ${customer?.state}` : ""}</span></span>}

                            <span style={{ fontWeight: 'bold', cursor: "pointer", color: "black" }}>
                                {user?.userTypes.includes("CUSTOMER") ? "" : <Link to='/region-customer'>To change, click here.</Link>}
                            </span>
                        </div>}
                        <div className="login-button">

                            {user ? <Button onClick={handleLogout} style={{ backgroundColor: "#e2a855", borderColor: "#e2a855" }} variant="primary" size="sm">LOGOUT</Button> :
                                <Button as={Link} to="/login" style={{ backgroundColor: "#e2a855", borderColor: "#e2a855" }} variant="primary" size="sm">LOGIN</Button>}
                        </div>
                    </div>
                </div>
            </div> */}

            {/* <InnerHeader />
            <DesktopNavigation />
            <MobileBottomNavigation />
            <MobileNavigation /> */}
        </div>
    )
}
