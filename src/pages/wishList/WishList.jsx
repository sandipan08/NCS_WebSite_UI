import React, { useState, useContext, useEffect } from 'react'
import { Button, Container, Table, Form, Col, Row, Card } from 'react-bootstrap'
import { useFieldArray, useForm } from 'react-hook-form';
import { AiOutlineHeart } from 'react-icons/ai'
import { FcDislike } from 'react-icons/fc'
import { BiCart } from 'react-icons/bi'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { GrFormSearch } from 'react-icons/gr'
import DefaultImg from '../../image/default_product_img.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { CartContext } from '../../states/contexts/CartContext';
import { WishListContext } from '../../states/contexts/wishListContext';
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { useNavigate } from 'react-router-dom';
import ViewProductImageModal from '../../components/elements/components/ViewProductImageModal';
import { UserContext } from '../../states/contexts/UserContext';

const WishList = () => {
    const [wishLists, setWishLists] = useState([]);
    const [carts, setCarts] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [usdMultiplier, setUSDMultiplier] = useState(null);
    const [cadMultiplier, setCADMultiplier] = useState(null);
    const [usdMatrix, setUsdMatrix] = useState([]);
    const [cadMatrix, setCadMatrix] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [largeModalShow, setLargeModalShow] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { user } = useContext(UserContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { dispatch: wishListDispatch, quantity: wishListQuantity } = useContext(WishListContext)

    const navigate = useNavigate();


    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let uniteType = ''

    customer != null && customer?.addresses.forEach(address => {
        if (address?.isDefaultBilling && address?.country?.text == "UNITED STATES") {
            uniteType = 'y'
        } else {
            uniteType = 'm'
        }
    })
    // const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
    //     defaultValues: {
    //     }
    // });
    // const { append: cartAppend, remove: cartRemove, fields: wishlistItemFields } = useFieldArray({ control, name: "wishlistItems" });



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

    const getWishListDetail = () => {
        setLoadingStatus(true)
        let array = []
        let country = ''

        // customers != null && customers[customers?.length - 1]?.addresses.map(address => {
        customers != null && customer?.addresses.map(address => {
            if (address?.isDefaultBilling) {
                // console.log(address?.country?.text);
                country = address?.country?.text
            }
        })

        ApiService.setHeader()
        ApiService.get(`shop/wishList/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            console.log(response.data);
            if (response?.data.isSuccess) {
                console.log(response?.data.documents);

                response?.data?.documents?.length && response?.data?.documents.map(ele => {

                    if (country == "CANADA") {
                        ele.multipliers = formatArray(ele?.productId?.cadFullMultiplier ? ele?.productId?.cadFullMultiplier : 1)
                    } else {
                        ele.multipliers = formatArray(ele?.productId?.usdFullMultiplier ? ele?.productId?.usdFullMultiplier : 1)
                    }

                    // ele.multipliers = formatArray(ele?.productId?.usdFullMultiplier ? ele?.productId?.usdFullMultiplier : ele?.productId?.cadFullMultiplier ? ele?.productId?.cadFullMultiplier : 1)
                    array.push(ele)
                })

                // setWishLists(response?.data?.documents)
                setWishLists(array)
                wishListDispatch({ type: "ADD_TO_WISHLIST_QUANTITY", payload: response?.data?.documents?.length });

                setLoadingStatus(false)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const addCart = async (data) => {
        ApiService.post(`shop/cart?model=${getModelRoute(user).model}`, data).then(response => {
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
    }

    const addToCart = (data) => {
        console.log(data);
        addCart(data)
    }

    const getPricingMatrix = async () => {
        await ApiService.get(`shop/pricingMatrix/getPrice?model=${getModelRoute(user).model}&priceLevel=${customers[customers?.length - 1]?.priceLevel}`).then(response => {
            // console.log(response.data.documents);
            if (response?.data.isSuccess) {
                setUsdMatrix(response.data.documents.usd)
                setCadMatrix(response.data.documents.cad)
                // console.log(response.data.documents.usd?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`)))
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }

    const getPriceByPricingMatrix = (data) => {
        let country = null

        let priceCode = data?.toLowerCase().trim()
        // console.log(customers[customers?.length - 1]);
        customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
            if (address?.isDefaultBilling) {
                console.log(address?.country?.text);
                country = address?.country?.text
            }
        })

        if (country == "CANADA") {
            return cadMatrix?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`))[0]?.value
        } else {
            return usdMatrix?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`))[0]?.value
        }
    }

    const findProductMultiplierAndFormatArray = (productId) => {
        let country = null;
        setCADMultiplier([])

        ApiService.setHeader()
        ApiService.get(`shop/product/${productId}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })

                // if (country == "CANADA") {
                //     // setCADMultiplier(formatArray(response.data.document.cadMultiplier))
                //     formatArray(response.data.document.cadMultiplier)
                // } else {
                //     // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                //     formatArray(response.data.document.usdMultiplier)
                // }
                console.log(response.data.document);
                // if (response.data.document.cadFullMultiplier && response.data.document.usdFullMultiplier) {
                if (country == "CANADA") {
                    // setCADMultiplier(formatArray(response.data.document.cadMultiplier))
                    formatArray(response.data.document.cadFullMultiplier ? response.data.document.cadFullMultiplier : 1)
                } else {
                    // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                    formatArray(response.data.document.usdFullMultiplier ? response.data.document.usdFullMultiplier : 1)
                }
                // } else {
                //     setCADMultiplier([])
                //     showMessage(`The product ${response.data.document.name} does not have cadFullMultiplier or usdFullMultiplier`, "error")
                // }
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }

    const formatArray = (multiplier) => {
        // console.log(multiplier);
        let array = []
        for (let i = 1; i <= 10; i++) {
            array.push((i * parseInt(multiplier)))
        }
        // console.log(array);
        setCADMultiplier(array)
        return array
    }

    const deleteFromWishList = (wishListId) => {
        console.log(wishListId);
        ApiService.setHeader()
        ApiService.delete(`shop/wishList/${wishListId}?model=${getModelRoute(user).model}`).then(response => {
            console.log(response.data);
            if (response.status == 204) {
                getWishListDetail()
            }
        }).catch(error => {
            console.log(error)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }



    useEffect(() => {
        if (customers != null) {
            getWishListDetail()
            getCartDetail()
            getPricingMatrix()
        }
    }, []);

    // useEffect(() => {
    //     if (customers != null) {
    //         getWishListDetail()
    //     }
    // }, [wishLists]);


    if (loadingStatus) {
        return <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", height: "400px" }}>
            <span style={{ color: 'rgb(128, 128, 128)', fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>Please wait while getting wishlist details...</span>
        </Col>
    }


    return (
        <Container className=' p-0'>
            <Row className=' m-0 p-0 col-xl-12 col-lg-12 col-md-12 col-sm-12' xs={1} sm={2} md={2} lg={4} style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ paddingLeft: "0px" }}>Wish List Deatils</h3>
                <hr style={{ width: "100%" }} />
            </Row>
            <Row className='' xs={1} sm={2} md={2} lg={4} style={{ display: "flex" }}>

                {
                    wishLists?.length ? wishLists?.map(product => {
                        return <Col className='' key={product?.productId?._id} >
                            <Card className=' mb-2' key={product?.productId?._id} style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                                <Card.Body className='' key={product?.productId?._id} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "none" }}>
                                    {/* <Card.Link as={Link} to={`/ `}> */}
                                    <LazyLoadImage
                                        style={{ cursor: "pointer", objectFit: "fill" }}
                                        onClick={() => {
                                            if (product?.productId?.uploadLargePoster?.url) {
                                                // setProductImage(product?.productId?.uploadLargePoster?.url)
                                                setProductImage(product?.productId)
                                            } else {
                                                // setProductImage(product?.productId?.uploadSmallPoster?.url)
                                                setProductImage(product?.productId)
                                            }
                                            setModalShow(true)
                                        }}
                                        alt={""}
                                        width={"145"}
                                        height={"145"}
                                        effect="blur"
                                        src={product?.productId?.uploadLargePoster?.url ? product?.productId?.uploadLargePoster?.url : product?.productId?.uploadSmallPoster?.url ? product?.productId?.uploadSmallPoster?.url : DefaultImg} />
                                    {/* </Card.Link> */}
                                    <Card.Title className='' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div className='' style={{ width: "55%", height: "30px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: customers?.length > 1 || customer ? "space-between" : "center" }}>
                                            <HiOutlineInformationCircle style={{ cursor: "pointer" }} onClick={() => {
                                                // setProductImage(product?.productId?.uploadLargePoster?.url ? product?.productId?.uploadLargePoster?.url : product?.productId?.uploadSmallPoster?.url ? product?.productId?.uploadSmallPoster?.url : DefaultImg)
                                                setProductImage(product?.productId)
                                                setModalShow(true)
                                            }} />

                                            <FcDislike style={{ cursor: "pointer" }} onClick={() => deleteFromWishList(product?._id)} />
                                        </div>

                                        <h6 className='' style={{ fontSize: "14px", textAlign: "center", width: "61%" }}>
                                            {`${product?.productId?.name} ${(product?.productId?.displayName || product?.productId?.colorDescription) ? `(${product?.productId?.displayName && product?.productId?.displayName} ${product?.productId?.colorDescription && product?.productId?.colorDescription})` : ""}`}
                                        </h6>

                                        {/* {customers?.length > 1 ? <> */}
                                        {customer ? <>
                                            {/* <h6 style={{ fontWeight: 500, fontSize: 15 }}>${getPriceByPricingMatrix(product?.productId?.priceCode?.slice(0, 2))}({product?.productId?.primaryUnitsType})</h6> */}
                                            <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product.productId.price}({uniteType})</h6>

                                            {/* <Form.Group key={product?.productId?._id} as={Col} md={7} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>
                                                <Form.Select size='sm' style={{ height: "30px" }}
                                                    id={`product_${product?.productId?._id}`}
                                                    disabled={carts.length ? carts.filter(cart => cart.productId._id == product?.productId?._id).length ? true : false : false}
                                                
                                                >
                                                    {product.multipliers?.length && product.multipliers?.map(ele => { return <option key={ele} value={ele}>{ele}</option> })}
                                                </Form.Select>
                                            </Form.Group> */}
                                            <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yards(s)" : "meters(s)"}</span>
                                        </> : ""}

                                    </Card.Title>
                                </Card.Body>
                                {/* {(customers?.length > 1 || customer) ? */}
                                {/* {(customer) ?
                                    <Card.Footer className='' style={{ width: "50%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                                        {
                                            carts.length ?
                                                carts.filter(cart => cart.productId._id == product?.productId?._id).length ?
                                                    <Button className='' size='sm' variant='secondary'
                                                        onClick={() => { navigate(`/cart-detail`) }}
                                                    >Go To Cart</Button>
                                                    :
                                                    <Button className='' size='sm' variant='secondary'
                                                        // onClick={() => { addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.price }) }}
                                                        onClick={() => {
                                                            if (document.getElementById(`product_${product?.productId?._id}`).value !== "Select qty...") {
                                                                // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                let price = product?.productId.price
                                                                // addToCart({ productId: product?.productId?._id, userId: customers[customers?.length - 1]?._id, price: getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2)), productQuantity: document.getElementById(`product_${product?.productId?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?.productId?._id}`).value) * parseFloat(getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2))).toFixed(2)) }) 
                                                                addToCart({ productId: product?.productId?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?.productId?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?.productId?._id}`).value) * parseFloat(price).toFixed(2)), image: product?.productId.uploadSmallPoster?.url ? product?.productId.uploadSmallPoster?.url : DefaultImg })
                                                            } else {
                                                                showMessage("Please select a quantity!", "info")
                                                            }

                                                        }}
                                                    >Add To Cart</Button>
                                                :
                                                <Button className='' size='sm' variant='secondary'
                                                    // onClick={() => { addToCart({ productId: product?.productId?._id, userId: customers[customers?.length - 1]?._id, price: getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2)), productQuantity: document.getElementById(`product_${product?.productId?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?.productId?._id}`).value) * parseFloat(getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2))).toFixed(2)) }) }}
                                                    onClick={() => {
                                                        if (document.getElementById(`product_${product?.productId?._id}`).value !== "Select qty...") {
                                                            // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                            // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                            let price = product?.productId.price
                                                            // addToCart({ productId: product?.productId?._id, userId: customers[customers?.length - 1]?._id, price: getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2)), productQuantity: document.getElementById(`product_${product?.productId?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?.productId?._id}`).value) * parseFloat(getPriceByPricingMatrix(product?.productId?.priceCode.slice(0, 2))).toFixed(2)) }) 
                                                            addToCart({ productId: product?.productId?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?.productId?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?.productId?._id}`).value) * parseFloat(price).toFixed(2)), image: product?.productId.uploadSmallPoster?.url ? product?.productId.uploadSmallPoster?.url : DefaultImg })
                                                        } else {
                                                            showMessage("Please select a quantity!", "info")
                                                        }

                                                    }}
                                                >Add To Cart</Button>

                                        }
                                    </Card.Footer>
                                    : ""
                                } */}
                            </Card>
                        </Col>
                    }) : <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%" }}>
                        <div style={{ color: "GrayText", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <BiCart style={{ fontSize: 300 }} />
                        </div>
                        <div style={{ fontSize: 50, color: "GrayText", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            YOUR WISHLIST IS EMPTY!
                        </div>

                    </Col>
                }


            </Row>

            <ViewProductImageModal show={modalShow} productImage={productImage} setModalShow={setModalShow} />
        </Container>
    )
}

export default WishList