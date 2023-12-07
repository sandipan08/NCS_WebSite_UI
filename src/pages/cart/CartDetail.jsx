import { useEffect, React, useState, useContext } from 'react'
import { Container, Row, Col, Buttom, Card, Button, Figure, Form, Table } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ApiService from '../../helpers/ApiServices';
import { getCountry, getModelRoute, showMessage } from '../../helpers/Utils';

import { CiEdit } from 'react-icons/ci'
import { FaRegEye } from 'react-icons/fa'
import { BiCart } from 'react-icons/bi'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import { CartContext } from '../../states/contexts/CartContext';
import NumberField from '../../components/elements/fields/NumberField';
import { Typeahead } from 'react-bootstrap-typeahead';
import DisplayCartDetails from '../../components/elements/components/DisplayCartDetails';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';

const CartDetail = () => {
    const [state, setState] = useState([]);
    const [carts, setCarts] = useState([]);
    const [total, setTotal] = useState(null);
    const [usdMultiplier, setUSDMultiplier] = useState(null);
    const [cadMultiplier, setCADMultiplier] = useState(null);
    // const [updateCartData, setUpdateCartData] = useState();
    const [isEditCart, setIsEditCart] = useState(false);

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { user } = useContext(UserContext)
    const { backgroundColor } = useContext(BrandIconContext)
    const { dispatch: cartDispatch, shipType } = useContext(CartContext)

    const navigate = useNavigate()

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    // console.log("cart: ", quantity);


    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
        }
    });
    const { append: cartAppend, remove: cartRemove, fields: cartItemFields } = useFieldArray({ control, name: "cartItems" });

    let updateCartData = { quantity: "", cartId: "", price: "", subTotal: "" }



    const onSubmit = (formData) => {
        console.log(formData);
    }

    const formatData = (cart) => {
        let array = []
        cart.multipliers?.map(e => {
            let obj = {}
            obj = {
                id: e,
                name: String(e)
            }
            array.push(obj)
        })

        return {
            productQuantity: [{
                id: cart.productQuantity,
                name: String(cart.productQuantity)
            }],
            multipliers: array
        }
    }

    // Check wheather prices are changed or not. If changed update price in every cart item else don't update.

    const checkPricesOfCart = (prices) => {
        let obj = {}
        let updatedCartItems = []

        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                response?.data.documents?.map(cartItem => {

                    console.log("cart item: ", cartItem);

                    // Get pricing matrix based on products's priceCode
                    // console.log(getCountry());
                    const key = `${getCountry()?.toUpperCase()} ${customers[customers?.length - 1].priceLevel}`?.toUpperCase()
                    // console.log(key);

                    const pm = prices.filter(price => price.Code === cartItem.productId.priceCode)
                    // console.log("pm: ", pm);

                    // Set price from pricing matrix in each product
                    if (pm.length) {
                        for (let ele of Object.entries(pm[0])) {
                            if (ele[0]?.toUpperCase() === key) {
                                // Set new price from pricing matrix into product if changed
                                if (ele[1] !== cartItem?.price) {
                                    cartItem.price = ele[1]
                                    cartItem.subTotal = parseFloat(parseFloat(ele[1]) * cartItem.productQuantity).toFixed(2)
                                    updatedCartItems.push(cartItem)
                                }
                            }
                        }

                    }
                })

                console.log('updatedCartItems: ', updatedCartItems);
                updatePriceInCartItems(updatedCartItems)

            }
        }).catch(error => {
            console.log(error)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }


    const getCartDetail = () => {
        let obj = {}

        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // getMultipliers()

                console.log(response?.data.documents);
                cartDispatch({ type: "ADD_TO_CART_QUANTITY", payload: response?.data.documents?.length });
                setState(response?.data.documents)

                setTotal(response?.data.documents?.reduce(function getSum(total, cart) {
                    // return total + cart?.price;
                    return (parseFloat(total) + parseFloat(cart?.subTotal)).toFixed(2);
                }, 0))

                // Format cart items
                response?.data.documents?.map(ele => {
                    ele.productQuantity = formatData(ele).productQuantity
                    ele.multipliers = formatData(ele).multipliers
                })

                obj.cartItems = response?.data.documents
                // console.log(obj);
                reset(obj)

                // Group all cart items by collection name
                const groupBycollectionName = response?.data.documents?.reduce((group, cartItem) => {
                    const { collectionName } = cartItem;

                    group[collectionName] = group[collectionName] ?? [];
                    group[collectionName].push(cartItem);

                    return group;
                }, {});

                // Set formated cart items
                console.log(Object.entries(groupBycollectionName));
                setCarts(Object.entries(groupBycollectionName))
            }
        }).catch(error => {
            console.log(error)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const updateCartItem = (cartId) => {
        if (updateCartData.cartId && cartId == updateCartData.cartId) {

            ApiService.setHeader()
            ApiService.patch(`shop/cart/increaseCartItemQuantity/${updateCartData.cartId}?model=${getModelRoute(user).model}`, updateCartData).then(response => {
                if (response?.data.isSuccess) {
                    getCartDetail()
                }
            }).catch(error => {
                console.log(error.response.data)
                // showMessage(error.response.data.message, "error")
            })

            setIsEditCart(!isEditCart)
        } else {
            showMessage("Please select correct Item for update!", "warning")
        }
    }

    const deleteCartItem = (cartId) => {
        ApiService.setHeader()
        ApiService.delete(`shop/cart/${cartId}?model=${getModelRoute(user).model}`).then(response => {
            if (response.status == 204) {
                getCartDetail()
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }

    const deleteAllSelectedCartItem = (cartIds) => {
        ApiService.setHeader()
        ApiService.delete(`shop/cart/many/${JSON.stringify(cartIds)}?model=${getModelRoute(user).model}`).then(response => {
            if (response.status == 204) {
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })

        getCartDetail()
    }

    const updatePriceInCartItems = (updatedCartItems) => {
        // Not completed
        if (updatedCartItems?.length) {
            ApiService.setHeader()
            ApiService.patch(`shop/cart/bulkUpdatePrice?model=${getModelRoute(user).model}`, updatedCartItems).then(response => {
                if (response?.data.isSuccess) {
                    getCartDetail()
                }
            }).catch(error => {
                console.log(error.response?.data)
                // console.log("Else Catch")
                // showMessage(error.response.data.message, "error")
            })
        } else {
            getCartDetail()
        }
    }

    const toggleEdit = () => {
        setIsEditCart(!isEditCart)
    }

    const findProductMultiplierAndFormatArray = (productId) => {
        let country = null;

        ApiService.setHeader()
        ApiService.get(`shop/product/${productId}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })

                if (country == "CANADA") {
                    // setCADMultiplier(formatArray(response.data.document.cadMultiplier))
                    formatArray(response.data.document.cadMultiplier)
                } else {
                    // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                    formatArray(response.data.document.usdMultiplier)
                }
            }
        }).catch(error => {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        })
    }

    const formatArray = (multiplier) => {
        // console.log(multiplier);
        let array = []
        for (let i = 1; i <= 10; i++) {
            array.push((i * parseFloat(multiplier)).toFixed(2))
        }
        // console.log(array);
        setCADMultiplier(array)
        return array
    }

    const getMultipliers = () => {
        let country = null;

        ApiService.setHeader()
        ApiService.get(`shop/multiplier?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })

                if (country == "CANADA") {
                    setCADMultiplier(response?.data.document?.cad)
                } else {
                    setCADMultiplier(response?.data.document?.usd)
                }
            }
        }).catch(error => {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        })
    }


    useEffect(() => {
        // if (customers != null) getCartDetail()
        // if (customers?.length > 1) {
        if (customers?.length) {
            ApiService.setHeader()
            ApiService.get(`shop/pricingMatrix?model=${getModelRoute(user).model}`).then(response => {
                console.log(response.data.documents);
                if (response?.data.isSuccess) {
                    // prices = response.data.documents

                    // Get cart details (passing pricing matrixes)
                    // getCartDetail(response.data.documents)
                    checkPricesOfCart(response.data.documents)
                }
            }).catch(error => {
                console.log(error.response.data)
                // showMessage(error.response.data.message, "error")
            })

        }

        // getMultipliers()
    }, []);

    console.log(carts);

    return (
        // <AppContentForm onSubmit={handleSubmit(onSubmit)}>
        <Container>
            <Row className=' m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12' xs={1} sm={2} md={2} lg={4} style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ paddingLeft: "0px" }}>Cart Details</h3>
                <hr style={{ width: "100%" }} />
            </Row>
            {state?.length ?
                <Container className='m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12'>
                    <Row className='m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12' style={{ display: "flex", flexDirection: "column" }}>
                        <Col className='m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12' style={{ width: "100%", display: "flex", justifyContent: "flex-end", padding: "0px", gap: "10px" }}>
                            {/* ALL CART ITEMS ARE SHIPPED AS ONE ORDER */}
                            {!user?.userTypes.includes("CUSTOMER") ? <Button className='btn btn-outline-success' size="sm" variant='' style={{ marginBottom: "10px", backgroundColor: backgroundColor, color: "white", border: "none" }}
                                onClick={() => {
                                    // setShipType("orderComplete") 
                                    // cartDispatch({ type: "CHANGE_SHIP_TYPE", payload: "orderComplete" });
                                    navigate(`/order/create/${'orderComplete'}`)
                                }}>COMBINE SHIPMENT</Button> : null}

                            {!user?.userTypes.includes("CUSTOMER") ? <Button className='btn btn-outline-info' size="sm" variant='' style={{ marginBottom: "10px", backgroundColor: backgroundColor, color: "white", border: "none" }}
                                onClick={() => {
                                    // setShipType("orderComplete") 
                                    // cartDispatch({ type: "CHANGE_SHIP_TYPE", payload: "orderByCollection" });
                                    navigate(`/order/create/${'orderByCollection'}`)
                                }}>SHIP COMPLETE</Button> : null}

                            {/* <Button className='btn btn-outline-info' size="sm" variant='' style={{ marginBottom: "10px", backgroundColor: backgroundColor, color: "white", border: "none" }}
                                onClick={() => { navigate("/order") }}
                            >Checkout</Button>

                            {!isEditCart ? <Button className='btn btn-outline-info' size="sm" variant='' style={{ marginBottom: "10px" }}
                                onClick={toggleEdit}
                            > <CiEdit /></Button> :
                                <Button className='btn btn-outline-info' size="sm" variant='' style={{ marginBottom: "10px" }}
                                    onClick={toggleEdit}
                                > <FaRegEye /></Button>
                            } */}

                        </Col>

                        {/* <Col className='m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12 scroll scroll4' style={{ width: "100%", maxHeight: "400px", overflowY: "auto" }}> */}
                        <Col className='m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12 scroll scroll4' style={{ width: "100%" }}>
                            {
                                carts?.length && carts?.map(cart => {
                                    return <DisplayCartDetails key={cart?._id} isEditCart={isEditCart} cart={cart} updateCartData={updateCartData} updateCartItem={updateCartItem} deleteCartItem={deleteCartItem} total={total} deleteAllSelectedCartItem={deleteAllSelectedCartItem} />
                                })
                            }
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        <Container className="" style={{ marginRight: "-8px" }}>
                            <Row>
                                <Col sm="12" md="8">

                                </Col>
                                <Col sm="12" md="4">
                                    <Card className='border-top border-start rounded' style={{ border: "none" }}>
                                        <Card.Body>
                                            {/* <Row className='' style={{ textAlign: 'right', fontSize: '16px', fontWeight: 600 }}>
                                            <Col sm="12" md="3">Sub Total:</Col>
                                            <Col sm="12" md="9"></Col>
                                        </Row> */}
                                            <Row style={{ textAlign: 'right', fontSize: '16px', fontWeight: 600 }}>
                                                <Col sm="12" md="3">Total:</Col>
                                                <Col sm="12" md="9" style={{ borderTop: '1px solid black' }}>
                                                    $ {
                                                        state?.reduce(function getSum(total, cart) {
                                                            // return total + cart?.price;
                                                            return (parseFloat(total) + parseFloat(cart?.subTotal)).toFixed(2);
                                                        }, 0)
                                                    }
                                                </Col>
                                            </Row>


                                        </Card.Body>
                                    </Card>

                                </Col>
                            </Row>
                        </Container>
                    </Row>
                </Container > :
                <Container>
                    <div style={{ color: "GrayText", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <BiCart style={{ fontSize: 300 }} />
                    </div>
                    <div style={{ fontSize: 50, color: "GrayText", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        YOUR CART IS EMPTY!
                    </div>

                </Container>
            }
        </Container >
    )
}

export default CartDetail