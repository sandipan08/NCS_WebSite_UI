import { React, useContext, useEffect, useState } from 'react'
import { Container, Row, Card, Table, Button, Col } from 'react-bootstrap'
import { AgGridReact } from 'ag-grid-react';
import { BsBoxArrowInUpRight, BsEyeFill, BsFlagFill } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import DataTable from "react-data-table-component"

import { CustomerContext } from '../../states/contexts/CustomerContext'
import { UserContext } from '../../states/contexts/UserContext'
import ApiService from '../../helpers/ApiServices'
import { getModelRoute, showMessage } from '../../helpers/Utils'
import AppContentBody from '../../components/elements/builders/AppContentBody'
import moment from 'moment';
import { BrandIconContext } from '../../states/contexts/BrandIconContext';


const MyOrders = () => {
    const [state, setState] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const rootPath = location?.pathname?.split('/')[1];

    const { dispatch: customerDispatch, customer } = useContext(CustomerContext)
    const { division } = useContext(BrandIconContext)
    const { dispatch, user } = useContext(UserContext)

    let customers = JSON.parse(localStorage.getItem("PCTeRP.CUSTOMER_IDS"))
    let headerColor;



    function onGridReady(params) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const handleSearch = (e) => {
        gridApi.setQuickFilter(e.target.value);
    }

    const handleExportAsCsv = (e) => {
        gridApi.exportDataAsCsv();
    }

    const getOrders = async () => {
        console.log(customers[customers?.length - 1]?._id);
        setIsLoading(true)
        try {
            ApiService.setHeader();
            const response = await ApiService.get(`admin/order/orderByCustomer/${customers[customers?.length - 1]?._id}?model=${getModelRoute(user).model}`);
            if (response?.data.isSuccess) {
                console.log(response?.data.documents);
                setState(response?.data.documents)
                setFilterData(response?.data.documents)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error.response?.data)
            // console.log("Else Catch")
            showMessage(error.response?.data.message, "error")
        }
    }

    const goToOrderDetailPage = (id) => {
        navigate(`/order/${id}`)
    }


    const columns = [
        { headerName: 'ORDER DATE', field: 'orderDate', width: 160, valueGetter: (params) => params.data?.orderDate ? moment(params.data?.orderDate).format("MM/DD/YYYY ") : "Not Available" },
        { headerName: 'SHIPPING DATE', field: 'shippingDate', width: 160, valueGetter: (params) => params.data?.shippingDate ? moment(params.data?.shippingDate).format("MM/DD/YYYY ") : "Not Available" },
        // { headerName: 'ORDER NUMBER', field: 'orderNumber', width: 300, cellRendererFramework: (params) => <span style={{ cursor: "pointer" }} onClick={() => { goToOrderDetailPage(params.data._id) }}>{params.data.orderNumber}</span> },
        { headerName: 'ORDER NUMBER', field: 'orderNumber', width: 300, cellRendererFramework: (params) => <Link style={{ cursor: "pointer", color: "black" }} to={`/order/${params.data._id}`}>{params.data.orderNumber}</Link> },
        { headerName: 'PO NUMBER', field: 'customerPONumber', width: 200 },
        { headerName: 'TOTAL', field: 'total', width: 240, valueGetter: (params) => params.data?.total.toFixed(2) },
        {
            headerName: 'STATUS', field: 'status', width: 258,
            // cellRendererFramework: (params) => (customer?.isSOApprovalNeeded && (params.data?.status?.toUpperCase() === "PROCESSING" || params.data?.status?.toUpperCase() === "PENDING APPROVAL")) ?
            //     <p style={{ display: "flex", gap: "10px" }}>
            //         <span>{params.data?.status?.toUpperCase()}</span>
            //         <span><BsFlagFill style={{ color: "red" }} /></span>
            //     </p>

            //     : params.data?.status?.toUpperCase()
        },
        // { headerName: 'DETAIL', field: 'customerPONumber', width: 80, cellRendererFramework: (params) => <FcSearch style={{ cursor: "pointer" }} onClick={() => { goToOrderDetailPage(params.data._id) }} /> }
    ]




    useEffect(() => {
        getOrders()
    }, []);

    useEffect(() => {
        console.log("state", state);
        const result = state?.filter(data => {

            return data.status?.toLowerCase().match(search.toLowerCase())
        })

        setFilterData(result)
    }, [search]);



    return (
        <AppContentBody>
            <Container >

                <Row>
                    <p className='m-0 p-0' style={{ fontSize: "25px", fontWeight: 600 }}> MY ORDERS</p>
                    <hr style={{ height: "3px" }} />
                </Row>

                <Row className=''>
                    <div className='p-0 m-0' style={{ display: "flex", justifyContent: "flex-end" }}>
                        <input type="text" className="openning-cash-control__amount--input p-0 m-0 w-25" style={{ border: "none", borderBottom: "1px solid gray" }} placeholder="Search..." onChange={handleSearch}></input>
                    </div>
                    <div className={`ag-theme-alpine scroll scroll4 p-0 mt-3 ${division === "NORTHCOTT" ? 'ag-theme-alpine-n scroll scroll4' : division === "BANYAN BATIKS" ? "ag-theme-alpine-b scroll scroll4" : "ag-theme-alpine-p scroll scroll4"}`} style={{ height: 500, width: "100%" }}>
                        <AgGridReact
                            onGridReady={onGridReady}
                            rowData={state}
                            columnDefs={columns}
                            defaultColDef={{
                                editable: true,
                                sortable: true,
                                // flex: 1,
                                minWidth: 100,
                                filter: true,
                                resizable: true,
                            }}
                            pagination={true}
                            paginationPageSize={50}

                            // overlayNoRowsTemplate="No Purchase Order found. Let's create one!"
                            overlayNoRowsTemplate={isLoading ? '<span style="color: rgb(128, 128, 128); font-size: 2rem; font-weight: 100;">Fetching your orders!</span>' : '<span style="color: rgb(128, 128, 128); font-size: 2rem; font-weight: 100;">No Records Found!</span>'}
                        />
                    </div>
                </Row>

            </Container>
        </AppContentBody >
    )
}

export default MyOrders