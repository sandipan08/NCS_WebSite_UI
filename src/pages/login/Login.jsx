import { React, useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Container, Form } from 'react-bootstrap'
import { UserContext } from '../../states/contexts/UserContext'
import ApiService from '../../helpers/ApiServices'
import { TokenService } from '../../helpers/StorageServices';
import TextField from '../../components/elements/fields/TextField'
import { showMessage } from '../../helpers/Utils'
import { CustomerContext } from '../../states/contexts/CustomerContext'
import CheckboxField from '../../components/elements/fields/CheckboxField'
import { BrandIconContext } from '../../states/contexts/BrandIconContext'


export default function Login() {
    const [show, setShow] = useState(false);
    const [errorShow, seterrorShow] = useState("Your email or password is incorrect! Please try again.");

    const { dispatch, user } = useContext(UserContext)
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { backgroundColor, color, darkBackgroundColor } = useContext(BrandIconContext)

    const navigate = useNavigate();
    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({});


    const onSubmit = async (e) => {
        let model, route

        e.preventDefault();
        const dataArr = [...new FormData(e.currentTarget)];
        const data = Object.fromEntries(dataArr);

        // console.log(data)
        try {
            setShow(false)
            dispatch({ type: "LOGIN_START" });

            const response = await ApiService.post('/shop/user/login', data);
            // console.log(response.data);

            if (response.data.isSuccess) {
                const assignedWebsiteAccess = response?.data.document?.assignedWebsiteAccess.filter(e => e.text == "NORTHCOTT")[0]

                // if (response?.data.document?.giveWebsiteAccess && assignedWebsiteAccess != undefined) { // Check if the brand type is NORTHCOTT or not
                if (assignedWebsiteAccess != undefined) { // Check if the brand type is NORTHCOTT or not

                    // Save the logged in user's token into lokalstorage
                    TokenService.saveToken(response.data.token)

                    const user = response.data.document;
                    console.log(user);

                    // Find model and route
                    if (user?.userTypes.includes("CUSTOMER")) {
                        model = "Customer"
                        route = "customer"
                    } else {
                        model = "User"
                        route = "user"
                    }

                    ApiService.setHeader()
                    // const res = await ApiService.patch(`/shop/user/${user?._id}?updatedFrom=website`, data.savePassword == "on" ? { savePassword: true } : { savePassword: false });
                    const res = await ApiService.patch(`/shop/${route}/${user?._id}?model=${model}&updatedFrom=website`, data.savePassword == "on" ? { savePassword: true } : { savePassword: false });

                    if (res.data.isSuccess) {

                        if (!user?.userTypes.includes("CUSTOMER")) getTestAccount(user)

                        if (res?.data.document.active) {

                            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.document });
                            // customerDispatch({ type: "SELECT_CUSTOMER", payload: res.data.document });

                            if (user.userTypes.includes("CUSTOMER")) {
                                let array = []
                                array.push(user)

                                // Push empty array into local storage
                                localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))

                                // Load the selected customer into reducer
                                customerDispatch({ type: "SELECT_CUSTOMER", payload: user });


                                showMessage("You have successfully logged in!", "success")
                                navigate('/')
                            } else {
                                showMessage("You have successfully logged in!. Please select region and customer.", "success")
                                navigate("/region-customer")

                            }


                        } else {
                            // console.log("Else")
                            setShow(true)
                            showMessage("This user does not have the access to login. Please contact with administrator.", "warning")
                            // alert("this user does not have the access to login. Please contact with administrator.")
                        }
                    }
                } else {
                    showMessage("You do not have the access to login!", "worning")
                }
            }



        } catch (error) {
            console.log(error.response?.data)
            // console.log("Else Catch")
            showMessage(error.response?.data.message, "error")
            setShow(true)
            dispatch({ type: "LOGIN_FAILURE" });

        }
    }

    const getTestAccount = async (user) => {
        let array = []
        const customer = user?.testCustomerId
        // console.log(customer);
        array.push(customer)

        // Push test customer into local storage
        localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))

        if (user?.testCustomerId) customerDispatch({ type: "SELECT_CUSTOMER", payload: customer });
    }



    return (
        <Container>

            <Form onSubmit={onSubmit}>
                <TextField
                    register={register}
                    errors={errors}
                    field={{
                        description: "Please provide us your registered email address.",
                        label: "REGISTERED EMAIL",
                        fieldId: "email",
                        type: "email",
                        placeholder: "",
                        required: true,
                        validationMessage: "Please enter the email of the registered user!"
                    }}
                    changeHandler={null}
                    blurHandler={null}
                />


                <TextField
                    register={register}
                    errors={errors}
                    field={{
                        description: "Please provide us your registered email address.",
                        label: "PASSWORD",
                        fieldId: "password",
                        type: "password",
                        placeholder: "",
                        required: false,
                        validationMessage: "Please enter the email of the registered user!"
                    }}
                    changeHandler={null}
                    blurHandler={null}
                />

                <div style={{ display: "flex", justifyContent: "space-between", width: "450px", }}>
                    <CheckboxField
                        register={register}
                        errors={errors}
                        field={{
                            description: "Save password in browser",
                            label: "SAVE PASSWORD",
                            fieldId: "savePassword",
                            placeholder: "",
                            required: false,
                            validationMessage: "Please enter the Account Number!"
                        }}
                        changeHandler={null}
                        blurHandler={null}
                    />
                </div>

                <Button className='animet_btton' size="sm" variant="primary" type="submit" style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%,${darkBackgroundColor} 100%)`, border: 'none', transition: "all 0.2s ease" }}>
                    Submit
                </Button> {" "}
                <Button className='animet_btton' size="sm" variant="primary" type="button" as={Link} to="/forgot-password" style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%,${darkBackgroundColor} 100%)`, border: 'none' }}>
                    Forgot Password
                </Button>

            </Form>

        </Container>
    )
}






// import React from 'react'
// import { useState } from 'react';
// import { Link } from 'react-router-dom'


// export default function Login() {


//     return (

//         <div class="login-container">
//             <div class="login-wrapper">
//                 <div class="login-title"><span>LOGIN</span></div>
//                 <form action="#">
//                     <div class="row">
//                         <i class="fas fa-user"></i>
//                         <input type="text" placeholder="Email or Phone" required />
//                     </div>
//                     <div class="row">
//                         <i class="fas fa-lock"></i>
//                         <input type="password" placeholder="Password" required />
//                     </div>
//                     <div class="pass"><a href="#">Forgot password?</a></div>
//                     <div class="row button">
//                         <input type="submit" value="LOGIN" />
//                     </div>
//                     <div class="signup-link">Not a member? <a href="#">Signup now</a></div>
//                 </form>
//             </div>
//         </div>
//     )
// }
