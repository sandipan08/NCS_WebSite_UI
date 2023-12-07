import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { formatAddressNew } from '../../../../helpers/Utils';

const ViewCustomerDataInProductFinder = ({ show, customerData, setModalShow }) => {
    const { customer, email, phone, website, address } = customerData
    // console.log(address);

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show}
            onHide={() => setModalShow(false)}
            // style={{ height: 600 }}
            size="md"
        >
            <Modal.Header closeButton style={{ backgroundColor: "#C5C5C5" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    {/* {productImage?.displayName} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='' style={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <p style={{ fontWeight: 500 }}>Customer: {customer?.split('(')[0]}</p>
                <p style={{ fontWeight: 500 }}>
                    <span className=""> Address:</span> <span className="">{address?.length ? formatAddressNew(address[0]) : null}</span>
                </p>
                <p style={{ fontWeight: 500 }}>Email: {email}</p>
                <p style={{ fontWeight: 500 }}>Phone: {phone}</p>
                <p style={{ fontWeight: 500 }}>Website: {website}</p>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#C5C5C5" }}>
                <Button className='animet_btton' variant="secondary" size="sm" onClick={() => setModalShow(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewCustomerDataInProductFinder