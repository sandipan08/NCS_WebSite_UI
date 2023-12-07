import React, { useContext, useEffect, useState } from 'react'
import { Form, Button, Container, Alert, Col, OverlayTrigger, Popover, Card } from 'react-bootstrap'
// import CustomSelectField from '../../components/elements/CustomSelectField';
import ApiService from '../../helpers/ApiServices';
import { useForm } from 'react-hook-form'
import TextField from '../../components/elements/fields/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import PasswordStrengthBar from 'react-password-strength-bar';
import validator from 'validator';
import Tippy from '@tippyjs/react';
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import { UserContext } from '../../states/contexts/UserContext';

export default function ChangePassword() {
    const [showError, setShowError] = useState(false);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [pass, setpass] = useState('')
    const [isHasSymbol, setisHasSymbol] = useState(false)
    const [isEightCharacterLong, setisEightCharacterLong] = useState(false)
    const [isHasUppercase, setisHasUppercase] = useState(false)
    const [isHasLowercase, setisHasLowercase] = useState(false)

    const { backgroundColor, color, darkBackgroundColor } = useContext(BrandIconContext)
    const { user } = useContext(UserContext)


    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    const onSubmit = (formData) => {
        // console.log(getModelRoute(user).model);
        setShowError(false);
        return updatePasswordHander(formData);
    }

    const updatePasswordHander = (data) => {
        console.log(data)
        console.log("Cust id", id)

        if (data.password == data.passwordConfirm) {
            if (id) {

                ApiService.patch(`shop/user/updateCustomerPassword/${id}`, data).then(response => {
                    console.log(response);

                    if (response.data.isSuccess) {
                        showMessage("Password update successfull.", "success")
                        navigate('/customer-profile')
                    } else {
                        // console.log(response?.data.message)
                        // showMessage(response?.data.message, "error")
                    }

                }).catch(error => {

                    console.log(error.response.data)
                    // console.log("Else Catch")
                    showMessage(error.response.data.message, "error")

                })

            } else {
                ApiService.patch(`shop/user/updatePassword?model=${getModelRoute(user).model}`, data).then(response => {
                    console.log(response);

                    if (response.data.isSuccess) {
                        showMessage("Password update successfull.", "success")
                        navigate('/profile')
                    } else {
                        // console.log(response?.data.message)
                        // showMessage(response?.data.message, "error")
                    }

                }).catch(er => {
                    console.log(er.response.data.message)
                    // setShowError(true);
                    showMessage(er.response.data.message, "error")
                })
            }
        } else {
            showMessage("Passwords are not the same!", "warning")
        }
    }

    const validate = (value) => {

        // if (validator.isStrongPassword(value, {
        //     minLength: 8, minLowercase: 1,
        //     minUppercase: 1, minSymbols: 1
        // })) {
        //     setErrorMessage('Strong Password')
        // } else {
        //     setErrorMessage('Not Strong Password')
        // }

        setisHasUppercase(/[A-Z]/.test(value))
        setisHasLowercase(/[a-z]/.test(value))
        setisEightCharacterLong(value.length >= 8)
        setisHasSymbol(/[!@#$%^&*]/.test(value))


    }


    return (
        <Container>

            <Alert show variant="info">
                <h3>By changing your password on Northcott.com, it will also change on figofabrics.com</h3>
            </Alert>

            <Form onSubmit={handleSubmit(onSubmit)}>
                {id ? "" :
                    <TextField
                        register={register}
                        errors={errors}
                        field={{
                            description: "Please provide us your current password.",
                            label: "CURRENT PASSWORD",
                            fieldId: "passwordCurrent",
                            type: "password",
                            placeholder: "",
                            required: true,
                            validationMessage: "Please enter the current password!"
                        }}
                        changeHandler={null}
                        blurHandler={null}
                    />}

                {/* <TextField
                    register={register}
                    errors={errors}
                    field={{
                        description: "Please provide your password which you want to set.",
                        label: "NEW PASSWORD",
                        fieldId: "password",
                        type: "password",
                        placeholder: "",
                        required: true,
                        validationMessage: "Please enter the password!"
                    }}
                    changeHandler={(e, data) => { validate(e.target.value) }}
                    blurHandler={null}
                    focusHandler={setShow(true)}
                /> */}
                <Form.Group as={Col} md="4" className="mb-2">
                    <OverlayTrigger trigger="click" rootClose placement="auto" overlay={<Popover id="popover-basic">
                        <Popover.Header as="h3">Field Description</Popover.Header>
                        <Popover.Body>
                            Please provide your password which you want to set.
                        </Popover.Body>
                    </Popover>}>
                        <Form.Label className="m-0" style={{ fontSize: "12px" }}>NEW PASSWORD</Form.Label>
                    </OverlayTrigger>

                    <Form.Control size='sm' style={{ maxWidth: '400px' }} // input
                        // readOnly={isViewMode}
                        // plaintext={isViewMode}
                        disabled={false}
                        type={"password"}
                        // id={"password"}
                        // name={"password"}
                        // value={pass}
                        placeholder={""}
                        {...register(`password`)}
                        // onChange={(e, data) => setpass(e.target.value)}
                        onKeyUp={(e, data) => { validate(e.target.value) }}
                        onFocus={() => setShow(true)}
                        onBlur={() => setShow(false)}
                    />
                </Form.Group>

                {show && <PasswordStrengthCheck isEightCharacterLong={isEightCharacterLong} isHasLowercase={isHasLowercase} isHasUppercase={isHasUppercase} isHasSymbol={isHasSymbol} />}
                {/* {errorMessage === '' ? null :
                    <span style={{
                        marginLeft: errorMessage.includes("Not") ? '250px' : '280px',
                        marginTop: "1px",
                        fontWeight: 'bold',
                        fontSize: '12px',
                        color: errorMessage.includes("Not") ? 'red' : 'green',
                    }}>{errorMessage}</span>} */}

                <TextField
                    register={register}
                    errors={errors}
                    field={{
                        description: "Please provide your password again.",
                        label: "CONFIRM PASSWORD",
                        fieldId: "passwordConfirm",
                        type: "password",
                        placeholder: "",
                        required: true,
                        validationMessage: "Please enter the password again!"
                    }}
                    changeHandler={null}
                    blurHandler={null}
                />

                {/* {(isEightCharacterLong && isHasLowercase && isHasUppercase && isHasSymbol) && <Button type="submit">Submit</Button>} */}
                <Button className='mt-2 animet_btton' type="submit" disabled={(isEightCharacterLong && isHasLowercase && isHasUppercase && isHasSymbol) ? false : true} style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%,${darkBackgroundColor} 100%)`, border: "none" }}>Submit</Button>
            </Form>
        </Container>
    )
}



const PasswordStrengthCheck = ({ isEightCharacterLong, isHasLowercase, isHasUppercase, isHasSymbol }) => {

    return (
        <Card style={{ maxWidth: "380px", padding: "5px", zIndex: 1, position: "absolute" }}>
            <p className={isEightCharacterLong ? "valid" : "invalid"}>
                {isEightCharacterLong ? <span style={{ color: "green" }}><IoCheckmark /></span> : <span style={{ color: "red" }}><IoCloseOutline /></span>} <span> Should consist of a minimum of 8 characters </span>
            </p>
            <p className={isHasUppercase ? "valid" : "invalid"}>
                {isHasUppercase ? <span style={{ color: "green" }}><IoCheckmark /></span> : <span style={{ color: "red" }}><IoCloseOutline /></span>} <span> Should include capital latters </span>
            </p>
            <p className={isHasLowercase ? "valid" : "invalid"}>
                {isHasLowercase ? <span style={{ color: "green" }}><IoCheckmark /></span> : <span style={{ color: "red" }}><IoCloseOutline /></span>} <span> Should include lowercase latters </span>
            </p>
            <p className={isHasSymbol ? "valid" : "invalid"}>
                {isHasSymbol ? <span style={{ color: "green" }}><IoCheckmark /></span> : <span style={{ color: "red" }}><IoCloseOutline /></span>} <span> Should include at least one special characte </span>
            </p>
        </Card>
    )
}
