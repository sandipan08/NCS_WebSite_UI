import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import ApiService from '../../../helpers/ApiServices';
import { showMessage } from '../../../helpers/Utils';
import { BrandIconContext } from '../../../states/contexts/BrandIconContext';

const ProductCategorySkeleton = () => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    const { backgroundColor } = useContext(BrandIconContext)



    // const getCategoryType = () => {
    //     return ApiService.get(`shop/customList/title?title=Category Type`).then(response => {
    //         if (response?.data.isSuccess) {
    //             // console.log(response?.data.document.options);
    //             setCategoryTypes(response?.data.document.options)
    //         }
    //     }).catch(error => {
    //         console.log(error.response.data)
    //         // console.log("Else Catch")
    //         showMessage(error.response.data.message, "error")
    //     })
    // }

    // const getAllProductCategoriesBYType = (type = "NORTHCOTT") => {

    //     ApiService.get(`shop/category/type?type=${type}`).then(response => {
    //         // console.log(response);
    //         if (response?.data.isSuccess) {
    //             setCategories(response?.data.documents)
    //         }
    //     }).catch(error => {
    //         console.log(error.response.data)
    //         // console.log("Else Catch")
    //         showMessage(error.response.data.message, "error")
    //     })
    // }


    useEffect(() => {
        // getCategoryType()
        // getAllProductCategoriesBYType()
    }, []);



    return (
        <Container className='' style={{ width: "100%" }}>
            {/* {user?.userTypes.includes('CUSTOMER') ? "" : <Alert className='p-1 m-0' variant={"primary"}>
        Welcome <span style={{ fontWeight: "600" }}>{user?.name}!</span> Use "Customer" tab to access customer settings. You have selected "<span style={{ fontWeight: "600" }}>{customer?.name}</span>".
        <Link to='/region-customer'>To change, click here.</Link>
    </Alert>} */}
            <Row xs={1} sm={1} md={2} lg={2} className='mb-3 mt-3' style={{ backgroundColor: backgroundColor, borderBottom: "1px solid #666666", padding: "10px 30px", }}>
                <div className='p-1 m-0' style={{ width: "100%", fontSize: "13px" }}>
                    {/* Welcome <span style={{ fontWeight: "600" }}>{user?.name}!</span> Use "Customer" tab to access customer settings. You have selected "<span style={{ fontWeight: "600" }}>{customer?.name}</span>". <span><Link to='/region-customer'>To change, click here.</Link></span> */}
                    <Skeleton style={{ width: "100%" }} />
                </div>
            </Row>

            <h3 style={{ fontWeight: 650 }}><Skeleton style={{ width: "20%" }} /></h3>
            <hr />

            {/* <AppContentBody> */}
            <Container className=''>
                <Row className='' >
                    <Skeleton style={{ width: "100%", height: "100%" }} />
                </Row>

                <Row className='mt-5' style={{ fontSize: "25px", fontWeight: "bold" }}>{ }</Row>

                <Row xs={1} sm={2} md={3} lg={4}>


                    <Col>
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                            <Skeleton style={{ height: "220px", width: "220px", }} />
                            <Card.Body>
                                <Card.Title><Skeleton style={{ height: "13px", width: "145px", }} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                            <Skeleton style={{ height: "220px", width: "220px", }} />
                            <Card.Body>
                                <Card.Title><Skeleton style={{ height: "13px", width: "145px", }} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                            <Skeleton style={{ height: "220px", width: "220px", }} />
                            <Card.Body>
                                <Card.Title><Skeleton style={{ height: "13px", width: "145px", }} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                            <Skeleton style={{ height: "220px", width: "220px", }} />
                            <Card.Body>
                                <Card.Title><Skeleton style={{ height: "13px", width: "145px", }} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                            <Skeleton style={{ height: "220px", width: "220px", }} />
                            <Card.Body>
                                <Card.Title><Skeleton style={{ height: "13px", width: "145px", }} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* </AppContentBody > */}
        </Container >

    )
}

export default ProductCategorySkeleton