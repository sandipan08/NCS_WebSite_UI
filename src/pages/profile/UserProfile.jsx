import { React, useContext, useEffect, useState } from 'react'
import { Container, Button, Col, Row, DropdownButton, Dropdown, ButtonGroup, Modal, Tabs, Tab, Breadcrumb, Card, Table, Form } from 'react-bootstrap'
import { BsBoxArrowInUpRight, BsTrash } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../states/contexts/CustomerContext'
import { UserContext } from '../../states/contexts/UserContext'
import TextField from '../../components/elements/fields/TextField'
import { useFieldArray, useForm } from 'react-hook-form'
import ApiService from '../../helpers/ApiServices'
import { showMessage } from '../../helpers/Utils'
import AppContentForm from '../../components/elements/builders/AppContentForm'
import AppContentHeader from '../../components/elements/builders/AppContentHeader'
import AppContentBody from '../../components/elements/builders/AppContentBody'

export default function UserProfile() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [tabKey, setTabKey] = useState('mediaLinks');

    const navigate = useNavigate()

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)

    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm();
    const { append: addressAppend, remove: addressRemove, fields: addressFields, update: addressUpdate, insert: addressInsert } = useFieldArray({ control, name: "addresses" });

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))


    const onSubmit = async (formData) => {
        let id;

        if (user?.userTypes.includes("CUSTOMER")) {
            id = user?._id
        } else {
            id = user?.testCustomerId?._id
            // console.log(user);
        }

        console.log(formData);
        // return isAddMode
        //     ? createDocument(formData)
        //     : updateDocument(id, formData);

        return updateDocument(id, formData)
        // }
    }

    const updateDocument = async (id, data) => {
        await ApiService.patch(`shop/user/${id}`, data).then(response => {
            if (response.data.isSuccess) {
                let document = response.data.document

                reset(document)
                setIsEditMode(false)
                showMessage("Profile updated successfully 😃", "success")
                navigate(`/`)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const isLoggedIn = async () => {
        ApiService.setHeader()
        await ApiService.get(`shop/user/loggedIn`).then(response => {
            console.log(response.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data.document });

            // reset(response?.data.document)

        }).catch(error => {

            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")

        })

    }

    const setSelectedCustomer = () => {

        // if (user?.userTypes.includes("CUSTOMER")) {
        //     reset(user)
        // } else {
        reset(customers[customers?.length - 1])

        ApiService.setHeader()
        ApiService.get(`shop/user/${customers?.length ? customers[customers?.length - 1]._id : user?._id}`).then(response => {

            if (response.data.isSuccess) {
                let customer = response?.data.document

                // Load the selected customer into reducer
                customerDispatch({ type: "SELECT_CUSTOMER", payload: response.data.document });

                // Set customer data into field's
                reset(customer)
            }
        }).catch(error => {

            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")

        })
        // }
    }

    const toggleHandler = () => {
        setIsEditMode(!isEditMode)
    }


    useEffect(() => {

        isLoggedIn()
        setSelectedCustomer()
    }, []);

    return (

        <AppContentForm onSubmit={handleSubmit(onSubmit)}>

            <AppContentHeader>
                <Container className='mb-2' style={{ marginBottom: "-20px", marginLeft: "180px" }}><h3>USER PROFILE PAGE</h3></Container>
                <Container  >
                    <Row >
                        {/* {(user?.userTypes.includes("CUSTOMER") || customer?.isTestAccount) ?  */}
                        {((user?.userTypes.includes("CUSTOMER") && customers[customers?.length - 1]?.email == user?.email) || (!user?.userTypes.includes("CUSTOMER") && customers[customers?.length - 1]?._id == user?.testCustomerId._id)) ?
                            <Col className='p-0 ps-1 mt-5' style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>

                                <Button type="submit" size="sm" className='m-2' variant='primary' disabled={isEditMode ? false : true} style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>SUBMIT</Button>

                                <Form.Check checked={isEditMode} onChange={toggleHandler} size="sm" type="switch" id="custom-switch" label={isEditMode ? "Edit" : "View"} />

                                {customer?.isTestAccount ? <Button size="sm" as={Link} to={'/update-password'} className='m-2' variant='primary' style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>UPDATE PASSWORD</Button> : ""}
                            </Col> : ""}
                    </Row>
                </Container>
            </AppContentHeader >

            <AppContentBody>
                <Container >

                    <Row>
                        <TextField
                            register={register}
                            errors={errors}
                            field={{
                                description: "Customer account number.",
                                label: "ACCOUNT NUMBER",
                                fieldId: "accountnumber",
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
                                disabled: isEditMode ? false : true,
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
                                disabled: isEditMode ? false : true,
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
                                description: "Customer email.",
                                label: "EMAIL",
                                fieldId: "email",
                                placeholder: "",
                                required: false,
                                disabled: isEditMode ? false : true,
                                validationMessage: "Please enter the email!"
                            }}
                            changeHandler={null}
                            blurHandler={null}
                        />

                        <TextField
                            register={register}
                            errors={errors}
                            field={{
                                description: "Customer store email.",
                                label: "STORE EMAIL",
                                fieldId: "storeEmail",
                                placeholder: "",
                                required: false,
                                disabled: isEditMode ? false : true,
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
                                disabled: isEditMode ? false : true,
                                validationMessage: "Please enter the store email!"
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
                                description: "Customer store phone number.",
                                label: "STORE PHONE NUMBER",
                                fieldId: "storePhone",
                                placeholder: "",
                                required: false,
                                disabled: isEditMode ? false : true,
                                validationMessage: "Please enter the store phone number!"
                            }}
                            changeHandler={null}
                            blurHandler={null}
                        />

                        <TextField
                            register={register}
                            errors={errors}
                            field={{
                                description: "Customer store cell phone number.",
                                label: "CELL PHONE NUMBER",
                                fieldId: "cellPhone",
                                placeholder: "",
                                required: false,
                                disabled: isEditMode ? false : true,
                                validationMessage: "Please enter the store cell phone number!"
                            }}
                            changeHandler={null}
                            blurHandler={null}
                        />

                    </Row>


                </Container>

                <Container >
                    <Tabs defaultActiveKey='auditTrail' activeKey={tabKey} onSelect={(k) => setTabKey(k)}>

                        < Tab eventKey="mediaLinks" title="Media Links" style={{ marginLeft: 0, marginTop: 8 }}>
                            <Container >
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
                                            disabled: isEditMode ? false : true,
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
                                            disabled: isEditMode ? false : true,
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
                                            disabled: isEditMode ? false : true,
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
                                            disabled: isEditMode ? false : true,
                                            validationMessage: "Please enter the youtube url!"
                                        }}
                                        changeHandler={null}
                                        blurHandler={null}
                                    />
                                </Row>
                            </Container>
                        </Tab>
                    </Tabs >

                    {/* <Address
                    state={editAddressModalState}
                    isEditMode={isEditMode}
                    show={showAddressModal}
                    handleShow={(e) => handleShow(e)}
                    addressAppend={addressAppend}
                    checkDefault={checkDefault}
                    addressFields={addressFields}
                    isDefaultTick={isDefaultTick}
                    setIsDefaultTick={setIsDefaultTick}
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
                /> */}
                </Container >

            </AppContentBody >

        </AppContentForm >
    )
}
