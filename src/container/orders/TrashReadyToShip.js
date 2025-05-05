import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import { DatePickerIcon, Drop, ExportIcon, RevertBackIcon, SearchIcon, } from '../../svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrders, getAllOrdersList, setFilterValues, getTrashOrders, revertOrders, getAllOrderExport } from '../../redux/ordersSlice';
import { Box, CircularProgress, Pagination } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import DeleteModal from '../../component/DeleteModal';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export const TrashReadyToShip = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { trashOrdersData, filterOptions, isLoading, isRefresh, } = useSelector((state) => state.orders);

    console.log('trashOrdersData', trashOrdersData);

    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [order, setOrder] = useState('asc')


    const calculateShowingRange = () => {
        const start = (trashOrdersData?.currentPage - 1) * trashOrdersData.limit + 1;
        const end = Math.min(
            trashOrdersData?.currentPage * trashOrdersData.limit,
            trashOrdersData?.totalItems
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
                await dispatch(getTrashOrders({ ...filterOptions, orderType: 'Ready to ship orders' }));
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

    const RevertBackOrders = (value) => {
        dispatch(revertOrders(value));
    };


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
        const data = 'orderType=Ready to ship orders&isTrashed=true'
        const result = await dispatch(getAllOrderExport(data)).unwrap()
        console.log('result', result);

        const excelData = result?.data?.map((item) => ({
            Order_id: item?._id || '_',
            OrderItem_Name: item?.productDetails[0]?.productName || '_',
            // OrderItem_Quantity: item?.productDetails[0]?.units || '_',
            Customer: item?.customer?.firstName || '-',
            Email: item?.customer?.email || '-',
            Grand_Total: item?.grandTotal || '-',
            Payment_id: item?.payment?.id || '-',
            Payment_status: item?.payment?.status || '-',
            Date: moment(item?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            Status: 'Delivered',
            Order_type: item?.orderType || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'TrashReadyToShipOrders.xlsx');
    };
    //Filtered the data from maindata and search data
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



            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <div className={productStyle.search} style={{ width: '40%' }}>
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
                <div className={productStyle.dateStlye} style={{ width: '15%' }} >
                    <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                </div>
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.header}>
                    {/* <CustomizedCheckbox /> */}
                    <div className={orderStyle.orderMainStyle}> Order Id </div>

                    <div className={orderStyle.productMainStyle}> Product </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.dateStyle}>Date</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.customerStyle}>Customer</div>
                    <div className={orderStyle.totalStyle}>Total </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "price" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.paymentStyle}>Payment</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "payment" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.status} style={{ width: '14%' }}>Status</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}> <Drop color="#858D9D" /> </div>
                    <div className={orderStyle.action}>Action</div>
                </div>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {trashOrdersData?.data?.length > 0 ? (
                            <>
                                <div>
                                    {trashOrdersData?.data?.map((item, index) => {
                                        return (
                                            <div className={productStyle.info} key={index}>
                                                <div className={orderStyle.orderMainStyle} style={{ color: '#1D1F2C' }}> {item?._id} </div>
                                                <div className={orderStyle.productNameStyle} style={{width:'35%'}}>

                                                    {/* <img src={item?.productDetails[0]?.featuredImage} alt='productImage' width={40} height={40} style={{ borderRadius: 5 }} /> */}
                                                    <div>
                                                        <span >{item?.productDetails[0]?.productName && item.productDetails[0]?.productName.length > 10 ? `${item?.productDetails[0]?.productName.substring(0, 10)}...` : item?.productDetails[0]?.productName}</span>
                                                        {/* <span style={{ marginLeft: 5, color: '#1D1F2C' }}>{item?.order_items[0]?.name}</span> */}
                                                        <br />
                                                        <p className={productStyle.description}>+{item?.productDetails?.length - 1} Other Products</p>
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
                                                    <span className={productStyle.description} style={{ color: '#667085' }}>{item?.customer?.email && item?.customer?.email?.length > 15 ? `${item?.customer?.email.substring(0, 15)}...` : item?.customer?.email}</span>
                                                </div>
                                                <div className={orderStyle.totalStyle} >
                                                    ₹{item?.grandTotal}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={orderStyle.paymentStyle} style={{ color: '#667085' }}>
                                                    {item?.payment?.status}
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
                                                        paddingLeft: 6,
                                                        paddingRight: 6
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
                                                        onClick={() => RevertBackOrders(item?._id)}
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
                                            Showing {start}-{end} from {trashOrdersData?.totalItems}{" "}

                                        </div>
                                        <Pagination
                                            count={trashOrdersData?.totalPages}
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
            // handleSubject={handleSubject}
            />
        </div >
    )
}
