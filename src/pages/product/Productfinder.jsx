import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';

import { FcCheckmark } from 'react-icons/fc';
import { AiOutlineGlobal } from 'react-icons/ai';
import { BsHouseFill } from 'react-icons/bs';
import ApiService from '../../helpers/ApiServices';
import { UserContext } from '../../states/contexts/UserContext';
import { capitalizeInitials, getModelRoute, showMessage } from '../../helpers/Utils';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';
import AppContentForm from '../../components/elements/builders/AppContentForm';
import ViewCustomerDataInProductFinder from '../../components/elements/components/modals/ViewCustomerDataInProductFinder';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DefaultImg from '../../image/default_product_img.jpg'
import TableHeaderImage from '../../components/elements/components/TableHeaderImage';
import { CustomerContext } from '../../states/contexts/CustomerContext';


const Productfinder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    let [searchParams, setSearchParams] = useSearchParams();

    const [collection, setCollection] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedCustData, setSelectedCustData] = useState({});
    const [products, setProducts] = useState([]);
    const [largeImageProducts, setLargeImageProducts] = useState([]);
    const [smallImageProducts, setSmallImageProducts] = useState([]);
    const [qtys, setQtys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState([]);
    const [countryList, setCountryList] = useState([{ text: "Select country", _id: 1 }]);
    const [industryCodes, setIndustryCodes] = useState([]);
    const [regionCustomers, setRegionCustomers] = useState([]);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [stateName, setStateName] = useState(searchParams.get("state"));
    const [industryCode, setIndustryCode] = useState(searchParams.get("IC"));

    // console.log(searchParams.get("IC"));

    const { dispatch, user } = useContext(UserContext)
    const { customer } = useContext(CustomerContext)
    const { dispatch: iconDispatch, textColor, division, ...rest } = useContext(BrandIconContext)

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {}
    });

    // Global variables //params.data.customer.custData.industryCodes?.filter(ele => ele?.text === "BRICK AND MORTAR")
    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let columns = [{
        headerName: 'CUSTOMER NAME (CITY)', field: 'customer.customer', width: 250, pinned: "left",
        cellRendererFramework: (params) => <div style={{ display: "flex", gap: "10px" }}>

            <span style={{ cursor: "pointer", fontWeight: 500 }}>{params.data.customer.customer}</span>
            {
                params.data.customer.custData.industryCodes?.filter(ele => ele?.text == "ONLINE SHOP")?.length ? <span><AiOutlineGlobal style={{ color: "blue" }} /></span> : null
            }
        </div>
    }]
    // let columns = [{ headerName: { name: 'CUSTOMER NAME (CITY)' }, field: 'customer.customer', width: 250, pinned: "left" }]


    function onGridReady(params) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const handleExportAsCsv = (e) => {
        gridApi.exportDataAsCsv();
    }

    const setTestCustomer = (customers, array) => {
        if (customers?.length) {
            // array.unshift({ _id: "--SELECT A REGION--", name: "--SELECT A REGION--" })
            // array.unshift(customers[0]) // Add test account at the begening of array
            // array.unshift({ _id: "--TEST ACCOUNT--", name: "--TEST ACCOUNT--" })
        }
        return array;
    }

    const checkUSA = (ele) => {
        // console.log(ele);
        return ele.isUSA == 'true';
    }

    const checkCANADA = (ele) => {
        // console.log(ele);
        return ele.isCANADA == 'true';
    }

    const getRegion = async () => {
        let options = [];
        let regions = [];

        try {
            ApiService.setHeader()
            const response1 = await ApiService.get(`/shop/customList/title?model=${getModelRoute(user).model}&title=${"Territory Name USA"}`)
            const response2 = await ApiService.get(`/shop/customList/title?model=${getModelRoute(user).model}&title=${"Territory Name Canada"}`)
            const response3 = await ApiService.get(`/shop/internationalExport`)

            Array.prototype.push.apply(regions, [{ _id: "-CANADA-", name: "-CANADA-" }])
            Array.prototype.push.apply(regions, response3.data.documents.filter(checkCANADA))
            Array.prototype.push.apply(regions, response2?.data.document.options)

            Array.prototype.push.apply(regions, [{ _id: "-USA-", "name": "-USA-" }])
            Array.prototype.push.apply(regions, response3.data.documents.filter(checkUSA))
            Array.prototype.push.apply(regions, response1?.data.document.options)

            // console.log("options", options)
            // console.log("user", user)

            // // Sales rep and sale amanager can see only their teritory.
            // if (user?.userTypes.includes("SALES_REP") || user?.userTypes.includes("SALES_MANAGER")) {

            //     Array.prototype.push.apply(options, [{ _id: "-CANADA-", name: "-CANADA-" }])
            //     user?.region.map(ele => {

            //         if (response2?.data.document.options.find(e => e.text == ele.text) != undefined)
            //             Array.prototype.push.apply(options, [response2?.data.document.options.find(e => e.text == ele.text)])
            //     })

            //     Array.prototype.push.apply(options, [{ _id: "-USA-", "name": "-USA-" }])
            //     user?.region.map(ele => {

            //         if (response1?.data.document.options.find(e => e.text == ele.text) != undefined)
            //             Array.prototype.push.apply(options, [response1?.data.document.options.find(e => e.text == ele.text)])
            //     })

            //     const array = setTestCustomer(customers, options)
            //     array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            //     setState(array)
            //     // setState([region])
            // } else {
            //     const array = setTestCustomer(customers, regions)
            //     array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            //     setState(array)
            // }

            const array = setTestCustomer(customers, regions)
            array.unshift({ _id: 'Select State / Prov', name: 'Select State / Prov' })
            setState(array)
        } catch (error) {
            console.log(error.response.data)
            showMessage(error.response.data.message, "error")
        }
    }

    const getCollection = async () => {
        // setIsLoading(true)
        // console.log(id);
        ApiService.setHeader()
        await ApiService.get(`shop/collection/${id}?model=${getModelRoute(user).model}`).then(async response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                setCollection(response?.data.document)
                // getAllProductsByCollection(response?.data.document?.name)
                getAllCustomerInSelectedRegion(response?.data.document?.name)
                // setIsLoading(false)
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getAllCustomerInSelectedRegion = async (collectionName) => {
        // setIsLoading(true)
        // let array = []
        // console.log("iC: ", industryCode);

        ApiService.setHeader()
        // ApiService.get(`shop/user/buyProducts?region=${stateName}&name=${collectionName}&industryCode=${industryCode}`).then(response => {
        ApiService.get(`shop/customer/buyProducts?model=${getModelRoute(user).model}&region=${stateName}&name=${collectionName}&industryCode=${industryCode}`).then(response => {

            // Remove logged in store from the list
            const custs = response.data.documents.filter(ele => ele.customer?.custData?.name !== customer?.name)
            // console.log(custs);

            if (response?.data.isSuccess) {
                // setRegionCustomers(response?.data.document)
                setProducts(response.data.products)
                setRegionCustomers(custs)
                setValue('region', stateName)
                setValue('industryCode', industryCode)
                setIsLoading(false)
            }
        }).catch(error => {
            console.log(error.response?.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getIndustryCodes = (data) => {
        ApiService.setHeader()
        ApiService.get(`shop/customList/title?model=${getModelRoute(user).model}&title=NCS INDUSTRY CODES`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                setIndustryCodes(response?.data.document.options)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const getCountryList = (data) => {
        ApiService.setHeader()
        ApiService.get(`shop/customList/title?model=${getModelRoute(user).model}&title=NCS COUNTRY LIST`, data).then(response => {
            // console.log(response.data);
            if (response?.data.isSuccess) {
                countryList.push(...response?.data.document.options)
            }
        }).catch(error => {
            console.log(error.response.data)
            // console.log("Else Catch")
            // showMessage(error.response.data.message, "error")
        })
    }

    const openModal = (params) => {
        // console.log(params);
        if (params.column.colId === "customer.customer") {
            setSelectedCustData(params.data.customer)
            setModalShow(true)
        }
    }

    const goToPrintPage = () => {
        navigate(`/print/${id}?state=${stateName}&IC=${industryCode}`)
    }

    // Format the table header
    for (const product of products) {
        // console.log(product.uploadSmallPoster);
        let obj = {}

        // obj.headerName = product?.name
        obj.headerComponent = TableHeaderImage
        obj.headerComponentParams = {
            name: product?.name,
            image: product?.uploadSmallPoster?.url
        }
        obj.field = product.name
        obj.width = '200'
        obj.editable = false
        obj.cellRendererFramework = (params) => params.data[product.name] == true ? <FcCheckmark className='' style={{ width: "50px", height: "30px", textAlign: "center" }} /> : false

        columns.push(obj)
    }

    console.log(columns);



    useEffect(() => {
        setIsLoading(true)

        getRegion()
        getIndustryCodes()
        getCountryList()
        getCollection()
    }, [id, stateName, industryCode]);

    if (isLoading) {
        return (
            <Container className='p-0'
                style={{ color: 'rgb(128, 128, 128)', fontSize: '3rem', fontWeight: 100, display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center', height: '70vh' }}
            >
                PLEASE WAIT WHILE YOUR DATA HAS BEEN LOADED...
            </Container>
        )
    }


    return (
        <AppContentForm>
            <Container className='' style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}>
                <Row className=' p-0' style={{ fontSize: "27px", fontWeight: 500 }}>
                    Product Finder
                </Row>
                <Row className=' p-0' style={{ fontSize: "15px", fontWeight: 500 }}>
                    For Collection: {collection?.name}
                </Row>
                <Row className=' p-0' style={{ display: "flex", gap: "10px" }}>
                    {/* <Col className=' p-0'>Stores in {stateName.charAt(0) + stateName.slice(1).toLowerCase()}</Col> */}
                    <Col className=' p-0'>Stores in {capitalizeInitials(stateName)}</Col>
                    <Col className=' p-0'>
                        <Form.Select size='sm' aria-label="Default select example"
                            {...register("industryCode")}
                            defaultValue={industryCode}
                            onChange={e => {
                                // console.log(e.target.value);
                                setIndustryCode(e.target.value)
                                navigate(`/product-finder/${id}?state=${stateName}&IC=${e.target.value}`)
                            }}>
                            <option value={"null"}>{'Select Industry Code...'}</option>
                            {
                                industryCodes?.length && industryCodes.map(industryCode => {
                                    // console.log(industryCode);
                                    return <option key={industryCode?.value} value={industryCode?.text}>{industryCode?.text}</option>
                                })
                            }
                        </Form.Select>
                    </Col>
                    <Col className=' p-0'>
                        {
                            industryCode == 'INTERNATIONAL DISTRIBUTOR' ?
                                <Form.Select size='sm' aria-label="Default select example"
                                    {...register("region")}
                                    defaultValue={stateName}
                                    onChange={e => {
                                        console.log();
                                        setStateName(e.target.value)
                                        setSearchParams(e.target.value)
                                        navigate(`/product-finder/${id}?state=${e.target.value}&IC=${industryCode}`)
                                    }}
                                >
                                    {
                                        countryList?.length && countryList.map(ele => {
                                            // console.log(ele);
                                            return <option key={ele?._id} value={ele?.text}>{ele?.text}</option>
                                        })
                                    }
                                </Form.Select>
                                :
                                <Form.Select size='sm' aria-label="Default select example"
                                    {...register("region")}
                                    defaultValue={stateName}
                                    onChange={e => {
                                        console.log();
                                        setStateName(e.target.value)
                                        setSearchParams(e.target.value)
                                        navigate(`/product-finder/${id}?state=${e.target.value}&IC=${industryCode}`)
                                    }}
                                >
                                    {
                                        state?.length && state.map(ele => {
                                            // console.log(ele);
                                            return <option key={ele?._id} value={ele?.name}>{ele?.name}</option>
                                        })
                                    }
                                </Form.Select>
                        }

                    </Col>
                    <Col className=' p-0' style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button className='animet_btton' onClick={goToPrintPage} style={{ backgroundColor: rest.backgroundColor, borderColor: rest.backgroundColor }} variant="primary" size="sm">Print</Button>
                    </Col>
                </Row>
                <Row className=' p-0' style={{ color: rest.color }}>The following stores have purchased these products:</Row>
                <Row className=' p-0'>
                    {(regionCustomers && columns) ?
                        <div className={`ag-theme-alpine scroll scroll4 p-0 mt-3 ${division === "NORTHCOTT" ? 'ag-theme-alpine-n scroll scroll4' : division === "BANYAN BATIKS" ? "ag-theme-alpine-b scroll scroll4" : "ag-theme-alpine-p scroll scroll4"}`} style={{ width: "100%" }}>
                            <AgGridReact
                                onGridReady={onGridReady}
                                rowData={regionCustomers}
                                columnDefs={columns}
                                defaultColDef={{
                                    editable: true,
                                    sortable: true,
                                    // flex: 1,
                                    minWidth: 100,
                                    filter: true,
                                    resizable: true,
                                    suppressNavigable: true,
                                    // cellStyle: () => ({
                                    //     // display: "flex",
                                    //     // alignItems: "center",
                                    //     // justifyContent: "center"
                                    //     textAlign: 'center'
                                    // }),

                                }}
                                headerHeight={80}
                                animateRows={true}
                                domLayout='autoHeight'
                                rowHeight={40}
                                pagination={true}
                                paginationPageSize={regionCustomers?.length}
                                onCellClicked={openModal}
                                // overlayNoRowsTemplate="No Purchase Order found. Let's create one!"
                                overlayNoRowsTemplate='<span style="color: rgb(128, 128, 128); font-size: 2rem; font-weight: 100;">No Records Found!</span>'
                            />
                        </div>

                        // <div style={{ overflowX: 'scroll' }}>
                        //     <Table className='striped bordered hover size="sm"'>
                        //         <thead style={{ backgroundColor: "#c5c5c5", zIndex: 999 }}>
                        //             <tr style={{}}>
                        //                 {
                        //                     regionCustomers?.map((regionCustomer, index) => {
                        //                         return <th key={index} style={{ minWidth: "220px" }}>
                        //                             <div>
                        //                                 <p>{index == 0 ? "Customer name (City)" : regionCustomer?.productName}</p>
                        //                                 {index > 0 ? <p><LazyLoadImage
                        //                                     className='rounded'
                        //                                     style={{ cursor: "pointer", objectFit: "fill" }}
                        //                                     alt={""}
                        //                                     width={"40"}
                        //                                     height={"40"}
                        //                                     effect="blur"
                        //                                     src={regionCustomer?.image ? regionCustomer?.image : DefaultImg} /></p> : null}
                        //                             </div>
                        //                         </th>
                        //                     })
                        //                 }
                        //             </tr>
                        //         </thead>
                        //     </Table>
                        // </div>

                        : null
                    }
                </Row>
            </Container>
            <ViewCustomerDataInProductFinder show={modalShow} customerData={selectedCustData} setModalShow={setModalShow} />
        </AppContentForm>
    )
}

export default Productfinder

