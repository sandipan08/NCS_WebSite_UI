import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Container, Figure, Form, Row } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { convertHtmlToString, formatArrayOfObjectToString, getModelRoute, showMessage } from '../../helpers/Utils'
import { BsZoomIn } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../helpers/ApiServices'
import DefaultCollection from '../../image/default-collection.png.crdownload'
import ViewProductImageModal from '../../components/elements/components/ViewProductImageModal'
import { UserContext } from '../../states/contexts/UserContext'


const PatternDetails = () => {
    const [state, setState] = useState(null)
    const [patterns, setPatterns] = useState([])
    const [productImage, setProductImage] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const { dispatch, user } = useContext(UserContext)

    const navigate = useNavigate();
    const { id } = useParams();


    const getPattern = () => {
        ApiService.get(`shop/pattern/${id}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data?.document);
                setState(response?.data?.document)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const getAllPatternsByCollection = () => {
        // console.log(state?.collections[0]?.text);
        ApiService.get(`shop/pattern/getByCollection?model=${getModelRoute(user).model}&collection=${state?.collections[0]?.text}&brandType=NORTHCOTT`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data?.documents);
                setPatterns(response?.data?.documents)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const goToPatternPage = (id) => {
        navigate(`/patern-detail/${id}`)
    }


    useEffect(() => {
        getPattern()
        // getAllPatternsByCollection()

    }, [id]);

    useEffect(() => {
        getAllPatternsByCollection()

    }, [state]);


    return (
        <Container className='p-0 mt-4' style={{ width: "100%" }}>
            {/* <AppContentBody> */}
            <Container>
                <Row className='p-0'>
                    <h5 className='p-0' style={{ width: "600px", marginTop: 13, color: "#3e2716", fontSize: "25px", fontWeight: "bold" }}>{state?.name}</h5>
                    <p className='p-0 m-0 mb-2' style={{ fontWeight: 700, fontSize: "16px" }}><span style={{ color: "#c60" }}>Based on</span> <span style={{ color: "#337ab7" }}>{formatArrayOfObjectToString(state?.collections)}</span> <span style={{ color: "#c60" }}>collections - by</span> <span style={{ color: "#337ab7" }}>{state?.designer?.text}</span></p>
                </Row>

                <Row className='designer_resource_details_for_mobile p-0' style={{ display: "flex", flexDirection: "row", gap: "0px" }}>
                    <Col className='m-0 p-0 mb-2 col-lg-3 col-md-3 col-sm-12 col-xs-12' style={{ display: "flex", flexDirection: "column" }}>
                        <LazyLoadImage
                            alt={""}
                            width={"240"}
                            height={"245"}
                            effect="blur"
                            src={state?.image?.url} />
                        <span className='' style={{ display: "flex", justifyContent: "flex-end", paddingRight: "80px", cursor: "pointer" }}>
                            <BsZoomIn
                                onClick={() => {
                                    setProductImage(state?.image?.url)
                                    setModalShow(true)
                                }}
                            />
                        </span>
                        <Link to={`/patern-list`} style={{ cursor: "pointer" }}><u>Back</u></Link>
                    </Col>

                    <Col className='col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3'>
                        {state ? <div className='' style={{ wordWrap: "break-word" }}
                            dangerouslySetInnerHTML={convertHtmlToString(state?.description)}>

                        </div> : ""}
                    </Col>

                    <Col className='col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0 border' style={{ overflowY: "auto", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <div className='w-100 border-bottom border-1' style={{ fontWeight: 700, }}>
                            <p className='p-0 m-0 pt-1 pb-1' style={{ backgroundColor: "#666666", color: "white" }}>PRODUCT FINDER</p>
                            <div className='p-2 m-0' style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <Form.Select size='sm' aria-label="Default select example">
                                    <option>Select State / Prov</option>
                                </Form.Select>

                                <Button size='sm' variant="secondary">Download Fabric Files</Button>
                                <p style={{ fontWeight: 400, fontSize: "15px" }}>Patterns can bepurchased through your local quilt shop.</p>
                            </div>
                        </div>
                        <div className='mb-4 p-0 pt-3 scroll scroll4' style={{ fontWeight: 900, height: "400px" }}>
                            <h4>Other patterns in this collection</h4>


                            {patterns?.length ? patterns?.map(pattern => {
                                return <div key={pattern?._id} style={{ display: "flex", justifyContent: "center" }}

                                >
                                    <Figure>
                                        <LazyLoadImage
                                            onClick={() => goToPatternPage(pattern?._id)}
                                            style={{ cursor: "pointer" }}
                                            alt={""}
                                            width={"145"}
                                            height={"145"}
                                            effect="blur"
                                            src={pattern?.image?.url ? pattern?.image?.url : DefaultCollection} />
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <Figure.Caption >
                                                {pattern?.name}
                                            </Figure.Caption>
                                        </div>
                                    </Figure>
                                </div>
                            }) : ""
                            }


                            < hr style={{ marginLeft: "30px", marginRight: "30px", height: "4px", border: "1px solid black" }} />
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* </AppContentBody > */}
            <ViewProductImageModal show={modalShow} productImage={productImage} setModalShow={setModalShow} />
        </Container >
    )
}

export default PatternDetails