import React, { useContext } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
// import './footer.css'
import brandLogo from '../../../assets/images/logo/brand-logo.png'
import { CiFacebook } from "react-icons/ci"
import { AiOutlineTwitter, AiFillYoutube } from "react-icons/ai"
import AppContentBody from '../../elements/builders/AppContentBody'
import NCSButton from '../../elements/designElement/NCSButton'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";

export default function FooterNavigation() {
    return (

        <div className="text-white bg-dark text-center">
            <div className="" style={{ paddingTop: "10px" }}>
                <footer className="text-center text-lg-start">
                    <section className="">
                        <div className="container justify-content-center  mt-5">
                            <div className="row mt-3">
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-4 text-md-center text-lg-start text-xl-start text-sm-center">
                                    <div className='container d-flex align-items-center justify-content-xl-start justify-content-center'>
                                        <img src={brandLogo} height="60px"
                                            width="180px" />
                                    </div>
                                    <section className="container d-flex align-items-center justify-content-xl-start justify-content-center mb-5 mt-2">
                                        <a> <FaFacebookF className="me-4" color="#E2A856" /></a>
                                        <FaTwitter className="me-4" color="#E2A856" />
                                        <FaYoutube className="me-4" color="#E2A856" />
                                        <FaInstagram className="me-4" color="#E2A856" />
                                    </section>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-4">
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

                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mx-auto mb-md-0 mb-4 ">
                                    <p className="text-lg-end text-md-end text-sm-center text-center"
                                        style={{ textAlign: "right", color: "white", fontSize: "22px", fontFamily: "Open Sans", fontWeight: 700, wordWrap: "break-word" }}>
                                        GET THE INSIDE SCOOP!
                                    </p>
                                    <p className="text-lg-end text-md-end text-sm-center text-center"
                                        style={{ textAlign: "right", color: "white", fontSize: "14px", fontFamily: "Open Sans", fontStyle: "italic", fontWeight: 400, lineHeight: "24px", wordWrap: "break-word" }}>
                                        New collections, free patterns, quilting tips and more.
                                    </p>
                                    <p className="text-lg-end text-md-end text-sm-center">
                                        <NCSButton props={{ buttonType: 'footerDefaultButton', buttonName: 'SUBSCRIBE TO OUR NEWSLETTER' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </footer>

            </div>
        </div>
    )
}
