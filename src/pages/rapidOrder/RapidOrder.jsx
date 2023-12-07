import React, { useContext, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { BsTrash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

import AppContentForm from '../../components/elements/builders/AppContentForm';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import ApiService from '../../helpers/ApiServices';
import { CustomerContext } from '../../states/contexts/CustomerContext';
import DefaultImg from '../../image/default_product_img.jpg'
import { getCountry, getModelRoute, showMessage } from '../../helpers/Utils';
import { useEffect } from 'react';
import { CartContext } from '../../states/contexts/CartContext';
import { CiEdit } from 'react-icons/ci'
import { FaRegEye } from 'react-icons/fa'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DisplayCartDetails from '../../components/elements/components/DisplayCartDetails';
import Loader from '../../components/elements/components/loaders/Loader';
import { UserContext } from '../../states/contexts/UserContext';
const moment = require('moment')


const RapidOrder = () => {
    const [show, setShow] = useState({ isShowSKU1: false, isShowSKU2: false, isShowSKU3: false, isShowSKU4: false, isShowSKU5: false, isShowSKU6: false, isShowSKU7: false, isShowSKU8: false, isShowSKU9: false, isShowSKU10: false });
    const [collections, setCollections] = useState({ sku1Collection: [], sku2Collection: [], sku3Collection: [], sku4Collection: [], sku5Collection: [], sku6Collection: [], sku7Collection: [], sku8Collection: [], sku9Collection: [], sku10Collection: [] });
    const [otherInfo, setOtherInfo] = useState({ sku1OtherInfo: {}, sku2OtherInfo: {}, sku3OtherInfo: {}, sku4OtherInfo: {}, sku5OtherInfo: {}, sku6OtherInfo: {}, sku7OtherInfo: {}, sku8OtherInfo: {}, sku9OtherInfo: {}, sku10OtherInfo: {} });
    const [carts, setCarts] = useState([])
    // const [unformatedCartData, setUnformatedCartData] = useState([])
    const [state, setState] = useState([]);
    const [total, setTotal] = useState(null);
    const [isEditCart, setIsEditCart] = useState(false);

    const navigate = useNavigate()

    const { dispatch: iconDispatch, textColor, division, ...rest } = useContext(BrandIconContext)
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { user } = useContext(UserContext)

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let uniteType;

    const { register, handleSubmit, control, setValue, reset, getValues, formState: { errors } } = useForm({
        defaultValues: {
        }
    });
    const { append: cartItemsAppend, remove: cartItemsRemove, fields: cartItemsFields, update: cartItemsUpdate, insert: cartItemsInsert } = useFieldArray({ control, name: "cartItems" });
    const { append: showCartItemsAppend, remove: showCartItemsRemove, fields: showCartItemsFields, update: showCartItemsUpdate, insert: showCartItemsInsert } = useFieldArray({ control, name: "showCartItems" });

    let updateCartData = { quantity: "", cartId: "", price: "", subTotal: "" }


    const onSubmit = (data) => {
        let array = []
        let itemsAddedtoCart = []
        // console.log(data);

        // Find unique items
        let uniqueItems = [...new Map(data.cartItems.map(item => [item['combineName'], item])).values()];

        // Update the quantity before adding into cart
        uniqueItems.map(ele => {
            let qty = ele.productQuantity * data.cartItems.filter(itm => itm.combineName === ele.combineName)?.length
            ele.productQuantity = qty
            ele.subTotal = ele.price * qty
        })

        // console.log("uniqueItems: ", uniqueItems.map(ele => ele.combineName));
        // console.log("cart: ", state);

        // Update sku quantity which is already present in cart
        for (let ele of uniqueItems) {
            let item = state.filter(itm => itm.combineName === ele.combineName)[0]
            // console.log(item);
            if (item) {
                const qty = ele.productQuantity + parseInt(item.productQuantity[0]?.id)

                item.productQuantity = qty
                item.subTotal = ele.price * qty

                array.push(item)
            }
        }

        // console.log("Modified: ", array.map(ele => ele.combineName));

        // Filterout the element which is already present in cart
        if (array.length) {
            for (let ele of uniqueItems) {

                if (!array.find((item) => item.combineName === ele.combineName)) {
                    itemsAddedtoCart.push(ele)
                }
            }
        }

        // console.log("itemsAddedtoCart:", itemsAddedtoCart.map(ele => ele.combineName));

        // Update qty and subtotal
        if (array.length) {
            updateQtyAndSubtotal(array)
        }

        if (data.cartItems?.length && data.cartItems.filter(ele => { return ele.sku == '' })?.length == 0) {
            // return addCart(data.cartItems)
            // return addCart(uniqueItems)
            return addCart(array.length ? itemsAddedtoCart : uniqueItems)
        } else {
            showMessage('Please select a product!!', "info")
        }
    }

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
                    const key = `${getCountry().toUpperCase()} ${customers[customers?.length - 1].priceLevel}`.toUpperCase()
                    // console.log(key);

                    const pm = prices.filter(price => price.Code === cartItem.productId.priceCode)
                    // console.log("pm: ", pm);

                    // Set price from pricing matrix in each product
                    if (pm.length) {
                        for (let ele of Object.entries(pm[0])) {
                            if (ele[0].toUpperCase() === key) {
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
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
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

    const addCart = async (data) => {
        ApiService.post(`shop/cart?model=${getModelRoute(user).model}`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.document);
                // cartItemsAppend({ sku: '', collection: [{ _id: "", value: "", text: '' }] })
                reset({ cartItems: [] })
                setCollections({ sku1Collection: [], sku2Collection: [], sku3Collection: [], sku4Collection: [], sku5Collection: [], sku6Collection: [], sku7Collection: [], sku8Collection: [], sku9Collection: [], sku10Collection: [] })
                setShow({ isShowSKU1: false, isShowSKU2: false, isShowSKU3: false, isShowSKU4: false, isShowSKU5: false, isShowSKU6: false, isShowSKU7: false, isShowSKU8: false, isShowSKU9: false, isShowSKU10: false })

                showMessage("Item's added successfully!!", "success")

                getCartDetail()
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getProduct = (name, skuNo) => {
        // console.log(skuNo);
        let country = '', multipliers

        ApiService.setHeader()
        ApiService.get(`shop/product/get/${name}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data.document);

            if (response?.data.isSuccess) {
                let obj = {}

                // Get country
                customers != null && customers[customers?.length - 1]?.addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        // console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })

                setShow(prev => ({ ...prev, [`isShowSKU${skuNo}`]: true }))
                setCollections(prev => ({ ...prev, [`sku${skuNo}Collection`]: response.data.document?.collections }))

                let price = response.data.document.price
                if (country == "CANADA") {
                    uniteType = 'm'
                    multipliers = formatArray(response.data.document?.cadFullMultiplier ? response.data.document?.cadFullMultiplier : 1)
                } else {
                    uniteType = 'y'
                    multipliers = formatArray(response.data.document?.usdFullMultiplier ? response.data.document?.usdFullMultiplier : 1)
                }

                setValue(`cartItems.${skuNo}.productId`, response.data.document._id)
                setValue(`cartItems.${skuNo}.userId`, customers[customers?.length - 1]?._id)
                setValue(`cartItems.${skuNo}.price`, price)
                setValue(`cartItems.${skuNo}.multipliers`, multipliers)
                setValue(`cartItems.${skuNo}.productQuantity`, parseInt(multipliers[0]))
                setValue(`cartItems.${skuNo}.subTotal`, parseInt(multipliers[0]) * price)
                setValue(`cartItems.${skuNo}.image`, response.data.document?.uploadSmallPoster?.url ? response.data.document?.uploadSmallPoster?.url : DefaultImg)
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    // Get selected collection and set ship date to each cart item
    const getAndSetShipDate = (collectionName, skuNo) => {
        ApiService.get(`shop/collection/name/${collectionName}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response.data);
                setValue(`cartItems.${skuNo}.shipDate`, response.data?.document?.date)

                // Below line is only for finding unique items from array
                setValue(`cartItems.${skuNo}.combineName`, `${getValues(`cartItems.${skuNo}.sku`)} ${collectionName}`)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    //OLD
    // const getCartDetail = () => {
    //     let obj = {}

    //     ApiService.setHeader()
    //     ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}`).then(response => {
    //         // console.log(response.data);
    //         if (response?.data.isSuccess) {

    //             // console.log(response?.data.documents);
    //             cartDispatch({ type: "ADD_TO_CART_QUANTITY", payload: response?.data.documents?.length });

    //             // Format cart items
    //             response?.data.documents.map(ele => {
    //                 // ele.productQuantity = formatData(ele).productQuantity
    //                 // ele.multipliers = formatData(ele).multipliers
    //                 ele.productQuantity = `${ele.productQuantity}/ ${uniteType == 'm' ? 'Metre(s)' : 'Yard(s)'}`
    //                 ele.price = `$${ele.price}/ ${uniteType}`
    //                 ele.subTotal = `$${ele.subTotal}`
    //             })

    //             obj.showCartItems = response?.data.documents

    //             // Group all cart items by collection name
    //             const groupBycollectionName = response?.data.documents.reduce((group, cartItem) => {
    //                 const { collectionName } = cartItem;

    //                 group[collectionName] = group[collectionName] ?? [];
    //                 group[collectionName].push(cartItem);

    //                 return group;
    //             }, {});
    //             // console.log(Object.entries(groupBycollectionName));

    //             // Set formated cart items to a state
    //             // setCarts(obj.showCartItems)
    //             setCarts(Object.entries(groupBycollectionName))
    //             // console.log(obj);

    //             // // Reset formated cart items to show on list
    //             // reset(obj)

    //         }
    //     }).catch(error => {
    //         console.log(error.response?.data)
    //         // console.log("Else Catch")
    //         // showMessage(error.response.data.message, "error")
    //     })
    // }

    // NEW
    const getCartDetail = () => {
        let obj = {}

        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // getMultipliers()

                // console.log(response?.data.documents);
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
                    ele.combineName = `${ele.productId.name.split(":")[1].trim()} ${ele.collectionName}`
                })

                obj.cartItems = response?.data.documents
                // console.log(obj);
                // reset(obj)

                // Group all cart items by collection name
                const groupBycollectionName = response?.data.documents?.reduce((group, cartItem) => {
                    const { collectionName } = cartItem;

                    group[collectionName] = group[collectionName] ?? [];
                    group[collectionName].push(cartItem);

                    return group;
                }, {});

                // Set formated cart items
                setCarts(Object.entries(groupBycollectionName))
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const updateCartItem = (cartId) => {
        // console.log(cartId);
        // console.log(updateCartData);
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

    const updateQtyAndSubtotal = (array) => {
        ApiService.setHeader()
        ApiService.patch(`shop/cart/updateQty?model=${getModelRoute(user).model}`, array).then(response => {
            if (response?.data.isSuccess) {

            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })

    }

    const deleteCartItem = (cartId) => {
        console.log(cartId);

        ApiService.setHeader()
        ApiService.delete(`shop/cart/${cartId}?model=${getModelRoute(user).model}`).then(response => {
            if (response.status == 204) {
                getCartDetail()
            }
        }).catch(error => {
            console.log(error)
            // showMessage(error.response.data.message, "error")
        })
    }

    const deleteAllSelectedCartItem = (cartIds) => {
        console.log(cartIds);
        ApiService.setHeader()
        ApiService.delete(`shop/cart/many/${JSON.stringify(cartIds)}?model=${getModelRoute(user).model}`).then(response => {
            if (response.status == 204) {
                getCartDetail()
            }
        }).catch(error => {
            console.log(error)
            // showMessage(error.response.data.message, "error")
        })

    }

    const toggleEdit = () => {
        setIsEditCart(!isEditCart)
    }


    const formatData = (cart) => {
        let array = [{ id: "", name: "" }]
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
            // productQuantity: cart.productQuantity,
            multipliers: array
        }
    }

    const formatArray = (multiplier, calledFrom) => {
        let array = []
        for (let i = 1; i <= 10; i++) {
            array.push((i * parseInt(multiplier)))
        }

        if (calledFrom !== "checkBox") {
            // setCADMultiplier(array)
            // setQtys(array)
        }
        return array
    }

    const goToCart = () => {
        navigate(`/cart-detail`)
    }

    customers != null && customers[customers?.length - 1]?.addresses.forEach(address => {
        if (address?.isDefaultBilling && address?.country?.text == "UNITED STATES") {
            uniteType = 'y'
        } else {
            uniteType = 'm'
        }
    })

    // console.log(carts);

    useEffect(() => {
        // if (customer != null) getCartDetail()
        if (customer != null) {
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
    }, []);



    return (
        <AppContentForm onSubmit={handleSubmit(onSubmit)}>
            <Container className='p-0'>
                <Row className=' p-0 mb-4' style={{ display: "flex", flexDirection: "column" }}>
                    <Col className='p-0 mb-3'><h2 style={{ fontSize: "30px" }}>Rapid Order Placement</h2></Col>
                    <Col className='p-0' style={{ fontSize: "14px" }}>Please enter the SKUs of the swatches you wish to add to the order :</Col>
                    <Col className='p-0' style={{ color: "red", fontSize: "14px" }}>If SKU belongs to more than one collection, please select the appropriate collection</Col>
                </Row>

                {/* SKU SELECTION */}
                {/* <AppContentBody className="p-0 m-0"> */}

                <Row >
                    <Card className='p-0 mb-4 border' style={{ width: '100%', border: "none" }}>
                        <Card.Body className="card-scroll">
                            <Table responsive striped hover size='sm'>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: "1rem" }}></th>
                                        <th style={{ minWidth: "15rem", fontSize: "14px" }}>SKU</th>
                                        <th style={{ minWidth: "10rem", fontSize: "14px" }}>COLLECTIONS</th>
                                        <th style={{ minWidth: "1rem" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItemsFields.map((field, index) => {

                                        return (
                                            <tr key={index} >
                                                <td>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <Form.Group as={Col} md={'4'}>
                                                        <Form.Control size='sm' style={{ maxWidth: "15rem" }}
                                                            label=''
                                                            type="text"
                                                            id="sku"
                                                            name="sku"
                                                            {...register(`cartItems.${index}.sku`)}
                                                            onBlur={(e) => {
                                                                // console.log(e.target.value);
                                                                if (e.target.value) {
                                                                    getProduct(e.target.value, index)
                                                                }
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    {show[`isShowSKU${index}`] ? <Form.Group as={Col} md={'4'} className="mb-2">
                                                        <Form.Select size='sm' aria-label="Default select example" autoFocus style={{ width: '250px' }}
                                                            {...register(`cartItems.${index}.collectionName`)}
                                                            onBlur={(e) => {
                                                                // Get selected collection shipdate
                                                                getAndSetShipDate(e.target.value, index)
                                                            }}
                                                            onFocus={(e) => {
                                                                // Get selected collection shipdate
                                                                getAndSetShipDate(e.target.value, index)
                                                            }}

                                                        >
                                                            {
                                                                collections[`sku${index}Collection`]?.length && collections[`sku${index}Collection`].map(ele => {
                                                                    // console.log(ele);
                                                                    return <option key={ele?._id} value={ele?.text}>{ele?.text}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </Form.Group> : null}
                                                </td>
                                                <td>
                                                    <Button size="sm" variant="danger"
                                                        onClick={() => {
                                                            cartItemsRemove(index);
                                                            // setCollections({ sku1Collection: [], sku2Collection: [], sku3Collection: [], sku4Collection: [], sku5Collection: [], sku6Collection: [], sku7Collection: [], sku8Collection: [], sku9Collection: [], sku10Collection: [] })
                                                            // setShow({ isShowSKU1: false, isShowSKU2: false, isShowSKU3: false, isShowSKU4: false, isShowSKU5: false, isShowSKU6: false, isShowSKU7: false, isShowSKU8: false, isShowSKU9: false, isShowSKU10: false })
                                                            setShow(prev => ({ ...prev, [`isShowSKU${index}`]: false }))
                                                            setCollections(prev => ({ ...prev, [`sku${index}Collection`]: [] }))
                                                        }}
                                                    ><BsTrash /></Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <td colSpan="14">
                                            <Button size="sm" className='animet_btton' style={{ backgroundColor: rest.backgroundColor, borderColor: rest.backgroundColor }} onClick={() => {
                                                cartItemsAppend({ sku: '', collection: [{ _id: "", value: "", text: '' }] })
                                                // setCollections({ sku1Collection: [], sku2Collection: [], sku3Collection: [], sku4Collection: [], sku5Collection: [], sku6Collection: [], sku7Collection: [], sku8Collection: [], sku9Collection: [], sku10Collection: [] })
                                                // setShow({ isShowSKU1: false, isShowSKU2: false, isShowSKU3: false, isShowSKU4: false, isShowSKU5: false, isShowSKU6: false, isShowSKU7: false, isShowSKU8: false, isShowSKU9: false, isShowSKU10: false })
                                            }}>Add Sku</Button>

                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Row>

                <Row className='p-0 mb-3'>
                    <Col className='p-0' style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <Button className='animet_btton' type='submit' style={{ backgroundColor: rest.backgroundColor, borderColor: rest.backgroundColor }} variant="primary" size="sm">Add to Order</Button>

                        <Button className='animet_btton' style={{ backgroundColor: rest.backgroundColor, borderColor: rest.backgroundColor }} variant="primary" size="sm" onClick={goToCart}>View Cart</Button>

                        {/* {!isEditCart ? <Button className='btn btn-outline-info' size="sm" variant=''
                            onClick={toggleEdit}
                        > <CiEdit /></Button> :
                            <Button className='btn btn-outline-info' size="sm" variant=''
                                onClick={toggleEdit}
                            > <FaRegEye /></Button>
                        } */}
                    </Col>
                </Row>

                {/* SHOW CART ITEMS */}
                {/* {carts?.length ? <Row>
                    <Table striped hover size="sm" style={{ fontSize: "16px" }}>
                        <thead style={{ position: "sticky", top: 0, backgroundColor: rest.backgroundColor, color: "white", zIndex: 999 }}>
                            <tr style={{}}>
                                <th style={{ minWidth: "2rem" }}></th>
                                <th style={{ minWidth: "0rem" }}>IMAGE</th>
                                <th style={{ minWidth: "12rem" }}>PRODUCT NAME</th>
                                <th style={{ minWidth: "12rem" }}>COLLECTION NAME</th>
                                <th style={{ minWidth: "12rem" }}>PRICE</th>
                                <th style={{ minWidth: "9rem" }}>QTY</th>
                                <th style={{ minWidth: "9rem" }}>DISCOUNT</th>
                                <th style={{ minWidth: "12rem" }}>NET TOTAL</th>
                            </tr>
                        </thead>
                        <tbody >
                            {showCartItemsFields?.map((field, index) => {
                                return (
                                    <tr key={field.id}>
                                        <td style={{ textAlign: 'center', paddingTop: '8px' }}>{index + 1}</td>
                                        <td style={{ textAlign: 'center', paddingTop: '8px' }}>
                                            <LazyLoadImage
                                                alt={""}
                                                width={"145"}
                                                height={"145"}
                                                effect="blur"
                                                {...register(`showCartItems.${index}.image`)}
                                                src={getValues(`showCartItems.${index}.image`)}
                                            />
                                        </td>

                                        <td>
                                            <Form.Group >
                                                <Form.Control
                                                    plaintext readOnly disabled
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    {...register(`showCartItems.${index}.productId.name`)} />
                                            </Form.Group>
                                        </td>

                                        <td>
                                            <Form.Group >
                                                <Form.Control
                                                    plaintext readOnly disabled
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    {...register(`showCartItems.${index}.collectionName`)} />
                                            </Form.Group>
                                        </td>

                                        <td>
                                            <Form.Group >
                                                <Form.Control
                                                    plaintext readOnly disabled
                                                    type="text"
                                                    id="price"
                                                    name="price"
                                                    {...register(`showCartItems.${index}.price`)} />
                                            </Form.Group>
                                        </td>

                                        <td>
                                            <Form.Group >
                                                <Form.Control
                                                    plaintext readOnly disabled
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    {...register(`showCartItems.${index}.productQuantity`)} />
                                            </Form.Group>
                                        </td>

                                        <td>
                                            n/a
                                        </td>

                                        <td>
                                            <Form.Group >
                                                <Form.Control
                                                    plaintext readOnly disabled
                                                    type="text"
                                                    id="price"
                                                    name="price"
                                                    {...register(`showCartItems.${index}.subTotal`)} />
                                            </Form.Group>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Row> : null} */}

                {/* {carts?.length ?
                    <Container className=' p-0'>
                        <Row className='border p-0' style={{ fontSize: "14px", position: "sticky", top: 0, backgroundColor: rest.backgroundColor, color: "white", zIndex: 999 }}>
                            <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>IMAGE</Col>
                            <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>PRODUCT NAME</Col>
                            <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>COLLECTION NAME</Col>
                            <Col className='border p-0' style={{ minWidth: "9rem", textAlign: "center" }}>PRICE</Col>
                            <Col className='border p-0' style={{ minWidth: "9rem", textAlign: "center" }}>QTY</Col>
                            <Col className='border p-0' style={{ minWidth: "9rem", textAlign: "center" }}>DISCOUNT</Col>
                            <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>NET TOTAL</Col>
                        </Row>

                        {
                            carts.map((cart, idx) => {
                                return (
                                    <Row key={idx} className='' style={{ fontSize: "14px" }}>
                                        <Container style={{ backgroundColor: "#CFF", height: "60px", fontWeight: 700, display: "flex", alignItems: "center" }}>Ship Date: {moment(cart[1][0]?.shipDate).format('DD-MMM-YYYY').replaceAll("-", " ")}</Container>
                                        <Container className='mt-2 border-bottom'>
                                            {
                                                cart[1]?.map((ele, index) => {
                                                    return (
                                                        <Row key={ele?._id} className=''>
                                                            <Col className=' p-0' style={{ minWidth: "6rem", textAlign: "center" }}>
                                                                <LazyLoadImage
                                                                    alt={""}
                                                                    width={"145"}
                                                                    height={"145"}
                                                                    effect="blur"
                                                                    // {...register(`showCartItems.${index}.image`)}
                                                                    src={ele?.image}
                                                                />
                                                            </Col>
                                                            <Col className=' p-0' style={{ minWidth: "6rem", textAlign: "center" }}>{ele.productId?.name}</Col>
                                                            <Col className=' p-0' style={{ minWidth: "6rem", textAlign: "center" }}>{ele?.collectionName}</Col>
                                                            <Col className=' p-0' style={{ minWidth: "9rem", textAlign: "center" }}>{ele?.price}</Col>
                                                            <Col className=' p-0' style={{ minWidth: "9rem", textAlign: "center" }}>{ele?.productQuantity}</Col>
                                                            <Col className=' p-0' style={{ minWidth: "9rem", textAlign: "center" }}>{"n/a"}</Col>
                                                            <Col className=' p-0' style={{ minWidth: "6rem", textAlign: "center" }}>{ele?.subTotal}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                        </Container>
                                    </Row>
                                )
                            })
                        }
                    </Container> : null} */}

                {
                    carts?.length ? carts?.map(cart => {
                        return <DisplayCartDetails key={cart?._id} isEditCart={isEditCart} cart={cart} updateCartData={updateCartData} updateCartItem={updateCartItem} deleteCartItem={deleteCartItem} total={total} deleteAllSelectedCartItem={deleteAllSelectedCartItem} />
                    }) : <Loader content={`CART IS EMPTY!!`} position={'start'} />
                }
            </Container >
        </AppContentForm >
    )
}



export default RapidOrder