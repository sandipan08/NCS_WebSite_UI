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
import "./home.css";
import cat3 from '../../assets/images/products/cat3.jpg';
import comingSoon from '../../assets/images/products/coming-soon.jpg';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cat2 from '../../assets/images/products/cat2.jpg';
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

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div>
            <HomeSliders />
            <div className='mt-5' id='whatsNewDiv'>
                <Row md={2} className='mt-5' >
                    <Col className='d-flex justify-content-end pe-5 pb-3'>
                        <h2 className='' style={{ width: '25rem', fontWeight: 'bold' }}>What's New</h2>
                    </Col>
                </Row>
                <Row md={2} xs={1} sm={1} className="">
                    <Col className='d-flex justify-content-end pe-5'>
                        <Card style={{ width: '25rem', height: '24rem' }} className='cardWithNoBorder'>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>Promotion Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='d-flex justify-content-start ps-5'>
                        <Card style={{ width: '25rem', height: '24rem' }} className='cardWithNoBorder'>
                            <Card.Img variant="top" src={ctaBanner} />
                            <Card.Body>
                                <Card.Title>New Collection Example</Card.Title>
                                <NCSButton props={{ buttonType: 'thirdlyDefaultButton', buttonName: 'Shop Now' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Row md={1}>
                <Col className='d-flex justify-content-center'>
                    <h2 className='' style={{ fontWeight: 'bold' }}>What's New</h2>
                </Col>
            </Row>
            <Row md={1} className=''>
                <Col className='d-flex justify-content-center'>
                    <Card className='cardWithNoBorder text-center' style={{ width: '56rem' }}>
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
            <div className='d-flex justify-content-center' id='featuredCategoriesDiv'>
                <Row xs={1} sm={1} md={3} className="container g-5">
                    <Col key={1} className='d-flex justify-content-center' >
                        <Card className='featuredCategoriesCard'>
                            <Card.Img variant="top" src={cat3} />
                            <Card.Body>
                                <Card.Title>Holiday 2023 Release Collections</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={2} className='d-flex justify-content-center' >
                        <Card >
                            <Card.Img variant="top" src={cat3} />
                            <Card.Body>
                                <Card.Title>September 2023 Release Collections</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={3} className='d-flex justify-content-center' >
                        <Card >
                            <Card.Img variant="top" src={cat3} />
                            <Card.Body>
                                <Card.Title>September 2023 Collection Precuts</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={4} className='d-flex justify-content-center'>
                        <Card  >
                            <Card.Img variant="top" src={cat3} />
                            <Card.Body>
                                <Card.Title>April 2023 Release Collections</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={5} className='d-flex justify-content-center'>
                        <Card >
                            <Card.Img variant="top" src={cat3} />
                            <Card.Body>
                                <Card.Title>April 2023 Collection Precuts</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={6} className='d-flex justify-content-center'>
                        <Card >
                            <Card.Img variant="top" src={comingSoon} />
                            <Card.Body>
                                <Card.Title>Coming Soon</Card.Title>
                                <Card.Text>
                                    <a>Shop Now -</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Row md={1}>
                <Col className='d-flex justify-content-center mt-5 mb-3'>
                    <h2 className='' style={{ fontWeight: 'bold' }}>Follow us on social media as we always have something<br></br> exciting to share #NorthcottFabrics</h2>
                </Col>
            </Row>
            {/* <Row md={1}>
                <Col className='d-flex justify-content-center mt-5 mb-3'> */}
            <div>
                <Carousel responsive={responsive} className=''>
                    <div>  <Card >
                        <Card.Img variant="top" src={ctaBanner} />
                    </Card></div>
                    <div>  <Card >
                        <Card.Img variant="top" src={ctaBanner} />
                    </Card></div>
                    <div>  <Card >
                        <Card.Img variant="top" src={ctaBanner} />
                    </Card></div>
                    <div>  <Card >
                        <Card.Img variant="top" src={ctaBanner} />
                    </Card></div>
                    <div>  <Card >
                        <Card.Img variant="top" src={ctaBanner} />
                    </Card></div>
                </Carousel>
            </div>
            {/* </Col>
            </Row> */}
        </div >
    )
}
