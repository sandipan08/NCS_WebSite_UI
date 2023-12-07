import React from 'react'
import { Modal } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import defaultProduct from "../../../image/default-product.png"
import DefaultImg from '../../../image/default_product_img.jpg'

const ViewProductLargeImageModal = ({ show, productImage, setLargeModalShow }) => {

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show}
            onHide={() => setLargeModalShow(false)}
            style={{ height: 800, display: "flex", justifyContent: "center", alignItems: "center" }}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {productImage?.displayaName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <LazyLoadImage
                    alt={""}
                    width={"100%"}
                    height={"500px"}
                    effect="blur"
                    src={productImage?.uploadLargePoster?.url ? productImage?.uploadLargePoster?.url : DefaultImg} />
            </Modal.Body>
        </Modal>
    )
}

export default ViewProductLargeImageModal