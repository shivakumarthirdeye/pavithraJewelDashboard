import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import SwitchTab from '../../component/SwicthTab';
import { DatePickerIcon, DeleteIcon, DeliveredIcon, Drop,  ExportIcon, FilterIcon, NewIcon, ProcessingIcon, SearchIcon, ShippingIcon, ViewIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrders, getOrders, orderStatistics, getAllOrderExport, setFilterValues } from '../../redux/ordersSlice';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CheckIcon from '@mui/icons-material/Check';
import DeleteModal from '../../component/DeleteModal';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { formatDate } from '../../helper/FormatDate';

export const MadeToOrders = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { ordersData, filterOptions, isLoading, isRefresh, orderStatisticsData } = useSelector((state) => state.orders);
console.log('ordersData==============',ordersData);

    //Main data

    const [value, setValue] = useState([
        { val: "All Dates", id: 0 },
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
    const [status, setStatus] = useState("");
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        let data = '?orderType=Made to orders'
        dispatch(orderStatistics(data))
    }, [dispatch])


    const changeID = (id) => {
        setSelected(id.val);
    };


   

    const calculateShowingRange = () => {
        const start = (ordersData?.currentPage - 1) * ordersData.limit + 1;
        const end = Math.min(
            ordersData?.currentPage * ordersData.limit,
            ordersData?.totalItems
        );
        return { start, end };
    };

    const { start, end } = calculateShowingRange();

    // Handler function to handle category click
    const handlePageChange = (event, page) => {
        dispatch(setFilterValues({ page }));
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        dispatch(setFilterValues({ search: e.target.value, page: 1 }));
    };

    const handleFilterSelection = (e) => {
        setStatus(e.target.value)
        dispatch(setFilterValues({ status: e.target.value, page: 1 }));
    };



    const handleStartDateChange = (e) => {
        setSelectedDate(e);
        dispatch(setFilterValues({ startDate: e, page: 1 }))
    };
    const handleEndDateChange = (e) => {
        setSelectedDate(e);
        dispatch(setFilterValues({ endDate: e, page: 1 }))
    };

    const handleOpenMenu = (e) => {
        setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        dispatch(setFilterValues({ sortBy: e.target.value, order, page: 1 }))
    };
    

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                await dispatch(getOrders({ ...filterOptions, orderType: 'Made to orders', }));
            } catch (error) {
                console.log(error);
            }
        };
        getAllCategories();
    }, [dispatch, filterOptions, isRefresh]);


    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const deletedData = (value) => {
        let data ={
            status:true
        }
        dispatch(deleteOrders({value,data}));
    };


    const dateContent = (
        <div style={{ width: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                    // value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(newValue) => {
                        const [startDate, endDate] = newValue;
                        handleStartDateChange(startDate ? dayjs(startDate).format('YYYY-MM-DD') : null);
                        handleEndDateChange(endDate ? dayjs(endDate).format('YYYY-MM-DD') : null);
                    }}
                    calendars={1}
                />
            </LocalizationProvider>
        </div>
    );



    const statusContent = (
        <div style={{ width: '100%' }}>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "8px 0px",
                    backgroundColor: status === "" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#822D32', marginLeft: 12, marginRight: 1, fontFamily: 'Poppins' }}> Clear All</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "NEW" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "NEW" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        color: '#2F2F2F',
                        fontFamily: 'Poppins',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "NEW"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    New
                </Typography>

            </Box>

            <Box
                onClick={() => handleFilterSelection({ target: { value: "PROCESSING" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "PROCESSING" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins',
                        color: '#2F2F2F',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "PROCESSING"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Processing
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "SHIPPED" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "SHIPPED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins',
                        color: '#2F2F2F',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "SHIPPED"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Shipped
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "DELIVERED" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "DELIVERED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins',
                        color: '#2F2F2F',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "DELIVERED"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Delivered
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "CONFIRMED" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "CONFIRMED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins',
                        color: '#2F2F2F',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "CONFIRMED"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Confirmed
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "READY TO SHIP" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "READY TO SHIP" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    // borderRadius: "8px",
                    padding: "8px 0px",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: '10px',
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins',
                        color: '#2F2F2F',
                        marginLeft: 5,
                        marginRight: 10
                    }}>
                    {status === "READY TO SHIP"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Ready to ship
                </Typography>
            </Box>

        </div>
    );

    const transformedData = [
        {
            id: 0,
            icon: <NewIcon />,
            name: 'New',
            number: orderStatisticsData?.NEW?.totalCount || 0,
            dayCount: `+${orderStatisticsData?.NEW?.todayCount || 0} today`
        },
        {
            id: 1,
            icon: <ProcessingIcon />,
            name: 'Processing',
            number: orderStatisticsData?.PROCESSING?.totalCount || 0,
            dayCount: `+${orderStatisticsData?.PROCESSING?.todayCount || 0} today`
        },
        {
            id: 2,
            icon: <ShippingIcon />,
            name: 'Shipped',
            number: orderStatisticsData?.SHIPPED?.totalCount || 0,
            dayCount: `+${orderStatisticsData?.SHIPPED?.todayCount || 0} today`
        },
        {
            id: 3,
            icon: <DeliveredIcon />,
            name: 'Delivered',
            number: orderStatisticsData?.DELIVERED?.totalCount || 0,
            dayCount: `+${orderStatisticsData?.DELIVERED?.todayCount || 0} today`
        }
    ];


    const exportToExcel = async () => {
        const data = 'orderType=Made to orders&isTrashed=false'
        const result = await dispatch(getAllOrderExport(data)).unwrap()
        const excelData = result?.data?.map((item) => ({
            Order_id: item?._id || '_',
            OrderItem_Name: item?.productDetails[0]?.productName || '_',
            // OrderItem_Quantity: item?.productDetails[0]?.units || '_',
            Customer: item?.customer?.firstName || '-',
            Email: item?.customer?.email || '-',
            Grand_Total: item?.grandTotal || '-',
            Advance_Paid: item?.advancePaid || '-',
            Payment_id: item?.payment?.id || '-',
            Payment_status: item?.payment?.status || '-',
            Date: moment(item?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.status || '-',
            Order_type: item?.orderType || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'MadeToOrders.xlsx');
    };

   
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Made To Orders</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Made To Orders" />
                </div>
                <div className={orderStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} onClick={exportToExcel}>
                        <ExportIcon /> <p style={{ marginLeft: 5 }}>Export</p>
                    </div>
                    <div className={orderStyle.trashButton} onClick={() => navigate('/orders/MadeToOrders/TrashMadeToOrders')}>
                        Trash
                    </div>
                </div>
            </div>

            <div className={orderStyle.cardWrap} style={{ marginTop: 20 }}>
                {transformedData?.map((item, index) => {
                    return (
                        <div className={orderStyle.cardStyle}>
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.nameStyle}>
                                        {item?.name}
                                    </div>
                                    <div className={orderStyle.numStyle} style={{ marginTop: 10 }}>
                                        {item?.number}
                                    </div>
                                    <div className={productStyle.description} style={{ marginTop: 10 }}>
                                        {item?.dayCount}
                                    </div>
                                </div>
                                <div>
                                    {item.icon}
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
            <div className={productStyle.container} style={{ marginTop: 20 }}>
                <div >
                    <SwitchTab
                        value={value}
                        selected={selected}
                        onChange={(id) => changeID(id)}
                    />
                </div>
                <div style={{ width: '50%' }}>
                    <div className={productStyle.filterBoxStyle}>
                        <div className={productStyle.search} style={{ width: '60%' }}>
                            <div style={{ cursor: 'pointer', marginTop: 5 }}>
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search Orders. . ."
                            />
                        </div>
                        <div className={productStyle.dateStlye} >
                            <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                        </div>
                        <div className={productStyle.filter} >
                            <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.header}>
                    {/* <CustomizedCheckbox /> */}
                    <div className={orderStyle.orderMainStyle}> Order Id </div>

                    <div className={orderStyle.productMainStyle} > Product </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.dateStyle}>Date</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "customerName" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.customerStyle}>Customer</div>
                    <div className={orderStyle.totalStyle}>Price </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "price" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.paymentStyle}>Payment</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.status}>Status</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.action}>Action</div>
                </div>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {ordersData?.data?.length > 0 ? (
                            <>
                                <div>
                                    {ordersData?.data?.map((item, index) => {
                                        const arr = item?.status;
                                        let lastValue = arr?.at(-1);
                                        return (
                                            <div className={productStyle.info} key={index}>
                                                <div className={orderStyle.orderMainStyle} style={{ color: '#1D1F2C' }}> {item?._id} </div>
                                                <div className={orderStyle.productNameStyle}>

                                                    {/* <img src={item?.order_items[0]?.productId?.featuredImage} alt='productImage' width={40} height={40} style={{ borderRadius: 5 }} /> */}
                                                    <div>
                                                        <span >{item?.productDetails[0]?.productName && item?.productDetails[0]?.productName?.length > 10 ? `${item?.productDetails[0]?.productName?.substring(0, 10)}...` : item?.productDetails[0]?.productName}</span>
                                                        {/* <span style={{ marginLeft: 5, color: '#1D1F2C' }}>{item?.order_items[0]?.name}</span> */}
                                                        <br />
                                                        {/* <p className={productStyle.description}>{item?.productDetails?.length}, Other Products</p> */}
                                                    </div>
                                                </div>
                                                {/* <div className={productStyle.dropdownStyle}/> */}
                                                <div className={orderStyle.dateStyle} style={{ color: '#667085' }}>
                                                    {formatDate(item?.createdAt)}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.customerStyle} style={{ color: '#1D1F2C' }} >
                                                    {item?.customer?.firstName}{" "}{item?.customer?.lastName}
                                                    <br />
                                                    {/* <span className={productStyle.description} style={{ color: '#667085' }}>{item?.customer?.email}</span> */}
                                                    <span className={productStyle.description} style={{ color: '#667085',textTransform:'none'  }}>{item?.customer?.email && item?.customer?.email?.length > 15 ? `${item?.customer?.email.substring(0, 15)}...` : item?.customer?.email}</span>
                                                </div>
                                                <div className={orderStyle.totalStyle} >
                                                    <div>
                                                        ₹{item?.grandTotal}
                                                        <br />
                                                        <span className={orderStyle.adPayment}>Ad: ₹{item?.advancePaid}  </span>
                                                    </div>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.paymentStyle} style={{ color: '#667085' }}>
                                                    <div>
                                                        Razorpay
                                                        <br />
                                                        <span className={orderStyle.adPayment} style={{ color: '#F92929' }}>{item?.payment?.status}</span>
                                                    </div>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div
                                                    style={{
                                                        backgroundColor: lastValue?.name === 'NEW'
                                                            ? "#4A4C561A" : lastValue?.name === 'PROCESSING'
                                                                ? '#F439391A' : lastValue?.name === 'DELIVERED'
                                                                    ? '#EAF8FF' : lastValue?.name === 'READY TO SHIP'
                                                                            ? '#EDDF181A' : '#EAF8FF',
                                                        width: '15%',
                                                        borderRadius: 10,
                                                        height: 30,
                                                        alignContent: 'center',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        // marginLeft: 20,
                                                        alignSelf: 'center',
                                                        paddingLeft: 7,
                                                        paddingRight: 7
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'DM Sans',
                                                            fontSize: 12,
                                                            fontWeight: '600',
                                                            lineHeight: 18.23,
                                                            letterSpacing: 0.1,
                                                            textAlign: 'center',
                                                            // textTransform: 'capitalize',
                                                            color: lastValue?.name === 'NEW'
                                                                ? "#4A4C56" : lastValue?.name === 'PROCESSING'
                                                                    ? '#F86624' : lastValue?.name === 'DELIVERED'
                                                                        ? '#2BB2FE' : lastValue?.name === 'READY TO SHIP'
                                                                                ? '#EDDF18' : '#3250FF',
                                                        }}
                                                    >{lastValue?.name === 'NEW'
                                                        ? "New" : lastValue?.name === 'PROCESSING'
                                                            ? 'Processing' : lastValue?.name === 'DELIVERED'
                                                                ? 'Delivered' : lastValue?.name === 'READY TO SHIP'
                                                                    ? 'Ready to ship'  : 'Shipped'}
                                                    </span>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.action}>
                                                    <div
                                                        onClick={() => navigate(`/orders/MadeToOrders/MadeToOrderDetails/${item._id}`)}
                                                    >
                                                        <ViewIcon />
                                                    </div>
                                                    <div style={{ marginLeft: 12 }} onClick={() => openDeleteModal(item?._id)}>
                                                        <DeleteIcon />
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
                                            Showing {start}-{end} from {ordersData?.totalItems}{" "}

                                        </div>
                                        <Pagination
                                            count={ordersData?.totalPages}
                                            page={filterOptions?.page}
                                            onChange={handlePageChange}
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
                handleSubject={deletedData}
            />
        </div >
    )
}
