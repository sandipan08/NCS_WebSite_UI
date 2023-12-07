import { React, useState, useEffect, useContext } from 'react'
import { Container, ButtonGroup, Button, Card, Row, Col } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import AppContentBody from '../../components/elements/builders/AppContentBody';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import Image from "../../image/person_img.jpg"
import DesignerCard from '../../components/elements/components/DesignerCard';
import SkeletonCard from '../../components/elements/components/SkeletonCard';
import { UserContext } from '../../states/contexts/UserContext';


const DesignerList = () => {
    const [state, setState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [designers, setDesigners] = useState([]);
    const [buttonKey, setButtonKey] = useState('COLLECTION DESIGNER');
    const arr = new Array(8)

    const { user } = useContext(UserContext)

    const { dispatch: iconDispatch, isNorthchott, isBanyan, isPatrick, backgroundColor } = useContext(BrandIconContext)
    // console.log(isNorthchott, isBanyan, isPatrick);


    const getCollectiondesigners = (key) => {
        // console.log(buttonKey);
        ApiService.setHeader()
        ApiService.get(`shop/designer?model=${getModelRoute(user).model}&designerType=${buttonKey}&brandType=NORTHCOTT&division=${isNorthchott ? "NORTHCOTT" : isBanyan ? "BANYAN BATIKS" : "PATRICK LOSE"}`).then(response => {
            // console.log(response?.data);
            if (response?.data.isSuccess) {
                setDesigners(response?.data.documents)
                setIsLoading(false)
            }
        }).catch(error => {
            setIsLoading(false)
            console.log(error.response?.data)
            // console.log("Else Catch")
            showMessage(error.response?.data.message, "error")
        })
    }

    const getPatterndesigners = () => {
        ApiService.get(`shop/designer?model=${getModelRoute(user).model}&designerType=PATTERN&brandType=NORTHCOTT&division=${isNorthchott ? "NORTHCOTT" : isBanyan ? "BANYAN BATIKS" : "PATRICK LOSE"}`).then(response => {
            if (response?.data.isSuccess) {
                setDesigners(response?.data.documents)
            }
        }).catch(error => {

            console.log(error.response.data)
            // console.log("Else Catch")
            showMessage(error.response.data.message, "error")
        })
    }

    // useEffect(() => {
    //     getCollectiondesigners(buttonKey)
    // }, []);

    useEffect(() => {
        setIsLoading(true)
        getCollectiondesigners(buttonKey)
        // getPatterndesigners()
    }, [isNorthchott, isBanyan, isPatrick, buttonKey]);


    return (
        <Container>
            <h3>Designers</h3>
            <hr style={{ border: '1px solid #e3a856' }} />

            {/*BUTTONGROUP FOR NAVIAGTE TO DESIGNERS */}
            <ButtonGroup aria-label="Basic example" style={{ display: "flex", justifyContent: "center", }}>
                <Button variant="secondary" active={buttonKey == "COLLECTION DESIGNER" ? true : false}
                    style={{ backgroundColor: backgroundColor }}
                    onClick={() => {
                        setButtonKey("COLLECTION DESIGNER")
                        // getCollectiondesigners("COLLECTION")
                    }}>COLLECTION</Button>

                <Button variant="secondary" active={buttonKey == "PATTERN DESIGNER" ? true : false}
                    style={{ backgroundColor: backgroundColor }}
                    onClick={() => {
                        setButtonKey("PATTERN DESIGNER")
                        // getCollectiondesigners()
                    }}>PATTERN</Button>
            </ButtonGroup>

            {/* ALL DESIGNERS */}
            <AppContentBody>
                <Container>
                    <Row xs={1} sm={2} md={3} lg={4} style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "6px" }}>
                        {
                            isLoading ?
                                <SkeletonCard />
                                :
                                designers?.length ? designers?.map(designer =>
                                    <DesignerCard key={designer?._id} designer={designer} Image={Image} />
                                ) : ""
                        }
                    </Row>
                </Container>
            </AppContentBody>
        </Container>
    )
}

export default DesignerList