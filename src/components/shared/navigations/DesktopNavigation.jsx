import { React, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import "./header.css"
import { Link } from 'react-router-dom'
import Stonehenge from '../../../assets/images/products/stonehenge.jpg'
import CurrentCollections from '../../../assets/images/products/current-collections.jpg'
import ComingSoon from '../../../assets/images/products/coming-soon.jpg'
import { CustomerContext } from '../../../states/contexts/CustomerContext'
import { UserContext } from '../../../states/contexts/UserContext'
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap'

export default function DesktopNavigation() {

    const { dispatch, user } = useContext(UserContext);
    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let recentCustomers = customers?.length && customers?.slice(-5)
    return (
        <nav className="navbar " style={{ fontSize: "12px" }}>
            {/* desktop-navigation-menu */}
            <div className="app-container text-xl-middle" >
                <Navbar expand="md xl xxl" >
                    <Container >
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'center' }}>
                            <Nav className='justify-content-center'>
                                <Nav.Link href="#login" className='navItem d-xxl-none d-xl-none d-md-none d-block'>LOGIN</Nav.Link>
                                <Nav.Link href="#home" className='navItem'>HOME</Nav.Link>
                                <NavDropdown title="ABOUT" id="basic-nav-dropdown" className='navItem'>
                                    <NavDropdown.Item href="#action/3.1">About Us</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Wholesale Contacts
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Charities We Support</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Calendar</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Contact Us</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="SHOP" id="basic-nav-dropdown" className='navItem'>
                                    <ListGroup className='list-group flex-column flex-sm-row'>
                                        <ListGroup.Item className='border-0'><p className='fw-bold'>Categories</p>
                                            <NavDropdown.Item href="#action/3.1">Holiday 2023 Release Collections</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.2">
                                                September 2023 Release Collections
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.3">September 2023 Collection Precuts</NavDropdown.Item>
                                        </ListGroup.Item>
                                        <ListGroup.Item className='border-0'><p></p>
                                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.2">
                                                Another action
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item></ListGroup.Item>
                                        <ListGroup.Item className='border-0'><p className='fw-bold'>Categories</p>
                                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.2">
                                                Another action
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        </ListGroup.Item>
                                    </ListGroup>

                                </NavDropdown>
                                <Nav.Link href="#link" className='navItem'>LOOKBOOK</Nav.Link>
                                <Nav.Link href="#link" className='navItem'>PATTERNS</Nav.Link>
                                <Nav.Link href="#link" className='navItem'>DESIGNERS</Nav.Link>
                                <NavDropdown title="RESOURCES" id="basic-nav-dropdown" className='navItem'>
                                    <NavDropdown.Item href="#action/3.1">Free Patterns</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Get Inspired!
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Videos</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.4">
                                        Quilting Tips
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Advertisements</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Editorial Features</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">News</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="CUSTOMER" id="basic-nav-dropdown" className='navItem'>
                                    <NavDropdown.Item href="#action/3.1">Personal Info</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Order History
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Invoice History</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.4">
                                        Statement
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Dashboard</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="#link" className='navItem' >RAPID ORDER</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </div>

        </nav>
    )
}


