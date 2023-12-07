import { React, useState, useEffect, useContext } from 'react'
import { Button, ButtonGroup, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import ApiService from '../../helpers/ApiServices';
import { convertHtmlToString, getModelRoute, showMessage } from '../../helpers/Utils';
// import parse from 'html-react-parser';
// import DOMPurify from 'dompurify';
import AppContentBody from '../../components/elements/builders/AppContentBody';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DefaultCollection from '../../image/default-collection.png.crdownload'
import CollectionCard from '../../components/elements/components/CollectionCard';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import SkeletonCard from '../../components/elements/components/SkeletonCard';
import { CustomerContext } from '../../states/contexts/CustomerContext';
import { UserContext } from '../../states/contexts/UserContext';



const DesignerProfile = () => {
    const { textColor, color, isNorthchott, isBanyan, isPatrick, backgroundColor } = useContext(BrandIconContext)
    const { customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)

    const [state, setState] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [showNorthcott, setShowNorthcott] = useState(isNorthchott);
    const [showPatrick, setShowPatrick] = useState(isPatrick);
    const [showBanyan, setShowBanyan] = useState(isBanyan);
    const [tabKey, setTabKey] = useState('collection');
    const [activeButton, setActiveButton] = useState(isNorthchott ? "NORTHCOTT" : isBanyan ? "BANYAN BATIKS" : "PATRICK LOSE");
    const [collections, setCollections] = useState([]);
    const [order, setOrder] = useState({ northcottOrder: 1, banyanOrder: 1, patrickOrder: 1 });


    const navigate = useNavigate();
    const location = useLocation();
    const rootPath = location?.pathname?.split('/')[1];
    const { id } = useParams();



    const findDesigner = () => {
        ApiService.get(`shop/designer/${id}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data.document);
                setState(response?.data.document)
                setIsloading(false)
            }
        }).catch(error => {
            setIsloading(false)
            // console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const findAllCollectionByDesigner = () => {
        ApiService.get(`shop/collection/designer/${id}?model=${getModelRoute(user).model}&brandType=NORTHCOTT`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                setCollections(response?.data.documents)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const goToCollectionPage = (collectionId) => {
        navigate(`/product-detail/${collectionId}`)
    }

    const goBack = () => {
        console.log(rootPath);
        navigate(`/designers-list`)
    }

    // console.log("isNorthchott isBanyan isPatrick", isNorthchott, isBanyan, isPatrick);
    // console.log(activeButton);
    const toggleNorthcott = () => {
        setShowNorthcott(true)
        setShowBanyan(false)
        setShowPatrick(false)
    }

    const toggleBanyan = () => {
        setShowBanyan(true)
        setShowPatrick(false)
        setShowNorthcott(false)
    }

    const togglePatrick = () => {
        setShowPatrick(true)
        setShowBanyan(false)
        setShowNorthcott(false)
    }

    useEffect(() => {
        setIsloading(true)
        findDesigner()
        // findAllCollectionByDesigner()
    }, [id]);

    useEffect(() => {
        if (isNorthchott) {
            setOrder({ northcottOrder: 1, banyanOrder: 2, patrickOrder: 2 });
            setActiveButton("NORTHCOTT")
            toggleNorthcott()
        }
        if (isBanyan) {
            setOrder({ northcottOrder: 2, banyanOrder: 1, patrickOrder: 2 });
            setActiveButton("BANYAN BATIKS")
            toggleBanyan()
        }
        if (isPatrick) {
            setOrder({ northcottOrder: 2, banyanOrder: 2, patrickOrder: 1 });
            setActiveButton("PATRICK LOSE")
            togglePatrick()
        }

    }, [isNorthchott, isBanyan, isPatrick]);

    useEffect(() => {
        setIsloading(true)
        // console.log(activeButton);
        // Get collection by designer's division
        ApiService.setHeader()
        ApiService.get(`shop/collection/designerCollection/${id}?model=${getModelRoute(user).model}&brandType=NORTHCOTT&division=${activeButton}&customer=${customer}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                setCollections(response?.data.documents);
                setIsloading(false)
            }
        }).catch(error => {
            // console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }, [activeButton])


    if (isLoading) {
        return <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", height: "400px" }}>
            <span style={{ color: 'rgb(128, 128, 128)', fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>Designer data has been fetched...</span>
        </Col>
    }

    return (
        // <Container className='' style={{ width: "100%" }}>
        // <AppContentBody>
        <Container>
            <Row className='p-0'>
                <h3 className='p-0'><b>Designer Profile</b></h3>
                <h5 className='p-0' style={{ width: "600px", marginTop: 13 }}>{state?.name}</h5>
                <a className='p-0' href={state?.website?.startsWith("htt") ? state?.website : `https://${state?.website}`} target="_blank"><h6 style={{ width: "600px", marginBottom: "20px" }}>{state?.website}</h6></a>
            </Row>

            <Row className='designer_resource_details_for_mobile p-0' style={{ display: "flex", flexDirection: state?.designerDisplay.isVertical ? "column" : "row", gap: state?.designerDisplay.isVertical ? "10px" : "0px" }}>
                {/* IMAGE */}
                <Col className={state?.designerDisplay.isVertical ? "center_designer_image p-0 mb-2 col-lg-12 col-md-12 col-sm-12 col-xs-12 border" : 'p-0 mb-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 border'}
                    style={{
                        order: `${state?.designerDisplay.imageTag?.value}`, height: "203px",
                        width: `${state?.designerDisplay.isVertical ? `${state?.designerDisplay.imageTag?.width}` : "15%"}`
                    }}
                >
                    <LazyLoadImage
                        alt={""}
                        // width={"100%"}
                        // height={"200"}
                        style={{ objectFit: "cover", paddingLeft: "0px" }}
                        width={state?.designerDisplay.isVertical ? `${state?.designerDisplay.imageTag?.width}` : "100%"}
                        height={state?.designerDisplay.isVertical ? `${state?.designerDisplay.imageTag?.height}` : "200"}
                        effect="blur"
                        src={state?.image?.url} />

                    <p onClick={goBack} style={{ fontSize: "15px", cursor: "pointer", color: color }}>View All Designers</p>
                </Col>

                {/* BIO */}
                {state?.bioData.includes("&lt;") ? <Col className='col-lg-10 col-md-10 col-sm-12 col-xs-12 m-0 p-0' style={{ order: `${state?.designerDisplay.textTag?.value}` }}>
                    {state ? <div className='' style={{ wordWrap: "break-word", paddingLeft: "45px", paddingRight: "60px" }}
                        dangerouslySetInnerHTML={convertHtmlToString(state?.bioData)}>

                    </div> : ""}
                </Col> :
                    <Col className='col-lg-10 col-md-10 col-sm-12 col-xs-12 m-0 p-0' style={{ order: `${state?.designerDisplay.textTag?.value}` }}>
                        {state ? <div className='' style={{ wordWrap: "break-word", paddingLeft: "45px", paddingRight: "60px" }}>
                            {state.bioData.replace(/<[^>]+>/g, '')}
                        </div> : ""}
                    </Col>}


                {/* Collections by this Designer */}
                {/* <Col className=' col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0' style={{ order: `${state?.designerDisplay.collectionsTag?.value}`, height: "600px", overflowY: "auto", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <div className='scroll scroll4 mb-4 pt-2' style={{ fontWeight: 1000, backgroundColor: "#f6f0e5", height: "600px" }}>
                        <h4 style={{ fontSize: "20px", padding: "8px", fontWeight: "bold" }}>Collections by this Designer</h4>


                        {collections?.length ? collections?.map(collection =>
                            <CollectionCard key={collection._id} collection={collection} goToCollectionPage={goToCollectionPage} DefaultCollection={DefaultCollection} />
                        ) : ""
                        }


                        < hr style={{ marginLeft: "30px", marginRight: "30px", height: "4px", border: "1px solid black" }} />
                    </div>
                </Col> */}
            </Row>

            {/* COLLECTION BY THIS DESIGNER */}
            {/* <AppContentBody> */}
            {/* <Container className='border'> */}
            <Row className='p-0 mt-5'>
                <Tabs className='p-0' defaultActiveKey='collection' activeKey={tabKey} onSelect={(k) => setTabKey(k)} style={{ padding: "0px" }}>
                    <Tab className=' p-0' eventKey="collection" title="COLLECTIONS BY THIS DESIGNER" style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {/* <Row className='p-0' style={{}}>
                            <ButtonGroup className='p-0' size='sm' aria-label="Basic example" style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
                                <Button variant="secondary" active={activeButton == "NORTHCOTT" ? true : false}
                                    style={{}}
                                    onClick={() => {
                                        setActiveButton("NORTHCOTT")
                                    }}>NORTHCOTT</Button>

                                <Button variant="secondary" active={activeButton == "BANYAN BATIKS" ? true : false}
                                    style={{}}
                                    onClick={() => {
                                        setActiveButton("BANYAN BATIKS")
                                    }}>BANYAN BATIKS</Button>

                                <Button variant="secondary" active={activeButton == "PATRICK LOSE" ? true : false}
                                    style={{}}
                                    onClick={() => {
                                        setActiveButton("PATRICK LOSE")
                                    }}>PATRICK LOSE</Button>
                            </ButtonGroup>
                        </Row>

                        <Row className=' p-0 mt-1 shadow-sm bg-white rounded scroll scroll4' xs={1} sm={2} md={4} lg={4} style={{ height: "580px" }}>
                            {
                                isLoading ?
                                    <SkeletonCard />
                                    :
                                    collections?.length ? collections?.map(collection =>
                                        <CollectionCard key={collection._id} collection={collection} goToCollectionPage={goToCollectionPage} DefaultCollection={DefaultCollection} />
                                    ) : <span className='w-100' style={{ color: "rgb(128, 128, 128)", fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>This designer have no collections under this division!!!</span>
                            }
                        </Row> */}

                        <Row className=' p-0 m-0' style={{ order: `${order.northcottOrder}` }}>
                            <p className=' p-0 m-0' style={{ cursor: "pointer", backgroundColor: '#c5c5c5' }}
                                onClick={e => {
                                    console.log(e.target.innerHTML);
                                    setActiveButton(e.target.innerHTML.toUpperCase())
                                    toggleNorthcott()
                                }}>
                                Northcott
                            </p>
                            {showNorthcott ? <Row className=' p-0 m-0' xs={1} sm={2} md={4} lg={4}>
                                {
                                    isLoading ?
                                        <SkeletonCard />
                                        :
                                        collections?.length ? collections?.map(collection =>
                                            <CollectionCard key={collection._id} collection={collection} goToCollectionPage={goToCollectionPage} DefaultCollection={DefaultCollection} />
                                        ) : <span className='w-100' style={{ color: "rgb(128, 128, 128)", fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>This designer have no collections under this division!!!</span>
                                }
                            </Row> : null}
                        </Row>
                        <Row className=' p-0 m-0' style={{ order: `${order.banyanOrder}` }}>
                            <p className=' p-0 m-0' style={{ cursor: "pointer", backgroundColor: '#c5c5c5' }}
                                onClick={e => {
                                    console.log(e.target.innerHTML);
                                    setActiveButton(e.target.innerHTML.toUpperCase())
                                    toggleBanyan()
                                }}>
                                Banyan Batiks</p>
                            {showBanyan ? <Row className=' p-0 m-0' xs={1} sm={2} md={4} lg={4}>
                                {
                                    isLoading ?
                                        <SkeletonCard />
                                        :
                                        collections?.length ? collections?.map(collection =>
                                            <CollectionCard key={collection._id} collection={collection} goToCollectionPage={goToCollectionPage} DefaultCollection={DefaultCollection} />
                                        ) : <span className='w-100' style={{ color: "rgb(128, 128, 128)", fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>This designer have no collections under this division!!!</span>
                                }
                            </Row> : null}
                        </Row >
                        <Row className=' p-0 m-0' style={{ order: `${order.patrickOrder}` }}>
                            <p className=' p-0 m-0' style={{ cursor: "pointer", backgroundColor: '#c5c5c5' }}
                                onClick={e => {
                                    console.log(e.target.innerHTML);
                                    setActiveButton(e.target.innerHTML.toUpperCase())
                                    togglePatrick()
                                }}>Patrick Lose</p>
                            {showPatrick ? <Row className=' p-0 m-0' xs={1} sm={2} md={4} lg={4}>
                                {
                                    isLoading ?
                                        <SkeletonCard />
                                        :
                                        collections?.length ? collections?.map(collection =>
                                            <CollectionCard key={collection._id} collection={collection} goToCollectionPage={goToCollectionPage} DefaultCollection={DefaultCollection} />
                                        ) : <span className='w-100' style={{ color: "rgb(128, 128, 128)", fontSize: "2rem", fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>This designer have no collections under this division!!!</span>
                                }
                            </Row> : null}
                        </Row>
                    </Tab>
                </Tabs>
            </Row>
            {/* </Container> */}
            {/* </AppContentBody> */}
        </Container >
        // </AppContentBody >
    )
}

export default DesignerProfile