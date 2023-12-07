import { React, useContext, useEffect, useState } from 'react'
import { Container, Button, Col, Row, DropdownButton, Dropdown, ButtonGroup, Modal, Tabs, Tab, Breadcrumb, Card, Table, Form } from 'react-bootstrap'
import { BsBoxArrowInUpRight, BsTrash } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../states/contexts/CustomerContext'
import { UserContext } from '../../states/contexts/UserContext'
import TextField from '../../components/elements/fields/TextField'
import { useFieldArray, useForm } from 'react-hook-form'
import ApiService from '../../helpers/ApiServices'
import { getModelRoute, logout, showMessage } from '../../helpers/Utils'
import AppContentForm from '../../components/elements/builders/AppContentForm'
import AppContentHeader from '../../components/elements/builders/AppContentHeader'
import AppContentBody from '../../components/elements/builders/AppContentBody'
import { CustomerService, TokenService } from '../../helpers/StorageServices'

export default function RecentCustomers() {
    const navigate = useNavigate()


    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { dispatch, user } = useContext(UserContext)

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))



    const isLoggedIn = async () => {
        ApiService.setHeader()
        await ApiService.get(`shop/user/loggedIn?model=${getModelRoute(user).model}`).then(response => {
            console.log(response.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data.document });

            // reset(response?.data.document)

        }).catch(async error => {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
            try {
                await logout()
                dispatch({ type: "LOGOUT_SUCCESS" });
                customerDispatch({ type: "SELECT_CUSTOMER", payload: null })
            } catch (error) {
                dispatch({ type: "LOGIN_FAILURE" });
            }
            navigate(`/`)

        })

    }


    useEffect(() => {

        isLoggedIn()
    }, []);



    return (
        <AppContentBody>
            <Container >

                <Row>
                    <p className='m-0 p-0' style={{ fontSize: "25px", fontWeight: 600 }}> RECENT CUSTOMERS</p>
                    <hr />
                </Row>

                <Row>
                    <Card style={{ width: '100%', marginLeft: 0 }}>
                        <Card.Title style={{ textAlign: "end" }}>Customer Count: {customers?.length - 1}</Card.Title>
                        <Card.Body className="card-scroll">
                            <Table responsive striped hover className='scroll scroll4 m-0 p-0'>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: "0.5rem" }}>#</th>
                                        <th style={{ minWidth: "1rem" }}>CUSTOMER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        customers?.length ?
                                            customers?.map((customer, index) => {
                                                if (customer?.city != undefined) {
                                                    return <tr>
                                                        <td>{index}</td>
                                                        <td>{`${customer?.companyName} - ${customer?.customerId} - ${customer?.city} - ${customer?.state}`}</td>
                                                    </tr>
                                                }
                                            })
                                            : ""
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                </Row>

            </Container>
        </AppContentBody >
    )
}
