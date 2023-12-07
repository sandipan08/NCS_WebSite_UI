import React, { useEffect, useContext, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useParams, useSearchParams } from 'react-router-dom';

import ApiService from '../../helpers/ApiServices';
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { getModelRoute } from '../../helpers/Utils';
import { UserContext } from '../../states/contexts/UserContext';

const PrintProductFinder = () => {
    const { id } = useParams();
    let [searchParams, setSearchParams] = useSearchParams();

    const [stateName, setStateName] = useState(searchParams.get("state"));
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState('');
    const [products, setProducts] = useState([]);
    const [regionCustomers, setRegionCustomers] = useState([]);
    const [industryCode, setIndustryCode] = useState(searchParams.get("IC"));

    const { customer } = useContext(CustomerContext)
    const { user } = useContext(UserContext)



    const getCollection = async () => {
        ApiService.setHeader()
        await ApiService.get(`shop/collection/${id}?model=${getModelRoute(user).model}`).then(async response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                setCollection(response?.data.document)
                getAllCustomerInSelectedRegion(response?.data.document?.name)
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getAllCustomerInSelectedRegion = async (collectionName) => {

        ApiService.setHeader()
        ApiService.get(`shop/user/buyProducts?model=${getModelRoute(user).model}&region=${stateName}&name=${collectionName}&industryCode=${industryCode}`).then(response => {
            // console.log(response.data.documents);

            // Remove logged in store from the list
            const custs = response.data.documents.filter(ele => ele.customer?.custData?.name !== customer?.name)
            // console.log(custs);

            if (response?.data.isSuccess) {
                setProducts(response.data.products)
                setRegionCustomers(custs)
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }



    useEffect(() => {
        setIsLoading(true)
        getCollection()
    }, []);


    return (
        <Container className='' style={{ width: "100%" }}>
            <Row style={{ fontSize: "14px" }}>
                <h4 style={{ fontWeight: 400 }}>Northcott Product Finder Results:</h4>
                <div style={{ lineHeight: "10px" }}>
                    <p><span style={{ fontWeight: 500 }}>Collection :</span><span>{collection?.name}</span></p>
                    <p><span style={{ fontWeight: 500 }}>ColorWay :</span><span>{collection?.colorDescription}</span></p>
                    <p><span style={{ fontWeight: 500 }}>State/Prov :</span><span>{stateName}</span></p>
                </div>
            </Row>
            <Row style={{ fontSize: "14px" }}>
                <h4 style={{ fontWeight: 400 }}>The following stores have purchased these items:</h4>

                {
                    regionCustomers?.length ?
                        regionCustomers?.map(regionCustomer => {
                            return <div key={regionCustomer?.customer?.custData?._id} className='mb-3' style={{ display: "flex", flexDirection: "column" }}>
                                <span><span style={{ fontWeight: 500 }}>Name :</span><span>{regionCustomer?.customer?.customer}</span></span>
                                <span><span style={{ fontWeight: 500 }}>Address :</span><span></span></span>
                                <span><span style={{ fontWeight: 500 }}>Email :</span><span>{regionCustomer?.customer?.email}</span></span>
                                <span><span style={{ fontWeight: 500 }}>Website :</span><span>{regionCustomer?.customer?.website}</span></span>
                                <span style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 500 }}>Purchased :</span>
                                    <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                                        {
                                            products?.length ? products?.map(product => {
                                                if (regionCustomer[product?.name])
                                                    return <span key={product?._id}>{product?.name.split(":")[1].trim()}</span>
                                            }) : ""
                                        }
                                    </span>
                                </span>
                            </div>
                        })
                        : ""
                }

            </Row>
        </Container>
    )
}

export default PrintProductFinder