import { React, useState, useEffect, useContext } from 'react'
import { Container, ButtonGroup, Button, Card, Row } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import AppContentBody from '../../components/elements/builders/AppContentBody';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { UserContext } from '../../states/contexts/UserContext';

const ResourceCategoryList = () => {
    const [state, setState] = useState(null);
    const [resourceCategories, setResourceCategories] = useState([]);

    const { user } = useContext(UserContext)


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





    useEffect(() => {
        getResourceCategories()
    }, []);

    return (
        <Container>
            <h3>Resource Categories</h3>
            <hr />


            {/* ALL RESOURCE CATEGORIES */}
            <AppContentBody>
                <Container>
                    <Row>
                        {
                            resourceCategories?.length ? resourceCategories?.map(resourceCategory =>
                                <Card key={resourceCategory?._id} as={Link} to={`/resources-list/${resourceCategory?._id}`} style={{ width: '20rem', margin: "31px", display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>
                                    {/* <Card.Img variant="top" style={{ maxWidth: "255px", maxHeight: "255px" }} src={resourceCategory?.image?.url} /> */}
                                    <LazyLoadImage
                                        alt={""}
                                        width={"255"}
                                        height={"255"}
                                        effect="blur"
                                        src={resourceCategory?.image?.url} />
                                    <Card.Body>
                                        <Card.Title><h6>{resourceCategory?.name}</h6></Card.Title>
                                    </Card.Body>
                                </Card>
                            ) : ""
                        }
                    </Row>
                </Container>
            </AppContentBody>
        </Container>
    )
}

export default ResourceCategoryList