import React from 'react'
import { Modal } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import defaultProduct from "../../../image/default-product.png"
import DefaultImg from '../../../image/default_product_img.jpg'

const ViewProductImageModal = ({ show, productImage, setModalShow }) => {

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show}
            onHide={() => setModalShow(false)}
            style={{ height: 600 }}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {/* {productImage?.displayName} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='' style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
                <div style={{ display: 'flex', flexDirection: "column" }}>
                    <span style={{ fontSize: "15px" }}>{productImage?.displayName}</span>
                    <span style={{ fontSize: "15px" }}>{productImage?.colorDescription}</span>
                    <span style={{ fontSize: "15px" }}>{productImage?.type}</span>
                </div>

                <div className='border'>
                    <LazyLoadImage
                        alt={""}
                        width={"100%"}
                        height={"300px"}
                        effect="blur"
                        src={productImage?.uploadSmallPoster?.url ? productImage?.uploadSmallPoster?.url : DefaultImg} />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ViewProductImageModal