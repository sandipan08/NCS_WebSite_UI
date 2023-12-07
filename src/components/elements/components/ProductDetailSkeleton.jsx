import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import DesignerCard from './DesignerCard'

const ProductDetailSkeleton = () => {
    return (
        <Container className='' style={{ width: "100%" }}>
            {/* <AppContentBody> */}
            {/* <Container> */}


            <Row xs={1} sm={1} md={2} lg={2} className=''>
                <Col className='col-xl-9 col-lg-9 col-md-9 col-sm-12 p-0' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Row className='col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0'>
                        <h3 style={{ paddingLeft: "0px", fontSize: "18px" }}><b><Skeleton style={{ color: "gray", height: "13px", width: "145px" }} /></b></h3>
                        {/* <p><b>By</b> {type.replace("%20", " ")}</p> */}
                        <div style={{ paddingLeft: "0px" }}>
                            By <Skeleton style={{ color: "gray", height: "13px", width: "145px" }} />
                        </div>
                        <p style={{ paddingLeft: "0px", fontSize: "15px" }}><Skeleton style={{ color: "gray", height: "13px", width: "145px" }} /></p>
                    </Row>

                    <Row className='make-verticle-section col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0' style={{ gap: "10px" }}>
                        <Col className='p-0' style={{ color: "red", fontWeight: 640, textAlign: "center" }}>
                            <Skeleton style={{ color: "gray", height: "13px", width: "800px" }} />

                        </Col>

                        <Col className='p-0' style={{ fontWeight: 640, textAlign: "center", fontSize: "14px" }}>
                            <Skeleton style={{ color: "gray", height: "13px", width: "800px" }} />
                        </Col>

                        <Col className='p-0   make-horizontal-sectionborder' style={{ display: "flex", justifyContent: "space-between" }}>
                            <Skeleton style={{ color: "gray", height: "13px", width: "145px" }} />
                            <Skeleton style={{ color: "gray", height: "13px", width: "145px" }} />
                            <Skeleton style={{ color: "gray", height: "13px", width: "145px" }} />
                            {/* <Button size='sm' style={{ background: "linear-gradient(to bottom, #e5a544 16%,#e5a544 16%,#e5a544 34%,#7d5402 100%)", border: "none", fontWeight: 600, fontSize: "14px" }}>
                            Select Full Collection
                        </Button>
                        <Button size='sm' style={{ background: "linear-gradient(to bottom, #e5a544 16%,#e5a544 16%,#e5a544 34%,#7d5402 100%)", border: "none", fontWeight: 600, fontSize: "14px" }}>Add All Selected</Button>
                        <Button size='sm' style={{ background: "linear-gradient(to bottom, #e5a544 16%,#e5a544 16%,#e5a544 34%,#7d5402 100%)", border: "none", fontWeight: 600, fontSize: "14px" }}>Select Full Collection - Half Price</Button> */}
                        </Col>
                    </Row>

                    <Row className='mt-5 p-0 ' style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Col className='col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0'>
                            <Skeleton style={{ color: "gray", height: "200px", width: "990px" }} />
                        </Col>
                        <Col>
                            {/* <AppContentBody> */}
                            <Container className=''>
                                <Row>
                                    <Col className=' p-0 col-xl-3 col-lg-3 col-md-3 col-sm-3' style={{ marginRight: "5px" }}>
                                        <Col >
                                            <Skeleton style={{ marginTop: "10px", height: "400px", width: "250px", display: "flex", justifyContent: "center", alignItems: "center", border: "none", marginBottom: "5px" }} />

                                        </Col>


                                    </Col>

                                    <Col className=' p-0'>
                                        <Row xs={1} sm={2} md={4} lg={4} style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "6px", gap: "10px" }}>
                                            <Skeleton style={{ marginTop: "10px", height: "200px", width: "150px", margin: "10px" }} />
                                            <Skeleton style={{ marginTop: "10px", height: "200px", width: "150px", margin: "10px" }} />
                                            <Skeleton style={{ marginTop: "10px", height: "200px", width: "150px", margin: "10px" }} />
                                            <Skeleton style={{ marginTop: "10px", height: "200px", width: "150px", margin: "10px" }} />

                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                            {/* </AppContentBody> */}
                        </Col>
                    </Row>
                </Col>

                <Col className='scroll scroll4 col-xl-3 col-lg-3 col-md-3 col-sm-12 p-0' style={{ height: "1000px", overflowY: "auto", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    {/* <div className='mb-4' style={{ fontWeight: 900, border: "1px solid gray", borderTop: "none", height: "600px", width: "89.5%", marginLeft: "35px", }}>
                    <h5 style={{ backgroundColor: "#e3a856", padding: "5px", color: "white" }}>PRODUCT FINDER</h5>
                </div> */}

                    <div className='' style={{ height: "100%", fontWeight: 700, border: "1px solid gray", borderTop: "none", width: "89.5%", marginLeft: "35px" }}>
                        <p className='p-0 m-0 pt-1 pb-1' style={{ backgroundColor: "#e3a856", color: "white" }}>PRODUCT FINDER</p>
                        <div className='p-2 mt-2' style={{ height: "24%", display: "flex", flexDirection: "column", gap: "70px" }}>
                            <Form.Select size='sm' aria-label="Default select example">
                                <option>Select State / Prov</option>
                            </Form.Select>
                            <div className=''>
                                <p style={{ fontSize: "25px", fontWeight: 490 }}>My Fabric Order Total</p>
                                <p style={{ fontSize: "28px", color: "#e3a856", fontWeight: 490 }}>$0.00</p>
                            </div>
                        </div>

                        <div className='' style={{ backgroundColor: "#e3a856", fontWeight: 400, color: "white", fontSize: "15px", width: "100%", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>View List</div>

                        <div className='p-2 mt-2' style={{ height: "17%", display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Button size='sm' variant="secondary" style={{ backgroundColor: "#e3a856", color: "white", border: "none", margin: "0px 40px 0px 40px" }}>Download Fabric Files</Button>
                            <p className='mt-4' style={{ fontWeight: 400, fontSize: "15px", margin: "0px 55px 0px 55px" }}>Patterns can bepurchased through your local quilt shop.</p>
                        </div>

                        <hr style={{ backgroundColor: "gray" }} />
                    </div>
                </Col>
            </Row>
            {/* </Container> */}
            {/* </AppContentBody > */}
        </Container >
    )
}

export default ProductDetailSkeleton