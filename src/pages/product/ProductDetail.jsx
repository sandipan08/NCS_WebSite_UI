import { useEffect, React, useState, useContext } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import AppContentBody from '../../components/elements/builders/AppContentBody';

import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { AiOutlineHeart } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { FaHeart } from 'react-icons/fa'
import { GrFormSearch } from 'react-icons/gr'
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';
import { CartContext } from '../../states/contexts/CartContext';
// import defaultProduct from "../../image/default-product.png"
import DefaultImg from '../../image/default_product_img.jpg'
import ViewProductImageModal from '../../components/elements/components/ViewProductImageModal';
import ViewProductLargeImageModal from '../../components/elements/components/ViewProductLargeImageModal';
import { WishListContext } from '../../states/contexts/wishListContext';
import ProductCard from '../../components/elements/components/ProductCard';
import LargeProductCard from '../../components/elements/components/LargeProductCard';
import ProductDetailSkeleton from '../../components/elements/components/ProductDetailSkeleton';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';

export default function ProductDetail() {
    const [collection, setCollection] = useState(null);
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);
    const [wishLists, setWishLists] = useState([]);
    const [country, setCountry] = useState(null);
    const [countryList, setCountryList] = useState([{ text: "Select country", _id: 1 }]);
    const [productImage, setProductImage] = useState(null);
    const [usdMultiplier, setUSDMultiplier] = useState(null);
    const [cadMultiplier, setCADMultiplier] = useState(null);
    const [largeImageProducts, setLargeImageProducts] = useState([]);
    const [smallImageProducts, setSmallImageProducts] = useState([]);
    const [pricingMatrixes, setPricingMatrixes] = useState([]);
    const [usdMatrix, setUsdMatrix] = useState([]);
    const [cadMatrix, setCadMatrix] = useState([]);
    const [qtys, setQtys] = useState([]);
    const [state, setState] = useState([]);
    const [industryCodes, setIndustryCodes] = useState([]);
    const [industryCode, setIndustryCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [largeModalShow, setLargeModalShow] = useState(false);

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)
    const { dispatch: cartDispatch, quantity } = useContext(CartContext)
    const { dispatch: wishListDispatch, quantity: wishListQuantity } = useContext(WishListContext)
    const { dispatch: iconDispatch, isNorthchott, isBanyan, isPatrick, color, textColor, brandType, backgroundColor, darkBackgroundColor } = useContext(BrandIconContext)

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    // console.log(customers);
    const { id } = useParams();
    const { search } = useLocation();
    const navigate = useNavigate();
    let type = search.split("=")[1]
    let largeImages = [];
    let smallImages = []
    let selectedProductArray = []
    // let country = null;
    let prices = []



    const setTestCustomer = (customers, array) => {
        if (customers?.length) {
            // array.unshift({ _id: "--SELECT A REGION--", name: "--SELECT A REGION--" })
            // array.unshift(customers[0]) // Add test account at the begening of array
            // array.unshift({ _id: "--TEST ACCOUNT--", name: "--TEST ACCOUNT--" })
        }
        return array;
    }

    const getRegion = async () => {
        let options = [];
        let regions = [];

        try {
            ApiService.setHeader()
            const response1 = await ApiService.get(`/shop/customList/title?model=${getModelRoute(user).model}&title=${"Territory Name USA"}`)
            const response2 = await ApiService.get(`/shop/customList/title?model=${getModelRoute(user).model}&title=${"Territory Name Canada"}`)

            Array.prototype.push.apply(regions, [{ _id: "-CANADA-", name: "-CANADA-" }])
            Array.prototype.push.apply(regions, response2?.data.document.options)

            Array.prototype.push.apply(regions, [{ _id: "-USA-", "name": "-USA-" }])
            Array.prototype.push.apply(regions, response1?.data.document.options)

            // console.log("options", options)
            // console.log("user", user)

            // // Sales rep and sale amanager can see only their teritory.
            // if (user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("SALES_MANAGER")) {

            //     Array.prototype.push.apply(options, [{ _id: "-CANADA-", name: "-CANADA-" }])
            //     user?.region.map(ele => {

            //         if (response2?.data.document.options.find(e => e.text == ele.text) != undefined)
            //             Array.prototype.push.apply(options, [response2?.data.document.options.find(e => e.text == ele.text)])
            //     })

            //     Array.prototype.push.apply(options, [{ _id: "-USA-", "name": "-USA-" }])
            //     user?.region.map(ele => {

            //         if (response1?.data.document.options.find(e => e.text == ele.text) != undefined)
            //             Array.prototype.push.apply(options, [response1?.data.document.options.find(e => e.text == ele.text)])
            //     })

            //     const array = setTestCustomer(customers, options)
            //     array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            //     setState(array)
            //     // setState([region])
            // } else {
            //     const array = setTestCustomer(customers, regions)
            //     array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            //     setState(array)
            // }

            const array = setTestCustomer(customers, regions)
            array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            setState(array)
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }
    // console.log(state);

    const getCartDetail = () => {
        ApiService.setHeader()
        ApiService.get(`shop/cart/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                setCarts(response?.data.documents)
                cartDispatch({ type: "ADD_TO_CART_QUANTITY", payload: response?.data.documents?.length });
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getWishListDetail = () => {
        ApiService.setHeader()
        ApiService.get(`shop/wishList/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`).then(response => {
            console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                setWishLists(response?.data?.documents)
                wishListDispatch({ type: "ADD_TO_WISHLIST_QUANTITY", payload: response?.data?.documents?.length });
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }
    // console.log(wishListQuantity);

    const getCollection = () => {
        setIsLoading(true)
        // console.log(customers);

        ApiService.setHeader()
        ApiService.get(`shop/pricingMatrix?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data.documents);
            if (response?.data.isSuccess) {
                // setPricingMatrixes(response.data.documents)
                prices = response.data.documents

                if (prices.length) {
                    ApiService.setHeader()
                    ApiService.get(`shop/collection/${id}?model=${getModelRoute(user).model}`).then(response => {
                        // console.log(response?.data.document?.name);
                        if (response?.data.isSuccess) {
                            setCollection(response?.data.document)
                            if (customers != null) {
                                getAllProductsByCollection(response?.data.document?.name)
                            } else {
                                getAllProductsByCollectionForNonLoggedInUser(response?.data.document?.name)
                            }
                            setIsLoading(false)
                        }
                    }).catch(error => {
                        console.log(error)
                        // console.log("Else Catch")
                        // showMessage(error.response.data.message, "error")
                    })
                } else {
                    navigate(-1)
                    showMessage("No Pricing matrix data found!! Please contact to administrator.", "info")
                }
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })

        // ApiService.setHeader()
        // ApiService.get(`shop/collection/${id}`).then(response => {
        //     // console.log(response?.data.document?.name);
        //     if (response?.data.isSuccess) {
        //         setCollection(response?.data.document)
        //         getAllProductsByCollection(response?.data.document?.name)
        //         setIsLoading(false)
        //     }
        // }).catch(error => {
        //     console.log(error)
        //     // console.log("Else Catch")
        //     // showMessage(error.response.data.message, "error")
        // })
    }

    const getAllProductsByCollection = (name) => {
        // console.log(name)
        let country = ""
        let array = []
        let productTypeArray = []

        // console.log(customers != null && customers[customers?.length - 1]?.productType?.length)
        let productType = customers != null ? customers[customers?.length - 1]?.productType?.length && customers[customers?.length - 1]?.productType.map(ele => {
            let obj = {}
            obj.type = ele.text
            productTypeArray.push(obj)
        }) : []

        let countrydesignations = customers != null ? customers[customers?.length - 1]?.countryDesignations?.length && customers[customers?.length - 1]?.countryDesignations?.map(ele => {
            let obj = {}
            obj.countryDesignation = ele.text
            array.push(obj)
        }) : []

        console.log(productTypeArray)
        console.log(array)

        ApiService.setHeader()
        // ApiService.get(`shop/product/collection/${name}?productType=${JSON.stringify(productType)}&countryDesinations=${countrydesignations?.length ? countrydesignations : null}`).then(response => {
        ApiService.get(`shop/product/collection/${name}?model=${getModelRoute(user).model}&productType=${JSON.stringify(productTypeArray)}&countryDesinations=${JSON.stringify(array)}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                customers != null && customers[customers?.length - 1]?.addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        // console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })


                // console.log("arrayUniqueByKey: ", pricingMatrixes);
                // console.log("arrayUniqueByKey: ", prices);
                // console.log("response?.data.documents: ", response?.data.documents);

                // response?.data.documents?.filter(ele => ele.name.includes(":")).map(product => {
                response?.data?.documents?.map(product => {

                    // Get pricing matrix based on products's priceCode
                    const key = `${country} ${customers[customers?.length - 1]?.priceLevel}`.toUpperCase()
                    console.log(key);

                    const pm = prices?.filter(ele => ele.Code === product.priceCode)
                    console.log("pm: ", pm);

                    // Set price from pricing matrix in each product
                    if (pm.length) {
                        // console.log("pm: ", Object.entries(pm[0]));
                        for (let ele of Object.entries(pm[0])) {
                            if (ele[0].toUpperCase() === key) {
                                // console.log("product price: ", ele[1]);
                                // Set price from pricing matrix into product
                                product.priceFromPM = ele[1]
                            }
                        }

                    }

                    if (product?.uploadLargePoster?.url) {
                        // product.multipliers = formatArray(product.usdFullMultiplier ? product.usdFullMultiplier : product.cadFullMultiplier ? product.cadFullMultiplier : 1)
                        largeImages.push(product)

                        if (country == "CANADA") {
                            // setCADMultiplier(formatArray(product.cadMultiplier))
                            product.multipliers = formatArray(product?.cadFullMultiplier ? product?.cadFullMultiplier : 1)
                            // product.multiplier = product.cadFullMultiplier ? product.cadFullMultiplier : 1
                        } else {
                            // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                            product.multipliers = formatArray(product?.usdFullMultiplier ? product?.usdFullMultiplier : 1)
                            // product.multiplier = product.usdFullMultiplier ? product.usdFullMultiplier : 1
                        }
                    } else {
                        smallImages.push(product)

                        if (country == "CANADA") {
                            // setCADMultiplier(formatArray(product.cadMultiplier))
                            product.multipliers = formatArray(product?.cadFullMultiplier ? product?.cadFullMultiplier : 1)
                            // product.multiplier = product.cadFullMultiplier ? product.cadFullMultiplier : 1
                        } else {
                            // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                            product.multipliers = formatArray(product?.usdFullMultiplier ? product?.usdFullMultiplier : 1)
                            // product.multiplier = product.usdFullMultiplier ? product.usdFullMultiplier : 1
                        }
                    }
                })
                // console.log(smallImages);
                setLargeImageProducts(largeImages)
                setSmallImageProducts(smallImages)
                setProducts(response?.data.documents)
            }
        }).catch(error => {
            console.log(error)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getAllProductsByCollectionForNonLoggedInUser = (name) => {
        // console.log(name)
        let country = ""
        let array = []
        let productTypeArray = []

        ApiService.setHeader()
        // ApiService.get(`shop/product/collection/${name}?productType=${JSON.stringify(productType)}&countryDesinations=${countrydesignations?.length ? countrydesignations : null}`).then(response => {
        ApiService.get(`shop/product/collection/${name}?model=${getModelRoute(user).model}&for=nonLoggedInUser`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                customers != null && customers[customers?.length - 1]?.addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        // console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })


                // console.log("arrayUniqueByKey: ", pricingMatrixes);
                // console.log("arrayUniqueByKey: ", prices);
                // console.log("response?.data.documents: ", response?.data.documents);

                // response?.data.documents?.filter(ele => ele.name.includes(":")).map(product => {
                response?.data?.documents?.map(product => {

                    if (product?.uploadLargePoster?.url) {
                        // product.multipliers = formatArray(product.usdFullMultiplier ? product.usdFullMultiplier : product.cadFullMultiplier ? product.cadFullMultiplier : 1)
                        largeImages.push(product)

                        if (country == "CANADA") {
                            // setCADMultiplier(formatArray(product.cadMultiplier))
                            product.multipliers = formatArray(product?.cadFullMultiplier ? product?.cadFullMultiplier : 1)
                            // product.multiplier = product.cadFullMultiplier ? product.cadFullMultiplier : 1
                        } else {
                            // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                            product.multipliers = formatArray(product?.usdFullMultiplier ? product?.usdFullMultiplier : 1)
                            // product.multiplier = product.usdFullMultiplier ? product.usdFullMultiplier : 1
                        }
                    } else {
                        smallImages.push(product)

                        if (country == "CANADA") {
                            // setCADMultiplier(formatArray(product.cadMultiplier))
                            product.multipliers = formatArray(product?.cadFullMultiplier ? product?.cadFullMultiplier : 1)
                            // product.multiplier = product.cadFullMultiplier ? product.cadFullMultiplier : 1
                        } else {
                            // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                            product.multipliers = formatArray(product?.usdFullMultiplier ? product?.usdFullMultiplier : 1)
                            // product.multiplier = product.usdFullMultiplier ? product.usdFullMultiplier : 1
                        }
                    }
                })
                // console.log(smallImages);
                setLargeImageProducts(largeImages)
                setSmallImageProducts(smallImages)
                setProducts(response?.data.documents)
            }
        }).catch(error => {
            console.log(error)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }


    const addCart = async (data) => {
        data.shipdate = collection?.date
        data.collectionName = collection?.name

        ApiService.post(`shop/cart?model=${getModelRoute(user).model}`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.document);
                getCartDetail()

                showMessage("Item added", "success")
                selectedProductArray = []
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const addToCart = (data) => {
        // console.log(data);
        // console.log(customer);

        addCart(data)

    }

    const getPricingMatrix = async () => {
        await ApiService.get(`shop/pricingMatrix/getPrice?model=${getModelRoute(user).model}&priceLevel=${customers[customers?.length - 1]?.priceLevel}`).then(response => {
            // console.log(response.data.documents);
            if (response?.data.isSuccess) {
                setUsdMatrix(response.data.documents.usd)
                setCadMatrix(response.data.documents.cad)
                // console.log(response.data.documents.usd?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`)))
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }


    const getPriceByPricingMatrix = (data) => {
        // console.log(data);
        let cntry = null

        let priceCode = data.toLowerCase().trim()
        // console.log(customers[customers?.length - 1]);
        // console.log(priceCode);
        customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
            if (address?.isDefaultBilling) {
                // console.log(address?.country?.text);
                cntry = address?.country?.text
            }
        })

        console.log(cadMatrix);

        if (cntry == "CANADA") {
            return cadMatrix?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`))[0]?.value
        } else {
            return usdMatrix?.filter(ele => (ele?.label == customers[customers?.length - 1].priceLevel && ele?.scriptid == `_pct_ncs_${priceCode}`))[0]?.value
        }
    }

    const findProductMultiplierAndFormatArray = (productId) => {
        // let country = null;
        setCADMultiplier([])
        setQtys([])


        ApiService.setHeader()
        ApiService.get(`shop/product/${productId}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                customers[customers?.length - 1].addresses.length && customers[customers?.length - 1].addresses.map(address => {
                    if (address?.isDefaultBilling) {
                        // console.log(address?.country?.text);
                        country = address?.country?.text
                    }
                })

                console.log(response.data.document);
                // if (response.data.document.cadFullMultiplier && response.data.document.usdFullMultiplier) {
                if (country == "CANADA") {
                    // setCADMultiplier(formatArray(response.data.document.cadMultiplier))
                    formatArray(response.data.document.cadFullMultiplier ? response.data.document.cadFullMultiplier : 1)
                } else {
                    // setUSDMultiplier(formatArray(response.data.document.usdMultiplier))
                    formatArray(response.data.document.usdFullMultiplier ? response.data.document.usdFullMultiplier : 1)
                }
                // } else {
                //     setCADMultiplier([])
                //     setQtys([])
                //     showMessage(`The product ${response.data.document.name} does not have cadFullMultiplier or usdFullMultiplier`, "error")
                // }
            }

            // console.log(priceArray);

        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }

    const formatArray = (multiplier, calledFrom) => {
        // console.log(multiplier);
        // console.log(calledFrom);
        let array = []
        for (let i = 1; i <= 10; i++) {
            array.push((i * parseInt(multiplier)))
        }
        // console.log(array);
        if (calledFrom !== "checkBox") {
            // setCADMultiplier(array)
            setQtys(array)
        }
        return array
    }

    const setQuantity = () => {
        setCADMultiplier(qtys)
    }

    const moveToWishList = async (product, customer) => {
        // console.log(productId);
        // console.log(customer);
        const data = {
            productId: product?._id,
            userId: customer?._id
        }
        console.log(data);

        await ApiService.post(`shop/wishList?model=${getModelRoute(user).model}`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                // console.log(response?.data.document);
                getCartDetail()
                getWishListDetail()

                showMessage("Item added to wishlist.", "success")
            }
        }).catch(error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        })
    }


    const addAllProductToCart = async () => {
        let array = []
        let qtyArray = []


        await Promise.all(
            products?.length && products?.map(async product => {
                let obj = {}
                // let price = !getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? 0.00 : getPriceByPricingMatrix(product?.priceCode.slice(0, 2))
                let price = product.price

                // Get qty array for each product
                await ApiService.setHeader()
                await ApiService.get(`shop/product/${product?._id}?model=${getModelRoute(user).model}`).then(response => {
                    if (response?.data.isSuccess) {

                        if (country == "CANADA") {
                            qtyArray = formatArray(response.data.document.cadMultiplier ? response.data.document.cadMultiplier : 1)
                        } else {
                            qtyArray = formatArray(response.data.document.usdMultiplier ? response.data.document.usdMultiplier : 1)
                        }
                    }
                }).catch(error => {
                    console.log(error.response.data)
                    showMessage(error.response.data.message, "error")
                })

                obj.productId = product?._id
                obj.userId = customers[customers?.length - 1]?._id
                obj.price = price
                obj.productQuantity = qtyArray[0]
                obj.subTotal = parseInt(qtyArray[0]) * parseFloat(price)

                array.push(obj)
                // console.log(findProductMultiplierAndFormatArray(product?._id));
            })
        )

        // console.log(array);
        addToCart(array)
    }

    const getCustomerCounry = () => {
        // console.log(customers);

        if ((customers[customers?.length - 1].addresses?.length && customers?.length > 1)) {
            customers[customers?.length - 1].addresses.map(address => {
                if (address?.isDefaultBilling) {
                    // console.log(address?.country?.text);
                    // country = address?.country?.text
                    setCountry(address?.country?.text)
                }
            })
        } else {
            setCountry(null)
        }

    }

    const addSelectedProductsToCart = async (id, product, e, quantity) => {
        console.log(quantity);
        if (document.getElementById(id).checked) {
            let obj = {}
            let arr = []

            getCustomerCounry()
            // let price = !getPriceByPricingMatrix(product?.priceCode.slice(0, 2)) ? 0.00 : getPriceByPricingMatrix(product?.priceCode.slice(0, 2))
            let price = product.price

            ApiService.setHeader()
            await ApiService.get(`shop/product/${product?._id}?model=${getModelRoute(user).model}`).then(response => {
                if (response?.data.isSuccess) {
                    if (country == "CANADA") {
                        arr = formatArray(response.data.document.cadMultiplier, "checkBox")
                    } else {
                        arr = formatArray(response.data.document.usdMultiplier, "checkBox")
                    }
                }
            }).catch(error => {
                console.log(error.response.data)
                showMessage(error.response.data.message, "error")
            })

            obj.productId = product?._id
            obj.userId = customers[customers?.length - 1]?._id
            obj.price = product.price
            obj.productQuantity = quantity
            obj.multipliers = product.multipliers
            obj.subTotal = (parseFloat(quantity) * parseFloat(price)).toFixed(2)
            obj.image = product?.uploadLargePoster?.url ? product?.uploadLargePoster?.url : product?.uploadSmallPoster?.url

            selectedProductArray.push(obj)
            console.log(selectedProductArray)


        } else {
            let filterproductArray = selectedProductArray.filter((item) => item.productId !== e.target.value);
            selectedProductArray = filterproductArray
            // console.log(selectedProductArray);
        }
    }

    const getIndustryCodes = (data) => {
        ApiService.setHeader()
        ApiService.get(`shop/customList/title?model=${getModelRoute(user).model}&title=NCS INDUSTRY CODES`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                setIndustryCodes(response?.data.document.options)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getCountryList = (data) => {
        ApiService.setHeader()
        ApiService.get(`shop/customList/title?model=${getModelRoute(user).model}&title=NCS COUNTRY LIST`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                countryList.push(...response?.data.document.options)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const gotoDesignerPage = (designerNsId) => {
        ApiService.setHeader()
        ApiService.get(`shop/designer/byId/${designerNsId}?model=${getModelRoute(user).model}`).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                navigate(`/designer-profile/${response?.data?.document?._id}?model=${getModelRoute(user).model}`)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const goToRapidOrder = () => {
        navigate(`/rapid-order`)
    }




    useEffect(() => {
        // console.log(id);
        // getPricingMatrixes()
        if (customers != null) {
            getCartDetail()
            getWishListDetail()
            getCustomerCounry()
        }

        getIndustryCodes()
        getCountryList()
        getRegion()
        getCollection()

        // console.log(country);
    }, [id]);

    // console.log(country);

    return (
        <>
            {
                isLoading ? <ProductDetailSkeleton />
                    :
                    <Container className='' style={{ width: "100%" }}>
                        {/* <AppContentBody> */}
                        {/* <Container> */}
                        {!customer ? "" : <Row xs={1} sm={1} md={2} lg={2} className='mb-3 mt-3' style={{ backgroundColor: backgroundColor, borderBottom: "1px solid #666666", padding: "10px 30px", }}>
                            <div className='p-1 m-0' style={{ width: "100%", fontSize: "13px", color: textColor }}>
                                Welcome <span style={{ fontWeight: "600" }}>{user?.name}!</span> Use "Customer" tab to access customer settings. You have selected "<span style={{ fontWeight: "600" }}>{customer?.name}</span>". <span><Link to='/region-customer'>To change, click here.</Link></span>

                            </div>
                        </Row>}

                        <Row xs={1} sm={1} md={2} lg={2} className=''>
                            <Col className='col-xl-9 col-lg-9 col-md-9 col-sm-12 p-0' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Row className='col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0'>
                                    <h3 style={{ paddingLeft: "0px", fontSize: "18px" }}><b>{collection?.name}</b></h3>
                                    {/* <p><b>By</b> {type.replace("%20", " ")}</p> */}
                                    <div style={{ paddingLeft: "0px" }}>
                                        By {collection?.designer?.length ? collection?.designer?.map(designer => {
                                            // console.log(designer);
                                            if (collection?.designer?.length == 1 && designer?.id) {

                                                return <Link className='' key={designer?._id} style={{ display: "inline-block", fontSize: "15px", color: "black", fontWeight: "bold" }} as={Link} to={`/designer-profile/${designer?.id}`}>{designer?.text}&nbsp; & &nbsp;</Link>

                                            } else if (collection?.designer?.length == 1 && !designer?.id) {
                                                return <span key={designer?._id} style={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
                                                    onClick={() => gotoDesignerPage(designer?.value)}
                                                >{designer?.text}&nbsp; & &nbsp;</span>
                                            }
                                        }) : ""}

                                        {collection?.designerTwo?.length ? collection?.designerTwo?.map((designer, index) => {
                                            if (designer?.id) {
                                                // console.log(collection?.designerTwo[index + 1]);
                                                if (collection?.designerTwo[index + 1]) {
                                                    return <Link className='' key={designer?._id} style={{ display: "inline-block", fontSize: "15px", color: "black", fontWeight: "bold" }} as={Link} to={`/designer-profile/${designer?.id}`}>{designer?.text}&nbsp; & &nbsp;</Link>
                                                } else {
                                                    return <Link className='' key={designer?._id} style={{ display: "inline-block", fontSize: "15px", color: "black", fontWeight: "bold" }} as={Link} to={`/designer-profile/${designer?.id}`}>{designer?.text}</Link>
                                                }

                                            } else if (!designer?.id) {
                                                if (collection?.designerTwo[index + 1]) {
                                                    return <span key={designer?._id} style={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
                                                        onClick={() => gotoDesignerPage(designer?.value)}
                                                    >{designer?.text}&nbsp;& &nbsp;</span>
                                                } else {
                                                    return <span key={designer?._id} style={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
                                                        onClick={() => gotoDesignerPage(designer?.value)}
                                                    >{designer?.text}</span>
                                                }
                                            }
                                        }) : ""}
                                    </div>
                                    <p style={{ paddingLeft: "0px", fontSize: "15px" }}>Available Now</p>
                                </Row>

                                {/* {customers?.length > 1 ? <Row className='make-verticle-section col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0' style={{ gap: "10px" }}> */}
                                <Row className='make-verticle-section col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0' style={{ gap: "10px" }}>
                                    <Col className='p-0' style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Button className='animet_btton' size='sm' style={{ backgroundColor: "#ae3429", border: "none", fontWeight: 600, fontSize: "14px" }}
                                            onClick={goToRapidOrder}
                                        >
                                            Rapid Order Placement
                                        </Button>
                                    </Col>
                                    <Col className='p-0' style={{ color: "red", fontWeight: 640, textAlign: "center" }}>
                                        Two FREE digitally printed Shop Samples quilt tops are available when you purchase this full collection. Click HERE to view Shop Samples!
                                    </Col>

                                    <Col className='p-0' style={{ fontWeight: 640, textAlign: "center", fontSize: "14px" }}>
                                        Order by May 9th, 2023 to guarantee delivery of the full collection
                                    </Col>

                                    <Col className='p-0   make-horizontal-sectionborder' style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Button className='animet_btton' size='sm' style={{ backgroundColor: backgroundColor, border: "none", fontWeight: 600, fontSize: "14px" }}
                                        // onClick={addAllProductToCart}
                                        >
                                            Select Full Collection
                                        </Button>
                                        <Button className='animet_btton' size='sm' style={{ backgroundColor: backgroundColor, border: "none", fontWeight: 600, fontSize: "14px" }}
                                            onClick={() => {
                                                // console.log(selectedProductArray);
                                                if (selectedProductArray.length) {
                                                    addToCart(selectedProductArray)
                                                } else {
                                                    showMessage("Please select atleast one product!", "warning")
                                                }
                                            }}
                                        >Add All Selected</Button>
                                        <Button className='animet_btton' size='sm' style={{ backgroundColor: backgroundColor, border: "none", fontWeight: 600, fontSize: "14px" }}>Select Full Collection - Half Price</Button>
                                    </Col>
                                </Row>
                                {/* </Row> : ""} */}

                                <Row className='mt-5 p-0 ' style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    {collection?.posterImage?.url ? <Col className='col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0'>
                                        <LazyLoadImage
                                            style={{ objectFit: "fill" }}
                                            alt={""}
                                            width={"100%"}
                                            height={"250"}
                                            effect="blur"
                                            src={collection?.posterImage.url ? collection?.posterImage.url : DefaultImg} />
                                    </Col> : null}
                                    <Col>
                                        {/* <AppContentBody> */}
                                        <Container className=''>
                                            <Row>
                                                {largeImageProducts?.length ? <Col className=' p-0 col-xl-3 col-lg-3 col-md-3 col-sm-3' style={{ marginRight: "5px" }}>

                                                    {
                                                        largeImageProducts?.length ? largeImageProducts?.map(product => {
                                                            return <LargeProductCard key={product?._id} setQuantity={setQuantity} product={product} customers={customers} wishLists={wishLists} navigate={navigate} moveToWishList={moveToWishList} carts={carts} addSelectedProductsToCart={addSelectedProductsToCart} getPriceByPricingMatrix={getPriceByPricingMatrix} findProductMultiplierAndFormatArray={findProductMultiplierAndFormatArray} cadMultiplier={cadMultiplier} addToCart={addToCart} setProductImage={setProductImage} setLargeModalShow={setLargeModalShow} country={country} />



                                                        }) : ""
                                                    }

                                                </Col> : ""}

                                                {smallImageProducts?.length ? <Col className=' p-0'>
                                                    <Row xs={1} sm={2} md={2} lg={4} style={{ displayL: "flex", justifyContent: "center" }}>
                                                        {
                                                            smallImageProducts?.length ? smallImageProducts?.map(product => {
                                                                // width: "150px", margin: "10px",
                                                                return <ProductCard key={product?._id} setQuantity={setQuantity} product={product} customers={customers} wishLists={wishLists} navigate={navigate} moveToWishList={moveToWishList} carts={carts} addSelectedProductsToCart={addSelectedProductsToCart} getPriceByPricingMatrix={getPriceByPricingMatrix} findProductMultiplierAndFormatArray={findProductMultiplierAndFormatArray} cadMultiplier={cadMultiplier} addToCart={addToCart} setProductImage={setProductImage} setModalShow={setModalShow} country={country} />


                                                            }) : ""
                                                        }
                                                    </Row>
                                                </Col> : ""}
                                            </Row>
                                        </Container>
                                        {/* </AppContentBody> */}
                                    </Col>
                                </Row>
                            </Col>

                            {/* PRODUCT FINDER */}
                            <Col className='scroll scroll4 col-xl-3 col-lg-3 col-md-3 col-sm-12 p-0' style={{ height: "1000px", overflowY: "auto", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

                                <div className='' style={{ height: "100%", fontWeight: 700, border: "1px solid gray", borderTop: "none", width: "89.5%", marginLeft: "35px" }}>
                                    <p className='p-0 m-0 pt-1 pb-1' style={{ backgroundColor: backgroundColor, color: "white" }}>PRODUCT FINDER</p>
                                    <div className='p-2 mt-2' style={{ height: "24%", display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <Form.Select size='sm' className='' aria-label="Default select example"
                                            onChange={e => {
                                                console.log();
                                                setIndustryCode(e.target.value)
                                            }}>
                                            <option value={null}>{'Select Industry Code...'}</option>
                                            {
                                                industryCodes?.length && industryCodes.map(industryCode => {
                                                    // console.log(industryCode);
                                                    return <option key={industryCode?.value} value={industryCode?.text}>{industryCode?.text}</option>
                                                })
                                            }
                                        </Form.Select>

                                        {
                                            industryCode == 'INTERNATIONAL DISTRIBUTOR' ?
                                                <Form.Select size='sm' className='' aria-label="Default select example"
                                                    onChange={e => {
                                                        console.log();
                                                        navigate(`/product-finder/${id}?state=${e.target.value}&IC=${industryCode}`)
                                                    }}
                                                >
                                                    {/* return <option>Select State / Prov</option> */}
                                                    {
                                                        countryList?.length && countryList.map(ele => {
                                                            // console.log(ele);
                                                            return <option key={ele?._id} value={ele?.text}>{ele?.text}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                                :
                                                <Form.Select size='sm' className='' aria-label="Default select example"
                                                    onChange={e => {
                                                        console.log();
                                                        navigate(`/product-finder/${id}?state=${e.target.value}&IC=${industryCode}`)
                                                    }}
                                                >
                                                    {/* return <option>Select State / Prov</option> */}
                                                    {
                                                        state?.length && state.map(ele => {
                                                            // console.log(ele);
                                                            return <option key={ele?._id} value={ele?.name}>{ele?.name}</option>
                                                        })
                                                    }
                                                </Form.Select>
                                        }
                                        {/* <Form.Select size='sm' className='' aria-label="Default select example"
                                            onChange={e => {
                                                console.log();
                                                navigate(`/product-finder/${id}?state=${e.target.value}&IC=${industryCode}`)
                                            }}
                                        >
                                        {
                                            state?.length && state.map(ele => {
                                                // console.log(ele);
                                                return <option key={ele?._id} value={ele?.name}>{ele?.name}</option>
                                            })
                                        }
                                    </Form.Select> */}
                                        <div className=''>
                                            <p style={{ fontSize: "25px", fontWeight: 490 }}>My Fabric Order Total</p>
                                            <p style={{ fontSize: "28px", color: "#e3a856", fontWeight: 490 }}>$0.00</p>
                                        </div>
                                    </div>

                                    <div className='' style={{ backgroundColor: backgroundColor, fontWeight: 400, color: "white", fontSize: "15px", width: "100%", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>View List</div>

                                    <div className='p-2 mt-2' style={{ height: "17%", display: "flex", flexDirection: "column", gap: "20px" }}>
                                        <Button className='animet_btton' size='sm' variant="secondary" style={{ backgroundColor: backgroundColor, color: "white", border: "none", margin: "0px 40px 0px 40px" }}>Download Fabric Files</Button>
                                        <p className='mt-4' style={{ fontWeight: 400, fontSize: "15px", margin: "0px 55px 0px 55px" }}>Patterns can bepurchased through your local quilt shop.</p>
                                    </div>

                                    <hr style={{ backgroundColor: "gray" }} />
                                </div>
                            </Col>
                        </Row>
                        {/* </Container> */}
                        {/* </AppContentBody > */}
                        <ViewProductImageModal show={modalShow} productImage={productImage} setModalShow={setModalShow} />
                        <ViewProductLargeImageModal show={largeModalShow} productImage={productImage} setLargeModalShow={setLargeModalShow} />
                    </Container >
            }
        </>


    )
}
