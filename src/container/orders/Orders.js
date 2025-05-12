import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import SwitchTab from '../../component/SwicthTab';
import { DatePickerIcon, DeleteIcon, DeliveredIcon, Drop, ExportIcon, FilterIcon, NewIcon, ProcessingIcon, SearchIcon, ShippingIcon, ViewIcon } from '../../svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrders, getOrders, orderStatistics, setFilterValues, getAllOrderExport } from '../../redux/ordersSlice';
import { Box, Button, CircularProgress, Pagination, Typography } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CheckIcon from '@mui/icons-material/Check';
import DeleteModal from '../../component/DeleteModal';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export const Orders = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();
    const { ordersData, filterOptions, isLoading, isRefresh, orderStatisticsData } = useSelector((state) => state.orders);
    // console.log('location=======', location);

    //Main data
    console.log('ordersData==================', ordersData);

    const [value, setValue] = useState([
        { val: "All Dates", id: 0 },
        { val: "12 Months", id: 1 },
        { val: "30 Days", id: 2 },
        { val: "7 Days", id: 3 },
        { val: "24 Hour", id: 4 },
    ]);
    const [ordersValue, setOrdersValue] = useState([
        { val: "Single Product Orders", id: 0 },
        { val: "Multiple Product Orders", id: 1 },
    ]);
    const [selected, setSelected] = useState(0);
    const [selectedOrders, setSelectedOrders] = useState(0);
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [status, setStatus] = useState("");
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');

        if (tab !== null) {
            setSelectedOrders(Number(tab)); // Set the selected tab from URL
        }
    }, [location.search]);

    useEffect(() => {
        // let data = '?orderType=Ready to ship orders'
        dispatch(orderStatistics())
    }, [dispatch,])

    // const handleTabChange = (tabId) => {
    //     setSelected(tabId);
    //     navigate(`/orders/Orders?tab=${tabId}`);
    // };
    const changeID = (id) => {
        // console.log('id', id);

        setSelected(id.id);
        dispatch(setFilterValues({ filter: id.val, page: 1 }))

    };
    const changeOrdersID = (id) => {
        // console.log('id', id);

        setSelectedOrders(id.id);
        navigate(`/orders/Orders?tab=${id.id}`);
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
        if (selectedOrders === 0) {
            const getAllCategories = async () => {
                try {

                    await dispatch(getOrders({ ...filterOptions, isMutlipleOrder: false, }));
                } catch (error) {
                    console.log(error);
                }
            };
            getAllCategories();
        } else if (selectedOrders === 1) {
            const getAllCategories = async () => {
                try {

                    await dispatch(getOrders({ ...filterOptions, isMutlipleOrder: true, }));
                } catch (error) {
                    console.log(error);
                }
            };
            getAllCategories();
        }
    }, [dispatch, filterOptions, selectedOrders, isRefresh]);


    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const deletedData = (value) => {
        let data = {
            status: true,
            value
        }
        dispatch(deleteOrders(data));
    };




    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

    const handleDateRangeChange = (newValue) => {
        setSelectedDateRange(newValue);

        const [startDate, endDate] = newValue;

        if (startDate) {
            handleStartDateChange(dayjs(startDate).format('YYYY-MM-DD'));
        } else {
            handleStartDateChange(null);
        }

        if (endDate) {
            handleEndDateChange(dayjs(endDate).format('YYYY-MM-DD'));
        } else {
            handleEndDateChange(null);
        }
    };

    const handleClearDates = () => {
        setSelectedDateRange([null, null]);
        handleStartDateChange(null);
        handleEndDateChange(null);
    };

    const dateContent = (
        <div style={{ width: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                    value={selectedDateRange}
                    onChange={handleDateRangeChange}
                    calendars={1}
                    renderDay={(day, _value, DayComponentProps) => {
                        const isToday = dayjs().isSame(day, 'day');
                        return (
                            <PickersDay
                                {...DayComponentProps}
                                sx={{
                                    ...(isToday && {
                                        border: '2px solid #1976d2',
                                        fontWeight: 'bold',
                                        color: '#1976d2',
                                    }),
                                }}
                            />
                        );
                    }}
                />
            </LocalizationProvider>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, padding: '10px' }}>
                <Button variant="outlined" size="small" onClick={handleClearDates}>
                    Clear
                </Button>
            </Box>
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
        const data = 'isTrashed=false'
        const result = await dispatch(getAllOrderExport(data)).unwrap()
        console.log('result', result);

        const excelData = result?.data?.map((item) => ({
            Order_id: item?._id || '_',
            OrderItem_Name: item?.productDetails?.map((i) => i?.productName).join(', ') || '_',
            // OrderItem_Quantity: item?.productDetails[0]?.units || '_',
            Customer: `${item?.customer?.firstName} ${item?.customer?.lastName}` || '-',
            Email: item?.customer?.email || '-',
            Grand_Total: item?.grandTotal?.toLocaleString("en-IN") || '-',
            // Payment_id: item?.payment?.id || '-',
            Payment_status: item?.payment?.method || '-',
            Date: moment(item?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            // Status: item?.status || '-',
            Order_type: item?.productDetails?.map((i) => i?.gold?.orderType).join(', ') || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'Orders.xlsx');
    };



    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Orders</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Orders" />
                </div>
                <div className={orderStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} onClick={exportToExcel}>
                        <ExportIcon /> <p style={{ marginLeft: 5 }}>Export</p>
                    </div>
                    <div className={orderStyle.trashButton} onClick={() => navigate('/orders/Orders/TrashOrders')}>
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
            <div className={orderStyle.container} style={{ marginTop: 20 }}>
                <div style={{ width: '45%' }}>
                    <SwitchTab
                        value={value}
                        selected={selected}
                        onChange={(id) => changeID(id)}
                    />
                </div>
                <div style={{ width: '50%' }}>

                    <div className={productStyle.filterBoxStyle}>
                        {selectedOrders === 0 && (
                            <div className={productStyle.search} style={{ width: '70%' }}>
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
                        )}
                        <div className={productStyle.dateStlye} >
                            <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                        </div>
                        {selectedOrders === 0 && (
                        <div className={productStyle.filter} >
                            <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} />
                        </div>
                        )}
                    </div>
                    
                </div>
            </div>
            <div className={orderStyle.tabViewSwitchTab}>
                <SwitchTab
                    value={value}
                    selected={selected}
                    onChange={(id) => changeID(id)}
                />
                {selectedOrders === 0 && (
                    <div className={productStyle.filter} >
                        <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} />
                    </div>
                )}
                <div className={productStyle.dateStlye} >
                    <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                </div>
            </div>
            {selectedOrders === 0 && (
                <div className={orderStyle.filterBoxStyle}>
                    <div className={productStyle.search} >
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
                    {/* <div className={productStyle.dateStlye} >
                    <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                </div> */}
                </div>
            )}
            <div style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                <SwitchTab
                    value={ordersValue}
                    selected={selectedOrders}
                    onChange={(id) => changeOrdersID(id)}
                />
            </div>
            {selectedOrders === 0 ? (
                <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                    <div className={productStyle.scrollContainer} >
                        <div className={productStyle.header}>
                            {/* <CustomizedCheckbox /> */}
                            <div className={orderStyle.orderMainStyle}> Order Id </div>

                            <div className={orderStyle.productMainStyle} > Product </div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.dateStyle}>Date</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "customerName" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.customerStyle}>Customer</div>
                            <div className={orderStyle.totalStyle}>Total </div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "price" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.paymentStyle}>Payment</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.status}>Status</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.action}>Action</div>
                        </div>
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                {ordersData?.data?.length > 0 ? (
                                    <>
                                        <div>
                                            {ordersData?.data?.map((item, index) => {
                                                // const arr = item?.status;
                                                // let lastValue = arr?.at(-1);
                                                return (
                                                    <div className={productStyle.info} key={index}>
                                                        <div className={orderStyle.orderMainStyle} style={{ color: '#1D1F2C' }}> {item?._id} </div>
                                                        <div className={orderStyle.productNameStyle} style={{ width: '36%' }}>

                                                            {/* <img src={item?.order_items[0]?.productId?.featuredImage} alt='productImage' width={40} height={40} style={{ borderRadius: 5 }} /> */}
                                                            <div>
                                                                <span >{item?.productDetails[0]?.productName && item?.productDetails[0]?.productName?.length > 20 ? `${item?.productDetails[0]?.productName?.substring(0, 20)}...` : item?.productDetails[0]?.productName}</span>

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
                                                            <span className={productStyle.description} style={{ color: '#667085', textTransform: 'none' }}>{item?.customer?.email && item?.customer?.email?.length > 15 ? `${item?.customer?.email.substring(0, 15)}...` : item?.customer?.email}</span>
                                                        </div>
                                                        <div className={orderStyle.totalStyle} >
                                                            <div>
                                                                ₹{item?.grandTotal?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </div>
                                                        </div>
                                                        <div className={productStyle.dropdownStyle} />
                                                        <div className={orderStyle.paymentStyle} style={{ color: '#667085' }}>
                                                            {item?.payment?.method === 'HDFC' ? (
                                                                <div>
                                                                    {item?.payment?.method}
                                                                    <br />
                                                                    {/* <span className={orderStyle.adPayment} style={{ color: '#F92929' }}>{item?.payment?.status}</span> */}
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    Razorpay
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={productStyle.dropdownStyle} />
                                                        <div
                                                            style={{
                                                                backgroundColor: item?.status?.name === 'NEW'
                                                                    ? "#4A4C561A" : item?.status?.name === 'PROCESSING'
                                                                        ? '#F439391A' : item?.status?.name === 'DELIVERED'
                                                                            ? '#EAF8FF' : '#3250FF1A',
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
                                                                    fontSize: 11,
                                                                    fontWeight: '400',
                                                                    lineHeight: 18.23,
                                                                    letterSpacing: 0.1,
                                                                    textAlign: 'center',
                                                                    // textTransform: 'capitalize',
                                                                    color: item?.status?.name === 'NEW'
                                                                        ? "#4A4C56" : item?.status?.name === 'PROCESSING'
                                                                            ? '#F86624' : item?.status?.name === 'DELIVERED'
                                                                                ? '#2BB2FE' : '#3250FF',
                                                                }}
                                                            >{item?.status?.name === 'NEW'
                                                                ? "New" : item?.status?.name === 'PROCESSING'
                                                                    ? 'Processing' : item?.status?.name === 'DELIVERED'
                                                                        ? 'Delivered' : 'Out for delivery'}
                                                            </span>
                                                        </div>

                                                        <div className={productStyle.dropdownStyle} />
                                                        <div className={orderStyle.action}>
                                                            <div
                                                                onClick={() => navigate(`/orders/Orders/OrderDetails/${item._id}`)}
                                                            // onClick={() => navigate(`/orders/Orders/OrdersDetails/${item._id}`)}
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
                    </div>
                </div >
            ) : selectedOrders === 1 ? (
                <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                    <div className={productStyle.scrollContainer} >
                        <div className={productStyle.header}>
                            {/* <CustomizedCheckbox /> */}
                            <div className={orderStyle.orderMainStyle}> Order Id </div>

                            <div className={orderStyle.productMainStyle} > Product </div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.dateStyle}>Date</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "customerName" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.customerStyle}>Customer</div>
                            <div className={orderStyle.totalStyle}>Total </div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "price" } })}> <Drop color="#858D9D" /> </div>
                            <div className={orderStyle.paymentStyle}>Payment</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}> <Drop color="#858D9D" /> </div>
                            {/* <div className={orderStyle.status}>Status</div>
                            <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}> <Drop color="#858D9D" /> </div> */}
                            <div className={orderStyle.action}>Action</div>
                        </div>
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                {ordersData?.data?.length > 0 ? (
                                    <>
                                        <div>
                                            {ordersData?.data?.map((item, index) => {
                                                return (
                                                    <div className={productStyle.info} key={index}>
                                                        <div className={orderStyle.orderMainStyle} style={{ color: '#1D1F2C' }}> {item?._id} </div>
                                                        <div className={orderStyle.productNameStyle} style={{ width: '36%' }}>

                                                            {/* <img src={item?.order_items[0]?.productId?.featuredImage} alt='productImage' width={40} height={40} style={{ borderRadius: 5 }} /> */}
                                                            <div>
                                                                {/* <span >{item?.productDetails[0]?.productName && item?.productDetails[0]?.productName?.length > 20 ? `${item?.productDetails[0]?.productName?.substring(0, 20)}...` : item?.productDetails[0]?.productName}</span> */}
                                                                <span style={{ color: '#1D1F2C' }}>Multiple Items</span>
                                                                <br />
                                                                {item?.productDetails?.length > 0 ? (
                                                                    <p
                                                                        className={productStyle.description}
                                                                    >
                                                                        {item?.productDetails?.length}{" "}
                                                                        Products
                                                                    </p>
                                                                ) : (<p
                                                                    className={productStyle.description}>0 Other Products</p>
                                                                )}
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
                                                            <span className={productStyle.description} style={{ color: '#667085', textTransform: 'none' }}>{item?.customer?.email && item?.customer?.email?.length > 15 ? `${item?.customer?.email.substring(0, 15)}...` : item?.customer?.email}</span>
                                                        </div>
                                                        <div className={orderStyle.totalStyle} >
                                                            <div>
                                                                ₹{item?.grandTotal?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </div>
                                                        </div>
                                                        <div className={productStyle.dropdownStyle} />
                                                        <div className={orderStyle.paymentStyle} style={{ color: '#667085' }}>
                                                            {item?.payment?.method === 'HDFC' ? (
                                                                <div>
                                                                    {item?.payment?.method}
                                                                    <br />
                                                                    {/* <span className={orderStyle.adPayment} style={{ color: '#F92929' }}>{item?.payment?.status}</span> */}
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    Razorpay
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={productStyle.dropdownStyle} />
                                                        {/* <div
                                                            style={{
                                                                backgroundColor: lastValue?.name === 'NEW'
                                                                    ? "#4A4C561A" : lastValue?.name === 'PROCESSING'
                                                                        ? '#F439391A' : lastValue?.name === 'DELIVERED'
                                                                            ? '#EAF8FF' : '#3250FF1A',
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
                                                                                ? '#2BB2FE' : '#3250FF',
                                                                }}
                                                            >{lastValue?.name === 'NEW'
                                                                ? "New" : lastValue?.name === 'PROCESSING'
                                                                    ? 'Processing' : lastValue?.name === 'DELIVERED'
                                                                        ? 'Delivered' : 'Out for delivery'}
                                                            </span>
                                                        </div> */}

                                                        {/* <div className={productStyle.dropdownStyle} /> */}
                                                        <div className={orderStyle.action}>
                                                            <div
                                                                onClick={() => navigate(`/orders/Orders/MultiProductOrderDetails/${item._id}`)}
                                                            // onClick={() => navigate(`/orders/Orders/OrdersDetails/${item._id}`)}
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
                    </div>
                </div >
            ) : null}
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
