import { useEffect, useContext } from 'react';
import { React } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { CiDiscount1 } from 'react-icons/ci'
import DefaultImg from './../../../image/default_product_img.jpg'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext';


const OrderItems = ({ cart, total }) => {
    const { backgroundColor, textColor, color, darkBackgroundColor } = useContext(BrandIconContext)


    // console.log(cart);

    useEffect(() => {

    }, []);


    return (
        <Row key={cart?._id} className='mb-2 p-0 m-0'>
            <Row key={cart?._id} className='m-0 border rounded'>
                <Col className='col-lg-6' style={{ display: "flex" }}>
                    <Card key={cart?._id} className="" style={{ border: "1px solid black", width: '10rem', height: "12rem", display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                        <Card.Img variant="top" style={{ maxWidth: "10rem", maxHeight: "10rem" }} src={cart?.productId?.uploadSmallPoster?.url ? cart?.productId?.uploadSmallPoster?.url : cart?.productId?.uploadLargePoster?.url ? cart?.productId?.uploadLargePoster?.url : DefaultImg} />

                    </Card>

                    <div className='p-3' style={{ width: '25rem', height: "12rem" }}>
                        <div className='mb-2' style={{ fontWeight: 700 }}>{cart?.productId?.name}</div>

                        <div style={{ fontSize: "13px" }}>
                            {cart?.productId?.collections.map(collection => {
                                if (collection?.text != "") return <p key={collection?._id} style={{ lineHeight: "2px" }}>{collection?.text}</p>
                            })}
                        </div>
                    </div>
                </Col>

                <Col className='col-lg-3' style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>

                    <div className='' style={{ display: "flex", flexDirection: "row" }}>
                        <span style={{ fontWeight: 500 }}>Price: </span>
                        <span>&nbsp;${cart?.price}</span>
                    </div>
                    <div className='' style={{ display: "flex", flexDirection: "row" }}>
                        <span style={{ fontWeight: 500 }}>Qty: </span>
                        <span>&nbsp;{cart?.productQuantity}</span>
                    </div>
                    <div className='' style={{ display: "flex", flexDirection: "row" }}>
                        <span style={{ fontWeight: 500 }}>Discount: </span>
                        <span>&nbsp;0%</span>
                    </div>
                </Col>

                <Col className=' col-lg-3' style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    {/* ${cart?.price} */}
                    ${cart?.subTotal}
                </Col>
            </Row>

        </Row>
    )
}

export default OrderItems