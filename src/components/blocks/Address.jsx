import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import ApiService from '../../helpers/ApiServices';
import { formatAddressNew, formatAddr, getModelRoute } from '../../helpers/Utils';
import ConditionalObjectSelectField from '../elements/fields/ConditionalObjectSelectField';
import ObjectSelectField from '../elements/fields/ObjectSelectField';
import TextField from '../elements/fields/TextField';
import { UserContext } from '../../states/contexts/UserContext';


export default function Address({ state, setCountry, country, addressFields, isEditMode, show, handleShow, addressAppend, checkDefault, setCheckDefault, isDefaultTick, isDefaultTickAdd, setIsDefaultTickAdd, setIsDefaultTick, setAddressValue, addressValueLineLevel, setAddressValueLineLevel, editAddressModalIndex, addressUpdate, addressInsert, addressRemove }) {
    // const [country, setCountry] = useState("");
    const [states, setStates] = useState([]);
    const [regions, setRegions] = useState([]);

    const { dispatch, user } = useContext(UserContext)


    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
    });


    const getAllRegions = async () => {
        let regionArray = [];

        ApiService.setHeader()
        const response = await ApiService.get(`admin/customList/title?title=${country}&model=${getModelRoute(user).model}`)
        setRegions(response?.data.document?.options)
    }


    useEffect(() => {

        if (isEditMode) {
            reset(state);
        } else {
            reset({ isDefaultShipping: false, isDefaultBilling: false, attention: "", address1: "", address2: "", address3: "", addressee: "", addressPhone: "", city: "", zip: "", state: "", country: "", });
        }

    }, [state])

    useEffect(() => {
        getAllRegions()
        let c = getValues().country?.text
        setCountry(c == "United States" ? "NCS US STATE LIST" : "NCS CA STATE LIST")

    }, [country])


    // Use field array 

    const handleAddressAppend = () => {
        const data = getValues();
        data.address = formatAddr(data)
        // console.log(data)

        if (data.default) {
            const v = formatAddr(data)
            setAddressValue(v);
        }

        let arr = [];
        if (data.default) {
            if (isDefaultTick.length === 0) {
                setCheckDefault(true);
                setIsDefaultTickAdd(true)
            }
            isDefaultTick.map(e => {
                arr.push(true);
            })
            arr.push(!data.default);
            setIsDefaultTick(arr);
        } else {
            if (checkDefault) {
                let newArr = [...isDefaultTick];
                newArr.push(!data.default);
                setIsDefaultTick(newArr);
            } else {
                let newArr = [...isDefaultTick];
                newArr.push(isDefaultTickAdd);
                setIsDefaultTick(newArr);
            }
        }

        const addressArr = [...addressValueLineLevel];
        const formatAddressLineLevel = formatAddr(data)
        addressArr.push(formatAddressLineLevel);
        setAddressValueLineLevel(addressArr);

        addressAppend(data);
        handleShow(false);
        reset({ isDefaultShipping: false, isDefaultBilling: false, attention: "", address1: "", address2: "", address3: "", addressee: "", addressPhone: "", city: "", zip: "", state: "", country: "", });
    }


    const handleAddressUpdate = () => {
        const data = getValues();
        delete data.address
        // console.log(data);
        data.address = formatAddr(data)
        // console.log(data)

        if (data.default) {
            const v = formatAddr(data)
            setAddressValue(v);
        }

        let addressArr = [...addressValueLineLevel];
        const formatAddressLineLevel = formatAddr(data);
        addressArr[editAddressModalIndex] = formatAddressLineLevel;
        setAddressValueLineLevel(addressArr);

        // console.log(editAddressModalIndex);
        addressInsert(editAddressModalIndex, data);
        addressRemove(editAddressModalIndex + 1);
        handleShow(false);
        reset({ isDefaultShipping: false, isDefaultBilling: false, attention: "", address1: "", address2: "", address3: "", addressee: "", addressPhone: "", city: "", zip: "", state: "", country: "", });
    }


    return (

        <Modal show={show} centered onHide={() => handleShow(false)} size="lg">
            <Modal.Header className=' w-100' closeButton >
                <Modal.Title>Address</Modal.Title>
            </Modal.Header>
            <Form >
                <Modal.Body>
                    <Row>
                        <Col className='col-md-6 col-lg-6'>
                            <Form.Group style={{ display: 'flex', flexDirection: 'row' }}>
                                <Form.Check
                                    size="sm"
                                    type="checkbox"
                                    id="isDefaultBilling"
                                    name="isDefaultBilling"
                                    {...register(`isDefaultBilling`)} />
                                <Form.Label style={{ marginLeft: '1rem' }}>BILLING</Form.Label>
                            </Form.Group>
                            <Form.Group style={{ display: 'flex', flexDirection: 'row' }}>
                                <Form.Check
                                    size="sm"
                                    type="checkbox"
                                    id="isDefaultShipping"
                                    name="isDefaultShipping"
                                    {...register(`isDefaultShipping`)}
                                />
                                <Form.Label style={{ marginLeft: '1rem' }}>SHIPPING</Form.Label>
                            </Form.Group>
                            {/* <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="country"
                                    name="country"
                                    {...register(`country`)}
                                ></Form.Control>
                            </Form.Group> */}
                            <ObjectSelectField
                                control={control}
                                errors={errors}
                                field={{
                                    description: "All country",
                                    label: "COUNTRY",
                                    fieldId: "country",
                                    placeholder: "",
                                    placedIn: "modal",
                                    multiple: false,
                                    required: false,
                                    // validationMessage: "",
                                    selectRecordType: "admin/customList/title?title=NCS COUNTRY LIST",
                                }}
                                changeHandler={(data, e) => {
                                    if (data?.length) {
                                        setCountry(data[0]?.text == "United States" ? "NCS US STATE LIST" : "NCS CA STATE LIST")
                                    }
                                }}
                            />
                            {/* <Form.Group>
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="state"
                                    name="state"
                                    {...register(`state`)}
                                ></Form.Control>

                            </Form.Group> */}
                            <ConditionalObjectSelectField
                                control={control}
                                errors={errors}
                                states={regions}
                                field={{
                                    description: "All state",
                                    label: "STATE",
                                    fieldId: "state",
                                    placeholder: "",
                                    placedIn: "modal",
                                    multiple: false,
                                    required: false,
                                    // validationMessage: "",
                                    selectRecordType: `modal`,
                                }}
                                changeHandler={null}
                            />
                            {/* <Form.Group>
                                <Form.Label className="m-0">City</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="city"
                                    name="city"
                                    {...register(`city`)}

                                >
                                </Form.Control>
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "CITY",
                                    label: "CITY",
                                    fieldId: "city",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            {/* <Form.Group>
                                <Form.Label className="m-0">Zip</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    {...register(`zip`)}

                                />
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ZIP",
                                    label: "ZIP",
                                    fieldId: "zip",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            {/* <Form.Group>
                                <Form.Label className="m-0">Address Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="addressPhone"
                                    name="addressPhone"
                                    {...register(`addressPhone`)}

                                />
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ADDRESSPHONE",
                                    label: "ADDRESS PHONE",
                                    fieldId: "addressPhone",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                        </Col>
                        <Col className='col-md-6 col-lg-6'>
                            {/* <Form.Group style={{ display: 'flex', flexDirection: 'row' }}>
                                <Form.Check
                                    type="checkbox"
                                    id="default"
                                    name="default"
                                    disabled={checkDefault}
                                    {...register(`default`)}

                                />
                                <Form.Label style={{ marginLeft: '1rem' }}>DEFAULT</Form.Label>
                            </Form.Group> */}

                            {/* <Form.Group>
                                <Form.Label className="m-0">Attention</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="attention"
                                    name="attention"
                                    {...register(`attention`)}
                                >
                                </Form.Control>
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ATTENTION",
                                    label: "ATTENTION",
                                    fieldId: "attention",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            {/* <Form.Group>
                                <Form.Label className="m-0">Address 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="address1"
                                    name="address1"
                                    {...register(`address1`)}

                                >
                                </Form.Control>
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ADDRESS1",
                                    label: "ADDRESS1",
                                    fieldId: "address1",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            {/* <Form.Group>
                                <Form.Label className="m-0">Address 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="address2"
                                    name="address2"
                                    {...register(`address2`)}

                                >
                                </Form.Control>
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ADDRESS2",
                                    label: "ADDRESS2",
                                    fieldId: "address2",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                            {/* <Form.Group>
                                <Form.Label className="m-0">Addressee</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="addressee"
                                    name="addressee"
                                    {...register(`addressee`)}

                                >
                                </Form.Control>
                            </Form.Group> */}
                            <TextField
                                register={register}
                                errors={errors}
                                field={{
                                    description: "ADDRESSEE",
                                    label: "ADDRESSEE",
                                    fieldId: "addressee",
                                    placeholder: "",
                                    placedIn: "modal"
                                }}
                                changeHandler={null}
                                blurHandler={null}
                            />

                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size='sm' onClick={() => {
                        setValue("country", state.country)
                        setValue("state", state.state)
                        handleShow(false)

                    }}>
                        Cancel
                    </Button>
                    {isEditMode ? <Button onClick={handleAddressUpdate} size='sm' variant="primary">
                        Update
                    </Button> : <Button onClick={handleAddressAppend} size='sm' variant="primary">
                        Add
                    </Button>}
                </Modal.Footer>
            </Form>
        </Modal>

    );
}



