import React, { useContext } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// import './footer.css'
import brandLogo from '../../../assets/images/logo/brand-logo.png'
import { CiFacebook } from "react-icons/ci"
import { AiOutlineTwitter, AiFillYoutube } from "react-icons/ai"
import { FiInstagram } from "react-icons/fi"
import Figo from "./../../../image/figo.jpg"
import PinterestIcon from "./../../../image/pinterest-icon.jpg"
import wordpressIcon from "./../../../image/wordpress-icon.jpg"
import AppContentBody from '../../elements/builders/AppContentBody'
import { BrandIconContext } from '../../../states/contexts/BrandIconContext'
import NCSButton from '../../elements/designElement/NCSButton'


export default function FooterNavigation() {



    return (

        <div className="text-white bg-dark text-center">
            <div className="" style={{ paddingTop: "10px" }}>
                {/* <!-- Footer --> */}
                <footer className="text-center text-lg-start">
                    {/* <!-- Section: Social media -->

                <!-- Section: Social media -->

                <!-- Section: Links  --> */}
                    <section className="">
                        <div className="container justify-content-center  mt-5">
                            {/* <!-- Grid row --> */}
                            <div className="row mt-3">
                                {/* <!-- Grid column --> */}
                                <div
                                    className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-4 text-md-center text-lg-start text-xl-start text-sm-center">
                                    <div className='container d-flex align-items-center justify-content-xl-start justify-content-center'>
                                        <img src={brandLogo} height="60px"
                                            width="180px" />
                                    </div>
                                    {/* <!-- Content --> */}
                                    {/* <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">HEELO HERE <img src="https://northcott.com/images/Northcott-Logo-Web-2x.png" height="60px"
                                        width="180px" />
                                    </p> */}


                                    {/* <!-- Section: Social --> */}
                                    <section className="text-left mb-5 ">
                                        <a href="" className="text-white me-4 anchorTagTextDecorationNone">
                                            <i className="fa fa-facebook" style={{ fontSize: '24px', color: "#E2A856" }}>Facebook</i>
                                        </a>
                                        <a href="" className="text-white me-4 anchorTagTextDecorationNone">
                                            <i className="fa fa-twitter" style={{ fontSize: '24px', color: "#E2A856" }}>Twitter</i>
                                        </a>

                                        <a href="" className="text-white me-4  anchorTagTextDecorationNone">
                                            <i className="fa fa-instagram" style={{ fontSize: '24px', color: "#E2A856" }}>instagram</i>
                                        </a>
                                        <a href="" className="text-white me-4 anchorTagTextDecorationNone">
                                            <i className="fa fa-youtube-play" style={{ fontSize: '24px', color: "#E2A856" }}>youtube</i>
                                        </a>

                                    </section>
                                    {/* <!-- Section: Social --> */}
                                </div>
                                {/* <!-- Grid column --> */}


                                {/* <!-- <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            </div> --> */}
                                {/* <!-- Grid column -->

                            <!-- Grid column --> */}
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-4">
                                    {/* <!-- Links --> */}

                                    <div className="row">
                                        <div className="col-md-6 col-lg-6 col-sm-6 col-xs-12">
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                HELP
                                            </p>
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                FAQ
                                            </p>
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                Web Tour
                                            </p>
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                Contact Us
                                            </p>
                                        </div>
                                        <div className="ol-md-6 col-lg-6 col-sm-6 col-xs-12">
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                POLICIES
                                            </p>
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                Privacy Policy
                                            </p>
                                            <p className="text-lg-start text-xl-start text-md-center text-sm-center sm">
                                                Terms And
                                                Condition
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Grid column -->

                            <!-- Grid column --> */}
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-md-0 mb-4 ">
                                    {/* <!-- Links --> */}
                                    <p className="text-lg-end text-md-end text-sm-center text-center"
                                        // style="text-align: right; color: white; font-size: 22px; font-family: Open Sans; font-weight: 700; word-wrap: break-word">
                                        style={{ textAlign: "right", color: "white", fontSize: "22px", fontFamily: "Open Sans", fontWeight: 700, wordWrap: "break-word" }}>
                                        GET THE INSIDE SCOOP!
                                    </p>
                                    <p className="text-lg-end text-md-end text-sm-center text-center"
                                        // style="text-align: right; color: white; font-size: 14px; font-family: Open Sans; font-style: italic; font-weight: 400; line-height: 24px; word-wrap: break-word">
                                        style={{ textAlign: "right", color: "white", fontSize: "14px", fontFamily: "Open Sans", fontStyle: "italic", fontWeight: 400, lineHeight: "24px", wordWrap: "break-word" }}>
                                        New collections, free patterns, quilting tips and more.
                                    </p>
                                    <p className="text-lg-end text-md-end text-sm-center">
                                        {/* <button className="btn  primaryButton"
                                            type="button">subscribe to our newsletter</button> */}
                                        <NCSButton props={{ buttonType: 'footerDefaultButton', buttonName: 'SUBSCRIBE TO OUR NEWSLETTER' }} />
                                    </p>
                                    {/* <!-- <div style="width: 100%; height: 100%; padding-left: 30px; padding-right: 30px; padding-top: 15px; padding-bottom: 15px; background: #E2A856; border-radius: 4px; justify-content: center; align-items: center; gap: 10px; display: inline-flex">
                                    <div style="flex: 1 1 0; text-align: center; color: #090806; font-size: 16px; font-family: Open Sans; font-weight: 700; text-transform: uppercase; line-height: 19.20px; word-wrap: break-word">subscribe to our newsletter</div>
                                    </div> -->

                                <!-- <div className="d-grid gap-2 col-6 mx-auto">
                                    <button className="btn btn-primary" type="button">subscribe to our newsletter</button>
                                    <button className="btn btn-primary" type="button">Button</button>
                                  </div> --> */}
                                </div>
                                {/* <!-- Grid column --> */}
                            </div>
                            {/* <!-- Grid row --> */}
                        </div>
                    </section>
                    {/* <!-- Section: Links  -->

                <!-- Copyright -->

                <!-- Copyright --> */}
                </footer>
                {/* <!-- Footer --> */}
            </div>
        </div>


        // <Container className='border-top border-3 pt-4'>
        //     <Row xs={1} sm={2} md={4} lg={4}>
        //         <Col className=' col-lg-7 col-md-7 col-sm-12 col-xs-12 p-0 m-0 footer-left-division'
        //             style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: "3px" }}>
        //             <img className='' src={Figo} alt="" style={{ borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }} />
        //             <a className='' style={{ fontSize: "12px", fontWeight: 400, textDecoration: "none", color: "black", cursor: "pointer" }} target='__blank' href='http://localhost:3002'>DIVISION OF NRTHCOTT</a>
        //         </Col>

        //         <Col className='col-lg-2 col-md-2 col-sm-12 col-xs-12 p-0 m-0' style={{ fontSize: "14px", fontWeight: 700, display: "flex", flexDirection: "column", gap: "0px" }}>
        //             <span style={{ color: "black", cursor: "pointer" }}>Privacy Policy</span>
        //             <span style={{ color: "black", cursor: "pointer" }}>Contact Us</span>
        //             <span style={{ color: "black", cursor: "pointer" }}>Current Collection</span>
        //             <span style={{ color: "black", cursor: "pointer" }}>Comming Soon</span>
        //         </Col>

        //         <Col className='col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0 m-0' style={{ fontSize: "12px", fontWeight: 700, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "9px" }}>
        //             <div className="text">
        //                 GET THE INSIDE SCOOP — NEW COLLECTIONS,
        //                 FREE PATTERNS, QUILTING TIPS AND MORE
        //             </div>
        //             <div className="subscribeNewsletter">
        //                 {/* <Button className='' size='sm' style={{ background: "linear-gradient(to bottom, #f1e767 0%, #e3a856 100%)", width: "100%", fontSize: "15px", fontWeight: 700 }}>Subscribe to our Newsletter!</Button> */}
        //                 <Button className='button' size='sm' style={{ width: "100%", fontSize: "15px", fontWeight: 700, background: `linear-gradient(to bottom, ${backgroundColor} 16%,${backgroundColor} 16%,${backgroundColor} 34%,${darkBackgroundColor} 100%)` }}>Subscribe to our Newsletter!</Button>
        //             </div>
        //             <div className="icons">
        //                 {/* <wordpressIcon className="icon" /> */}
        //                 {/* <PinterestIcon className="icon" /> */}
        //                 <CiFacebook className="icon" style={{ color: backgroundColor }} />
        //                 <AiOutlineTwitter className="icon" style={{ color: backgroundColor }} />
        //                 <AiFillYoutube className="icon" style={{ color: backgroundColor }} />
        //                 <FiInstagram className="icon" style={{ color: backgroundColor }} />
        //             </div>
        //         </Col>
        //     </Row>
        // </Container>



    )
}
