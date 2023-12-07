import { useEffect, React, useState, useContext } from 'react'
import { Container, Row, Col, Card, Button, Figure, Form, Table } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom';
import { BsExclamationTriangle } from 'react-icons/bs'
import { nanoid } from 'nanoid'
import Swal from 'sweetalert2'

import AppContentForm from '../../components/elements/builders/AppContentForm';
import TextField from '../../components/elements/fields/TextField';
import ApiService from '../../helpers/ApiServices';
import { formatAddressForSaveInDB, formatAddressNew, getModelRoute, showMessage } from '../../helpers/Utils';
// import { BiCart } from 'react-icons/bi'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import { CartContext } from '../../states/contexts/CartContext';
import OrderItems from '../../components/elements/components/OrderItems';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import moment from "moment";
import DisplayOderItems from '../../components/elements/components/DisplayOderItems';

const Order = () => {
    // All useStates
    const [state, setState] = useState([]);
    const [carts, setCarts] = useState([]);
    const [shipDates, setShipDates] = useState([]);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [selectedShippingAddress, setSelectedShippingAddress] = useState('');
    const [total, setTotal] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [shippingtype, setShipingType] = useState(null);

    // All reducers
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { color, backgroundColor } = useContext(BrandIconContext)

    const navigate = useNavigate()
    const { shipType } = useParams();

    // All local storage data
    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let uniteType;

    // All useForms
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {

        }
    });



    // All functions
    const onSubmit = (data) => {
        setLoadingStatus(true)

        let arr = []
        // console.log("shippingType: ", shipType);
        // data.cartItems = state

        if (shipType === "orderComplete") {
            data.cartItems = formatCartItemForShipComplete(state)
            data.shippingDate = moment.max(shipDates)._i
            data.orderNumber = `N${nanoid(9)}`
            data.status = customer?.isPFApprovalNeeded ? "Credit approval" : customer?.isSOApprovalNeeded ? "Credit hold" : "Pending Fulfillment"
            data.total = total
            data.orderBy = {
                id: user?._id,
                text: user?.name,
                value: user?.netsuiteId
            }
            data.onBehalfOf = {
                id: customers[customers?.length - 1]?._id,
                text: customers[customers?.length - 1]?.name,
                value: customers[customers?.length - 1]?.netsuiteId
            }
            data.billTo = customer?.addresses.length ? formatAddressForSaveInDB(customer?.addresses.filter(address => address.isDefaultBilling)[0]) : ""
            data.shipTo = customer?.addresses.length ? formatAddressForSaveInDB(customer?.addresses.filter(address => address.address1 == selectedShippingAddress)[0]) : ""
            data.subsidiary = customer?.addresses.filter(address => address.isDefaultBilling)[0]?.country.text === 'CANADA' ? "C" : "U"
            // data.division = customer.brandTypes[0]?.text === "NORTHCOTT" ? "Northcott" : "Figo"
            data.division = 'Northcott'

        } else if (shipType === "orderByCollection") {
            carts.forEach(ele => {
                let obj = {}
                let items = formatCartItemForShipComplete(ele[1])

                obj.cartItems = formatCartItemForShipComplete(ele[1])
                obj.shippingDate = ele[1][0].shipDate
                obj.specialInstruction = ele[1][0].specialInstruction
                obj.orderNumber = `N${nanoid(9)}`
                obj.status = customer?.isPFApprovalNeeded ? "Credit approval" : customer?.isSOApprovalNeeded ? "Credit hold" : "Pending Fulfillment"
                obj.total = items?.reduce(function getSum(total, item) {
                    return (parseFloat(total) + parseFloat(item?.subTotal)).toFixed(2);
                }, 0)
                obj.orderBy = {
                    id: user?._id,
                    text: user?.name,
                    value: user?.netsuiteId
                }
                obj.onBehalfOf = {
                    id: customers[customers?.length - 1]?._id,
                    text: customers[customers?.length - 1]?.name,
                    value: customers[customers?.length - 1]?.netsuiteId
                }
                obj.billTo = customer?.addresses.length ? formatAddressForSaveInDB(customer?.addresses.filter(address => address.isDefaultBilling)[0]) : ""
                obj.shipTo = customer?.addresses.length ? formatAddressForSaveInDB(customer?.addresses.filter(address => address.address1 == selectedShippingAddress)[0]) : ""
                obj.subsidiary = customer?.addresses.filter(address => address.isDefaultBilling)[0]?.country.text === 'CANADA' ? "C" : "U"
                // obj.division = customer.brandTypes[0]?.text === "NORTHCOTT" ? "Northcott" : "Figo"
                obj.division = 'Northcott'

                arr.push(obj)
            })
        }



        console.log(data);
        console.log(arr);

        if (arr.length) {
            return createMultipleOrder(arr)
        } else {
            Swal.fire({
                title:
                    `<Container className="p-0" style="font-size: 27px">
                        YOUR COMBINED ORDER WILL SHIP BY ${moment(moment.max(shipDates)._i).format('DD-MMM-YYYY').replaceAll("-", " ")}.
                    </Container>`
                ,
                html: `
                <div style="display: flex; justify-content: center; align-items: center; flex-direction: column">
                    <p>Want to change ship date and special instruction?</p>
                    <p>
                        <input id="swal-input1" type="date" class=""
                        style="height: 30px; width: 250px; border: none; border-bottom: 1px solid black" />
                    </p>

                    <p>
                        <input id="specialInstruction" type="text"  class="" placeholder="SPECIAL INSTRUCTION"
                        style="width: 450px; border: none; border-bottom: 1px solid black"" />
                    </p>

                </div>
                `,
                showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: `CONFIRM`,
                denyButtonText: `NOT CONFIRM`,
                // customClass: {
                //     confirmButton: 'confirm-button-class',
                // },
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */

                if (result.isConfirmed) {
                    if (document.getElementById('swal-input1').value || document.getElementById('specialInstruction').value) {
                        data.shippingDate = new Date(document.getElementById('specialInstruction').value)?.toISOString()
                        data.specialInstruction = document.getElementById('specialInstruction').value
                    }

                    return createOrder(data)

                } else if (result.isDenied) {
                    // Swal.fire('NOT CONFIRMED', '', 'info')
                }
            })
        }

        // return createOrder(data)
    }

    const createOrder = (data) => {

        return ApiService.post(`shop/order?model=${getModelRoute(user).model}`, data).then(async response => {
            if (response?.data.isSuccess) {

                const order = response.data.document

                let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
                let initials = [...order.orderBy.text.matchAll(rgx)] || [];

                order.customerId = order.onBehalfOf.id.customerId;
                order.customerNetsuiteId = order.onBehalfOf.id.customerNetsuiteId;
                order.shippingDate = moment(order.shippingDate).format("MM/DD/YYYY")
                order.orderBy = initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
                console.log("order: ", order);

                // Push the order to netsuite
                ApiService.setHeader();
                // const res = await ApiService.post(`admin/nsOrder`, order)
                const res = await ApiService.post(`shop/nsOrder?model=${getModelRoute(user).model}`, order)
                // console.log(res);
                if (res.data.isSuccess) {

                    console.log("success");
                    const resp = await ApiService.patch(`shop/order/${order._id}?model=${getModelRoute(user).model}`, { netsuiteId: res.data.document.id })
                    if (resp.data.isSuccess) {
                        setState(resp.data.document)
                        setLoadingStatus(false)
                        // navigate(`/${rootPath}/order/edit/${id}`)
                        showMessage("Your order has been Placed successfully!", 'info')
                    }
                }
                navigate(`/my-orders`)
            }
        }).catch(error => {
            setLoadingStatus(false)
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        })
    }

    const createMultipleOrder = (dataArr) => {
        dataArr.forEach(data => {

            ApiService.post(`shop/order?model=${getModelRoute(user).model}`, data).then(async response => {
                if (response?.data.isSuccess) {
                    const order = response.data.document

                    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
                    let initials = [...order.orderBy.text.matchAll(rgx)] || [];

                    order.customerId = order.onBehalfOf.id.customerId;
                    order.customerNetsuiteId = order.onBehalfOf.id.customerNetsuiteId;
                    order.shippingDate = moment(order.shippingDate).format("MM/DD/YYYY")
                    order.orderBy = initials = ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
                    console.log("order: ", order);

                    // Push the order to netsuite
                    ApiService.setHeader();
                    // const res = await ApiService.post(`admin/nsOrder`, order)
                    const res = await ApiService.post(`shop/nsOrder?model=${getModelRoute(user).model}`, order)
                    // console.log(res);
                    if (res.data.isSuccess) {

                        console.log("success");
                        const resp = await ApiService.patch(`shop/order/${order._id}?model=${getModelRoute(user).model}`, { netsuiteId: res.data.document.id })
                        if (resp.data.isSuccess) {
                            setState(resp.data.document)
                            setLoadingStatus(false)
                            // navigate(`/${rootPath}/order/edit/${id}`)
                            showMessage("Your order has been Placed successfully!", 'info')
                            navigate(`/my-orders`)
                        }
                    }

                }
            }).catch(error => {
                setLoadingStatus(false)
                console.log(error.response.data)
                showMessage(error.response.data.message, "error")
            })
        })
    }

    const formatCartItemForShipComplete = (state) => {
        let array = []
        state.forEach(ele => {
            let obj = {}

            obj.collectionName = ele.collectionName
            obj.id = ele.id
            obj.image = ele.image
            obj.multipliers = ele.multipliers
            obj.price = ele.price.split("/")[0].replace("$", "")
            obj.productId = ele.productId
            obj.productQuantity = ele.productQuantity.split("/")[0]
            obj.shipDate = ele.shipDate
            obj.specialInstruction = ele?.specialInstruction
            obj.subTotal = ele.subTotal.replace("$", '')
            obj.userId = ele.userId
            obj._id = ele._id

            array.push(obj)
        })

        return array
    }

    const getCartDetail = () => {
        let array = []

        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {

                // Calculate and set total
                setTotal(response?.data.documents?.reduce(function getSum(total, cart) {
                    // return total + cart?.price;
                    return (parseFloat(total) + parseFloat(cart?.subTotal)).toFixed(2);
                }, 0))

                // Set cart qty
                cartDispatch({ type: "ADD_TO_CART_QUANTITY", payload: response?.data.documents?.length });

                // Set all cart Id's into an array
                response?.data.documents.map(cart => array.push(moment(cart?.shipDate)))
                setShipDates(array)

                // Format cart items
                response?.data.documents.map(ele => {
                    // ele.productQuantity = formatData(ele).productQuantity
                    // ele.multipliers = formatData(ele).multipliers
                    ele.productQuantity = `${ele.productQuantity}/ ${uniteType == 'm' ? 'Metre(s)' : 'Yard(s)'}`
                    ele.price = `$${ele.price}/ ${uniteType}`
                    ele.subTotal = `$${ele.subTotal}`
                })

                // Set and format the data by shiptype
                if (shipType === "orderByCollection")
                    formatDataToShowInCart(response?.data.documents)

                if (shipType === 'orderComplete')
                    setState(response?.data.documents)


            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const formatDataToShowInCart = (cartDetails) => {
        // Format cart items
        // cartDetails.map(ele => {
        //     // ele.productQuantity = formatData(ele).productQuantity
        //     // ele.multipliers = formatData(ele).multipliers
        //     ele.productQuantity = `${ele.productQuantity}/ ${uniteType == 'm' ? 'Metre(s)' : 'Yard(s)'}`
        //     ele.price = `$${ele.price}/ ${uniteType}`
        //     ele.subTotal = `$${ele.subTotal}`
        // })

        // Group all cart items by collection name
        const groupBycollectionName = cartDetails.reduce((group, cartItem) => {
            const { collectionName } = cartItem;

            group[collectionName] = group[collectionName] ?? [];
            group[collectionName].push(cartItem);

            return group;
        }, {});

        setCarts(Object.entries(groupBycollectionName))
    }

    const getCustomerShippingAddresses = () => {
        console.log(customer);

        let array = []
        customers[customers?.length - 1]?.addresses.map(address => {
            // for (let address of customers[customers?.length - 1]?.addresses) {
            // console.log(address.isDefaultShipping);
            if (address.isDefaultShipping) {
                array.push(address)
                // console.log(address);
            }
        })

        setShippingAddresses(array)
    }

    console.log(shippingAddresses);
    customers != null && customers[customers?.length - 1]?.addresses.forEach(address => {
        if (address?.isDefaultBilling && address?.country?.text == "UNITED STATES") {
            uniteType = 'y'
        } else {
            uniteType = 'm'
        }
    })


    useEffect(() => {
        // console.log(customer);
        if (customers != null) {
            getCustomerShippingAddresses()
            getCartDetail()
        }
    }, []);

    console.log(carts);

    if (loadingStatus) {
        return <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", height: "400px" }}>
            <span style={{ color: 'rgb(128, 128, 128)', fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>Please wait while Your order has been placed...</span>
        </Col>
    }

    return (
        <AppContentForm onSubmit={handleSubmit(onSubmit)}>
            <Container className=''>
                {/* TOP BUTTONS */}
                <Row className=''>
                    <Col className='col-lg-6'></Col>
                    <Col className='col-lg-6' style={{ display: "flex", justifyContent: "flex-end", padding: "0px", gap: "10px" }}>
                        <Button className='animet_btton' size="sm" variant='' style={{ backgroundColor: backgroundColor, color: "white" }} onClick={() => { navigate(`/product-category`) }}>Continue Shopping</Button>
                        <Button className='animet_btton' size="sm" variant='' style={{ backgroundColor: backgroundColor, color: "white" }} onClick={() => { navigate(`/cart-detail`) }}>View Cart</Button>
                    </Col>
                </Row>

                {/* HEADING */}
                <Row className='' style={{ fontSize: 30, fontWeight: 500 }}>
                    <Col className='p-0'>My Order Details</Col>
                    <Col className='p-0' style={{ display: "flex", justifyContent: "flex-end" }}>
                        Grand Total: ${
                            total
                        }
                    </Col>
                </Row>

                {/* ORDER DETAILS */}
                <Row className='mt-2'>
                    <Col className=' rounded col-lg-4'>

                        <Row className='' >
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Order number:</Col>
                                <Col className='' style={{ marginRight: "-29px", marginTop: "7px" }}>
                                    To be generated...
                                </Col>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ordered By:</Col>
                                {/* <Col className='' style={{ marginRight: "-29px" }}>{user?.name}</Col> */}
                                <Col className='' style={{ marginRight: "-29px" }}>{customers[customers?.length - 1]?.name}</Col>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Order Start Date:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>

                                    <Form.Group as={Col} md="4" className="mb-2">
                                        <Form.Control size='sm' style={{ width: '250px' }}
                                            type="date"
                                            id="orderStartDate"
                                            name="orderStartDate"
                                            {...register("orderStartDate", { value: new Date().toISOString().split("T")[0] })}
                                        />
                                    </Form.Group>

                                </Col>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Bill To:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>
                                    {customer?.addresses?.length ? formatAddressNew(customer?.addresses.filter(address => address.isDefaultBilling)[0]) : ""}

                                </Col>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px", fontSize: "13px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500, width: "14%" }}><BsExclamationTriangle style={{ fontSize: "40px", color: color }} /></Col>
                                <Col className=' p-0 m-0' style={{}}>
                                    If the address we have on file is incorrect, please contact us at 1-905-760-0072
                                </Col>
                                <hr />
                            </Row>
                        </Row>

                        <Row className='mt-5' >
                            <Row className="" style={{ marginRight: "-29px", fontSize: 25, fontWeight: 400 }}>
                                Additional Information
                            </Row>
                            <Row className="" style={{ marginRight: "-29px", fontSize: "12px", fontStyle: "italic" }}>
                                Please complete all information before proceeding
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ship To:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>
                                    <div>
                                        <Form.Select size='sm' aria-label="Default select example" style={{ width: "250px" }}
                                            {...register("shippingAddress", { required: true })}
                                            required={true}
                                            // defaultValue={industryCode}
                                            onChange={e => {
                                                // console.log(e.target.value);
                                                setSelectedShippingAddress(e.target.value)
                                            }}>
                                            <option value={""}>{'Select shipping address...'}</option>
                                            {
                                                shippingAddresses?.length && shippingAddresses.map(address => {
                                                    return <option key={address?._id} value={address?.address1}>{address?.address1}</option>
                                                })
                                            }
                                        </Form.Select>
                                        {errors?.shippingAddress && <span>Please select shipping address!!</span>}
                                    </div>
                                    <div className='mt-3'>
                                        {selectedShippingAddress != "" ? formatAddressNew(customer?.addresses.filter(address => address.address1 == selectedShippingAddress)[0]) : ""}
                                    </div>
                                </Col>
                                <hr />
                            </Row>
                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Customer PO Number:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>
                                    <TextField
                                        register={register}
                                        errors={errors}
                                        field={{
                                            description: "",
                                            label: "",
                                            fieldId: "customerPONumber",
                                            placeholder: "",
                                            page: true,
                                            // required: true,
                                            // validationMessage: "Please enter customer PO number!"
                                        }}
                                        changeHandler={null}
                                        blurHandler={null}
                                    />

                                </Col>
                                <hr />
                            </Row>
                            {/* <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Ship Via:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>
                                    <TextField
                                        register={register}
                                        errors={errors}
                                        field={{
                                            description: "",
                                            label: "",
                                            fieldId: "shipVia",
                                            placeholder: "",
                                            page: true,
                                            // required: true,
                                            // validationMessage: "Please enter ship via!"
                                        }}
                                        changeHandler={null}
                                        blurHandler={null}
                                    />

                                </Col>
                                <hr />
                            </Row> */}

                            <Row className="" style={{ marginRight: "-29px" }}>
                                <Col className='col-lg-4 p-1' style={{ fontWeight: 500 }}>Memo:</Col>
                                <Col className='' style={{ marginRight: "-29px" }}>
                                    <TextField
                                        register={register}
                                        errors={errors}
                                        field={{
                                            description: "",
                                            label: "",
                                            fieldId: "memo",
                                            placeholder: "",
                                            page: true,
                                            // required: true,
                                            // validationMessage: "Please enter ship via!"
                                        }}
                                        changeHandler={null}
                                        blurHandler={null}
                                    />

                                </Col>
                                <hr />
                            </Row>
                        </Row>

                    </Col>
                    <Col className='col-lg-8'
                    // style={{ height: "500px" }}
                    >
                        {
                            // state && state?.map(cart => {
                            //     return (
                            //         <OrderItems key={cart?._id} cart={cart} />
                            //     )
                            // })


                            (carts?.length || state?.length) ?
                                <Container className='p-0'>
                                    <Row className='border p-0' style={{ fontSize: "14px", position: "sticky", top: 0, backgroundColor: backgroundColor, color: "white", zIndex: 1 }}>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>IMAGE</Col>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>PRODUCT NAME</Col>
                                        <Col className='border p-0' style={{ minWidth: "7rem", textAlign: "center" }}>COLLECTION NAME</Col>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>PRICE</Col>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>QTY</Col>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>DISCOUNT</Col>
                                        <Col className='border p-0' style={{ minWidth: "6rem", textAlign: "center" }}>NET TOTAL</Col>
                                    </Row>

                                    {
                                        carts?.length ? carts.map((cart, idx) => {

                                            return (
                                                <Row key={idx} className='p-0' style={{ fontSize: "14px" }}>
                                                    <Container style={{ backgroundColor: "#CFF", height: "60px", fontWeight: 700, display: "flex", flexDirection: "column" }}>
                                                        <span>Ship Date: {moment(cart[1][0]?.shipDate).format('DD-MMM-YYYY').replaceAll("-", " ")}</span>
                                                        <span>Special Instruction: {cart[1][0]?.specialInstruction}</span>
                                                    </Container>

                                                    <Container className='mt-2' style={{ border: "1px solid black" }}>
                                                        {
                                                            cart[1]?.length ? cart[1]?.map((ele, index) => {
                                                                return (
                                                                    <DisplayOderItems key={ele?._id} ele={ele} />
                                                                )
                                                            }) : ""
                                                        }
                                                    </Container>
                                                </Row>
                                            )
                                        }) : (
                                            <Row className='mt-2 border-bottom'>
                                                <Container>
                                                    {
                                                        state?.length ? state?.map((ele, index) => {

                                                            return (
                                                                <DisplayOderItems key={ele?._id} ele={ele} />
                                                            )
                                                        }) : ""
                                                    }
                                                </Container>
                                            </Row>
                                        )
                                    }
                                </Container> : ""
                        }

                        {total && <Row className='mt-3'>
                            <Col className='col-lg-4 col-md-4 col-sm-4' style={{ color: "#cc6600", fontSize: "14px" }}>
                                <p>FABRIC TOTAL*</p>
                                <p>Total does not include applicable taxes or delivery,and is subject to change. Product availability varies.</p>
                            </Col>
                            <Col className='col-lg-8 col-md-8 col-sm-8' style={{ color: "#cc6600", textAlign: "right", fontSize: "18px" }}>
                                ${total}
                            </Col>
                        </Row>}
                    </Col>
                </Row>


                {/* BOTTOM TEXT AND BUTTONS */}
                <Row className=''>
                    <div className='' style={{ padding: "0px", fontSize: "14px" }}>
                        Click here to read through our Sales Tearms and Conditions
                    </div>

                    <div className='' style={{ display: "flex", gap: "10px", padding: "0px", marginTop: "10px", marginBottom: "30px" }}>
                        {/* ALL CART ITEMS ARE SHIPPED AS DISSERENT ORDER BY COLLECTION */}
                        {/* <Button className='btn btn-outline-success' size="sm" variant='' type="submit" style={{ marginRight: "5px" }} onClick={() => { setShipType("orderByCollection") }}>COMPLETE ORDER</Button> */}

                        {/* ALL CART ITEMS ARE SHIPPED AS ONE ORDER */}
                        {/* {!user?.userTypes.includes("CUSTOMER") ? <Button className='btn btn-outline-success' size="sm" variant='' type="submit" style={{ marginRight: "5px" }} onClick={() => { setShipType("orderComplete") }}>COMBINE SHIPMENT</Button> : null} */}
                        <Button className='animet_btton' size="sm" variant='' type='submit' style={{ backgroundColor: backgroundColor, color: "white" }} onClick={() => { setShipingType(shipType) }}>COMPLETE</Button>
                        <Button className='animet_btton' size="sm" variant='' style={{ backgroundColor: backgroundColor, color: "white" }} onClick={() => { navigate(`/product-category`) }}>CONTINUE SHOPPING</Button>
                    </div>

                </Row>
            </Container>
        </AppContentForm>
    )
}

export default Order