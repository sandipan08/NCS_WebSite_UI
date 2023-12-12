import { React, useContext, useEffect, useState } from 'react'
import { Form, Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { Typeahead } from 'react-bootstrap-typeahead'
import axios from 'axios'
import BrandLogo from '../../../assets/images/logo/brand-logo.png'
import NorthcottIcon from '../../../assets/images/northcott.png'
import PatrikLose from '../../../assets/images/patrik-lose.png'
import Figo from '../../../assets/images/figo.jpg'
import { UserContext } from '../../../states/contexts/UserContext'

import { getModelRoute, showMessage } from '../../../helpers/Utils'
import { CartContext } from '../../../states/contexts/CartContext'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext'
import SelectField from '../../elements/fields/SelectField'
import ApiService from '../../../helpers/ApiServices'
import GlobalSearchSelectField from '../../elements/fields/GlobalSearchSelectField'
import { WishListContext } from '../../../states/contexts/wishListContext'
import { CustomerContext } from '../../../states/contexts/CustomerContext'
import { BsBag } from "react-icons/bs";

export default function InnerHeader() {
    const [cartLength, setCartLength] = useState([]);
    const [input, setInput] = useState("");
    const [destination, setDestination] = useState(null);
    const [active, setActive] = useState(false);
    const [isClickedInSearchResult, setIsClickedInSearchResult] = useState(false);
    const [state, setState] = useState([]);

    const { dispatch: iconDispatch, ...brandIconObject } = useContext(BrandIconContext)
    const { dispatch, user } = useContext(UserContext)
    const { customer } = useContext(CustomerContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { dispatch: wishListDispatch, quantity: wishListQuantity } = useContext(WishListContext)

    const navigate = useNavigate()
    let cancelToken;

    const { isNorthchott, isBanyan, isPatrick, backgroundColor } = brandIconObject

    // console.log(brandIconObject);
    // console.log("cart: ", quantity);

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
        }
    });

    // const getCartDetail = () => {
    //     ApiService.setHeader()
    //     ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}`).then(response => {
    //         console.log(response.data);
    //         if (response?.data.isSuccess) {
    //             // console.log(response?.data.documents);
    //             setCartLength(response?.data.documents?.length)
    //         }
    //     }).catch(error => {
    //         console.log(error.response.data)
    //         // console.log("Else Catch")
    //         showMessage(error.response.data.message, "error")
    //     })
    // }

    // const GlobalSearch = async (input) => {
    //     const controller = new AbortController();

    //     cancelToken = axios.CancelToken.source

    //     await axios.get(`shop/product/globalSearch/${input}`, { signal: controller.signal }).then(response => {
    //         console.log(response?.data.documents);
    //         setState(response?.data.documents)

    //     }).catch(e => {
    //         console.log(e.response?.data.message);
    //         showMessage(e?.response?.data.message, "error")
    //     })

    //     controller.abort()
    // }

    // const goToSearchPage = async (searchItemId) => {
    //     await ApiService.get(`shop/product/findSearchItem/${searchItemId}`).then(async response => {
    //         console.log(response?.data.document);

    //         if (response?.data.document?.collections.length) {
    //             await ApiService.get(`shop/collection/collectionByValue/${response?.data.document?.collections[0].value}`).then(res => {
    //                 console.log(res?.data.document);
    //                 navigate(`/product-detail/${res?.data.document?._id}`)

    //             }).catch(e => {
    //                 console.log(e.response?.data.message);
    //                 showMessage(e?.response?.data.message, "error")
    //             })

    //         } else {
    //             showMessage("This product does not have any collection atteached!", "info")
    //         }
    //         // switch (response?.data.document.db) {
    //         //     case "Product":
    //         //         break;

    //         //     default:
    //         //         navigate("/")
    //         //         break;
    //         // }
    //         setActive(false)
    //         setValue("search", "")

    //     }).catch(e => {
    //         console.log(e.response?.data.message);
    //         showMessage(e?.response?.data.message, "error")
    //     })
    // }

    const GlobalSearch = async (searchData) => {
        const controller = new AbortController();
        let data;

        cancelToken = axios.CancelToken.source

        await axios.get(`shop/collection/globalSearch/${searchData}?customer=${customer?.name}&model=${getModelRoute(user).model}`, { signal: controller.signal }).then(response => {
            console.log(response?.data.documents);
            setState(response?.data.documents)
            // data = response?.data.documents

        }).catch(e => {
            console.log(e.response?.data.message);
            // showMessage(e?.response?.data.message, "error")
        })

        // return data;
        controller.abort()

    }


    const goToSearchPage = async (data) => {
        // console.log(data);
        if (data?.modelName?.toUpperCase() === "COLLECTION") {

            if (isNorthchott)
                navigate(`/product-detail/${data?._id}?type=NORTHCOTT`)
            if (isBanyan)
                navigate(`/product-detail/${data?._id}?type=BANYAN BATIKS`)
            if (isPatrick)
                navigate(`/product-detail/${data?._id}?type=PATRICK LOSE`)

        } else if (data?.modelName?.toUpperCase() === "DESIGNER") {

            navigate(`/designer-profile/${data?._id}`)
        } else if (data?.modelName?.toUpperCase() === "PRODUCT") {
            // console.log("in product");

            // ApiService.setHeader()
            // await ApiService.get(`shop/collection/collectionByValue/${data?.mainCollection?.value}`).then(res => {
            // console.log(res?.data.document);

            if (isNorthchott)
                navigate(`/product-detail/${data?.collectionData[0]?._id}?type=NORTHCOTT`)
            if (isBanyan)
                navigate(`/product-detail/${data?.collectionData[0]?._id}?type=BANYAN BATIKS`)
            if (isPatrick)
                navigate(`/product-detail/${data?.collectionData[0]?._id}?type=PATRICK LOSE`)
            // navigate(`/product-detail/${res?.data.document?._id}?type=PATRICK LOSE`)

            // }).catch(e => {
            //     console.log(e.response?.data.message);
            //     showMessage(e?.response?.data.message, "error")
            // })
        } else if (data?.modelName?.toUpperCase() === "ORDER") {
            navigate(`/order/${data?._id}`)
        }

        setIsClickedInSearchResult(false)
        setActive(false)
        setValue("search", "")
    }

    const goToSearchPageForLink = async (data) => {
        // console.log(data);


        if (data?.modelName?.toUpperCase() === "COLLECTION") {

            if (isNorthchott)
                return `/product-detail/${data?._id}?type=NORTHCOTT`
            if (isBanyan)
                return `/product-detail/${data?._id}?type=BANYAN BATIKS`
            if (isPatrick)
                return `/product-detail/${data?._id}?type=PATRICK LOSE`

        } else if (data?.modelName?.toUpperCase() === "DESIGNER") {

            return `/designer-profile/${data?._id}`
        } else if (data?.modelName?.toUpperCase() === "PRODUCT") {


            if (isNorthchott)
                return `/product-detail/${data?.collectionData[0]?._id}?type=NORTHCOTT`
            if (isBanyan)
                return `/product-detail/${data?.collectionData[0]?._id}?type=BANYAN BATIKS`
            if (isPatrick)
                return `/product-detail/${data?.collectionData[0]?._id}?type=PATRICK LOSE`

        } else if (data?.modelName?.toUpperCase() === "ORDER") {
            return `/order/${data?._id}`
        }


        setIsClickedInSearchResult(false)
        setActive(false)
        setValue("search", "")
    }

    const goToSearchDetailPage = () => {
        navigate(`/search-detail/${input}`)
        setActive(false)
        setValue("search", "")
    }


    useEffect(() => {
        let setTime = setTimeout(() => {
            GlobalSearch(input)
        }, 300)

        return () => clearTimeout(setTime)
    }, [input])

    // console.log("destination: ", destination);

    return (
        <div className="header-main" id='innerHeader'>
            <nav className="flex navbar navbar-expand-lg navbar-light">

                <div className="container-fluid">
                    <span className="navbar-brand w-100 text-center ps-xl-5 ps-xxl-5 ps-lg-4 ps-0" href="#">
                        <img src={BrandLogo}
                            className="" alt="" style={{ maxWidth: '50%', maxHeight: '40px', minHeight: '5px' }} />
                    </span>
                    <span id='searchSpan'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><input className="form-control" type="search" placeholder="Search" aria-label="Search" id='search' /> <span className='addToCatrSmallScreen d-xxl-none d-xl-none d-md-none d-block'><BsBag fontSize="1.5em" /></span></div>
                    </span>




                    {/* <form className="">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    </form> */}
                </div>


            </nav >
            {/* <div className="app-container">

                <a href="#" className="header-logo">
                
                    {isNorthchott && <img src={BrandLogo} alt="Northcott" width="280" height="60" />}
                    {isBanyan && <img src={BanyanBatiks} alt="Northcott" width="280" height="60" />}
                    {isPatrick && <img src={PatrikLose} alt="Northcott" width="160" height="60" />}
             
                </a>

                <div className="header-search-container">

                    <input type="search" name="search" id="search" {...register("search")} className="search-field" placeholder="Enter your collection name..."

                        onChange={(e) => {
                            setInput(e.target.value)
                            if (String(e.target.value).length > 3) {
                                setActive(true)
                            } else {
                                setActive(false)
                                setState([])
                            }
                        }}
                    />
                    <button className="search-btn button-transparent" onClick={goToSearchDetailPage}>
                        <ion-icon name="search-outline"></ion-icon>
                    </button>
                    {active ? <div className='options border border-1' style={{
                        position: "absolute", padding: "20px", backgroundColor: 'white', color: "gray",
                        borderRadius: "10px",
                        top: "50px", display: "flex", flexDirection: "column",
                        fontWeight: "400px", fontSize: "15px", width: "530px", cursor: "pointer", zIndex: 9999,
                        height: "400px", overflowY: "auto"
                    }}
                    >
                        {state?.length ? state?.map((e, idx) => {
                          
                            if (typeof e === 'string') {
                                return <span className='p-1' style={{ background: "gray", fontWeight: "bold", color: "white" }}>{e}</span>
                            } else {

                                return <Link
                                    to={e.modelName?.toUpperCase() === 'COLLECTION' ? `/product-detail/${e?._id}?type=NORTHCOTT` :
                                        e.modelName?.toUpperCase() === 'PRODUCT' ? `/product-detail/${e?.collectionData[0]?._id}?type=NORTHCOTT` :
                                            e.modelName?.toUpperCase() === 'DESIGNER' ? `/designer-profile/${e?._id}` :
                                                e.modelName?.toUpperCase() === 'ORDER' && `/order/${e?._id}`
                                    }

                                    key={idx} value={e?._id} style={{ color: "black" }}

                                    onClick={(ele) => {
                                        setActive(false)
                                        setValue("search", "")
                                    }}
                                >{e?.name}
                                </Link>
                            }
                        })
                            : <span>{"No data found!"}</span>
                        }

                    </div> : null}

                </div>

                <div className="header-user-actions" style={{ minWidth: "200px" }}>

                    {!user ? "" : <>
                        <Button className="action-btn button-transparent" style={{ backgroundColor: "transparent" }} as={Link} to={`/wishlist-detail`}>
                            <ion-icon name="heart-outline"></ion-icon>
                            <span className="count" style={{ backgroundColor: backgroundColor }}>{wishListQuantity}</span>
                        </Button>

                        <Button className="action-btn button-transparent" style={{ backgroundColor: "transparent" }} as={Link} to={`/cart-detail`}>
                            <ion-icon name="bag-handle-outline"></ion-icon>
                            <span className="count" style={{ backgroundColor: backgroundColor }}>{quantity}</span>
                        </Button>

                        <Link to='/profile'>
                            <button className="action-btn button-transparent">
                                <ion-icon name="person-outline"></ion-icon>
                            </button>
                        </Link>
                    </>}

                </div>

            </div> */}

            {/* {
                customer?.isSOApprovalNeeded ?
                    <div className='p-0 m-0'>
                        <marquee behavior="alternate" style={{ color: "red" }}>Your all orders needed Sales order approval</marquee>

                    </div> :
                    customer?.isPFApprovalNeeded ?
                        <div className='p-0 m-0'>
                            <marquee behavior="alternate" style={{ color: "red" }}>Your all orders needed Pending fulfillment approval</marquee>

                        </div> :
                        ""
            } */}


        </div >
    )
}
