import { React, useContext, useEffect, useState } from 'react'
import { Form, Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Card, Container, Row, Tab, Tabs } from 'react-bootstrap';

import DefaultImg from '../../image/default_product_img.jpg'
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { UserContext } from '../../states/contexts/UserContext';

const SearchDetail = () => {
    const [state, setState] = useState([]);
    const [tabKey, setTabKey] = useState();

    const { dispatch: iconDispatch, ...brandIconObject } = useContext(BrandIconContext)
    const { user } = useContext(UserContext)

    const { searchItem } = useParams()
    const navigate = useNavigate()
    let cancelToken, to;

    const { isNorthchott, isBanyan, isPatrick } = brandIconObject


    const GlobalSearch = async () => {
        // console.log(searchItem);
        const controller = new AbortController();

        cancelToken = axios.CancelToken.source

        await axios.get(`shop/collection/globalSearch/${searchItem}?model=${getModelRoute(user).model}`, { signal: controller.signal }).then(response => {
            // console.log(response?.data.data[0][0]);

            setTabKey(response?.data.data[0][0])
            setState(response?.data.data)
            // data = response?.data.documents

        }).catch(e => {
            console.log(e.response?.data.message);
            // showMessage(e?.response?.data.message, "error")
        })

        // return data;
        controller.abort()
    }

    const goToSpecificPage = async (data) => {
        // console.log(data);
        switch (data.modelName.toUpperCase()) {
            case "DESIGNER":
                navigate(`/designer-profile/${data?._id}`)

                break;

            case "COLLECTION":
                if (isNorthchott)
                    navigate(`/product-detail/${data?._id}?type=NORTHCOTT`)
                if (isBanyan)
                    navigate(`/product-detail/${data?._id}?type=BANYAN BATIKS`)
                if (isPatrick)
                    navigate(`/product-detail/${data?._id}?type=PATRICK LOSE`)

                break;

            case "PRODUCT":
                ApiService.setHeader()
                await ApiService.get(`shop/collection/collectionByValue/${data?.mainCollection?.value}?model=${getModelRoute(user).model}`).then(res => {
                    // console.log(res?.data.document);

                    if (isNorthchott)
                        navigate(`/product-detail/${res?.data.document?._id}?type=NORTHCOTT`)
                    if (isBanyan)
                        navigate(`/product-detail/${res?.data.document?._id}?type=BANYAN BATIKS`)
                    if (isPatrick)
                        navigate(`/product-detail/${res?.data.document?._id}?type=PATRICK LOSE`)
                    // navigate(`/product-detail/${res?.data.document?._id}?type=PATRICK LOSE`)

                }).catch(e => {
                    console.log(e.response?.data.message);
                    showMessage(e?.response?.data.message, "error")
                })

                break;

            case "ORDER":
                navigate(`/order/${data?._id}`)

                break;

            default:
                break;
        }
    }


    useEffect(() => {
        GlobalSearch()
    }, [searchItem])



    return (
        <Container className='p-0'>
            <h3>Search results</h3>
            <hr />

            <Tabs defaultActiveKey={''} activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                {
                    state?.length ?
                        state.map(ele => {
                            // console.log(ele[0]);
                            // console.log(ele.slice(1));
                            return <Tab key={ele[0]} eventKey={ele[0]} title={`${ele[0]} (${ele.slice(1)?.length})`} style={{ marginLeft: "8px" }}>
                                <Row xs={1} sm={1} md={2} lg={2} className=''>
                                    {
                                        ele.slice(1)?.map((e, idx) => {
                                            console.log(e);
                                            return <Card key={e?.name} className='m-1' style={{ width: '14rem', border: "none", cursor: "pointer" }}
                                            // onClick={(ele) => { goToSpecificPage(e) }}
                                            >
                                                <Link key={idx}
                                                    to={e.modelName?.toUpperCase() === 'COLLECTION' ? `/product-detail/${e?._id}?type=NORTHCOTT` :
                                                        e.modelName?.toUpperCase() === 'PRODUCT' ? `/product-detail/${e?.collectionData[0]?._id}?type=NORTHCOTT` :
                                                            e.modelName?.toUpperCase() === 'DESIGNER' ? `/designer-profile/${e?._id}` :
                                                                e.modelName?.toUpperCase() === 'ORDER' && `/order/${e?._id}`
                                                    }
                                                >
                                                    <Card.Img className='mt-1' variant="top" src={e?.image?.url ? e?.image?.url : DefaultImg} />
                                                </Link>
                                                <Card.Body>
                                                    <Card.Title style={{ textAlign: "center" }}>{e?.name}</Card.Title>
                                                </Card.Body>
                                            </Card>
                                        })
                                    }
                                </Row>
                            </Tab >
                        })
                        : ""
                }
            </Tabs >
        </Container >
    )
}

export default SearchDetail