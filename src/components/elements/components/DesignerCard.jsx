import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

const DesignerCard = ({ designer, Image }) => {
    return (
        <Col>
            <Card key={designer?._id} as={Link} to={`/designer-profile/${designer?._id}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>

                <LazyLoadImage
                    style={{ objectFit: "cover" }}
                    alt={""}
                    width={"145"}
                    height={"145"}
                    effect="blur"
                    src={designer?.image?.url ? designer?.image?.url : Image}

                />
                <Card.Body>
                    <Card.Title style={{ fontSize: "13px", fontWeight: 700, color: "black" }}>{designer?.websiteDesignerName ? designer?.websiteDesignerName : designer?.name}</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default DesignerCard