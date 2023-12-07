import { useEffect, React, useState, useContext } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProgressBar, Step } from "react-step-progress-bar";

import ApiService from '../../helpers/ApiServices';
import { formatAddressNew, getModelRoute, showMessage, status } from '../../helpers/Utils';

import { BsExclamationTriangle, BsFlagFill } from 'react-icons/bs'
import Processing from '../../image/processing.png'
import Shipped from '../../image/shipped.png'
import Delivered from '../../image/delivered.png'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import { CartContext } from '../../states/contexts/CartContext';
import OrderItems from '../../components/elements/components/OrderItems';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import DisplayOderItems from '../../components/elements/components/DisplayOderItems';
const moment = require("moment")

const OrderDetails = () => {
    // All useStates
    const [state, setState] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [carts, setCarts] = useState([]);

    // All reducers
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { backgroundColor, color } = useContext(BrandIconContext)
    const { dispatch, user } = useContext(UserContext)
    // const { dispatch: cartDispatch, quantity } = useContext(CartContext)

    const navigate = useNavigate()
    const { id } = useParams();

    // All local storage data
    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

    // All useForms
    // const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
    //     defaultValues: {

    //     }
    // });



    // All functions
    // const onSubmit = (data) => {

    //     data.cartItems = carts
    //     data.total = carts?.reduce(function getSum(total, cart) {
    //         return total + parseFloat(cart?.subTotal);
    //     }, 0)
    //     data.orderBy = {
    //         id: user?._id,
    //         text: user?.name,
    //         value: user?.netsuiteId
    //     }
    //     data.onBehalfOf = {
    //         id: customers[customers?.length - 1]?._id,
    //         text: customers[customers?.length - 1]?.name,
    //         value: customers[customers?.length - 1]?.netsuiteId
    //     }

    //     console.log(data);
    //     return createOrder(data)
    // }

    const getOrder = () => {
        setLoadingStatus(true)

        ApiService.setHeader()
        return ApiService.get(`shop/order/${id}?model=${getModelRoute(user).model}`).then(async response => {
            if (response?.data.isSuccess) {
                console.log(response.data.document);
                setState(response.data.document)

                // const addr = response.data?.document.addresses.filter(address => {
                //     console.log(address);
                //     return true
                // })
                // console.log(addr);

                setLoadingStatus(false)
            }
        }).catch(error => {
            console.log(error.response?.data)
            showMessage(error.response?.data.message, "error")
        })
    }

    const getCartDetail = () => {
        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                setCarts(response?.data.documents)
                cartDispatch({ type: "ADD_TO_CART_QUANTITY", payload: response?.data.documents?.length });
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const addItemsToCart = async () => {
        state?.cartItems.map(cart => {

            ApiService.setHeader()
            ApiService.post(`shop/cart?model=${getModelRoute(user).model}`, cart).then(response => {
                // console.log(response.data);
                if (response?.data.isSuccess) {
                    // console.log(response?.data.document);
                    getCartDetail()

                    showMessage("Item added", "success")
                }
            }).catch(error => {
                console.log(error.response.data)
                // console.log("Else Catch")
                // showMessage(error.response.data.message, "error")
            })

        })
    }

    // const getInvDetails = (invId) => {
    //     console.log(invId);
    //     // ApiService.setHeader()
    //     ApiService.post(`shop/nsInv`, { id: invId }).then(response => {
    //         // console.log(response.data);
    //         if (response?.data.isSuccess) {
    //             console.log(response?.data);
    //         }
    //     }).catch(error => {
    //         console.log(error.response.data)
    //         // console.log("Else Catch")
    //         // showMessage(error.response.data.message, "error")
    //     })
    // }



    useEffect(() => {
        if (customers != null) getOrder()
    }, []);

    console.log(status.hasOwnProperty(state.status?.toUpperCase().split(" ").join("")));

    if (loadingStatus) {
        return <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", height: "400px" }}>
            <span style={{ color: 'rgb(128, 128, 128)', fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>Please wait while getting order details...</span>
        </Col>
    }


    return (
        <Container className='mt-5'>
            {/* TOP BUTTONS */}
            <Row className=''>
                <Col className='col-lg-4 col-md-4 col-sm-4' style={{}}>

                </Col>
                <Col className='col-lg-8 col-md-8 col-sm-8 m-0 p-0 ps-1' style={{ display: "flex", justifyContent: "space-between", padding: "0px 10px", fontSize: "14px" }}>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }} onClick={() => { addItemsToCart() }}>Reorder Items</Button>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }}>Print Order</Button>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }}>My Order</Button>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }}>Send Confirmation</Button>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }} onClick={() => { navigate(`/product-category`) }}>Continue Shopping</Button>
                    <Button className='animet_btton' size="sm" variant='primary' style={{ backgroundColor: backgroundColor, color: "white", border: "none" }} onClick={() => { navigate(`/cart-detail`) }}>View Cart</Button>
                </Col>

            </Row>

            <Row className=''>
                <Col className='col-lg-4 col-md-4 col-sm-4' style={{}}>

                </Col>
                {/* <Col className='col-lg-8 col-md-8 col-sm-8 mt-4'>
                    <ProgressBar
                        percent={state?.status === "PROCESSING" ? 33.33 : state?.status === "SHIPPING" ? 66.66 : 100}
                        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                    >
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <img
                                    style={{ filter: `grayscale(${accomplished ? 0 : 80}%)`, color: "green" }}
                                    width="30"
                                    alt=''
                                    src={Processing}
                                />
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <img
                                    style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                    width="30"
                                    alt=''
                                    src={Shipped}
                                />
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <img
                                    style={{ filter: `grayscale(${accomplished ? 0 : 80}%)`, color: "aqua" }}
                                    width="30"
                                    alt=''
                                    src={Delivered}
                                />
                            )}
                        </Step>
                    </ProgressBar>
                </Col> */}
            </Row>


            {/* HEADING */}
            <Row className='' style={{ fontSize: 30, fontWeight: 500 }}>
                <Col className='p-0'>My Order Details</Col>
                {/* <Col className='p-0' style={{ display: "flex", justifyContent: "flex-end" }}>
                        Grand Total: ${
                            carts?.reduce(function getSum(total, cart) {
                                // return total + cart?.price;
                                return (parseFloat(total) + parseFloat(cart?.subTotal)).toFixed(2);
                            }, 0)
                        }
                    </Col> */}
            </Row>

            {/* ORDER DETAILS */}
            <Row className='mt-2' style={{ fontSize: "14px" }}>
                <Col className=' rounded col-lg-4'>

                    <Row className='' >
                        <Row className="" style={{}}>
                            <span className=' p-0' style={{ color: "#cc6600", fontSize: "25px" }}>Order Information</span>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Web Order Number:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>{state?.orderNumber}</Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ordered By:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {/* {user?.name} */}
                                {state?.onBehalfOf?.text}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Order Start Date:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {moment(state?.orderStartDate).format("MM/DD/YYYY ")}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Bill To:</Col>
                            <Col className='' style={{ marginRight: "-20px" }}>
                                <pre style={{ lineHeight: "70%" }}>{state.billTo}</pre>
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ship To:</Col>
                            <Col className='' style={{ marginRight: "-20px" }}>
                                <pre style={{ lineHeight: "70%" }}>{state.shipTo}</pre>
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500, width: "14%" }}><BsExclamationTriangle style={{ fontSize: "40px", color: color }} /></Col>
                            <Col className=' p-0 m-0' style={{}}>
                                If the address we have on file is incorrect, please contact us at 1-905-760-0072
                            </Col>
                            <hr />
                        </Row>
                    </Row>


                    <Row className='mt-5' style={{ fontSize: "13px" }}>
                        <Row className="" style={{ marginRight: "-29px", fontSize: 25, fontWeight: 400, color: "#cc6600" }}>
                            Shipping Information
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <hr />
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Order Status:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {(customer?.isSOApprovalNeeded && (state.status?.toUpperCase() === "PROCESSING" || state.status?.toUpperCase() === "PENDING APPROVAL")) ?
                                    <p style={{ display: "flex", gap: "10px" }}>
                                        <span data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" style={{ cursor: "pointer" }}>{state.status?.toUpperCase()}</span>
                                        <span><BsFlagFill style={{ color: "red" }} /></span>
                                    </p>
                                    : <span data-bs-toggle="tooltip" data-bs-placement="top" title={status.hasOwnProperty(state.status?.toUpperCase().split(" ").join("")) ? status[state.status?.toUpperCase().split(" ").join("")].message : ""} style={{ cursor: "pointer" }}>{state.status?.toUpperCase()}</span>
                                }
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ship Date:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {moment(state?.shippingDate).format("MM/DD/YYYY ")}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Sales Order Number:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {state?.proOrderNumber}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Last Shipped Date:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {""}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Invoices:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {state?.invoices?.length && state?.invoices.map((inv, idx) => {

                                    if (inv != null) {
                                        if (state?.invoices?.length - 1 > idx) {
                                            return <span style={{ cursor: "pointer", color: "blue" }}
                                                onClick={() => navigate(`/invoice/${inv?.internalId}`)}
                                            >{`${inv?.number},`}&nbsp;</span>
                                        } else {
                                            return <span style={{ cursor: "pointer", color: "blue" }}
                                                onClick={() => navigate(`/invoice/${inv?.internalId}`)}
                                            >{`${inv?.number}`}</span>
                                        }
                                    }

                                })}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Total Units Ordered:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {state?.cartItems?.length ? state?.cartItems.reduce(function getSum(total, cart) {
                                    // return total + cart?.price;
                                    return (total + cart?.productQuantity)
                                }, 0) : ""
                                }
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Cumulative Units Shipped:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {''}
                            </Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Percentage Shipped:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {''}
                            </Col>
                            <hr />
                        </Row>
                        {/* <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Web OrderID:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {state?.webOrderNumber}
                            </Col>
                            <hr />
                        </Row> */}
                        {/* <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Memo:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {state?.memo}
                            </Col>
                            <hr />
                        </Row> */}
                    </Row>

                </Col>
                <Col>
                    {/* <Row className='col-lg-8 scroll scroll4 p-0 m-0' style={{ maxHeight: "500px", width: "100%" }}>
                        {
                            // state?.cartItems?.length ? state?.cartItems.map(cart => {
                            //     return (
                            //         <OrderItems key={cart?._id} cart={cart} total={state?.total} status={state?.status} />
                            //     )
                            // }) : null


                        }
                    </Row> */}

                    <Container className='p-0'>
                        <Row className='p-0 mb-1' style={{ fontSize: "14px", position: "sticky", top: 0, backgroundColor: backgroundColor, color: "white", zIndex: 999, }}>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>IMAGE</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>PRODUCT NAME</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>COLLECTION NAME</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>PRICE</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>QTY</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>DISCOUNT</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>NET TOTAL</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>STATUS</Col>
                        </Row>
                        {
                            state?.cartItems?.length ? state?.cartItems.map((cart, idx) => {
                                return (
                                    <Row key={idx} className='' style={{ fontSize: "14px" }}>
                                        <Container className='p-2' style={{ backgroundColor: "#CFF", fontWeight: 700, display: "flex", flexDirection: "column" }}>
                                            <span>Special Instruction: {state?.specialInstruction}</span>
                                        </Container>

                                        <Container className='mt-2 border-bottom'>
                                            <DisplayOderItems key={idx} ele={cart} status={(cart?.productId.isSoldOutUsa || cart?.productId.isSoldOutCanada) ? "SOLD OUT" : cart?.isBackOrder ? "BACK ORDER" : cart?.isBilled ? "BILLED" : ""} />
                                        </Container>
                                    </Row>
                                )
                            }) : null
                        }
                    </Container>

                    {state?.total && <Row className='mt-3'>
                        <Col className='col-lg-4 col-md-4 col-sm-4' style={{ color: "#cc6600" }}>
                            <p>FABRIC TOTAL*</p>
                            <p>Total does not include applicable taxes or delivery,and is subject to change. Product availability varies.</p>
                        </Col>
                        <Col className='col-lg-8 col-md-8 col-sm-8' style={{ color: "#cc6600", textAlign: "right", fontSize: "18px" }}>
                            ${state?.total.toFixed(2)}
                        </Col>
                    </Row>}
                </Col>

            </Row>


            {/* BOTTOM TEXT AND BUTTONS */}
            {/* <Row className=''>
                    <div className='' style={{ padding: "0px", fontSize: "14px" }}>
                        Click here to read through our Sales Tearms and Conditions
                    </div>

                    <div className='' style={{ padding: "0px", marginTop: "10px", marginBottom: "30px" }}>
                        <Button className='btn btn-outline-success' size="sm" variant='' type="submit" style={{ marginRight: "5px" }}>Complete Order</Button>
                        <Button className='btn-outline-warning' size="sm" variant='' style={{}} onClick={() => { navigate(`/product-category`) }}>Continue Shopping</Button>
                    </div>

                </Row> */}
        </Container>
    )
}

export default OrderDetails