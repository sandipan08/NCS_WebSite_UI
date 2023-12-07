import { useEffect, React, useState, useContext } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom';

import ApiService from '../../helpers/ApiServices';
import { formatAddressNew, getModelRoute, showMessage, status } from '../../helpers/Utils';

import { BsExclamationTriangle, BsFlagFill } from 'react-icons/bs'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import { CartContext } from '../../states/contexts/CartContext';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import DisplayOderItems from '../../components/elements/components/DisplayOderItems';
import DisplayInvoiceItems from '../../components/elements/components/DisplayInvoiceItems';
const moment = require("moment")

const InvoiceDetails = () => {
    // All useStates
    const [state, setState] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);

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



    const getInvDetails = () => {
        // console.log(id);
        // ApiService.setHeader()
        ApiService.post(`shop/nsInv?model=${getModelRoute(user).model}`, { id: id }).then(response => {
            console.log(response.data);
            if (response?.data.isSuccess) {
                console.log(response?.data);
                setState(response?.data?.document)
                setLoadingStatus(false)

            }
            if (!response?.data.isSuccess) {
                showMessage(response?.data?.response?.message, "error")
                navigate(-1)

            }
        }).catch(error => {
            console.log(error?.response)
            showMessage(error?.response?.message, "error")
            navigate(-1)
            // console.log("Else Catch")
        })
    }



    useEffect(() => {
        setLoadingStatus(true)
        if (customers != null) getInvDetails()
    }, []);

    // console.log(status.hasOwnProperty(state.status?.toUpperCase().split(" ").join("")));

    if (loadingStatus) {
        return <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", height: "400px" }}>
            <span style={{ color: 'rgb(128, 128, 128)', fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>Please wait while getting invoice details...</span>
        </Col>
    }

    return (
        <Container className='mt-5'>
            {/* TOP BUTTONS */}


            {/* HEADING */}
            <Row className='' style={{ fontSize: 30, fontWeight: 500 }}>
                <Col className='p-0'>Invoice Details</Col>
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
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Invoice Number:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>{state?.documentNumber}</Col>
                            <hr />
                        </Row>
                        <Row className="" style={{ marginRight: "-29px" }}>
                            <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Sales Order:</Col>
                            <Col className='' style={{ marginRight: "-29px" }}>
                                {/* {user?.name} */}
                                {state?.SONumber}
                            </Col>
                            <hr />
                        </Row>
                    </Row>


                    {/* <Row className='mt-5' style={{ fontSize: "13px" }}>
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
                                                onClick={() => getInvDetails(inv?.internalId)}
                                            >{`${inv?.number},`}&nbsp;</span>
                                        } else {
                                            return <span style={{ cursor: "pointer", color: "blue" }}
                                                onClick={() => getInvDetails(inv?.internalId)}
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

                    </Row> */}

                </Col>
                <Col>

                    <Container className='p-0'>
                        <Row className='p-0 mb-1' style={{ fontSize: "14px", position: "sticky", top: 0, backgroundColor: backgroundColor, color: "white", zIndex: 999, }}>

                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>PRODUCT NAME</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>COLLECTION NAME</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>PRICE</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>QTY</Col>
                            <Col className='border p-0' style={{ width: "20%", textAlign: "center" }}>NET TOTAL</Col>
                        </Row>
                        {
                            state?.items?.length ? state?.items.map((item, idx) => {
                                return (
                                    <Row key={idx} className='' style={{ fontSize: "14px" }}>

                                        <Container className='mt-2 border-bottom'>
                                            <DisplayInvoiceItems key={idx} ele={item} />
                                        </Container>
                                    </Row>
                                )
                            }) : null
                        }
                    </Container>

                    {/* {state?.total && <Row className='mt-3'>
                        <Col className='col-lg-4 col-md-4 col-sm-4' style={{ color: "#cc6600" }}>
                            <p>FABRIC TOTAL*</p>
                            <p>Total does not include applicable taxes or delivery,and is subject to change. Product availability varies.</p>
                        </Col>
                        <Col className='col-lg-8 col-md-8 col-sm-8' style={{ color: "#cc6600", textAlign: "right", fontSize: "18px" }}>
                            ${state?.total.toFixed(2)}
                        </Col>
                    </Row>} */}
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

export default InvoiceDetails