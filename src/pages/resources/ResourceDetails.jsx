import { React, useState, useEffect, useContext } from 'react'
import { Card, Col, Container, Figure, Table, Row, Button } from 'react-bootstrap';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import ApiService from '../../helpers/ApiServices';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import AppContentBody from '../../components/elements/builders/AppContentBody';
import { convertHtmlToString, getModelRoute, showMessage } from '../../helpers/Utils';
import { UserContext } from '../../states/contexts/UserContext';

const ResourceDetails = () => {
    const [state, setState] = useState(null);
    const [resourceCategories, setResourceCategories] = useState([]);
    const [resourceCategoryName, setResourceCategoryName] = useState('');

    const { user } = useContext(UserContext)

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const resourceCategoryId = location?.search.split("=")[1]



    const findResource = () => {
        ApiService.get(`shop/resource/${id}?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data.document);
                setState(response?.data.document)

                response?.data.document?.categories.map(e => {
                    console.log(e);
                    if (e?.id == resourceCategoryId) {
                        setResourceCategoryName(e?.text)
                    }
                })
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }


    const getResourceCategories = () => {
        ApiService.get(`shop/resourceCategory?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                setResourceCategories(response?.data.documents)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    const goToResourceListPage = () => {
        navigate(`/resources-list/${resourceCategoryId}`)
    }

    // console.log(resourceCategoryName);

    useEffect(() => {
        findResource()
        getResourceCategories()
    }, []);

    return (
        <Container className='' style={{ width: "100%" }}>
            <AppContentBody>
                <Container>
                    <Row className='designer_resource_details_for_mobile'>
                        <Col className=' col-xl-9 col-lg-9 col-md-9 col-sm-12'>
                            <Row>
                                <h3><b>Resources -</b> {resourceCategoryName}</h3>
                            </Row>

                            <Row className='mt-5'>
                                <Col className='col-xl-4 col-lg-4 col-md-4 col-sm-12'>
                                    <Figure>
                                        <Figure.Image
                                            width={240}
                                            height={240}
                                            alt="240*240"
                                            src={state?.image?.url}
                                        />
                                    </Figure>
                                </Col>
                                <Col className='col-xl-8 col-lg-8 col-md-8 col-sm-12 ml-0 p-0'>

                                    <div>{state?.resourceHeadline}</div>

                                    {state ? <div className='' style={{ wordWrap: "break-word", paddingLeft: "10px", paddingRight: "15px" }}
                                        dangerouslySetInnerHTML={convertHtmlToString(state?.resourceDetail)}>

                                    </div> : ""}

                                    <div style={{ paddingRight: "15px", display: "flex", justifyContent: "space-between" }}>
                                        <p style={{ fontSize: "15px", fontWeight: 500 }}> Posted on: {String(state?.postDate).split("T")[0]}</p>
                                        <p style={{ cursor: "pointer" }} onClick={goToResourceListPage}>Back to list</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                        <Col className='scroll scroll4 col-xl-3 col-lg-3 col-md-3 col-sm-12' style={{ height: "600px", overflowY: "auto", backgroundColor: "#f6f0e5", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            <div className='mb-4' style={{ fontWeight: 900 }}><h4>Select Resource Category</h4></div>

                            {
                                resourceCategories?.length ? resourceCategories?.map(resourceCategory => {

                                    return <div key={resourceCategory?._id} className='rounded border' style={{ height: "70px", width: "165px", marginBottom: "15px", cursor: "pointer", backgroundColor: "#3987b7", color: "white", padding: "5px", textAlign: "center", verticalAlign: "middle" }}
                                        onClick={() => navigate(`/resources-list/${resourceCategory?._id}`)}
                                    >
                                        <p style={{ fontWeight: "600px", fontSize: "18px" }}>{resourceCategory?.name}</p>
                                    </div>
                                }) : ""
                            }

                        </Col>
                    </Row>
                </Container>
            </AppContentBody>

        </Container >
    )
}

export default ResourceDetails