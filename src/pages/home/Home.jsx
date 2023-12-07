import { React, useState, useEffect, useContext } from 'react'
import { Container, Card, ListGroup } from 'react-bootstrap'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import HomeSliders from '../../components/blocks/HomeSliders';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import ctaBanner from '../../assets/images/cta-banner.jpg';
import banner3 from '../../assets/images/banner-3.jpg';
import NCSButton from '../../components/elements/designElement/NCSButton';
import "./home.css"
export default function Home() {

    const { dispatch, user } = useContext(UserContext)
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)

    const setCustomer = async () => {
        // console.log(user?._id);

        let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
        // console.log(customers[customers?.length - 1]);

        ApiService.setHeader()
        // await ApiService.get(`shop/user/${CustomerService.getCustomer() ? CustomerService.getCustomer() : user?._id}`).then(response => {
        ApiService.get(`shop/user/${customers?.length ? customers[customers?.length - 1]?._id : user?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);

            if (response.data.isSuccess) {
                let customer = response?.data.document

                // Load the selected customer into reducer
                customerDispatch({ type: "SELECT_CUSTOMER", payload: response.data.document });
                if (user?.userTypes.includes("CUSTOMER")) dispatch({ type: "LOGIN_SUCCESS", payload: response.data.document });
            }
        }).catch(error => {

            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")

        })

    }

    useEffect(() => {

        setCustomer()

    }, []);

    return (
        <div>
            <HomeSliders />
            <div className='mt-5' id='whatsNewDiv'>
                <Row md={2}>
                    <Col className='d-flex justify-content-end pe-5 pb-3'>
                        <h2 className='' style={{ width: '25rem', fontWeight: 'bold' }}>What's New</h2>
                    </Col>
                </Row>
                <Row md={2} className="">
                    <Col className='d-flex justify-content-end pe-5'>
                        <Card style={{ width: '25rem', height: '24rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Promotion Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='d-flex justify-content-start ps-5'>
                        <Card style={{ width: '25rem', height: '24rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>New Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row md={1}>
                    <Col className='d-flex justify-content-center'>
                        <h2 className='' style={{ fontWeight: 'bold' }}>What's New</h2>
                    </Col>
                </Row>
                <Row md={1} className=''>
                    <Col className='d-flex justify-content-center'>
                        <Card className='text-center' style={{ width: '56rem', }}>
                            <Card.Img variant="top" src={banner3} />
                            <Card.Body>
                                <Card.Title>Promotion Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
