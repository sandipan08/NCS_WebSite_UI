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
import fabric from '../../assets/images/products/fabric.jpg';
import banner3 from '../../assets/images/banner-3.jpg';
import NCSButton from '../../components/elements/designElement/NCSButton';
import "./home.css"
export default function Home() {

    const { dispatch, user } = useContext(UserContext)
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)

    const whoAreYouImage = fabric;
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
                        <Card className='text-center' style={{ width: '56rem' }}>
                            <Card.Img variant="top" src={banner3} />
                            <Card.Body>
                                <Card.Title>Promotion Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row md={1}>
                    <Col className='whoAreYou'>
                        <div className='container'>
                            <p> <h1>Northcott Fabrics</h1></p>
                            <p> <span>We are the home of “cottons that feel like silk”. Our fine cotton prints with a silky hand can be found in quilt and craft shops around the world. We are known for our superior quality and admirable customer service. The quilting industry is where we have built a name for ourselves and a community of great customers, distributors and partners. We design and partner with the best designers to produce fabrics to sell wholesale to your local shops and distributors.</span></p>
                            <NCSButton props={{ buttonType: 'footerDefaultButton', buttonName: 'LEARN MORE' }} />
                        </div>
                    </Col>
                </Row>
                <Row md={1}>
                    <Col className='d-flex justify-content-center mt-5 mb-3'>
                        <h2 className='' style={{ fontWeight: 'bold' }}>Featured Categories</h2>
                    </Col>
                </Row>
                {/* <div class="grid-container ms-10">
                    <div class="grid-item">
                        <Card className='text-center'>
                            <Card.Img variant="top" src={banner3} />
                            <Card.Body>
                                <Card.Title>Promotion Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card></div>
                    <div class="grid-item">
                        <Card className='text-center'>
                            <Card.Img variant="top" src={banner3} />
                            <Card.Body>
                                <Card.Title>Promotion Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card></div>
                    <div class="grid-item">
                        <Card className='text-center'>
                            <Card.Img variant="top" src={banner3} />
                            <Card.Body>
                                <Card.Title>Promotion Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </div>
                    <div class="grid-item">4</div>
                    <div class="grid-item">5</div>
                    <div class="grid-item">6</div>
                </div> */}

                {/* <Row md={3} className="container-flex">
                    <Col className='d-flex justify-content-end pe-5'>
                        <Card style={{ width: '25rem', height: '24rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Promotion Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='d-flex justify-content pe-5'>
                        <Card style={{ width: '25rem', height: '24rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Promotion Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='d-flex justify-content ps-5'>
                        <Card style={{ width: '25rem', height: '24rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>New Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row> */}

                <Row xs={1} md={3} className="container g-3" style={{ alignContent: 'center' }}>

                    <Col key={1}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={2}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={3}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={4}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={5}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={6}>
                        <Card style={{ width: '20rem', height: '20rem' }}>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit
                                    longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>

            </div>
        </div >
    )
}
