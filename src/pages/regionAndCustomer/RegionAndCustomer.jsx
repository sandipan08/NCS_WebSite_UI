import React, { useContext, useEffect, useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import CustomSelectField from '../../components/elements/fields/CustomSelectField';
import ApiService from '../../helpers/ApiServices';
import { useForm } from 'react-hook-form'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../states/contexts/UserContext';
import { showMessage } from '../../helpers/Utils';
import { CustomerService, TokenService } from '../../helpers/StorageServices';
import CustomerCustomSelectField from '../../components/elements/fields/CustomerCustomSelectField';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
const _ = require("lodash")

export default function RegionAndCustomer() {
    const navigate = useNavigate();
    const [state, setState] = useState(null)
    const [customerArray, setCustomerArray] = useState(CustomerService.getCustomer())
    const [isRegionSelected, setIsRegionSelected] = useState(false);
    const [customerState, setCustomerState] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [customerList, setCustomerList] = useState(null)

    const { backgroundColor, color, darkBackgroundColor } = useContext(BrandIconContext)
    const { dispatch, customer } = useContext(CustomerContext)
    const { user } = useContext(UserContext)

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm();


    const setTestCustomer = (customers, array) => {
        // console.log(customers[0]);
        if (customers?.length) {
            array.unshift({ _id: "--SELECT A REGION--", name: "--SELECT A REGION--" })
            if (customers[0]) {
                array.unshift(customers[0]) // Add test account at the begening of array
                array.unshift({ _id: "--TEST ACCOUNT--", name: "--TEST ACCOUNT--" })
            }
        }
        return array;
    }

    const checkUSA = (ele) => {
        // console.log(ele);
        return ele.isUSA == 'true';
    }

    const checkCANADA = (ele) => {
        // console.log(ele);
        return ele.isCANADA == 'true';
    }

    const getRegion = async () => {
        let options = [];
        let regions = [];

        try {
            ApiService.setHeader()
            const response1 = await ApiService.get(`/shop/customList/title?title=${"Territory Name USA"}`)
            const response2 = await ApiService.get(`/shop/customList/title?title=${"Territory Name Canada"}`)
            const response3 = await ApiService.get(`/shop/internationalExport`)
            // console.log(response3.data.documents.filter(checkUSA));
            // console.log(response2?.data.document.options);

            Array.prototype.push.apply(regions, [{ _id: "-CANADA-", name: "-CANADA-" }])
            Array.prototype.push.apply(regions, response3.data.documents.filter(checkCANADA))
            Array.prototype.push.apply(regions, response2?.data.document.options)

            Array.prototype.push.apply(regions, [{ "_id": "-USA-", "name": "-USA-" }])
            Array.prototype.push.apply(regions, response3.data.documents.filter(checkUSA))
            Array.prototype.push.apply(regions, response1?.data.document.options)

            // console.log("options", options)
            // console.log("user", user)

            // Sales rep and sale amanager can see only their teritory.
            if (user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("SALES_MANAGER")) {

                Array.prototype.push.apply(options, [{ _id: "-CANADA-", name: "-CANADA-" }])
                user?.region.map(ele => {

                    if (response2?.data.document.options.find(e => e.text == ele.text) != undefined)
                        Array.prototype.push.apply(options, [response2?.data.document.options.find(e => e.text == ele.text)])
                })

                Array.prototype.push.apply(options, [{ "_id": "-USA-", "name": "-USA-" }])
                user?.region.map(ele => {

                    if (response1?.data.document.options.find(e => e.text == ele.text) != undefined)
                        Array.prototype.push.apply(options, [response1?.data.document.options.find(e => e.text == ele.text)])
                })

                const array = setTestCustomer(customers, options)

                setState(array)
                // setState([region])
            } else {
                const array = setTestCustomer(customers, regions)
                setState(array)
            }
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }



    useEffect(() => {
        // isLoggedIn()
        getRegion()
    }, []);


    const regionChangeHandler = async (event, data) => {
        // console.log(data?.targetValue)

        switch (data?.targetValue) {
            case "--TEST ACCOUNT--||--TEST ACCOUNT--":
                setIsRegionSelected(false);
                showMessage("Please select a region!", "warning")
                return false;
                break;

            case "--SELECT A REGION--||--SELECT A REGION--":
                setIsRegionSelected(false);
                showMessage("Please select a region!", "warning")
                return false;
                break;

            case "-CANADA-||-CANADA-":
                setIsRegionSelected(false);
                showMessage("Please select a region!", "warning")
                return false;
                break;

            case "-USA-||-USA-":
                setIsRegionSelected(false);
                showMessage("Please select a region!", "warning")
                return false;
                break;

            default:
                break;
        }

        if (data?.targetValue.split("||")[1].includes("TEST")) {
            let array = new Array()

            // Load the selected customer into reducer
            dispatch({ type: "SELECT_CUSTOMER", payload: customers[0] });

            if (localStorage.getItem("PCTeRP.CUSTOMER_IDS") == null) {
                array.push(customers[0])

                // Save the customer array into localStorage, so that after refresh we can get the customer
                localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))

            } else if (JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS")).length) {

                // Parse the string array to an actual array
                array = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
                array.push(customers[0])

                // Save the customer array into localStorage, so that after refresh we can get the customer
                localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))
            }

            navigate('/product-category')
            return
        }


        const region = data?.targetValue?.split('||')[1];
        console.log(region);

        try {
            // const response = await ApiService.get(`shop/user/customer?region=${region}&salesRepId=${user?.netsuiteId}`)
            // const response = await ApiService.get(`shop/user/customer?region=${region}&userId=${user?.netsuiteId}&userType=${user?.userTypes[0]}&subsidiaryId=${user?.subsidiary?.value}&brandType=NORTHCOTT`)
            const response = await ApiService.get(`shop/customer/customer?region=${region}&userId=${user?.netsuiteId}&userType=${user?.userTypes[0]}&subsidiaryId=${user?.subsidiary?.value}&brandType=NORTHCOTT`)

            setIsRegionSelected(true);

            // To find unique data from an array of object
            // const unique = [...new Map(response.data.documents.map(item =>
            //     [item['customerId'], item])).values()]
            // console.log(response.data.documents);

            setCustomerList(response.data.documents.reverse());
        } catch (error) {
            console.log(error.response?.data)
            showMessage(error.response?.data.message, "error")
        }

    }

    const customerChangeHandler = async (event, data) => {
        const id = data?.targetValue?.split('||')[0]
        // console.log(id)
        setCustomerId(id);
    }

    // console.log(JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS")));

    const onSubmit = async () => {
        let array = new Array()

        try {
            // const response = await ApiService.get(`shop/user/customer?id=${customerId}&userType=ID`);
            const response = await ApiService.get(`shop/customer/customer?id=${customerId}&userType=ID`);
            const customer = response?.data.documents;

            // Load the selected customer into reducer
            dispatch({ type: "SELECT_CUSTOMER", payload: customer });

            // Push customer into an array
            if (localStorage.getItem("PCTeRP.CUSTOMER_IDS") == null) {
                array.push(customer)

                // Save the customer array into localStorage, so that after refresh we can get the customer
                localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))

            } else if (JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS")).length) {
                // Parse the string array to an actual array
                array = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))

                // Check the array if it is unique or not
                const result = array?.filter(e => e?.email == customer?.email);
                if (result?.length) {
                    _.remove(array, function (e) {
                        return e?.email == customer?.email
                    })
                }
                array.push(customer)
                // array.push(customer)

                // Save the customer array into localStorage, so that after refresh we can get the customer
                localStorage.setItem("PCTeRP.CUSTOMER_IDS", JSON.stringify(array))
            }

            // // Save the customer into localStorage, so that after refresh we can get the customer
            // CustomerService.saveCustomer(customer._id)
            navigate('/product-category')
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }


    return (
        <Container>
            <h2>Regions And Customers</h2>
            <h4> Please select a region and a customer you would like to place orders for below</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>

                <CustomSelectField
                    register={register}
                    errors={errors}
                    options={state}
                    // defaultOption={{ value: "--SELECT A REGION--", name: "--SELECT A REGION--" }}
                    field={{
                        description: "Region",
                        label: "REGION",
                        fieldId: "region",
                        placeholder: "",
                        // required: true,
                        // validationMessage: "Please enter the department name!",
                        multiple: false
                    }}

                    changeHandler={regionChangeHandler}
                    blurHandler={null}
                />
                {isRegionSelected &&
                    <CustomerCustomSelectField
                        register={register}
                        errors={errors}
                        options={customerList}
                        defaultOption={{ value: "--SELECT A CUSTOMER--", name: "--SELECT A CUSTOMER--" }}
                        field={{
                            description: "Region",
                            label: "CUSTOMER",
                            fieldId: "customer",
                            placeholder: "",
                            // required: true,
                            // validationMessage: "Please enter the department name!",
                            multiple: false
                        }}

                        changeHandler={customerChangeHandler}
                        blurHandler={null}
                    />
                }

                <Button className='animet_btton' type="submit" disabled={customerId ? false : true} style={{ background: `linear-gradient(to bottom, ${backgroundColor} 0%,${darkBackgroundColor} 100%)`, border: "none" }}>Submit</Button>
            </Form>
        </Container>
    )
}
