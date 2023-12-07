import React, { useContext, useEffect, useState } from 'react'
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


const ProductCard = ({ setQuantity, product, customers, wishLists, navigate, moveToWishList, carts, addSelectedProductsToCart, getPriceByPricingMatrix, findProductMultiplierAndFormatArray, cadMultiplier, addToCart, setProductImage, setModalShow, country }) => {
    const [isSoldOutCAD, setIsSoldOutCAD] = useState(false);
    const [isSoldOutUSA, setIsSoldOutUSA] = useState(false);

    let uniteType = ''

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch: iconDispatch, ...rest } = useContext(BrandIconContext)

    // console.log(customers);
    // console.log(customer);
    // console.log(country);
    customer != null && customer?.addresses.forEach(address => {
        if (address?.isDefaultBilling && address?.country?.text == "UNITED STATES") {
            uniteType = 'y'
        } else {
            uniteType = 'm'
        }
    })



    useEffect(() => {
        // Do it letter ater discussion
        if (customer && country === "CANADA") {
            if (!product?.isReorderable && product?.isSoldOutCanada) {
                setIsSoldOutCAD(true)
            }
        } else if (!product?.isReorderable && product?.isSoldOutUsa) {
            setIsSoldOutUSA(true)
        }

        return () => {

        }
    }, [])




    return (
        <Col key={product?._id}>
            <Card className=' mb-2' key={product?._id} style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none", boxShadow: "inset" }}>
                <Card.Body className='' key={product?._id} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "none" }}>
                    {/* <Card.Link as={Link} to={`/ `}> */}
                    {
                        ((country === "CANADA" && isSoldOutCAD) || (country === "UNITED STATE" && isSoldOutUSA)) ?
                            <LazyLoadImage
                                className='rounded'
                                style={{ objectFit: "fill" }}
                                alt={""}
                                width={"145"}
                                height={"145"}
                                effect="blur"
                                src={product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg} />
                            :

                            <LazyLoadImage
                                className='rounded'
                                style={{ cursor: "pointer", objectFit: "fill" }}
                                onClick={() => {
                                    // setProductImage(product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg)
                                    setProductImage(product)
                                    setModalShow(true)
                                }}

                                alt={""}
                                width={"145"}
                                height={"145"}
                                effect="blur"
                                src={product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg} />
                    }

                    {/* </Card.Link> */}
                    <Card.Title className='' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {
                            ((country === "CANADA" && isSoldOutCAD) || (country === "UNITED STATE" && isSoldOutUSA)) ?
                                <div className='' style={{ width: "80%", height: "30px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: customers?.length > 1 || customer ? "space-between" : "center" }}>

                                </div>
                                :
                                <div className='' style={{ width: "80%", height: "30px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: customers?.length > 1 || customer ? "space-between" : "center" }}>
                                    <HiOutlineInformationCircle style={{ cursor: "pointer" }} onClick={() => {
                                        // setProductImage(product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg)
                                        setProductImage(product)
                                        setModalShow(true)
                                    }} />

                                    {customers?.length > 1 || customer ? <>
                                        {wishLists.filter(wishList => wishList?.productId?._id == product._id).length ? <FcLike style={{ cursor: "pointer" }} onClick={() => navigate("/wishlist-detail")} /> : <AiOutlineHeart style={{ cursor: "pointer" }} onClick={() => moveToWishList(product, customers[customers?.length - 1])} />}
                                        {/* <Form.Group className="border" controlId="formBasicCheckbox"> */}
                                        {carts.length ?
                                            carts.filter(cart => cart.productId._id == product._id).length ? "" :
                                                <Form.Check className=''
                                                    id={`check_${product?._id}`
                                                    }
                                                    value={product?._id}
                                                    onChange={async (e) => {
                                                        addSelectedProductsToCart(`check_${product?._id}`, product, e, document.getElementById(`product_${product?._id}`).value)
                                                    }}
                                                /> :
                                            <Form.Check size={'sm'}
                                                id={`check_${product?._id}`}
                                                value={product?._id}
                                                onChange={async (e) => {
                                                    addSelectedProductsToCart(`check_${product?._id}`, product, e, document.getElementById(`product_${product?._id}`).value)
                                                }}
                                            />
                                        }
                                    </> : ""}
                                    {/* </Form.Group> */}
                                </div>
                        }

                        <h6 className='' style={{ fontSize: "14px", textAlign: "center" }}>
                            {`${product?.name} ${(product?.displayName || product?.colorDescription) ? `(${product?.displayName && product?.displayName}, ${product?.colorDescription && product?.colorDescription})` : ""}`}
                        </h6>

                        {/* {customers?.length > 1 ? <> */}
                        {/* {(customer && product?.isReorderable) ?
                            <>
                                <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.priceFromPM ? product.priceFromPM : product?.price}/{uniteType}</h6>
                                <Form.Group key={product?._id} as={Col} md={11} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>
                                
                                    <Form.Select className='' size='sm' style={{ padding: "0px 5px" }}
                                        id={`product_${product?._id}`}
                                    >
                                        {
                                            product.multipliers?.length && product.multipliers?.map(ele => {
                                              
                                                return <option key={ele} value={ele}>{ele}</option>
                                            })
                                        }

                                    </Form.Select>
                                </Form.Group>
                                <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yard(s)" : "Metre(s)"}</span>

                            </>
                            : <span style={{ fontWeight: 500, fontSize: 15, color: "red" }}>SOLD OUT</span>
                        } */}

                        {(customer && country === "CANADA") ?
                            <>
                                {
                                    !product?.isReorderable ?
                                        <>
                                            {
                                                (!product?.isSoldOutCanada) ?
                                                    <>
                                                        <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.priceFromPM ? product.priceFromPM : product?.price}/{uniteType}</h6>
                                                        {customer ? <>
                                                            <Form.Group key={product?._id} as={Col} md={11} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>

                                                                <Form.Select className='' size='sm' style={{ padding: "0px 5px" }}
                                                                    id={`product_${product?._id}`}
                                                                >
                                                                    {
                                                                        product.multipliers?.length && product.multipliers?.map(ele => {

                                                                            return <option key={ele} value={ele}>{ele}</option>
                                                                        })
                                                                    }

                                                                </Form.Select>
                                                            </Form.Group>
                                                            <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yard(s)" : "Metre(s)"}</span>
                                                        </> : ""}
                                                    </>
                                                    : <span style={{ fontWeight: 500, fontSize: 15, color: "red" }}>SOLD OUT</span>
                                            }
                                        </>
                                        :
                                        <>
                                            <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.priceFromPM ? product.priceFromPM : product?.price}/{uniteType}</h6>
                                            {customer ? <>
                                                <Form.Group key={product?._id} as={Col} md={11} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>

                                                    <Form.Select className='' size='sm' style={{ padding: "0px 5px" }}
                                                        id={`product_${product?._id}`}
                                                    >
                                                        {
                                                            product.multipliers?.length && product.multipliers?.map(ele => {

                                                                return <option key={ele} value={ele}>{ele}</option>
                                                            })
                                                        }

                                                    </Form.Select>
                                                </Form.Group>
                                                <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yard(s)" : "Metre(s)"}</span>
                                            </> : ""}
                                        </>
                                }
                            </> : <>
                                {
                                    !product?.isReorderable ?
                                        <>
                                            {
                                                (!product?.isSoldOutUsa) ?
                                                    <>
                                                        <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.priceFromPM ? product.priceFromPM : product?.price}/{uniteType}</h6>
                                                        {customer ? <>
                                                            <Form.Group key={product?._id} as={Col} md={11} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>

                                                                <Form.Select className='' size='sm' style={{ padding: "0px 5px" }}
                                                                    id={`product_${product?._id}`}
                                                                >
                                                                    {
                                                                        product.multipliers?.length && product.multipliers?.map(ele => {

                                                                            return <option key={ele} value={ele}>{ele}</option>
                                                                        })
                                                                    }

                                                                </Form.Select>
                                                            </Form.Group>
                                                            <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yard(s)" : "Metre(s)"}</span>
                                                        </> : ""}
                                                    </>
                                                    : <span style={{ fontWeight: 500, fontSize: 15, color: "red" }}>SOLD OUT</span>
                                            }
                                        </>
                                        :
                                        <>
                                            <h6 style={{ fontWeight: 500, fontSize: 15 }}>${product?.priceFromPM ? product.priceFromPM : product?.price}/{uniteType}</h6>
                                            {customer ? <>
                                                <Form.Group key={product?._id} as={Col} md={11} style={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: "4px", marginTop: "-8px" }}>

                                                    <Form.Select className='' size='sm' style={{ padding: "0px 5px" }}
                                                        id={`product_${product?._id}`}
                                                    >
                                                        {
                                                            product.multipliers?.length && product.multipliers?.map(ele => {

                                                                return <option key={ele} value={ele}>{ele}</option>
                                                            })
                                                        }

                                                    </Form.Select>
                                                </Form.Group>
                                                <span style={{ fontWeight: 500, fontSize: 15 }}>{uniteType === 'y' ? "Yard(s)" : "Metre(s)"}</span>
                                            </> : ""}
                                        </>
                                }
                            </>

                        }


                    </Card.Title>
                </Card.Body>
                {
                    // (customers?.length > 1 || customer) ?
                    // (customer && product?.isReorderable && !product?.isSoldOutUsa && !product?.isSoldOutCanada) ?
                    //     <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                    //         {
                    //             carts.length ?
                    //                 carts.filter(cart => cart.productId._id == product._id).length ?
                    //                     <Button className='' variant="outline-success" size='sm'
                    //                         onClick={() => { navigate(`/cart-detail`) }}
                    //                     >Go To Cart</Button>
                    //                     :
                    //                     <Button className='' size='sm' variant="outline-secondary"
                    //                         onClick={() => {
                    //                             if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                    //                                 console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                    //                                 // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                    //                                 let price = product?.price
                    //                                 // console.log(document.getElementById(`product_${product?._id}`).value);
                    //                                 // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                    //                                 addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                    //                             } else {
                    //                                 showMessage("Please select a quantity!", "info")
                    //                             }
                    //                         }}
                    //                     >Add To Cart</Button>
                    //                 :
                    //                 <Button className='' size='sm' variant="outline-secondary"
                    //                     onClick={() => {
                    //                         if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                    //                             console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                    //                             // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                    //                             let price = product?.price
                    //                             // console.log(document.getElementById(`product_${product?._id}`).value);

                    //                             // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                    //                             addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                    //                         } else {
                    //                             showMessage("Please select a quantity!", "info")
                    //                         }
                    //                     }}
                    //                 >Add To Cart</Button>

                    //         }
                    //     </Card.Footer>
                    //     : ""

                    customer ? <>
                        {


                            (customer && country === "CANADA") ?
                                <>
                                    {
                                        !product?.isReorderable ?
                                            <>
                                                {
                                                    (!product?.isSoldOutCanada) ?
                                                        <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                                                            {
                                                                carts.length ?
                                                                    carts.filter(cart => cart.productId._id == product._id).length ?
                                                                        <Button className='' variant="outline-success" size='sm'
                                                                            onClick={() => { navigate(`/cart-detail`) }}
                                                                        >Go To Cart</Button>
                                                                        :
                                                                        <Button className='' size='sm' variant="outline-secondary"
                                                                            onClick={() => {
                                                                                if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                                    // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                                    // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                                    let price = product?.price
                                                                                    // console.log(document.getElementById(`product_${product?._id}`).value);
                                                                                    // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                    addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                } else {
                                                                                    showMessage("Please select a quantity!", "info")
                                                                                }
                                                                            }}
                                                                        >Add To Cart</Button>
                                                                    :
                                                                    <Button className='' size='sm' variant="outline-secondary"
                                                                        onClick={() => {
                                                                            if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                                // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                                // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                                let price = product?.price
                                                                                // console.log(document.getElementById(`product_${product?._id}`).value);

                                                                                // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                            } else {
                                                                                showMessage("Please select a quantity!", "info")
                                                                            }
                                                                        }}
                                                                    >Add To Cart</Button>

                                                            }
                                                        </Card.Footer>
                                                        : ""
                                                }
                                            </>
                                            :
                                            <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                                                {
                                                    carts.length ?
                                                        carts.filter(cart => cart.productId._id == product._id).length ?
                                                            <Button className='' variant="outline-success" size='sm'
                                                                onClick={() => { navigate(`/cart-detail`) }}
                                                            >Go To Cart</Button>
                                                            :
                                                            <Button className='' size='sm' variant="outline-secondary"
                                                                onClick={() => {
                                                                    if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                        // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                        // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                        let price = product?.price
                                                                        // console.log(document.getElementById(`product_${product?._id}`).value);
                                                                        // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                        addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                    } else {
                                                                        showMessage("Please select a quantity!", "info")
                                                                    }
                                                                }}
                                                            >Add To Cart</Button>
                                                        :
                                                        <Button className='' size='sm' variant="outline-secondary"
                                                            onClick={() => {
                                                                if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                    // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                    // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                    let price = product?.price
                                                                    // console.log(document.getElementById(`product_${product?._id}`).value);

                                                                    // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                    addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                } else {
                                                                    showMessage("Please select a quantity!", "info")
                                                                }
                                                            }}
                                                        >Add To Cart</Button>

                                                }
                                            </Card.Footer>
                                    }
                                </> : <>
                                    {
                                        !product?.isReorderable ?
                                            <>
                                                {
                                                    (!product?.isSoldOutUsa) ?
                                                        <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                                                            {
                                                                carts.length ?
                                                                    carts.filter(cart => cart.productId._id == product._id).length ?
                                                                        <Button className='' variant="outline-success" size='sm'
                                                                            onClick={() => { navigate(`/cart-detail`) }}
                                                                        >Go To Cart</Button>
                                                                        :
                                                                        <Button className='' size='sm' variant="outline-secondary"
                                                                            onClick={() => {
                                                                                if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                                    // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                                    // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                                    let price = product?.price
                                                                                    // console.log(document.getElementById(`product_${product?._id}`).value);
                                                                                    // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                    addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                } else {
                                                                                    showMessage("Please select a quantity!", "info")
                                                                                }
                                                                            }}
                                                                        >Add To Cart</Button>
                                                                    :
                                                                    <Button className='' size='sm' variant="outline-secondary"
                                                                        onClick={() => {
                                                                            if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                                // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                                // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                                let price = product?.price
                                                                                // console.log(document.getElementById(`product_${product?._id}`).value);

                                                                                // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                                addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                            } else {
                                                                                showMessage("Please select a quantity!", "info")
                                                                            }
                                                                        }}
                                                                    >Add To Cart</Button>

                                                            }
                                                        </Card.Footer>
                                                        : ""
                                                }
                                            </>
                                            :
                                            <Card.Footer className='' style={{ width: "77%", display: "flex", justifyContent: "center", marginTop: "-17px" }}>

                                                {
                                                    carts.length ?
                                                        carts.filter(cart => cart.productId._id == product._id).length ?
                                                            <Button className='' variant="outline-success" size='sm'
                                                                onClick={() => { navigate(`/cart-detail`) }}
                                                            >Go To Cart</Button>
                                                            :
                                                            <Button className='' size='sm' variant="outline-secondary"
                                                                onClick={() => {
                                                                    if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                        // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                        // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                        let price = product?.price
                                                                        // console.log(document.getElementById(`product_${product?._id}`).value);
                                                                        // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                        addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                    } else {
                                                                        showMessage("Please select a quantity!", "info")
                                                                    }
                                                                }}
                                                            >Add To Cart</Button>
                                                        :
                                                        <Button className='' size='sm' variant="outline-secondary"
                                                            onClick={() => {
                                                                if (document.getElementById(`product_${product?._id}`).value !== "Select qty...") {
                                                                    // console.log(getPriceByPricingMatrix(product?.priceCode.slice(0, 2)));
                                                                    // let price = getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) : 0.00
                                                                    let price = product?.price
                                                                    // console.log(document.getElementById(`product_${product?._id}`).value);

                                                                    // addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                    addToCart({ productId: product?._id, userId: customers[customers?.length - 1]?._id, price: product?.priceFromPM ? product.priceFromPM : product?.price, multipliers: product.multipliers, productQuantity: document.getElementById(`product_${product?._id}`).value, subTotal: (parseInt(document.getElementById(`product_${product?._id}`).value) * parseFloat(product?.priceFromPM ? product.priceFromPM : product?.price).toFixed(2)).toFixed(2), image: product?.uploadSmallPoster?.url ? product?.uploadSmallPoster?.url : DefaultImg })
                                                                } else {
                                                                    showMessage("Please select a quantity!", "info")
                                                                }
                                                            }}
                                                        >Add To Cart</Button>
                                                }
                                            </Card.Footer>
                                    }
                                </>

                        }
                    </> : ""
                }
            </Card>
        </Col >
    )
}

export default ProductCard