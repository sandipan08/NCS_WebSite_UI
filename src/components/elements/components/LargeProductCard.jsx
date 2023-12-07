import React, { useContext } from 'react'
import { Button, Card, Col, Form } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { AiOutlineHeart } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { FaHeart } from 'react-icons/fa'
import { GrFormSearch } from 'react-icons/gr'
import { HiOutlineInformationCircle } from 'react-icons/hi'

import DefaultImg from '../../../image/default_product_img.jpg'
import { CustomerContext } from '../../../states/contexts/CustomerContext'
import { showMessage } from '../../../helpers/Utils'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext'



const LargeProductCard = ({ setQuantity, product, customers, wishLists, navigate, moveToWishList, carts, addSelectedProductsToCart, getPriceByPricingMatrix, findProductMultiplierAndFormatArray, cadMultiplier, addToCart, setProductImage, setLargeModalShow }) => {
    let uniteType = ''

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch: iconDispatch, ...rest } = useContext(BrandIconContext)

    // console.log(customer.addresses[0]);
    customer != null && customer?.addresses.forEach(address => {
        if (address?.isDefaultBilling && address?.country?.text == "UNITED STATES") {
            uniteType = 'y'
        } else {
            uniteType = 'm'
        }
    })


    return (
        <Col key={product?._id}>
            <Card className='main_image_container' key={product?._id} style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none", marginBottom: "5px" }}>
                <Card.Body key={product?._id}>
                    {/* <Card.Link as={Link} to={`/ `}> */}
                    <LazyLoadImage
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            // setProductImage(product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : DefaultImg)
                            setProductImage(product)
                            setLargeModalShow(true)
                        }}
                        alt={""}
                        width={"213"}
                        height={"400"}
                        effect="blur"
                        src={product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : DefaultImg} />
                    {/* </Card.Link> */}
                    <Card.Title style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "80%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: customers?.length > 1 ? "space-between" : "center" }}>
                            <HiOutlineInformationCircle style={{ cursor: "pointer" }} onClick={() => {
                                // setProductImage(product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : DefaultImg)
                                setProductImage(product)
                                setLargeModalShow(true)
                            }} />

                            {customers?.length > 1 ? <>
                                {wishLists.filter(wishList => wishList?.productId?._id == product._id).length ? <FcLike style={{ cursor: "pointer" }} onClick={() => navigate("/wishlist-detail")} /> : <AiOutlineHeart style={{ cursor: "pointer" }} onClick={() => moveToWishList(product?._id, customers[customers?.length - 1])} />}

                                {carts.length ?
                                    carts.filter(cart => cart.productId._id == product._id).length ? "" :
                                        <Form.Check
                                            id={`check_${product?._id}`}
                                            value={product?._id}
                                            onChange={async (e) => {
                                                addSelectedProductsToCart(`check_${product?._id}`, product, e, document.getElementById(`product_${product?._id}`).value)
                                            }}
                                        /> :
                                    <Form.Check
                                        id={`check_${product?._id}`}
                                        value={product?._id}
                                        onChange={async (e) => {
                                            addSelectedProductsToCart(`check_${product?._id}`, product, e, document.getElementById(`product_${product?._id}`).value)
                                        }}
                                    />
                                }
                            </> : ""}
                        </div>

                        <h6>{product?.name}</h6>
                        {/* {customers?.length > 1 ? <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.price}({product?.primaryUnitsType})</h6> : ""} */}
                        {/* {customers?.length > 1 ? <> */}
                        {customer ? <>
                            {/* <h6 style={{ fontWeight: 500, fontSize: 15 }}>${getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00}({product?.primaryUnitsType})</h6> */}
                            <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.price}/{uniteType}</h6>

                            <Form.Group key={product?._id} as={Col} md={11}>
                                <Form.Select size='sm' style={{ height: "30px" }}
                                    id={`product_${product?._id}`}
                                // onMouseEnter={() => {
                                //     // console.log(getValues(`cartItems.${index}.productId._id`));
                                //     findProductMultiplierAndFormatArray(product?._id)
                                // }}
                                // onClick={() => {
                                //     // findProductMultiplierAndFormatArray(product?._id)
                                //     setQuantity()
                                // }}
                                >
                                    {/* <option>Select qty...</option>
                                     */}
                                    {
                                        product.multipliers?.length && product.multipliers?.map(ele => {
                                            // console.log(ele);
                                            return <option key={ele} value={ele}>{ele}</option>
                                        })
                                    }
                                    {/* {
                                        cadMultiplier?.length && cadMultiplier?.map(ele => {
                                            // console.log(ele);
                                            return <option key={ele} value={ele}>{ele}</option>
                                        })
                                    } */}
                                </Form.Select>
                            </Form.Group>
                            <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yards(s)" : "meters(s)"}</span>
                        </> : ""}

                    </Card.Title>
                </Card.Body>
                {/* {(customers?.length > 1 || customer) ? */}
                {(customer) ?
                    <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "space-evenly" }}>

                        {
                            carts.length ?
                                carts.filter(cart => cart.productId._id == product._id).length ?
                                    <Button className='' size='sm' variant="outline-success" style={{ marginLeft: "-20px" }}
                                        onClick={() => { navigate(`/cart-detail`) }}
                                    >Go To Cart</Button>
                                    :
                                    <Button className='' size='sm' variant="outline-secondary" style={{ marginLeft: "-20px" }}
                                        // onClick={() => { addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.price }) }}
                                        onClick={() => {
                                            console.log(document.getElementById(`product_${product?._id}`).value);
                                            if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                let price = product?.price
                                                addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)), image: product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : DefaultImg })
                                            } else {
                                                showMessage("Please select a quantity!", "info")
                                            }
                                        }}
                                    >Add To Cart</Button>
                                :
                                <Button className='' size='sm' variant="outline-secondary" style={{ marginLeft: "-20px" }}
                                    // onClick={() => { addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.price }) }}
                                    onClick={() => {
                                        if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                            // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                            let price = product?.price
                                            addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseFloat(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)), image: product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : DefaultImg })
                                        } else {
                                            showMessage("Please select a quantity!", "info")
                                        }
                                    }}
                                >Add To Cart</Button>

                        }
                    </Card.Footer>
                    : ""
                }
            </Card>
        </Col>
    )
}

export default LargeProductCard