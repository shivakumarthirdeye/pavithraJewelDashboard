import React, { useEffect, useState } from "react";
import customerStyle from "./customer.module.css";
import orderStyle from "../orders/orders.module.css";
import productStyle from "../product/product.module.css";
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
import { getCustomersDetail } from "../../redux/customerSlice";
import { Box, CircularProgress, Pagination, Typography } from "@mui/material";
import { deleteOrders } from "../../redux/ordersSlice"
import PopoverComponent from "../../component/Popover";
import Calendar from "react-calendar";
import ErrorPage from "../../component/ErrorPage";
import CheckIcon from '@mui/icons-material/Check';
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";

export const CustomersDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();


    const handleSubject = (value) => {
        dispatch(deleteOrders(value))
        dispatch(getCustomersDetail(id))
    }

    const customersDetailData = useSelector((state) => state.customers);
    const customerDetails = customersDetailData?.customersDetailData?.data;
    const customerDetailOrders =
        customersDetailData?.customersDetailData?.data?.orders;

    console.log("customerDetailOrders", customerDetailOrders);
    console.log("customerDetails", customerDetails);

    //State
    const [datas, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [paginatedOrders, setPaginatedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Pagination state

    const itemsPerPage = 10; // Adjust based on your requirements

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    let currentProducts = customerDetailOrders?.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(customerDetailOrders?.length / itemsPerPage);

    const handleDateChange = (date) => {
        setSelectedDate((prevFilter) =>
            prevFilter && prevFilter.getTime() === date.getTime() ? '' : date
        );
    };


    console.log(search)

    const onPageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const searchByProductName = (order) => {
        return Array.isArray(order?.order_items.productDetails) && order.order_items.productDetails.some((item) =>
            item?.name?.toLowerCase().includes(search.toLowerCase())
        );
    };


    useEffect(() => {
        // Filter orders based on selected date and status
        let filtered = customerDetailOrders || [];

        if (search) {
            filtered = filtered.filter(searchByProductName);
        }

        if (selectedDate) {
            const formattedSelectedDate = selectedDate.toLocaleDateString("en-US");
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.order_date).toLocaleDateString(
                    "en-US"
                );
                return orderDate === formattedSelectedDate;
            });
        }

        if (selectedFilter) {
            filtered = filtered.filter((order) => order.status === selectedFilter);
        }




        // Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedOrders(filtered.slice(startIndex, endIndex));
        setFilteredOrders(filtered); // Store all filtered orders for pagination control
    }, [customerDetailOrders, selectedDate, selectedFilter, currentPage, search]);

    currentProducts = paginatedOrders; // Use paginatedOrders derived from filtered data
    console.log("currentProducts", currentProducts);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages = [];
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage); // Total pages based on filtered orders

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    1,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    //Delete Modal
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    //Useeffect
    useEffect(() => {
        dispatch(getCustomersDetail(id));
    }, [dispatch]);

    const handleFilterSelection = (filter) => {
        setSelectedFilter((prevFilter) => (prevFilter === filter ? '' : filter));
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

    const dateContent = (
        <div style={{ width: "300px" }}>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                // maxDate={new Date()}
                className={customerStyle.calendarStyle}
            />
        </div>
    );

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
                    backgroundColor: selectedFilter === "NEW" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
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
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "SHIPPED" && <CheckIcon fontSize="small" />}  Shipped</Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("EXCHANGE REQUEST")}
                sx={{
                    display: "flex",
                    padding: "8px 0px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:
                        selectedFilter === "EXCHANGE REQUEST" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "EXCHANGE REQUEST" && <CheckIcon fontSize="small" />}  Exchange Request</Typography>
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
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#2F2F2F', fontFamily: 'Poppins', marginLeft: 5, marginRight: 10 }}>  {selectedFilter === "DELIVERED" && <CheckIcon fontSize="small" />}  Delivered</Typography>

            </Box>
            {/* <Box
                onClick={() => handleFilterSelection("EXCHANGED")}
                sx={{
                    display: "flex",
                    padding: "8px 2px",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        selectedFilter === "EXCHANGED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                    borderBottom:'1px solid #F7F7F7',
                    borderBottomWidth:'100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center" }}>  {selectedFilter === "EXCHANGED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Exchanged</Typography>

            </Box>
            <Box
                onClick={() => handleFilterSelection("EXCHANGE REJECTED")}
                sx={{
                    display: "flex",
                    padding: "8px 2px",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        selectedFilter === "EXCHANGE REJECTED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center" }}>  {selectedFilter === "EXCHANGE REJECTED" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Exchange Rejected</Typography>

            </Box> */}
        </div>
    );

    const Data = [
        {
            order_id: 12332,
            order_items: {
                productDetails: [{
                    name: 'Supriya',
                    featuredImage: '/jweleryImage.png'
                }
                ]
            },
            order_date: '22 jan 2025',
            grandTotal: '54543',
            payment_method: 'Visa',
            status: 'NEW'
        },
        {
            order_id: 12333,
            order_items: {
                productDetails: [{
                    name: 'Supriya',
                    featuredImage: '/jweleryImage.png'
                }
                ]
            },
            order_date: '22 jan 2025',
            grandTotal: '54543',
            payment_method: 'Visa',
            status: 'PROCCESSING'
        },
        {
            order_id: 12334,
            order_items: {
                productDetails: [{
                    name: 'Supriya',
                    featuredImage: '/jweleryImage.png'
                }
                ]
            },
            order_date: '22 jan 2025',
            grandTotal: '54543',
            payment_method: 'Visa',
            status: 'SHIPPED'
        },
        {
            order_id: 12334,
            order_items: {
                productDetails: [{
                    name: 'Supriya',
                    featuredImage: '/jweleryImage.png'
                }
                ]
            },
            order_date: '22 jan 2025',
            grandTotal: '54543',
            payment_method: 'Visa',
            status: 'DELIVERED'
        },
    ]

    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={productStyle.container}>
                <div>
                    <h2 className={productStyle.categoryText}>Customers details</h2>
                    <CustomSeparator dashboard={'Dashboard'} type='Customer Details' />
                </div>
                <div
                    className={orderStyle.exportStyle}
                    style={{ marginTop: 20 }}
                    onClick={() => navigate("/customer/Customers")}
                >
                    Back to list
                </div>
            </div>
            <div className={orderStyle.cardWrap}>
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
                            className={orderStyle.proNameText}
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
                            className={orderStyle.proNameText}
                            style={{ marginLeft: 45, marginTop: 10 }}
                        >
                            {/* {customerDetails?.name} */}
                            Supriya Raj
                        </div>
                    </>
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
                                className={orderStyle.proNameText}
                                style={{ marginLeft: 30, marginTop: 10 }}
                            >
                                {/* {customerDetails?.email} */}
                                elikraj86028@gmail.com
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <CopyIcon />
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
                                className={orderStyle.proNameText}
                                style={{ marginLeft: 30, marginTop: 10 }}
                            >
                                {/* {customerDetails?.phone} */}
                                +91-7089422258
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <CopyIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className={orderStyle.cardWrap} style={{ marginBottom: 20 }}>
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
                            Payment
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
                        {/* {customerDetails?.addresses?.map((item) => (
                            <div
                                className={orderStyle.proNameText}
                                style={{ marginLeft: 50, marginTop: 10 }}
                            >
                                {item?.firstName} {item?.lastName}
                                {","}
                                {item?.streetAddress}, {item?.city}, {item?.state} {item?.zip},{" "}
                                {item?.country}
                                Supriya Raj
                                1833 Bel Meadow Drive, Fontana, California 92335, USA
                            </div>
                        ))} */}
                        <div
                            className={orderStyle.proNameText}
                            style={{ marginLeft: 50, marginTop: 10 }}
                        >
                            Supriya Raj
                            <br />
                            1833 Bel Meadow Drive, Fontana, California 92335, USA
                        </div>
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
                        {/* {customerDetails?.addresses?.map((item) => (
                            <div
                                className={orderStyle.proNameText}
                                style={{ marginLeft: 50, marginTop: 10 }}
                            >
                                {item?.firstName} {item?.lastName}
                                {","}
                                {item?.streetAddress}, {item?.city}, {item?.state} {item?.zip},{" "}
                                {item?.country}
                            </div>
                        ))} */}
                        <div
                            className={orderStyle.proNameText}
                            style={{ marginLeft: 50, marginTop: 10 }}
                        >
                            Supriya Raj
                            <br />
                            1833 Bel Meadow Drive, Fontana, California 92335, USA
                        </div>
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
                            onChange={(e) => setSearch(e.target.value)}
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
                        <div className={productStyle.filter}>
                            <PopoverComponent
                                icon={<FilterIcon />}
                                label="Status"
                                content={statusContent}
                            />
                        </div>
                    </div>
                </div>
                <div className={productStyle.header} style={{ paddingLeft: 20 }}>
                    <div className={orderStyle.orderMainStyle}> Order Id </div>

                    <div className={customerStyle.productMainStyle}> Product </div>
                    <div className={productStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" /> {" "}
                    </div>
                    <div className={orderStyle.dateStyle}>Date</div>
                    <div className={productStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" /> {" "}
                    </div>
                    <div className={orderStyle.totalStyle}>Total </div>
                    <div className={productStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" /> {" "}
                    </div>
                    <div className={orderStyle.paymentStyle}>Payment</div>
                    <div className={productStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" /> {" "}
                    </div>
                    <div className={orderStyle.status}>Status</div>
                    <div className={productStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" /> {" "}
                    </div>
                    <div className={customerStyle.actionStyle}>Action</div>
                </div>
                {Data && Data?.length > 0 ? (
                    <>
                        <div>
                            {Data?.map((item, index) => {
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
                                            {item?.order_id}
                                        </div>
                                        <div className={customerStyle.productMainStyle}>
                                            <img
                                                width={40}
                                                height={40}
                                                src={item.order_items?.productDetails[0]?.featuredImage}
                                                alt="Featured"
                                            />
                                            <div>
                                                <span style={{ marginLeft: 5, color: "#1D1F2C" }}>
                                                    {item.order_items?.productDetails[0]?.name}
                                                </span>
                                                <br />
                                                {item.order_items?.productDetails.length > 1 ? (
                                                    <p
                                                        style={{ marginLeft: 5 }}
                                                        className={productStyle.description}
                                                    >
                                                        +{item.order_items?.productDetails.length - 1} Other
                                                        Products
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className={productStyle.dropdownStyle} />
                                        <div
                                            className={orderStyle.dateStyle}
                                            style={{ color: "#667085" }}
                                        >
                                            {formatDate(item?.order_date)}
                                        </div>
                                        <div
                                            className={productStyle.dropdownStyle}
                                        // style={{ marginLeft: 10 }}
                                        />
                                        <div className={orderStyle.totalStyle}>
                                            {item?.grandTotal}
                                        </div>
                                        <div className={productStyle.dropdownStyle} />
                                        <div
                                            className={orderStyle.paymentStyle}
                                            style={{ color: "#667085", }}
                                        >
                                            {item?.payment_method}
                                        </div>
                                        <div className={productStyle.dropdownStyle} />
                                        <div
                                            style={{
                                                backgroundColor:
                                                    item?.status === "NEW"
                                                        ? "#c7c8ca"
                                                        : item.status === "PROCCESSING"
                                                            ? "#F439391A"
                                                            : item.status === "SHIPPED"
                                                                ? "#EAF8FF"
                                                                : "#E9FAF7",
                                                width: "14%",
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
                                                        item?.status === "NEW"
                                                            ? "#4A4C56"
                                                            : item.status === "PROCCESSING"
                                                                ? "#F86624"
                                                                : item.status === "SHIPPED"
                                                                    ? "#2BB2FE"
                                                                    : "#1A9882",
                                                }}
                                            >
                                                {item?.status}
                                            </span>
                                        </div>
                                        <div className={productStyle.dropdownStyle} />
                                        <div className={customerStyle.actionStyle}>
                                            <div
                                                onClick={() =>
                                                    navigate(`/orders/Orders/OrdersDetails/${item?._id}`)
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
                    </>
                ) : (
                    <ErrorPage />
                )}
            </div>
            <DeleteModal
                heading={"Delete Order"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                description={"Do you want to delete this order? "}
                handleSubject={handleSubject}
            />
        </div>
    );
};
