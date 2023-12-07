import { React, useContext, useEffect, useState } from 'react'
import { Container, Button, Col, Row, DropdownButton, Dropdown, ButtonGroup, Modal, Tabs, Tab, Breadcrumb, Card, Table, Form, Carousel } from 'react-bootstrap'
import { BsBoxArrowInUpRight, BsTrash } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react';

import { CustomerContext } from '../../states/contexts/CustomerContext'
import { UserContext } from '../../states/contexts/UserContext'
import { useForm, useFieldArray } from 'react-hook-form'
import TextField from '../../components/elements/fields/TextField'
import ApiService from '../../helpers/ApiServices'
import { formatAddress, isLoggedIn, showMessage, formatAddressByDefault, formatAddressNew, logout, formatAddressForCustomer, getModelRoute } from '../../helpers/Utils'
import { CustomerService, TokenService } from '../../helpers/StorageServices'
import Address from '../../components/blocks/Address'
import AppContentForm from "../../components/elements/builders/AppContentForm"
import AppContentBody from "../../components/elements/builders/AppContentBody"
import AppContentHeader from '../../components/elements/builders/AppContentHeader'
import CustomSelectField from '../../components/elements/fields/CustomSelectField'
import CheckboxField from '../../components/elements/fields/CheckboxField'
import CustomerCustomSelectField from '../../components/elements/fields/CustomerCustomSelectField'
import TextArea from '../../components/elements/fields/TextArea'
import LineTextAreaField from '../../components/elements/fields/LineTextAreaField'
import moment from 'moment';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
const _ = require('lodash');

export default function CustomerProfile() {
    const [state, setState] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [country, setCountry] = useState("");
    const [secondaryCustomers, setSecondaryCustomers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [isSaveSubscription, setIsSaveSubscription] = useState(false);
    const [tabKey, setTabKey] = useState('mediaLinks');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [checkDefault, setCheckDefault] = useState(false)
    const [checkDefaultArr, setCheckDefaultArr] = useState([]);
    const [isDefaultTick, setIsDefaultTick] = useState([]);
    const [addressValue, setAddressValue] = useState('');
    const [addressValueLineLevel, setAddressValueLineLevel] = useState([]);
    const [editAddressModalState, setEditAddressModalState] = useState({});
    const [selectCustomer, setSelectCustomer] = useState({});
    const [editAddressModalIndex, setEditAddressModalIndex] = useState();
    const [isDefaultTickAdd, setIsDefaultTickAdd] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);


    const navigate = useNavigate();

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)
    const { division } = useContext(BrandIconContext)


    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors, isDirty, dirtyFields, touchedFields } } = useForm({

    });
    const { register: defaultRegister } = useForm();
    const { append: addressAppend, remove: addressRemove, fields: addressFields, update: addressUpdate, insert: addressInsert } = useFieldArray({ control, name: "addresses" });

    // const watchFields = watch(["firstName", "lastName", "storeEmail", "storeWebsite", "storePhone", "cellPhone"]);

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    // let recentCustomers = customers


    function onGridReady(params) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const handleSearch = (e) => {
        gridApi.setQuickFilter(e.target.value);
    }

    const handleExportAsCsv = (e) => {
        gridApi.exportDataAsCsv();
    }

    const onSubmit = (formData) => {
        let id;

        // console.log(formData);

        if (user?.userTypes.includes("CUSTOMER")) id = user?._id
        if (user?.userTypes.includes("SALES_MANAGER") || user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("POWER_USER") || user?.userTypes.includes("ADMIN_USER")) id = customer?._id
        // console.log(id);

        if (isSaveSubscription) {
            return saveSubscription(id, formData)
        }
        return updateDocument(id, formData)
    }

    const updateDocument = async (id, data) => {
        console.log("touch fields: ", Object.keys(touchedFields).filter(function (item) { return item !== "addresses" }));
        console.log(getModelRoute(user).model);
        data.changedFields = Object.keys(touchedFields).filter(function (item) { return item !== "addresses" })

        // await ApiService.patch(`shop/user/${id}?updatedFrom=website`, data).then(response => {
        await ApiService.patch(`shop/customer/${id}?model=${getModelRoute(user).model}&updatedFrom=website`, data).then(response => {
            if (response.data.isSuccess) {
                let document = response.data.document

                reset(document)
                setIsEditMode(false)
                showMessage("Profile has been updated successfully..", "success")
                // navigate(`/`)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const saveSubscription = (id, data) => {
        // console.log("data: ", data);

        // ApiService.patch(`shop/user/subscrption/${id}`, data).then(response => {
        ApiService.patch(`shop/customer/subscrption/${id}`, data).then(response => {
            if (response.data.isSuccess) {
                let document = response.data.document

                reset(document)
                showMessage("Subscription has been updated!", "info")
                setIsSaveSubscription(false)
            }
        }).catch(error => {
            console.log(error?.response?.data)
            // console.log("Else Catch")
            showMessage(error?.response?.data?.message, "error")
        })
    }

    const isLoggedIn = async () => {
        ApiService.setHeader()
        await ApiService.get(`shop/user/loggedIn`).then(response => {
            // console.log(response.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data.document });

            if (response.data.document?.userTypes.includes("CUSTOMER")) reset(response.data.document)
        }).catch(async error => {

            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
            try {
                await logout()
                dispatch({ type: "LOGOUT_SUCCESS" });
                customerDispatch({ type: "SELECT_CUSTOMER", payload: null })
            } catch (error) {
                dispatch({ type: "LOGIN_FAILURE" });
            }
            navigate(`/`)

        })

    }

    const configureAddressArray = (customer) => {
        let addressArray = []

        customer?.addresses?.map(address => {
            let addressObj = address
            const v = formatAddressForCustomer(address)
            addressObj.address = v
            addressArray.push(addressObj)
        })
        return addressArray
    }

    const setCustomer = async () => {
        let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

        ApiService.setHeader()
        // ApiService.get(`shop/user/${customers?.length ? customers[customers?.length - 1]._id : user?._id}`).then(response => {
        await ApiService.get(`shop/customer/${customers?.length ? customers[customers?.length - 1]._id : user?._id}`).then(response => {

            if (response.data.isSuccess) {
                let customer = response?.data.document
                // console.log(customer);
                customer.addresses = configureAddressArray(customer)

                // Load the selected customer into reducer
                customerDispatch({ type: "SELECT_CUSTOMER", payload: customer });

                // Set customer data into field's
                reset(customer)
            }
        }).catch(error => {

            console.log(error)
            // showMessage(error.response.data.message, "error")

        })

    }

    const handleShow = (value) => {
        setShowAddressModal(value);

        if (isDefaultTick.length > 1) {
            let flag = true;
            isDefaultTick.map(e => {
                if (e) {
                    flag = false;
                    setCheckDefault(true);
                }
            })

            if (flag) {
                setCheckDefault(false)
            }
        }

    }

    const toggleHandler = () => {
        setIsUpdateForm(!isUpdateForm)
    }

    const getSecondaryCustomers = async (customerNetSuiteId) => {
        try {

            const response = await ApiService.get(`shop/user/secondarycustomer?customerNetSuiteId=${customerNetSuiteId}`)

            if (response?.data.isSuccess) {
                console.log(response?.data.documents);
                setSecondaryCustomers(response?.data.documents)
            }

        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }

    const customerChangeHandler = (e, data) => {
        const id = data?.targetValue?.split('||')[0]

        ApiService.setHeader()
        ApiService.get(`shop/user/${id}`).then(response => {
            let customer = response?.data.document
            customer.addresses = configureAddressArray(customer)

            // Load the selected customer into reducer
            customerDispatch({ type: "SELECT_CUSTOMER", payload: response.data.document });
            reset(response.data.document)

            customers.push(response.data.document)
            // Save the customer array into localStorage, so that after refresh we can get the customer
            localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(customers))



        }).catch(error => {
            console.log(error.response?.data)
            showMessage(error.response?.data.message, "error")
        })
    }

    const getInvoicesByCustomer = () => {
        // console.log(customers[customers?.length - 1]?.customerNetsuiteId);
        // console.log(customer?.customerNetsuiteId);
        ApiService.post(`shop/nsInv/getByCust`, { id: customers[customers?.length - 1]?.customerNetsuiteId }).then(response => {
            console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data);
                setInvoices(response?.data?.document)
                setLoadingStatus(false)

            }
            if (!response?.data.isSuccess) {
                showMessage(response?.data?.response?.message, "error")
                // navigate(-1)
                setLoadingStatus(false)

            }
        }).catch(error => {
            console.log(error?.response)
            showMessage(error?.response?.message, "error")
            // navigate(-1)
            // console.log("Else Catch")
            setLoadingStatus(false)
        })
    }

    const columns = [
        { headerName: 'INVOICE NUMBER', field: 'docNumber', width: 300, cellRendererFramework: (params) => <span style={{ cursor: "pointer" }} onClick={() => { navigate(`/invoice/${params.data.id}`) }}>{params.data.docNumber}</span> },
        { headerName: 'WEB ORDER NUMBER', field: 'webOrderNumber', width: 400 },
        { headerName: 'DATE', field: 'date', width: 160, valueGetter: (params) => params.data?.date ? moment(params.data?.date).format("MM/DD/YYYY ") : "Not Available" },
        { headerName: 'SHIPPING DATE', field: 'shipDate', width: 160, valueGetter: (params) => params.data?.shipDate ? moment(params.data?.shipDate).format("MM/DD/YYYY ") : "Not Available" },
        { headerName: 'STATUS', field: 'status', width: 240 },
        // { headerName: 'DETAIL', field: 'customerPONumber', width: 80, cellRendererFramework: (params) => <FcSearch style={{ cursor: "pointer" }} onClick={() => { goToOrderDetailPage(params.data._id) }} /> }
    ]


    // console.log(customers[customers?.length - 1]?.isPrimary)
    useEffect(() => {
        // isLoggedIn()
        setCustomer()
        // console.log("recentCustomers: ", customers[customers?.length - 1]?.email);

        // if (user?.userTypes.includes("CUSTOMER") && user?.isPrimary) {
        //     getSecondaryCustomers(user?.customerNetSuiteId)
        // } else if (!user?.userTypes.includes("CUSTOMER") && customers[customers?.length - 1]?.isPrimary) {
        //     getSecondaryCustomers(customers[customers?.length - 1]?.customerNetSuiteId)

        // }

        if (customers != null) {
            getInvoicesByCustomer()
        }

    }, []);

    if (user) {
        return (


            <AppContentForm onSubmit={handleSubmit(onSubmit)}>

                {/* <Container className="ml-4 mt-5 mb-0 border" ></Container> */}

                <AppContentHeader>
                    <Container className='' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Row><h3 style={{ fontWeight: "bold" }}>Subscribe to Northcott's Mailing List</h3></Row>

                        {user?.userTypes.includes("CUSTOMER") ? <Row><p>{user?.email}</p></Row> : <Row><p>{customers[customers?.length - 1]?.email}</p></Row>}

                        <Row >
                            <Col className='col-lg-1'>
                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "",
                                        fieldId: "northcottNotification",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />
                            </Col>
                            <Col className='col-lg-11'><b>You are currently subscribed to Northcott's Retail Mailing list. If you do not wish to receive any notifications regarding Northcott, please uncheck and save to unsubscribe</b></Col>
                        </Row>
                        <Row>
                            <Col className='col-lg-1'>
                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "",
                                        fieldId: "northcottPromotionNotification",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />
                            </Col>
                            <Col className='col-lg-11'><b>You are currently subscribed to Northcott's Promotions Mailing List. If you do not wish to receive any notifications regarding Northcott promotions, please uncheck and save to unsubscribe</b></Col>
                        </Row>
                        <Row>
                            <Col className='col-lg-1'>
                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "",
                                        fieldId: "northcottMonthlyConsumerNewsletterNotification",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />
                            </Col>
                            <Col className='col-lg-11'><b>You are currently subscribed to Northcott's Monthly Consumer Newsletter. If you do not wish to receive any notifications regarding Northcott's Monthly Consumer Newsletter, please uncheck and save to unsubscribe</b></Col>

                        </Row>

                        <Row>
                            <Button type='submit' size='sm' onClick={() => setIsSaveSubscription(true)} style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>SAVE SUBSCRIPTION</Button>
                        </Row>
                    </Container>

                    <Container className="ml-4 mt-5 mb-0" ><h3>CUSTOMER PROFILE</h3></Container>

                    <Container style={{ marginTop: "-60px" }}>
                        <Row className='' >
                            {/* className='border p-0 ps-1' style={{ display: "flex", justifyContent: "space-between", padding: 0 }} */}
                            <Col className='p-0 ps-1 mt-5' style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", marginBottom: 2 }}>

                                {((user?.userTypes.includes("CUSTOMER") && customers[customers?.length - 1]?.email == user?.email) || (!user?.userTypes.includes("CUSTOMER"))) ?
                                    <>
                                        <Button className='m-2' type="submit" size="sm" variant='primary' disabled={isUpdateForm ? false : true} style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>SUBMIT</Button>

                                        <Form.Check className='m-2' size="sm" type="switch" id="custom-switch" label={isUpdateForm ? "Edit" : "View"} checked={isUpdateForm} onChange={toggleHandler} />


                                        {user?.userTypes.includes("CUSTOMER") &&
                                            <Button className='m-2' size="sm" as={Link} to={'/update-password'} variant='primary' style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>UPDATE PASSWORD</Button>
                                        }
                                    </> : ""
                                }

                                {user?.userTypes.includes("ADMIN_USER") &&
                                    <Button className='m-2' size="sm" as={Link} to={`/update-password/${customer?._id}`} variant='primary' style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>UPDATE PASSWORD</Button>
                                }


                                {(user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("SALES_MANAGER") || user?.userTypes.includes("PCTERP_ADMIN")) || user?.userTypes.includes("POWER_USER") && ""}
                            </Col>

                            {/* <Col className='p-0 ps-1 mt-5 ' style={{ display: "flex", justifyContent: "flex-end" }}>

                                {secondaryCustomers?.length > 1 ? <CustomSelectField
                                {customers[customers?.length - 1]?.isPrimary ? <CustomSelectField

                                    index={secondaryCustomers?.length}
                                    register={defaultRegister}
                                    errors={errors}
                                    options={secondaryCustomers?.length && secondaryCustomers}
                                    defaultOption={{ value: "--SELECT A CUSTOMER--", name: "--SELECT A CUSTOMER--" }}
                                    field={{
                                        description: "",
                                        label: "",
                                        fieldId: "selectCustomer",
                                        placeholder: "Select customer...",
                                        multiple: false
                                    }}

                                    changeHandler={customerChangeHandler}
                                    blurHandler={null}
                                /> : ""}

                            </Col> */}
                        </Row>
                    </Container>

                </AppContentHeader >

                {/* BODY FIELDS */}
                <AppContentBody>
                    <Container >
                        <Row>
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer account number.",
                                    label: "ACCOUNT NUMBER",
                                    fieldId: "netsuiteId",
                                    placeholder: "",
                                    required: false,
                                    disabled: true,
                                    validationMessage: "Please enter the account number!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer name.",
                                    label: "FIRST NAME",
                                    fieldId: "firstName",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the name!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer name.",
                                    label: "LAST NAME",
                                    fieldId: "lastName",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the name!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                        </Row>

                        <Row>

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer store email.",
                                    label: "STORE EMAIL",
                                    fieldId: "storeEmail",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the store email!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer store website.",
                                    label: "STORE WEBSITE",
                                    fieldId: "storeWebsite",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the store email!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer store phone number.",
                                    label: "STORE PHONE NUMBER",
                                    fieldId: "storePhone",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the store phone number!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />
                        </Row>

                        <Row>
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer store cell phone number.",
                                    label: "CELL PHONE NUMBER",
                                    fieldId: "cellPhone",
                                    placeholder: "",
                                    required: false,
                                    disabled: isUpdateForm ? false : true,
                                    validationMessage: "Please enter the store cell phone number!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "Customer email.",
                                    label: "EMAIL",
                                    fieldId: "email",
                                    placeholder: "",
                                    required: false,
                                    disabled: (user?.userTypes.includes("SALES_MANAGER") || user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("CUSTOMER")) ? true : isUpdateForm ? false : true,
                                    validationMessage: "Please enter the email!"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />
                        </Row>

                    </Container>

                    <Container className='mt-3'>
                        <Tabs defaultActiveKey='auditTrail' activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                            {/* <Tab eventKey="address" title="Address" style={{ marginLeft: 8 }}>
                                <Card style={{ width: '100%' }}>
                                    <Card.Header>Address</Card.Header>
                                    <Card.Body className="card-scroll">
                                        <Table responsive striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th style={{ minWidth: "0.5rem" }}>#</th>
                                                    <th style={{ minWidth: "1rem" }}>IS BILLING</th>
                                                    <th style={{ minWidth: "1rem" }}>IS SHIPPING</th>
                                                    <th style={{ minWidth: "16rem" }}>LABLE</th>
                                                    <th style={{ minWidth: "16rem" }}>ADDRESSEE</th>
                                                    <th style={{ minWidth: "16rem" }}>CITY</th>
                                                    <th style={{ minWidth: "16rem" }}>ADDRESS 1</th>
                                                    <th style={{ minWidth: "16rem" }}>ADDRESS 2</th>
                                                    <th style={{ minWidth: "16rem" }}>COUNTRY</th>
                                                    <th style={{ minWidth: "16rem" }}>PIN</th>
                                                    <th style={{ minWidth: "16rem" }}>ADDRESS</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addressFields.map((field, index) => {
                                                    return (
                                                        <tr key={field.id} >
                                                            
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Check
                                                                        label=''
                                                                        type="checkbox"
                                                                        id="isBilling"
                                                                        name="isBilling"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.isBilling`)} />
                                                                </Form.Group>
                                                            </td>
                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Check
                                                                        label=''
                                                                        type="checkbox"
                                                                        id="isShipping"
                                                                        name="isShipping"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.isShipping`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>
                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="lable"
                                                                        name="lable"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.lable`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>
                                                            <td>
                                                                <Form.Group>
                                                                    <Form.Control
                                                                        type="text"
                                                                        id="addressee"
                                                                        name="addressee"
                                                                        // disabled
                                                                        // value={addressValueLineLevel[index]}
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.addressee`)}
                                                                    // onBlur={() => {
                                                                    //     const values = getValues();
                                                                    //     const v = formatAddress(values)
                                                                    //     setValue("address", v);
                                                                    // }}
                                                                    >
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="city"
                                                                        name="city"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.city`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="address1"
                                                                        name="address1"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.address1`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="address2"
                                                                        name="address2"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.address2`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="country"
                                                                        name="country"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.country`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        type="text"
                                                                        id="pin"
                                                                        name="pin"
                                                                        disabled={isEditMode ? false : true}
                                                                        {...register(`addresses.${index}.pin`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Form.Group >
                                                                    <Form.Control
                                                                        label=''
                                                                        as="textarea"
                                                                        rows={2}
                                                                        readOnly
                                                                        id="address"
                                                                        name="address"
                                                                        {...register(`addresses.${index}.address`)}
                                                                    />
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Button size="sm" variant="danger"
                                                                    onClick={() => {
                                                                        // let arr = [];
                                                                        // if (!isDefaultTick[index]) {
                                                                        //     isDefaultTick.splice(index, 1);
                                                                        //     setIsDefaultTickAdd(false);
                                                                        //     setCheckDefault(false)
                                                                        //     isDefaultTick.map(e => {
                                                                        //         arr.push(false);
                                                                        //     })
                                                                        //     setIsDefaultTick(arr);
                                                                        // } else {
                                                                        //     isDefaultTick.splice(index, 1);
                                                                        // }

                                                                        addressRemove(index);

                                                                        // const values = getValues();
                                                                        // const v = formatAddressByDefault(values);
                                                                        // console.log(v)
                                                                        // setAddressValue(v);
                                                                    }}
                                                                ><BsTrash /></Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                <tr>
                                                    <td colSpan="14">
                                                        <Button size="sm" style={{ minWidth: "8rem" }} onClick={() => addressAppend({ isBilling: false, isShipping: false, lable: '', addressee: '', country: '', city: '', pin: "", address1: '', address2: '', address: '' })} >Add a Address</Button>
                                                        
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card >
                            </Tab > */}

                            <Tab Tab eventKey="mediaLinks" title="Media Links" style={{ marginTop: 8 }
                            }>
                                <Container>
                                    <Row>
                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Customer facebook url.",
                                                label: "FACEBOOK URL",
                                                fieldId: "facebook",
                                                placeholder: "",
                                                required: false,
                                                disabled: isUpdateForm ? false : true,
                                                validationMessage: "Please enter the facebook url!"
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Customer instagram url.",
                                                label: "INSTAGRAM URL",
                                                fieldId: "instagram",
                                                placeholder: "",
                                                required: false,
                                                disabled: isUpdateForm ? false : true,
                                                validationMessage: "Please enter the instagram url!"
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Customer tiktok url.",
                                                label: "TIKTOK URL",
                                                fieldId: "tiktok",
                                                placeholder: "",
                                                required: false,
                                                disabled: isUpdateForm ? false : true,
                                                validationMessage: "Please enter the tiktok url!"
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Customer youtube url.",
                                                label: "YOUTUBE URL",
                                                fieldId: "youtube",
                                                placeholder: "",
                                                required: false,
                                                disabled: isUpdateForm ? false : true,
                                                validationMessage: "Please enter the youtube url!"
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />
                                    </Row>
                                </Container>
                            </Tab >

                            <Tab Tab eventKey="address" title="Address" style={{ marginTop: 8 }}>
                                <Container >
                                    {/* <Row>
                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Customer attention.",
                                                label: "ATTENTION",
                                                fieldId: "shippingAddress.attention",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Address 1",
                                                label: "ADDRESS 1",
                                                fieldId: "shippingAddress.address1",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Address 2.",
                                                label: "ADDRESS 2",
                                                fieldId: "shippingAddress.address2",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "City.",
                                                label: "CITY",
                                                fieldId: "shippingAddress.city",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                                validationMessage: "Please enter the youtube url!"
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Zip.",
                                                label: "ZIP",
                                                fieldId: "shippingAddress.zip",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "State.",
                                                label: "STATE",
                                                fieldId: "shippingAddress.state",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />

                                        <TextField
                                            register={register}
                                            errors={errors}
                                            field={{
                                                description: "Country.",
                                                label: "COUNTRY",
                                                fieldId: "shippingAddress.country",
                                                placeholder: "",
                                                required: false,
                                                disabled: isEditMode ? false : true,
                                            }}
                                            changeHandler={null}
                                            blurHandler={null}
                                        />
                                    </Row> */}

                                    <Card style={{ width: '100%', marginLeft: 0 }}>
                                        <Card.Header>Address</Card.Header>
                                        <Card.Body className="card-scroll">
                                            <Table responsive striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th style={{ minWidth: "1rem" }}>Edit</th>
                                                        <th style={{ minWidth: "1rem" }}>Billing</th>
                                                        <th style={{ minWidth: "1rem" }}>Shipping</th>
                                                        <th style={{ minWidth: "16rem" }}>Address</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {addressFields.map((field, index) => {
                                                        return (
                                                            <tr key={field.id} >
                                                                <td>
                                                                    <Button style={{ minWidth: "4rem" }} size="sm"
                                                                        disabled={isUpdateForm ? false : true}
                                                                        onClick={e => {
                                                                            handleShow(true);
                                                                            // console.log(field)
                                                                            setIsEditMode(true);
                                                                            setEditAddressModalState(field);
                                                                            setEditAddressModalIndex(index);
                                                                        }}><BsBoxArrowInUpRight /></Button>
                                                                </td>

                                                                <td>
                                                                    <Form.Group >
                                                                        <Form.Check
                                                                            label=''
                                                                            type="checkbox"
                                                                            id="isDefaultBilling"
                                                                            name="isDefaultBilling"
                                                                            disabled
                                                                            {...register(`addresses.${index}.isDefaultBilling`)} />
                                                                    </Form.Group>
                                                                </td>
                                                                <td>
                                                                    <Form.Group >
                                                                        <Form.Check
                                                                            label=''
                                                                            type="checkbox"
                                                                            id="isDefaultShipping"
                                                                            name="isDefaultShipping"
                                                                            disabled
                                                                            {...register(`addresses.${index}.isDefaultShipping`)}
                                                                        />
                                                                    </Form.Group>
                                                                </td>
                                                                {/* <td>
                                                                    <Form.Group >
                                                                        <Form.Check
                                                                            label=''
                                                                            type="checkbox"
                                                                            id="default"
                                                                            name="default"
                                                                            // disabled={!checkDefaultArr[index]}
                                                                            // disabled={isDefaultTick[index]}
                                                                            disabled
                                                                            {...register(`addresses.${index}.default`)}
                                                                            onChange={e => {
                                                                                // console.log(e.target.checked);
                                                                                setCheckDefault(e.target.checked)
                                                                                const currentValue = e.target.checked;
                                                                                setValue(`addresses.${index}.default`, currentValue);
                                                                                const values = getValues();

                                                                                const v = formatAddressByDefault(values);
                                                                                // console.log(v)
                                                                                setAddressValue(v);

                                                                                let shippingArr = [];
                                                                                for (var i = 0; i < values.addresses.length; i++) {
                                                                                    if (i === index) {
                                                                                        currentValue ? shippingArr[i] = !currentValue : shippingArr[i] = currentValue;
                                                                                        setIsDefaultTickAdd(currentValue);
                                                                                    } else {
                                                                                        shippingArr[i] = currentValue;
                                                                                    }
                                                                                }
                                                                                // console.log(shippingArr);
                                                                                setIsDefaultTick(shippingArr);
                                                                            }}
                                                                        />
                                                                    </Form.Group>
                                                                </td> */}

                                                                <td>
                                                                    <Form.Group>
                                                                        <Form.Control className='scroll scroll4' size='sm'
                                                                            as="textarea"
                                                                            rows={3}
                                                                            id="address"
                                                                            name="address"
                                                                            disabled
                                                                            // value={addressValueLineLevel[index]}
                                                                            {...register(`addresses.${index}.address`)}
                                                                            onChange={null}
                                                                        >
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                </td>

                                                                <td>
                                                                    <Button size="sm" variant="danger"
                                                                        disabled={isUpdateForm ? false : true}
                                                                        onClick={() => {
                                                                            let arr = [];
                                                                            if (!isDefaultTick[index]) {
                                                                                isDefaultTick.splice(index, 1);
                                                                                setIsDefaultTickAdd(false);
                                                                                setCheckDefault(false)
                                                                                isDefaultTick.map(e => {
                                                                                    arr.push(false);
                                                                                })
                                                                                setIsDefaultTick(arr);
                                                                            } else {
                                                                                isDefaultTick.splice(index, 1);
                                                                            }

                                                                            addressRemove(index);

                                                                            const values = getValues();
                                                                            const v = formatAddressByDefault(values);
                                                                            // console.log(v)
                                                                            setAddressValue(v);
                                                                        }}
                                                                    ><BsTrash /></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    <tr>
                                                        <td colSpan="14">
                                                            {/* <Button size="sm" style={{ minWidth: "8rem" }} onClick={() => addressAppend({ billing: false, shipping: false, label: '', country: '', state: '', zip: "" })} >Add a Address</Button> */}
                                                            <Button size="sm" style={{ minWidth: "8rem" }}
                                                                disabled={isUpdateForm ? false : true}
                                                                onClick={() => {
                                                                    handleShow(true);
                                                                    setIsEditMode(false);
                                                                    console.log(checkDefault);
                                                                    setEditAddressModalState([])
                                                                }} >Add a Address</Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Container>
                            </Tab >

                            <Tab Tab eventKey="invoices" title="Invoices" style={{ marginTop: 8 }
                            }>
                                <Container>
                                    <Row className=''>
                                        <div className='p-0 m-0' style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <input type="text" className="openning-cash-control__amount--input p-0 m-0 w-25" style={{ border: "none", borderBottom: "1px solid gray" }} placeholder="Search..." onChange={handleSearch}></input>
                                        </div>
                                        <div className={`ag-theme-alpine scroll scroll4 p-0 mt-3 ${division === "NORTHCOTT" ? 'ag-theme-alpine-n scroll scroll4' : division === "BANYAN BATIKS" ? "ag-theme-alpine-b scroll scroll4" : "ag-theme-alpine-p scroll scroll4"}`} style={{ height: 460, width: "100%" }}>
                                            <AgGridReact
                                                onGridReady={onGridReady}
                                                rowData={invoices}
                                                columnDefs={columns}
                                                defaultColDef={{
                                                    editable: true,
                                                    sortable: true,
                                                    // flex: 1,
                                                    minWidth: 100,
                                                    filter: true,
                                                    resizable: true,
                                                }}
                                                pagination={true}
                                                paginationPageSize={50}

                                                // overlayNoRowsTemplate="No Purchase Order found. Let's create one!"
                                                overlayNoRowsTemplate='<span style="color: rgb(128, 128, 128); font-size: 2rem; font-weight: 100;">No Records Found!</span>'
                                            />
                                        </div>
                                    </Row>
                                </Container>
                            </Tab >

                        </Tabs >

                        <Address
                            state={editAddressModalState}
                            isEditMode={isEditMode}
                            show={showAddressModal}
                            handleShow={(e) => handleShow(e)}
                            addressAppend={addressAppend}
                            checkDefault={checkDefault}
                            addressFields={addressFields}
                            isDefaultTick={isDefaultTick}
                            setIsDefaultTick={setIsDefaultTick}
                            setCountry={setCountry}
                            country={country}
                            isDefaultTickAdd={isDefaultTickAdd}
                            setIsDefaultTickAdd={setIsDefaultTickAdd}
                            setCheckDefault={setCheckDefault}
                            setAddressValue={setAddressValue}
                            addressValueLineLevel={addressValueLineLevel}
                            setAddressValueLineLevel={setAddressValueLineLevel}
                            editAddressModalIndex={editAddressModalIndex}
                            addressUpdate={addressUpdate}
                            addressInsert={addressInsert}
                            addressRemove={addressRemove}
                        />
                    </Container >

                </AppContentBody >
                {/* </Form>*/}
            </AppContentForm >

        )
    }
}
