import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import AppContentForm from '../../components/elements/builders/AppContentForm'
import CheckboxField from '../../components/elements/fields/CheckboxField';
import ApiService from '../../helpers/ApiServices';
import { getModelRoute, showMessage } from '../../helpers/Utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { UserContext } from '../../states/contexts/UserContext';

const PatternList = () => {
    const [type, setType] = useState("Current Patterns")
    const [patterns, setPatterns] = useState([])

    const { dispatch, user } = useContext(UserContext)

    const { register, control, reset, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
        }
    });


    const onSubmit = (data) => {
        console.log(data);
    }

    const getAllPatternByType = () => {
        ApiService.get(`shop/pattern/getByType?model=${getModelRoute(user).model}&brandType=NORTHCOTT&type=${type}`).then(response => {
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

    const changePatternType = (e) => {
        setType(e.target.value)
    }


    useEffect(() => {
        getAllPatternByType()
    }, [type]);




    return (
        <Container className='p-0 mt-5' style={{ width: "100%" }}>
            <Row className='p-0 m-0' >
                <Col className='p-0 m-0' style={{ display: "flex", justifyContent: "flex-start", fontSize: "24px", fontWeight: 600 }}>{type}</Col>
                <Col className='p-0 m-0' style={{ display: "flex", justifyContent: "flex-end" }}><Button size='sm' variant="secondary" value={type === "Archived Patterns" ? "Current Patterns" : "Archived Patterns"} onClick={(e) => changePatternType(e)}>{type === "Archived Patterns" ? "Current Patterns" : "Archived Patterns"}</Button></Col>
            </Row>
            <hr style={{ border: "1px solid #e3a856" }} />
            <Row className='p-0 m-0' style={{ display: "flex", flexDirection: "column" }}>
                <Col className='p-0 m-0' style={{ fontWeight: 700, color: "gray" }}>Refine Search</Col>
                <Form className='p-0 m-0' onSubmit={handleSubmit(onSubmit)}>
                    <Col className='p-0 m-0 mt-4' style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Row className='p-0 m-0'>
                            <Col className='p-0 m-0  col-xl-2 col-lg-2 col-md-2 col-sm-2' style={{ fontWeight: 700, fontSize: "14px", display: "flex", alignItems: 'center' }}>Category :</Col>
                            <Col className='p-0 m-0  col-xl-10 col-lg-10 col-md-10 col-sm-10' style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Quilts",
                                        fieldId: "quilts",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Crafts/Home Decor",
                                        fieldId: "craftsHomeDecor",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Fashion",
                                        fieldId: "fashion",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Free",
                                        fieldId: "free",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Video",
                                        fieldId: "video",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />
                            </Col>
                        </Row>

                        <Row className='p-0 m-0'>
                            <Col className='p-0 m-0  col-xl-2 col-lg-2 col-md-2 col-sm-2' style={{ fontWeight: 700, fontSize: "14px", display: "flex", alignItems: 'center' }}>Skill Level :</Col>
                            <Col className='p-0 m-0  col-xl-10 col-lg-10 col-md-10 col-sm-10' style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Beginner",
                                        fieldId: "beginner",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Confident Beginner",
                                        fieldId: "confidentBeginner",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Intermediate",
                                        fieldId: "intermediate",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />

                                <CheckboxField
                                    register={register}
                                    errors={errors}
                                    field={{
                                        description: "",
                                        label: "Advanced",
                                        fieldId: "advanced",
                                        placeholder: "",
                                        // required: true,
                                        // validationMessage: "Please enter the Account Number!"
                                    }}
                                    changeHandler={null}
                                    blurHandler={null}
                                />
                            </Col>
                        </Row>
                        <Row className='p-0 m-0' md="6"><Button type="submit" size='sm' variant='secondary'>Search</Button></Row>
                    </Col>
                </Form>
            </Row>

            <hr style={{ border: "1px solid #e3a856" }} />

            <Row className='p-0 m-0 mt-4' xs={1} sm={2} md={3} lg={4}>
                {
                    patterns?.length ? patterns.map(pattern =>
                        // width: '20rem', margin: "31px",
                        <Col key={pattern?._id}>
                            <Card as={Link} to={`/patern-detail/${pattern?._id}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}>

                                <LazyLoadImage
                                    alt={""}
                                    width={"130"}
                                    height={"130"}
                                    effect="blur"
                                    src={pattern?.image?.url} />
                                <Card.Body>
                                    <Card.Title style={{ textAlign: "center", verticalAlign: "middle", fontSize: "15px", color: "black" }}>{pattern?.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : ""
                }
            </Row>
        </Container>
    )
}

export default PatternList