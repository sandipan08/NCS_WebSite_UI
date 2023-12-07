import React, { useContext, useEffect, useState } from 'react'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import CustomSelectField from '../../components/elements/fields/CustomSelectField';
import ApiService from '../../helpers/ApiServices';
import { useForm } from 'react-hook-form'
import TextField from '../../components/elements/fields/TextField';
import { useNavigate } from 'react-router-dom';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import { UserContext } from '../../states/contexts/UserContext';

export default function ForgotPassword() {
    const { backgroundColor, color, darkBackgroundColor } = useContext(BrandIconContext)
    const { user } = useContext(UserContext)

    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (formData) => {
        return forgotPasswordHander(formData);
    }

    const forgotPasswordHander = (email) => {
        console.log(email)
        ApiService.post(`shop/user/forgotPassword?model=${getModelRoute(user).model}`, email).then(response => {
            console.log(response);

            if (response.data.isSuccess) {
                // showMessage("A reset link is sent to given email. Please check your mail and click on reset link button.", "info")
                showMessage(response.data.message, "info")
                navigate('/')
            } else {
                // console.log(response?.data.message)
                // showMessage(response?.data.message, "error")
            }

        }).catch(err => {
            showMessage(err.response.data.message, "error")
        })
    }

    return (
        <Container>
            <Alert show={true} variant="info">
                <h4> If you need assistance recovering or creating an account, please call or email the below contacts:</h4>

                <h6> Northcott Canada: info@northcott.com 905-760-0072 </h6>
                <h6> Northcott USA: info2@northcott.com 201-672-9600 </h6>
            </Alert>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    register={register}
                    errors={errors}
                    field={{
                        description: "Please provide us your registered email address.",
                        label: "REGISTERED EMAIL",
                        fieldId: "email",
                        placeholder: "",
                        required: true,
                        validationMessage: "Please enter the email of the registered user!"
                    }}
                    changeHandler={null}
                    blurHandler={null}
                />
                <Button className='mt-2 animet_btton' type="submit" style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%,${darkBackgroundColor} 100%)`, border: "none" }}>Submit</Button>
            </Form>
        </Container>
    )
}
