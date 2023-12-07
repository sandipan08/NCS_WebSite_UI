import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap'

import Northcott from "../../image/northcottLogo.jpg"
import { critics, wholesaleContacts } from '../../helpers/data'


export default function About() {
    const [active, setActive] = useState(false)


    // const isActive = () => {
    //     if (window.scrollY > 200) {
    //         console.log(window.scrollY);
    //     }
    // }

    const goTo = (position) => {
        window.scrollTo({ top: position, behavior: "smooth" })
    }

    useEffect(() => {
        // window.addEventListener("scroll", isActive)

        // // Cleanup function
        // return () => {
        //     window.addEventListener("scroll", isActive)
        // }
    }, [])


    return (
        <Container className='mt-5 p-0'>
            <h4 className='border-bottom border-3 pb-3' style={{ color: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>About Us</h4>

            <Row className='p-0 m-0' xs={1} sm={2} md={3} lg={4} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ButtonGroup className='p-0 m-0' style={{ width: "100%", backgroundColor: "white", display: "flex", justifyContent: "center" }}>
                    <Button variant="" onClick={() => goTo(280)}><u>Wholesale Contacts</u></Button>
                    <Button variant="" onClick={() => goTo(1282)}><u>Charities We Support</u></Button>
                    <Button variant="" onClick={() => goTo(1925)}><u>Contact Us</u></Button>
                </ButtonGroup>
            </Row>

            <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>
                {wholesaleContacts?.length ? wholesaleContacts?.map(ele => {
                    return <Row key={ele?.title} className='p-0 m-0 border-bottom' xs={1} sm={2} md={3} lg={4} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12' style={{ display: "flex", justifyContent: "center" }}>
                            <img src={ele.imag} alt="" srcSet="" style={{ width: "80%" }} />
                        </Col>
                        <Col className='p-0 m-0 pl-2 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                            <p style={{ fontSize: "25px", fontWeight: "500px" }}>{ele.title}</p>
                            <p style={{ fontSize: "13px" }}>
                                {ele.text}
                                {/* We are the home of “cottons that feel like silk”. Our fine cotton prints with a silky hand can be found in
                                quilt and craft shops around the world. We are known for our superior quality and admirable customer
                                service. The quilting industry is where we have built a name for ourselves and a community of great
                                customers, distributors and partners. We design and partner with the best designers to produce
                                fabrics to sell wholesale to your local shops and distributors.

                                Our mission is to offer a wide variety of quality fabrics that will inspire everyone to sew and craft! We
                                want you to be able to find a fabric that motivates you to make something unique. The art of quilting and
                                sewing is something we are very passionate about.

                                We were founded in 1935, originally as a fashion textile converter. During the mid '80s we shifted our
                                focus to the ever-expanding cotton print market of quilting! It has been an amazing journey and we
                                continue to grow and expand each year. We launched Banyan Batiks in 2017, FIGO fabrics in 2018 and
                                Patrick Lose Fabrics has partnered with us for 2020.

                                Follow us on social media as we always have something exciting to share #NorthcottFabrics */}
                            </p>
                        </Col>
                    </Row>
                }) : ""}

                <div className='p-0 m-0 pt-3' style={{ width: "100%", gap: "2px" }}>
                    <span style={{ fontSize: "19px", fontWeight: 700 }}>Wholesale Contacts</span>
                    <span style={{ fontSize: "13px" }}>
                        Northcott fabrics can be found in quilt and craft shops around the world. Northcott is a wholesale company, meaning we sell our fabrics to stores who then sell to the public. You cannot
                        buy directly from Northcott unless you are a store or distributor. The drop-down menus below are for stores. They will provide you with the Northcott Sales Representative or Distributor
                        for your territory
                    </span>
                </div>
                <div className='p-0 m-0 mt-3' style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button className='' size='md' variant='secondary' onClick={() => goTo(0)} style={{ padding: "0px 13px" }}>Top</Button>
                </div>
            </Row>

            <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>
                <div className='p-0 m-0 pt-3 pb-3' style={{ width: "100%", display: "flex", flexDirection: "column", gap: "none" }}>
                    <span className='' style={{ fontSize: "19px", fontWeight: 700 }}>Charities We Support</span>
                    <span className='' style={{ fontSize: "13px" }}>
                        Northcott is proud to support the following charitable organizations.
                    </span>
                </div>

                {critics?.length ? critics?.map(ele => {
                    return <Row key={ele?.title} className='p-0 m-0 border-bottom' xs={1} sm={2} md={3} lg={4} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12' style={{ display: "flex", justifyContent: "center" }}>
                            <img src={ele.imag} alt="" srcset="" style={{ width: "50%" }} />
                        </Col>
                        <Col className='p-0 m-0 pl-2 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                            <p style={{ fontSize: "25px", fontWeight: "500px" }}>{ele.title}</p>
                            <p style={{ fontSize: "13px" }}>
                                {ele.text}
                            </p>
                        </Col>
                    </Row>
                }) : ""}

                <div className='p-0 m-0 mt-3' style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button className='' size='md' variant='secondary' onClick={() => goTo(0)} style={{ padding: "0px 13px" }}>Top</Button>
                </div>
            </Row>

            <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>
                <Col className='p-0 m-0 mb-4 col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{ fontWeight: 600 }}>
                    Contact
                </Col>
                <Col className='p-0 m-0 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    <Row className='p-0 m-0' xs={1} sm={2} md={3} lg={4}>
                        <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12'>
                            <div className='mb-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span className='mb-4' style={{ fontSize: "15px", fontWeight: 600 }}>USA Office</span>
                                <span>1050 Valley Brook Avenue</span>
                                <span>Lyndhurst, NJ 07071</span>
                                <span>T: (201) 672-9600</span>
                                <span>F: (201) 672 -9675</span>
                            </div>
                            <div>Email: info2@northcott.com</div>
                            <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span style={{ fontSize: "15px", fontWeight: 600 }}>Office Hours Eastern Time:</span>
                                <span>9:00AM- 5:00PM Mon-Fri</span>
                                <span>CLOSED ON WEEKENDS</span>
                            </div>
                            <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span style={{ fontSize: "15px", fontWeight: 600 }}>Warehouse Hours:</span>
                                <span>8:00AM- 3:00PM Mon- Fri</span>
                                <span>CLOSED ON WEEKENDS</span>
                            </div>
                        </Col>

                        <Col className='p-0 m-0 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                            <div className='mb-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span className='mb-4' style={{ fontSize: "15px", fontWeight: 600 }}>Canadian Office</span>
                                <span>101 Courtland Avenue</span>
                                <span>Vaughan, Ontario L4K 3T5</span>
                                <span>Tel: (905) 760-0072</span>
                                <span>Fax: (905) 760-0073</span>
                            </div>
                            <div>Email: Info@northcott.com</div>
                            <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span style={{ fontSize: "15px", fontWeight: 600 }}>Office Hours Eastern Time:</span>
                                <span>9:00AM- 5:00PM Mon-Fri</span>
                                <span>CLOSED ON WEEKENDS</span>
                            </div>
                            <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                <span style={{ fontSize: "15px", fontWeight: 600 }}>Warehouse Hours:</span>
                                <span>8:00AM- 3:00PM Mon- Fri</span>
                                <span>CLOSED ON WEEKENDS</span>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container >
    )
}
