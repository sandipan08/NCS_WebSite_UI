import { React, useContext, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../../states/contexts/CustomerContext';
import { UserContext } from '../../../states/contexts/UserContext'
import NorthcottIcon from '../../../assets/images/logo/Northcott - Logo.png'
import BanyanBatiks from '../../../assets/images/logo/Banyan Logo.png'
import PatrikLose from '../../../assets/images/logo/Logo-Patrick Lose.png'
import Figo from '../../../assets/images/logo/Figo - Logo.png'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext';
import { ToastContainer, toast, cssTransition } from "react-toastify";
import ApiService from '../../../helpers/ApiServices';
import { CustomerService, TokenService } from '../../../helpers/StorageServices';
import { logout, showMessage } from '../../../helpers/Utils';
import { BsBagFill } from "react-icons/bs";


export default function TopHeader() {
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



    useEffect(() => {
        // console.log(window.performance.getEntriesByType("navigation")[0].type);
        // if (window.performance.getEntriesByType("navigation")[0].type == "navigate") {
        //     console.log(user?.savePassword);
        //     handleLogout()
        // }


    }, []);


    return (
        // <div className="border" style={{ width: "100%", display: "block" }}>
        <div className="header-top">
            <ToastContainer
                newestOnTop
            // transition={bounce}
            />

            <div class="text-white text-center" >
                <div class="container-fluid" style={{ background: '#686661', maxHeight: '.5in', overflow: 'hidden' }}>
                    <header class="text-start text-lg-start">
                        <div class="row mt-0 mb-1">
                            <div class="col-xxl-1 col-xl-1 col-lg-1 col-md-2 col-sm-0 col-0 ">
                            </div>
                            <div
                                class="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-6 col-6 mx-auto text-xl-end text-lg-end text-end">
                                <img class="img-fluid  mx-auto" src={NorthcottIcon}
                                    style={{ maxWidth: '100%', maxHeight: '70px', minHeight: '10px' }} />
                                <img class="img-fluid " src={BanyanBatiks}
                                    style={{ maxWidth: '100%', maxHeight: '70px', minHeight: '10px' }} />

                            </div>
                            <div class="col-xxl-1 col-xl-1 col-lg-1 col-md-1 col-sm-4 col-4 mx-auto text-start">
                                <img class="img-fluid " src={PatrikLose}
                                    style={{ maxWidth: '100%', maxHeight: '30px', minHeight: '10px', }} />
                            </div>
                            <div class="col-xxl-1 col-xl-1 col-lg-1 col-md-4 col-sm-2 col-2 mx-auto text-left">
                                <img class="img-fluid " src={Figo}
                                    style={{ maxWidth: '100%', maxHeight: '70px', minHeight: '10px' }} />
                            </div>
                            <div
                                class="col-xxl-6 col-xl-5 col-lg-6 col-md-3 col-sm-0 col-0 mx-auto d-xxl-block d-xl-block d-lg-block d-none">
                            </div>
                            <div
                                class="col-xxl-1 col-xl-1 col-lg-1 col-md-0 col-sm-0 col-0 mx-auto d-xxl-block d-xl-block d-lg-block d-none">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}> <a href='#login' style={{ textDecoration: 'none', color: 'white' }}>Login</a> | <a href="" className="text-white me-4 anchorTagTextDecorationNone">
                                    <BsBagFill />
                                </a></div>
                            </div>
                            <div
                                class="col-xxl-1 col-xl-1 col-lg-1 col-md-0 col-sm-0 col-0 mx-auto d-xxl-block d-xl-block d-lg-block d-none">
                            </div>
                        </div>
                    </header>
                </div>
            </div>

        </div>
    )
}
