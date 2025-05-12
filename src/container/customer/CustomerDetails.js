import React, { useEffect, useState } from "react";
import customerStyle from "./customer.module.css";
import orderStyle from "../orders/orders.module.css";
import productStyle from "../product/product.module.css";
import catStyle from '../category/category.module.css'
import {
    BillingAddressIcon,
    ContactIcon,
    CopyIcon,
    CustomerInfoIcon,
    DatePickerIcon,
    DeleteIcon,
    Drop,
    Dropdown,
    EmailIcon,
    FilterIcon,
    HomeIcon,
    InfoReviewIcon,
    OneCustomerIcon,
    OneCustomerIdIcon,
    OrdersIcon,
    PaymentIcon,
    PhoneIcon,
    SearchIcon,
    ShippingAddressIcon,
    ViewIcon,
} from "../../svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomersOrders, getCustomersDetail, setFilterValues } from "../../redux/customerSlice";
import { Box, Button, CircularProgress, Pagination, Typography } from "@mui/material";
import { deleteOrders } from "../../redux/ordersSlice"
import PopoverComponent from "../../component/Popover";
import Calendar from "react-calendar";
import ErrorPage from "../../component/ErrorPage";
import CheckIcon from '@mui/icons-material/Check';
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";

export const CustomersDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const { customersDetailData, filterOptions, isLoading, isRefresh } = useSelector((state) => state.customers);
    const customerDetails = customersDetailData?.data;
    const customerDetailOrders =
        customersDetailData?.orders;

    console.log("customerDetailOrders", customerDetailOrders);
    // console.log("customersDetailData", customersDetailData);

    //State
    const [datas, setData] = useState([]);
    const [order, setOrder] = useState('asc')
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [copied, setCopied] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);

    // useEffect(() => {
    //     dispatch(getCustomersDetail(id))
    // }, [dispatch, id])

    const deletedData = (value) => {
        let data = {
            status: true,
            value
        }
        dispatch(deleteCustomersOrders(data));
    };

    const calculateShowingRange = () => {
        const start = (customersDetailData?.currentPage - 1) * customersDetailData.limit + 1;
        const end = Math.min(
            customersDetailData?.currentPage * customersDetailData.limit,
            customersDetailData?.totalItems
        );
        return { start, end };
    };

    const { start, end } = calculateShowingRange();


    const handlePageChange = (event, page) => {
        dispatch(setFilterValues({ page }));
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        dispatch(setFilterValues({ search: e.target.value, page: 1 }));
    };

    const handleFilterSelection = (e) => {
        setSelectedFilter(e)
        dispatch(setFilterValues({ status: e, page: 1 }));
    }

    const handleOpenMenu = (e) => {
        setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        dispatch(setFilterValues({ sortBy: e.target.value, order, page: 1 }))
    };
    const handleStartDateChange = (e) => {
        setSelectedDate(e);
        dispatch(setFilterValues({ startDate: e, page: 1 }))
    };
    const handleEndDateChange = (e) => {
        setSelectedDate(e);
        dispatch(setFilterValues({ endDate: e, page: 1 }))
    };
    useEffect(() => {
        const getAllCustomer = async () => {
            try {
                await dispatch(getCustomersDetail({ ...filterOptions, id: id }));
            } catch (error) {
                console.log(error);
            }
        };
        getAllCustomer();
    }, [dispatch, filterOptions, isRefresh, id]);


    //Delete Modal
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };



    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short", // This will give abbreviated month names (e.g., Dec)
            year: "numeric",
        });
        return formattedDate;
    };

    // const dateContent = (
    //     <div style={{ width: "300px" }}>
    //         <Calendar
    //             onChange={handleDateChange}
    //             value={selectedDate}
    //             // maxDate={new Date()}
    //             className={customerStyle.calendarStyle}
    //         />
    //     </div>
    // );

    const statusContent = (
        <div style={{ width: "100%", }}>
            <Box
                onClick={() => handleFilterSelection("")}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "8px 0px",
                    backgroundColor: selectedFilter === "" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#822D32', marginLeft: 12, marginRight: 1, fontFamily: 'Poppins' }}> Clear All</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("NEW")}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "8px 0px",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                    backgroundColor: selectedFilter === "NEW" ? "#F7F7F7" : "#FFFFFF",
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "NEW" && <CheckIcon fontSize="small" />}  New</Typography>
            </Box>

            <Box
                onClick={() => handleFilterSelection("PROCESSING")}
                sx={{
                    display: "flex",
                    padding: "8px 0px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "PROCESSING" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "PROCESSING" && <CheckIcon fontSize="small" />}  Processing</Typography>

            </Box>
            <Box
                onClick={() => handleFilterSelection("SHIPPED")}
                sx={{
                    display: "flex",
                    padding: "8px 0px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: selectedFilter === "SHIPPED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "SHIPPED" && <CheckIcon fontSize="small" />}Out for delivery</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("DELIVERED")}
                sx={{
                    display: "flex",
                    padding: "8px 0px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "DELIVERED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "DELIVERED" && <CheckIcon fontSize="small" />}Delivered</Typography>

            </Box>

        </div>
    );


    const handleCopyEmail = () => {
        const email = customerDetails?.email;
        if (email) {
            navigator.clipboard.writeText(email)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };
    const handleCopyPhone = () => {
        const phone = customerDetails?.phone
        if (phone) {
            navigator.clipboard.writeText(phone)
                .then(() => {
                    setCopiedPhone(true);
                    setTimeout(() => setCopiedPhone(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
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
    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={productStyle.container}>
                <div>
                    <h2 className={productStyle.categoryText}>Customers details</h2>
                    <CustomSeparator dashboard={'Dashboard'} type='Customers' subType='Customers Details' />
                </div>
                <div
                    className={orderStyle.exportStyle}
                    style={{ marginTop: 20 }}
                    onClick={() => navigate("/customer/Customers")}
                >
                    Back to list
                </div>
            </div>
            <div className={customerStyle.cardWrap}>
                <div className={customerStyle.infoCardStyle}>
                    <div
                        className={orderStyle.generalInfoStyle}
                        style={{ paddingLeft: 20, paddingTop: 20 }}
                    >
                        <div className={orderStyle.backgroundStyle}>
                            <InfoReviewIcon />
                        </div>
                        <div
                            className={orderStyle.generalInfoTextStyle}
                            style={{ paddingLeft: 10 }}
                        >
                            Customer Info
                        </div>
                    </div>
                    <div
                        className={orderStyle.lineStyle}
                        style={{ marginTop: 20, width: 514 }}
                    />
                    <>
                        {/* <div
                            className={orderStyle.generalInfoStyle}
                            style={{ marginTop: 20, paddingLeft: 20 }}
                        >
                            <OneCustomerIdIcon />
                            <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                Customer IDs
                            </p>
                        </div> */}
                        <div
                            className={customerStyle.proNameText}
                            style={{ marginLeft: 50, marginTop: 10 }}
                        >
                            {customerDetails?.customerId}
                        </div>
                    </>
                    <>
                        <div
                            className={orderStyle.generalInfoStyle}
                            style={{ marginTop: 20, paddingLeft: 20 }}
                        >
                            <OneCustomerIcon />
                            <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                Customer
                            </p>
                        </div>
                        <div
                            className={customerStyle.proNameText}
                            style={{ marginLeft: 45, marginTop: 10 }}
                        >
                            {customerDetails?.firstName}{" "}
                            {customerDetails?.lastName}
                        </div>                    </>
                </div>
                <div className={customerStyle.infoCardStyle}>
                    <div
                        className={orderStyle.generalInfoStyle}
                        style={{ paddingLeft: 20, paddingTop: 20 }}
                    >
                        <div className={orderStyle.backgroundStyle}>
                            <ContactIcon />
                        </div>
                        <div
                            className={orderStyle.generalInfoTextStyle}
                            style={{ paddingLeft: 10 }}
                        >
                            Contact
                        </div>
                    </div>
                    <div
                        className={orderStyle.lineStyle}
                        style={{ marginTop: 20, width: 514 }}
                    />
                    <div
                        className={orderStyle.iconStyle}
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    >
                        <div>
                            <div
                                className={orderStyle.generalInfoStyle}
                                style={{ marginTop: 20 }}
                            >
                                <EmailIcon />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                    Email
                                </p>
                            </div>
                            <div
                                className={customerStyle.proNameText}
                                style={{ marginLeft: 30, marginTop: 10 }}
                            >
                                {customerDetails?.email}
                            </div>
                        </div>
                        <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyEmail}>
                            <CopyIcon />
                            {copied && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                        </div>
                    </div>
                    <div
                        className={orderStyle.iconStyle}
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    >
                        <div>
                            <div
                                className={orderStyle.generalInfoStyle}
                                style={{ marginTop: 20 }}
                            >
                                <PhoneIcon />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                    Phone Number
                                </p>
                            </div>
                            <div
                                className={customerStyle.proNameText}
                                style={{ marginLeft: 30, marginTop: 10 }}
                            >
                                {customerDetails?.phone}
                            </div>
                        </div>
                        <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyPhone}>
                            <CopyIcon />
                            {copiedPhone && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={customerStyle.cardWrap} style={{ marginBottom: 20 }}>
                <div className={customerStyle.infoCardStyle}>
                    <div
                        className={orderStyle.generalInfoStyle}
                        style={{ paddingLeft: 20, paddingTop: 20 }}
                    >
                        <div className={orderStyle.backgroundStyle}>
                            <PaymentIcon />
                        </div>
                        <div
                            className={orderStyle.generalInfoTextStyle}
                            style={{ paddingLeft: 10 }}
                        >
                            Billing Address
                        </div>
                    </div>
                    <div
                        className={orderStyle.lineStyle}
                        style={{ marginTop: 20, width: 514 }}
                    />
                    <>
                        <div
                            className={orderStyle.generalInfoStyle}
                            style={{ marginTop: 20, paddingLeft: 20 }}
                        >
                            <BillingAddressIcon />
                            <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                Billing Address
                            </p>
                        </div>
                        {customerDetails?.billingAddress?.map((item) => (
                            <div
                                className={customerStyle.proNameText}
                                style={{ marginLeft: 50, marginTop: 10 }}
                            >
                                {item?.firstName} {item?.lastName}{","}
                                <br />
                                {item?.streetAddress}, {item?.city}, {item?.state} {item?.pincode},{" "}
                                {item?.country}
                                {/* Supriya Raj
                                1833 Bel Meadow Drive, Fontana, California 92335, USA */}
                            </div>
                        ))}
                        {/* <div
                            className={customerStyle.proNameText}
                            style={{ marginLeft: 50, marginTop: 10 }}
                        >
                            Supriya Raj
                            <br />
                            1833 Bel Meadow Drive, Fontana, California 92335, USA
                        </div> */}
                    </>
                </div>
                <div className={customerStyle.infoCardStyle}>
                    <div
                        className={orderStyle.generalInfoStyle}
                        style={{ paddingLeft: 20, paddingTop: 20 }}
                    >
                        <div className={orderStyle.backgroundStyle}>
                            <ShippingAddressIcon />
                        </div>
                        <div
                            className={orderStyle.generalInfoTextStyle}
                            style={{ paddingLeft: 10 }}
                        >
                            Shipping
                        </div>
                    </div>
                    <div
                        className={orderStyle.lineStyle}
                        style={{ marginTop: 20, width: 514 }}
                    />
                    <>
                        <div
                            className={orderStyle.generalInfoStyle}
                            style={{ marginTop: 20, paddingLeft: 20 }}
                        >
                            <HomeIcon />
                            <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>
                                Shipping Address
                            </p>
                        </div>
                        {customerDetails?.shippingAddress?.map((item) => (
                            <div
                                className={customerStyle.proNameText}
                                style={{ marginLeft: 50, marginTop: 5 }}
                            >
                                {item?.firstName} {item?.lastName}{","}
                                <br />
                                {item?.streetAddress}, {item?.city}, {item?.state} {item?.pincode},{" "}
                                {item?.country}
                            </div>
                        ))}
                        {/* <div
                            className={orderStyle.proNameText}
                            style={{ marginLeft: 50, marginTop: 10 }}
                        >
                            Supriya Raj
                            <br />
                            1833 Bel Meadow Drive, Fontana, California 92335, USA
                        </div> */}
                    </>
                </div>
            </div>
            <div className={customerStyle.productCardStyle}>
                <div className={customerStyle.headerStyle} style={{ padding: 20 }}>
                    <div className={orderStyle.backgroundStyle}>
                        <OrdersIcon />
                    </div>
                    <div
                        className={orderStyle.textStyle}
                        style={{ marginLeft: 10, marginTop: 5 }}
                    >
                        Orders
                    </div>
                    <div
                        style={{
                            marginLeft: 10,
                            width: 100,
                            height: 28,
                            borderRadius: 8,
                            backgroundColor: "#E9FAF7",
                            textAlign: "center",
                            marginTop: 5,
                        }}
                    >
                        <span
                            style={{
                                color: "#1A9882",
                                fontSize: 14,
                                fontWeight: "600",
                            }}
                        >
                            {customerDetailOrders?.length} Orders
                        </span>
                    </div>
                </div>
                <div className={orderStyle.productStyle} style={{ padding: 20 }}>
                    <div className={productStyle.search}>
                        <div style={{ cursor: "pointer", marginTop: 5 }}>
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search Order. . ."
                        />
                    </div>
                    <div className={productStyle.width}>
                        <div className={productStyle.dateStlye}>
                            <PopoverComponent
                                icon={<DatePickerIcon />}
                                label="Select Dates"
                                content={dateContent}
                            />
                        </div>
                        <div className={productStyle.filter} style={{ width: '25%' }}>
                            <PopoverComponent
                                icon={<FilterIcon />}
                                label="Status"
                                content={statusContent}
                            />
                        </div>
                    </div>
                </div>
                <div className={productStyle.scrollContainer} >
                    <div className={productStyle.header} style={{ paddingLeft: 20 }}>
                        <div className={orderStyle.orderMainStyle}> Order Id </div>

                        <div className={customerStyle.productMainStyle}> Product </div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}>
                            {" "}
                            <Drop color="#858D9D" /> {" "}
                        </div>
                        <div className={orderStyle.dateStyle}>Date</div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "date" } })}>
                            {" "}
                            <Drop color="#858D9D" /> {" "}
                        </div>
                        <div className={orderStyle.totalStyle}>Total </div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "total" } })}>
                            {" "}
                            <Drop color="#858D9D" /> {" "}
                        </div>
                        <div className={orderStyle.paymentStyle}>Payment</div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}>
                            {" "}
                            <Drop color="#858D9D" /> {" "}
                        </div>
                        <div className={orderStyle.status}>Status</div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}>
                            {" "}
                            <Drop color="#858D9D" /> {" "}
                        </div>
                        <div className={customerStyle.actionStyle}>Action</div>
                    </div>
                    {customerDetailOrders && customerDetailOrders?.length > 0 ? (
                        <>
                            <div>
                                {customerDetailOrders?.map((item, index) => {
                                    const arr = item?.products?.status;
                                    const lastValue = arr?.at(-1);
                                    return (
                                        <div
                                            className={productStyle.info}
                                            key={index}
                                            style={{ paddingLeft: 20 }}
                                        >
                                            <div
                                                className={orderStyle.orderMainStyle}
                                                style={{ color: "#1D1F2C" }}
                                            >
                                                {item?._id}
                                            </div>
                                            <div className={customerStyle.productMainStyle}>
                                                <img
                                                    width={40}
                                                    height={40}
                                                    src={item?.productDetails[0]?.featurerdImage}
                                                    alt="Featured"
                                                />
                                                <div>
                                                    <span style={{ marginLeft: 5, fontSize: 12, color: "#1D1F2C" }}>{item?.productDetails[0]?.productName && item?.productDetails[0]?.productName?.length > 20 ? `${item?.productDetails[0]?.productName?.substring(0, 20)}...` : item?.productDetails[0]?.productName}</span>

                                                    <br />

                                                </div>
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div
                                                className={orderStyle.dateStyle}
                                                style={{ color: "#667085" }}
                                            >
                                                {formatDate(item?.createdAt)}
                                            </div>
                                            <div
                                                className={productStyle.dropdownStyle}
                                            // style={{ marginLeft: 10 }}
                                            />
                                            <div className={orderStyle.totalStyle}>
                                                ₹{item?.grandTotal?.toLocaleString("en-IN")}
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div
                                                className={orderStyle.paymentStyle}
                                                style={{ color: "#667085", }}
                                            >
                                                {item?.payment?.method === 'HDFC' ? 'HDFC' : 'Razorpay'}
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div
                                                style={{
                                                    backgroundColor:
                                                    lastValue?.name === "NEW"
                                                            ? "#c7c8ca"
                                                            : lastValue?.name === "PROCESSING"
                                                                ? "#F439391A"
                                                                : lastValue?.name === "SHIPPED"
                                                                    ? "#EAF8FF"
                                                                    : "#E9FAF7",
                                                    width: "15%",
                                                    borderRadius: 10,
                                                    height: 30,
                                                    padding: "5PX",
                                                    alignContent: "center",
                                                    justifyContent: "center",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    // marginLeft: 20,
                                                    alignSelf: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: "DM Sans",
                                                        fontSize: 12,
                                                        fontWeight: "600",

                                                        letterSpacing: 0.5,
                                                        textTransform: "capitalize",
                                                        textAlign: "center",
                                                        color:
                                                        lastValue?.name === "NEW"
                                                                ? "#4A4C56"
                                                                : lastValue?.name === "PROCESSING"
                                                                    ? "#F86624"
                                                                    : lastValue?.name === "SHIPPED"
                                                                        ? "#2BB2FE"
                                                                        : "#1A9882",
                                                    }}
                                                >
                                                    {lastValue?.name === 'NEW' ? 'New' : lastValue?.name === 'PROCESSING' ? 'Processing' : lastValue?.name === 'SHIPPED' ? 'Out for delivery' : 'Delivered'}
                                                </span>
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div className={customerStyle.actionStyle}>
                                                <div
                                                    onClick={() =>
                                                        navigate(`/orders/Orders/OrderDetails/${item?._id}`)
                                                    }
                                                >
                                                    <ViewIcon />
                                                </div>

                                                <div
                                                    style={{ marginLeft: 12 }}
                                                    onClick={() => openDeleteModal(item?._id)}
                                                >
                                                    <DeleteIcon />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                className={catStyle.entryView}
                                style={{ padding: 20 }}
                            >
                                <div className={catStyle.showingText}>
                                    Showing {start}-{end} from {customersDetailData?.totalItems}{" "}
                                </div>
                                <Pagination
                                    count={customersDetailData?.totalPages}
                                    page={filterOptions?.page}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    siblingCount={1} // Show one sibling page (previous and next)
                                    boundaryCount={0} // Do not show first and last buttons
                                    sx={{
                                        "& .MuiPaginationItem-root": {
                                            margin: "0 4px",
                                            //   color: "#512DA8",
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
                        </>
                    ) : (
                        <ErrorPage />
                    )}
                </div>
            </div>
            <DeleteModal
                heading={"Delete Order"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                description={"Do you want to delete this order? "}
                handleSubject={deletedData}
            />
        </div>
    );
};
