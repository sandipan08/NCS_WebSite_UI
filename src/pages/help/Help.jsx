import React, { useState, useEffect } from 'react'
import { Accordion, Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap'
import ApiService from '../../helpers/ApiServices'
import { convertHtmlToString, showMessage } from '../../helpers/Utils'
import video from "../../image/demoVideo.mp4"


const Help = () => {
    const [state, setState] = useState([]);
    const [videos, setVideos] = useState([]);
    const [activeButton, setActiveButton] = useState("FAQ")

    const navigate = (tab) => {
        console.log(tab);
        setActiveButton(tab)
    }

    const getFaqs = async () => {
        try {
            const response = await ApiService.get('/shop/faq');
            if (response.data.isSuccess) {
                console.log(response?.data.documents);
                setState(response?.data.documents)

            } else {
            }
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }

    const getVideos = async () => {
        try {
            const response = await ApiService.get('/shop/helpVideo');
            if (response.data.isSuccess) {
                console.log(response?.data.documents);
                setVideos(response?.data.documents)

            } else {
            }
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }



    useEffect(() => {
        getFaqs()
        getVideos()

    }, []);


    return (
        <Container className='mt-5 p-0'>
            <h4 className='border-bottom border-2 pb-3' style={{ color: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)" }}>
                {activeButton === "FAQ" ? "FREQUENTLY ASKED QUESTIONS" : activeButton === "VIDEOS" ? "WEBSITE HELP VIDEOS" : "CONTACT US"}
            </h4>

            <Row className='p-0 m-0' xs={1} sm={2} md={3} lg={4} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ButtonGroup className='p-0 m-0' style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <Button variant="secondary" active={activeButton === "FAQ" ? true : false} onClick={(e) => { navigate(e.target.innerHTML) }}>FAQ</Button>
                    <Button variant="secondary" active={activeButton === "VIDEOS" ? true : false} onClick={(e) => { navigate(e.target.innerHTML) }}>VIDEOS</Button>
                    <Button variant="secondary" active={activeButton === "CONTACT US" ? true : false} onClick={(e) => { navigate(e.target.innerHTML) }}>CONTACT US</Button>
                </ButtonGroup >
            </Row >

            <hr />

            {activeButton === "FAQ" ? <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>
                <Accordion className='p-0 m-0' defaultActiveKey="0" style={{ width: "100%", fontSize: "14px" }}>

                    {
                        state?.length ? state?.map(faq => {
                            return <Accordion.Item key={faq?._id} eventKey={faq?._id} className="mb-3 border-top" style={{ backgroundColor: "gray" }}>
                                <Accordion.Header className="" style={{}}>{faq?.title}</Accordion.Header>
                                <Accordion.Body style={{ backgroundColor: "white" }} dangerouslySetInnerHTML={convertHtmlToString(faq?.description)}>

                                </Accordion.Body>
                            </Accordion.Item>
                        }) : ""
                    }
                </Accordion>
            </Row> : ""}

            {activeButton === "VIDEOS" ? <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>

                <div className='p-0 m-0' style={{ width: "100%" }}>
                    {
                        videos?.length ? videos?.map(video => {
                            return <Row className='p-0 m-0 border-bottom' >
                                <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12'>

                                </Col>
                                <Col className='p-3 m-0 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                                    <span className='mb-1' style={{ fontSize: "15px" }}>{video?.title}</span>
                                    <span dangerouslySetInnerHTML={convertHtmlToString(video?.description)} style={{ fontSize: "12px" }}>

                                    </span>
                                    <div className='mt-4' style={{ width: "70%" }}>

                                        <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" height="315"
                                            src={video?.videoLink} title={video?.title} width="560"></iframe>

                                    </div>
                                </Col>
                            </Row>
                        }) : ""
                    }

                    {/* <Row className='p-0 m-0' >
                        <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12'>

                        </Col>
                        <Col className='p-3 m-0 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                            <span className='mb-1' style={{ fontSize: "15px" }}>How to use the Product Finder</span>
                            <span style={{ fontSize: "12px" }}>This video walks you through how to use the product finder tool on the Northcott website. The product finder allows you to search for a specific fabric collection and locate a store in your local area that purchased it. *Results are for stores in North America only.</span>
                            <div className='mt-4' style={{ width: "70%" }}>

                                <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" height="315"
                                    src="https://www.youtube.com/embed/Svw-em75vak" title="How To Use Our Product Finder | Northcott Fabrics" width="560"></iframe>

                            </div>
                        </Col>
                    </Row> */}
                </div>

            </Row> : ""}

            {activeButton === "CONTACT US" ? <Row className='p-0 mt-4 m-0' xs={1} sm={2} md={3} lg={4}>
                <Col className='p-0 m-0 col-lg-3 col-md-3 col-sm-12 col-xs-12'>
                    <div className='mb-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span className='mb-4' style={{ fontSize: "15px", fontWeight: 600 }}>USA Office</span>
                        <span>1050 Valley Brook Avenue</span>
                        <span>Lyndhurst, NJ 07071</span>
                        <span>T: (201) 672-9600</span>
                        <span>F: (201) 672 -9675</span>
                    </div>
                    <div>Email: info2@northcott.com</div>
                    <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600 }}>Office Hours Eastern Time:</span>
                        <span>9:00AM- 5:00PM Mon-Fri</span>
                        <span>CLOSED ON WEEKENDS</span>
                    </div>
                    <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600 }}>Warehouse Hours:</span>
                        <span>8:00AM- 3:00PM Mon- Fri</span>
                        <span>CLOSED ON WEEKENDS</span>
                    </div>
                </Col>

                <Col className='p-0 m-0 col-lg-9 col-md-9 col-sm-12 col-xs-12'>
                    <div className='mb-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span className='mb-4' style={{ fontSize: "15px", fontWeight: 600 }}>Canadian Office</span>
                        <span>101 Courtland Avenue</span>
                        <span>Vaughan, Ontario L4K 3T5</span>
                        <span>Tel: (905) 760-0072</span>
                        <span>Fax: (905) 760-0073</span>
                    </div>
                    <div>Email: Info@northcott.com</div>
                    <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600 }}>Office Hours Eastern Time:</span>
                        <span>9:00AM- 5:00PM Mon-Fri</span>
                        <span>CLOSED ON WEEKENDS</span>
                    </div>
                    <div className='mt-2' style={{ fontSize: "15px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600 }}>Warehouse Hours:</span>
                        <span>8:00AM- 3:00PM Mon- Fri</span>
                        <span>CLOSED ON WEEKENDS</span>
                    </div>
                </Col>
            </Row> : ""}
        </Container >
    )
}

export default Help