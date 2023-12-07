import { React, useEffect, useState, useContext } from 'react'
import { Button, ButtonGroup, Container, Row, Card } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import AppContentBody from '../../components/elements/builders/AppContentBody'
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { UserContext } from '../../states/contexts/UserContext';

const ResourcesList = () => {
    const [resourceCategories, setResourceCategories] = useState([]);
    const [resources, setResources] = useState([]);
    const [activeResourceCategoryName, setActiveResourceCategoryName] = useState("");

    const { user } = useContext(UserContext)

    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const array = new Array()




    const getResourceCategories = (id) => {
        ApiService.get(`shop/resourceCategory?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                setResourceCategories(response?.data.documents)

                response?.data.documents.map(resourceCategory => {
                    if (resourceCategory?._id == id) setActiveResourceCategoryName(resourceCategory?.name)
                })
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }


    const getResources = (resourceCategoryId) => {
        let array = []

        ApiService.get(`shop/resource?model=${getModelRoute(user).model}`).then(response => {
            if (response?.data.isSuccess) {
                // console.log(response?.data.documents);
                response?.data.documents?.map(e => {
                    e?.categories.map(resourceCategory => {
                        if (resourceCategory?.id == resourceCategoryId) {
                            array.push(e)
                        }
                    })
                })

                setResources(array)
                navigate(`/resources-list/${resourceCategoryId}`)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }



    useEffect(() => {
        getResources(id)
        getResourceCategories(id)
    }, []);


    return (
        <Container className='' style={{ width: "100%" }}>

            <h3>Resources</h3>
            <hr />

            <AppContentBody>
                <Container className=''>
                    <Row className='rounded border' style={{ boxShadow: "3px 3px lightgray", backgroundImage: " linear-gradient(to bottom, #fff 0%, #f8f8f8 100%)" }}>
                        {
                            resourceCategories?.length ? resourceCategories?.map(resourceCategory =>
                                <Button key={resourceCategory?._id} active={id == resourceCategory?._id ? true : false} variant="light" size='sm' style={{ width: "33.33%", fontSize: "18px" }}
                                    onClick={() => {
                                        getResources(resourceCategory?._id)
                                        setActiveResourceCategoryName(resourceCategory?.name)
                                    }}
                                >{resourceCategory?.name}</Button>
                            ) : ""
                        }
                    </Row>

                    <Row className='mt-5' style={{ fontSize: "25px", fontWeight: "bold" }}>{activeResourceCategoryName}</Row>

                    <Row>
                        {
                            resources?.length ? resources.map(resource =>
                                <Card key={resource?._id} as={Link} to={`/resource-details/${resource?._id}?resourceCategoryId=${id}`} style={{ width: '20rem', margin: "31px", display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                                    {/* <Card.Img variant="top" style={{ maxWidth: "255px", maxHeight: "255px" }} src={resource?.image?.url} /> */}
                                    <LazyLoadImage
                                        alt={""}
                                        width={"255"}
                                        height={"255"}
                                        effect="blur"
                                        src={resource?.image?.url} />
                                    <Card.Body>
                                        <Card.Title style={{ textAlign: "center", verticalAlign: "middle" }}><h6>{resource?.resourceHeadline}</h6></Card.Title>
                                    </Card.Body>
                                </Card>
                            ) : ""
                        }
                    </Row>
                </Container>
            </AppContentBody >
        </Container >
    )
}

export default ResourcesList