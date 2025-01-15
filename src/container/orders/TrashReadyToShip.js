import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import SwitchTab from '../../component/SwicthTab';
import { DatePickerIcon, DeleteIcon, DeliveredIcon, Drop, Dropdown, ExportIcon, FilterIcon, ForwardIcon, NewIcon, ProcessingIcon, RevertBackIcon, SearchIcon, ShippingIcon, ViewIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrders, getOrders, searchOrders, orderStatistics, getAllOrdersList, filterOrder } from '../../redux/ordersSlice';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import Calendar from 'react-calendar';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CheckIcon from '@mui/icons-material/Check';
import DeleteModal from '../../component/DeleteModal';
import CustomSeparator from '../../component/CustomizedBreadcrumb';

export const TrashReadyToShip = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const ordersData = useSelector((state) => state.orders);
    const isLoading = useSelector((state) => state.orders.isLoading);
    const isRefresh = useSelector((state) => state.orders.isRefresh);
    //Main data
    const ordersListData = ordersData?.ordersData?.data;
    console.log('ordersData==================', ordersData);

    //Pagination Data
    const pagination = ordersData?.ordersData?.pagination

    //Search Data
    const searchData = ordersData?.searchOrdersData?.data;
    //Pagination Data
    const searchPagination = ordersData?.searchOrdersData?.pagination

    //statistics
    const orderStats = ordersData?.orderStatistics

    console.log('ordersData', searchPagination);

    const [value, setValue] = useState([
        { val: "All Date", id: 0 },
        { val: "12 Months", id: 1 },
        { val: "30 Days", id: 2 },
        { val: "7 Days", id: 3 },
        { val: "24 Hour", id: 4 },
    ]);
    const [selected, setSelected] = useState('');
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null)

    useEffect(() => {
        dispatch(orderStatistics())
    }, [dispatch])



    const handleDateChange = (date) => {
        setSelectedDate((prevFilter) =>
            prevFilter && prevFilter.getTime() === date.getTime() ? '' : date
        );
    };


    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (search) {
            let data = `?page=${currentPage}&isDeleted=false&query=${search}`
            dispatch(searchOrders(data))
        }
        else if (selectedDate || selectedFilter || selected) {
            dispatch(filterOrder({
                date: selectedDate,
                status: selectedFilter,
                isDeleted: false,
                filter: selected,
                page: currentPage
            }))
        }
        else {
            let data = `?page=${currentPage}&status=active`
            dispatch(getOrders(data))
        }
    }, [search, currentPage, isRefresh, selectedDate, selectedFilter, selected])

    // useEffect(() => {

    //     dispatch(filterOrder({
    //         date:selectedDate,
    //         status:selectedFilter,
    //         isDeleted:false,
    //         filter:selected
    //     }))

    // },[selectedDate,selectedFilter,selected])


    useEffect(() => {
        // Update pagination state when data changes
        if (search) {
            setCurrentPage(searchPagination?.currentPage)
            setTotalPages(searchPagination?.totalPages);
            setTotalItems(searchPagination?.totalItems);
            setItemsPerPage(searchPagination?.itemsPerPage || 10);
        } else {
            setCurrentPage(pagination?.currentPage);
            setTotalPages(pagination?.totalPages);
            setTotalItems(pagination?.totalItems);
            setItemsPerPage(pagination?.itemsPerPage || 10);
        }
    }, [search, pagination, searchPagination]);

    const calculateShowingRange = () => {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        return { start, end };
    };


    const { start, end } = calculateShowingRange();

    // Function to handle page changes
    const onPageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages = [];

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();


    const changeID = (id) => {
        setSelected(id.val);
    };

    console.log("selected", selected)

    const handleSubject = (value) => {
        dispatch(deleteOrders(value))
    }


    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', // This will give abbreviated month names (e.g., Dec)
            year: 'numeric',
        });
        return formattedDate;
    }

    const exportToExcel = async () => {
        // console.log(transaction)

        const result = await dispatch(getAllOrdersList()).unwrap()
        const excelData = result?.data?.map((item) => ({
            Order_id: item?.order_id || '_',
            OrderItem_Name: item?.order_items[0]?.name || '_',
            OrderItem_Quantity: item?.order_items[0]?.units || '_',
            Customer: item?.customer?.name || '-',
            Email: item?.customer?.email || '-',
            Grand_Total: item?.grandTotal || '-',
            Payment_Mode: item?.payment_method || '-',
            Date: moment(item?.order_date).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.status || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };
    //Filtered the data from maindata and search data
    let allOrdersData = [];
    if (search) {
        allOrdersData = searchData;
    } else {
        allOrdersData = ordersListData;
    }
    const handleFilterSelection = (filter) => {
        setSelectedFilter((prevFilter) => (prevFilter === filter ? '' : filter));
    };


    const dateContent = (
        <div style={{ width: "300px" }}>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                maxDate={new Date()}
            />
        </div>
    );


    const statusContent = (
        <div style={{ width: "auto" }}>
            <Box
                onClick={() => handleFilterSelection("NEW")}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "8px 12px",
                    backgroundColor: selectedFilter === "NEW" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                    marginBottom: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "NEW" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  New</Typography>
            </Box>

            <Box
                onClick={() => handleFilterSelection("PROCESSING")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "PROCESSING" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "PROCESSING" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Processing</Typography>

            </Box>
            <Box
                onClick={() => handleFilterSelection("SHIPPED")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: selectedFilter === "SHIPPED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}
                >  {selectedFilter === "SHIPPED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Shipped</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("EXCHANGE REQUEST")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "EXCHANGE REQUEST" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "EXCHANGE REQUEST" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Exchange Request</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("DELIVERED")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "DELIVERED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "DELIVERED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Delivered</Typography>

            </Box>
            <Box
                onClick={() => handleFilterSelection("EXCHANGED")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "EXCHANGED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "EXCHANGED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Exchanged</Typography>

            </Box>
            <Box
                onClick={() => handleFilterSelection("EXCHANGE REJECTED")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "EXCHANGE REJECTED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>  {selectedFilter === "EXCHANGE REJECTED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Exchange Rejected</Typography>

            </Box>
        </div>
    );

    const Data = [
        {
            id: 0,
            order_id: '32421',
            order_items: [{
                productId: {
                    featuredImage: '/jweleryImage.png'
                },
                name: 'supriya',
                stockQuantity: '2',
            }
            ],
            order_date: '23 jan 2025',
            customer: {
                name: 'rahul',
                email: 'elikraj86028@gmail.com'
            },
            grandTotal: '34452',
            payment_method: 'gpay',
            status: 'Delivered',
        },
        {
            id: 1,
            order_id: '32421',
            order_items: [{
                productId: {
                    featuredImage: '/jweleryImage.png'
                },
                name: 'supriya',
                stockQuantity: '2',
            }
            ],
            order_date: '23 jan 2025',
            customer: {
                name: 'rahul',
                email: 'elikraj86028@gmail.com'
            },
            grandTotal: '34452',
            payment_method: 'gpay',
            status: 'PROCESSING',
        },
        {
            id: 2,
            order_id: '32421',
            order_items: [{
                productId: {
                    featuredImage: '/jweleryImage.png'
                },
                name: 'supriya',
                stockQuantity: '2',
            }
            ],
            order_date: '23 jan 2025',
            customer: {
                name: 'rahul',
                email: 'elikraj86028@gmail.com'
            },
            grandTotal: '34452',
            payment_method: 'gpay',
            status: 'NEW',
        },
        {
            id: 3,
            order_id: '32421',
            order_items: [{
                productId: {
                    featuredImage: '/jweleryImage.png'
                },
                name: 'supriya',
                stockQuantity: '2',
            }
            ],
            order_date: '23 jan 2025',
            customer: {
                name: 'rahul',
                email: 'elikraj86028@gmail.com'
            },
            grandTotal: '34452',
            payment_method: 'gpay',
            status: 'SHIPPED',
        },
        {
            id: 4,
            order_id: '32421',
            order_items: [{
                productId: {
                    featuredImage: '/jweleryImage.png'
                },
                name: 'supriya',
                stockQuantity: '2',
            }
            ],
            order_date: '23 jan 2025',
            customer: {
                name: 'rahul',
                email: 'elikraj86028@gmail.com'
            },
            grandTotal: '34452',
            payment_method: 'gpay',
            status: 'DELIVERED',
        },
    ]
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Trash Orders</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Trash Orders" />
                </div>
                <div className={orderStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} onClick={exportToExcel}>
                        <ExportIcon /> <p style={{ marginLeft: 5 }}>Export</p>
                    </div>
                    <div
                        className={productStyle.buttonStyle}
                        style={{ backgroundColor: '#E87819' }}
                        onClick={() => navigate('/orders/ReadyToShipOrders')}
                    >
                        <span className={productStyle.addcategoryText}>Back To List</span>
                    </div>
                </div>
            </div>



            <div style={{ width: '100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20 }}>
                    <div className={productStyle.search} style={{ width: '40%' }}>
                        <div style={{ cursor: 'pointer', marginTop: 5 }}>
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Orders. . ."
                        />
                    </div>
                    <div className={productStyle.dateStlye} style={{width:'15%'}} >
                        <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                    </div>
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.header}>
                    {/* <CustomizedCheckbox /> */}
                    <div className={orderStyle.orderMainStyle}> Order Id </div>

                    <div className={orderStyle.productMainStyle}> Product </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.dateStyle}>Date</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.customerStyle}>Customer</div>
                    <div className={orderStyle.totalStyle}>Total </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.paymentStyle}>Payment</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.status} style={{width:'14%'}}>Status</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.action}>Action</div>
                </div>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {Data?.length > 0 ? (
                            <>
                                <div>
                                    {Data?.map((item, index) => {
                                        return (
                                            <div className={productStyle.info} key={index}>
                                                <div className={orderStyle.orderMainStyle} style={{ color: '#1D1F2C' }}> {item?.order_id} </div>
                                                <div className={orderStyle.productNameStyle}>

                                                    <img src={item?.order_items[0]?.productId?.featuredImage} alt='productImage' width={40} height={40} style={{ borderRadius: 5 }} />
                                                    <div>
                                                        <span >{item?.order_items[0]?.name && item.order_items[0]?.name.length > 10 ? `${item.order_items[0]?.name.substring(0, 10)}...` : item?.order_items[0]?.name}</span>
                                                        {/* <span style={{ marginLeft: 5, color: '#1D1F2C' }}>{item?.order_items[0]?.name}</span> */}
                                                        <br />
                                                        <p className={productStyle.description}>{item?.order_items?.stockQuantity}Other Products</p>
                                                    </div>
                                                </div>
                                                {/* <div className={productStyle.dropdownStyle}/> */}
                                                <div className={orderStyle.dateStyle} style={{ color: '#667085' }}>
                                                    {formatDate(item?.order_date)}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.customerStyle} style={{ color: '#1D1F2C' }} >
                                                    {item?.customer?.name}
                                                    <br />
                                                    {/* <span className={productStyle.description} style={{ color: '#667085' }}>{item?.customer?.email}</span> */}
                                                    <span className={productStyle.description} style={{ color: '#667085' }}>{item?.customer?.email && item?.customer?.email?.length > 15 ? `${item?.customer?.email.substring(0, 15)}...` : item?.customer?.email}</span>
                                                </div>
                                                <div className={orderStyle.totalStyle} >
                                                    {item?.grandTotal}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.paymentStyle} style={{ color: '#667085' }}>
                                                    {item?.payment_method}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div
                                                    style={{
                                                        backgroundColor: '#EAF8FF',
                                                        width: '15%',
                                                        borderRadius: 10,
                                                        height: 30,
                                                        alignContent: 'center',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        // marginLeft: 20,
                                                        alignSelf: 'center',
                                                        paddingLeft:6,
                                                        paddingRight:6
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'DM Sans',
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            lineHeight: 18.23,
                                                            letterSpacing: 0.5,
                                                            textAlign: 'center',
                                                            textTransform: 'capitalize',
                                                            color: '#2BB2FE',
                                                        }}
                                                    >Delivered
                                                    </span>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.action}>
                                                    <div
                                                        // onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails`)}
                                                    // onClick={() => navigate(`/orders/Orders/OrdersDetails/${item._id}`)}
                                                    >
                                                        <RevertBackIcon />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div
                                        className={productStyle.entryView}
                                        style={{ padding: 20, }}
                                    >
                                        <div className={productStyle.showingText}>
                                            {/* Showing {start}-{end} from {categoriesData?.totalCategories}{" "} */}
                                            Showing 1-2 from 2
                                        </div>
                                        <Pagination
                                            // count={categoriesData?.totalPages}
                                            // page={filterOptions?.page}
                                            // onChange={handlePageChange}
                                            count={2}
                                            page={2}
                                            shape="rounded"
                                            siblingCount={1} // Show one sibling page (previous and next)
                                            boundaryCount={0} // Do not show first and last buttons
                                            sx={{
                                                "& .MuiPaginationItem-root": {
                                                    margin: "0 4px",
                                                    color: "#E87819",
                                                    border: "1px solid #E0E2E7",
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    fontFamily: `'Public Sans', sans-serif`,
                                                },
                                                "& .Mui-selected": {
                                                    color: "#fff",
                                                    backgroundColor: "#E87819  !important", // custom color for selected page
                                                },
                                                "& .MuiPaginationItem-root:hover": {
                                                    color: "#fff",
                                                    backgroundColor: "#E87819", // custom hover color
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <ErrorPage />
                            </>
                        )}
                    </>
                )}

            </div >
            <DeleteModal
                heading={"Delete Order"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                description={'Do you want to delete this order? '}
                handleSubject={handleSubject}
            />
        </div >
    )
}
