import React from 'react'
import { Col, Row } from 'react-bootstrap'
import DefaultImg from './../../../image/default_product_img.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const DisplayInvoiceItems = ({ ele, status }) => {
    // console.log(ele);

    return (
        <Row key={ele?.item} className='' >
            <Col className=' p-0' style={{ width: "20%", textAlign: "center" }}>{ele.item}</Col>
            <Col className=' p-0' style={{ width: "20%", textAlign: "center" }}>{ele?.collectionName}</Col>
            <Col className=' p-0' style={{ width: "20%", textAlign: "center" }}>{ele?.rate}</Col>
            <Col className=' p-0' style={{ width: "20%", textAlign: "center" }}>{ele?.quantity}</Col>
            <Col className=' p-0' style={{ width: "20%", textAlign: "center" }}>{ele?.amount}</Col>
        </Row>
    )
}

export default DisplayInvoiceItems