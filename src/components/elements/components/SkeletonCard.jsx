import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'

const SkeletonCard = ({ height, width }) => {
    return (
        <>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                    <Skeleton style={{ height: height ? height : "145px", width: width ? width : "145px", }} />
                    <Card.Body>
                        <Card.Title><Skeleton style={{ height: "13px", width: width ? width : "145px", }} /></Card.Title>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default SkeletonCard