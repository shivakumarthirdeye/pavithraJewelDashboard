import React, { useEffect, useState } from 'react';
import productStyle from '../product/product.module.css'
import { DeleteIcon, Drop, ExportIcon, SearchIcon, ViewIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';
import customerStyle from './customer.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { deleteCustomers, getAllCustomers, setFilterValues, getExportsCustomers } from '../../redux/customerSlice';
import { Box, CircularProgress, Pagination } from '@mui/material';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import DeleteModal from '../../component/DeleteModal';
import { formatDate } from '../../helper/FormatDate';
import catStyle from '../category/category.module.css'

export const Customers = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [order, setOrder] = useState('asc')
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datas, setData] = useState([]);

    const { customerData, filterOptions, isLoading, isRefresh, exportCustomersData } = useSelector(
        (state) => state.customers
    );
    console.log('customerData==========', customerData);


    const calculateShowingRange = () => {
        const start = (customerData?.currentPage - 1) * customerData.limit + 1;
        const end = Math.min(
            customerData?.currentPage * customerData.limit,
            customerData?.totalItems
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


    const handleOpenMenu = (e) => {
        const newOrder = order === 'asc' ? 'desc' : 'asc';
        setOrder(newOrder);
        dispatch(setFilterValues({
            sortBy: e.target.value,
            order: newOrder,
            page: 1
        }));
    };

    useEffect(() => {
        const getAllCustomer = async () => {
            try {
                await dispatch(getAllCustomers(filterOptions));
            } catch (error) {
                console.log(error);
            }
        };
        getAllCustomer();
    }, [dispatch, filterOptions, isRefresh]);

    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    //Deleting Customer
    const deletedCustomer = (value) => {
        dispatch(deleteCustomers(value))
    }

    //Export
    const exportToExcel = async () => {
        // console.log(transaction)

        const result = await dispatch(getExportsCustomers()).unwrap()

        console.log('result.data?.users', result)

        const excelData = result?.map((item) => ({
            Customers_Name: `${item?.firstName} ${item?.lastName}` || '_',
            Phone: item?.phone || '_',
            Email: item?.email || '-',
            Date: moment(item?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.status || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        XLSX.writeFile(workbook, 'customers.xlsx');
    };

    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Customers</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Customers" />
                </div>
                <div className={productStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} onClick={exportToExcel}>
                        <ExportIcon /> <p style={{ marginLeft: 5 }}>Export</p>
                    </div>
                </div>
            </div>

            <div className={productStyle.search} style={{ marginTop: 20, width: '40%' }}>
                <div style={{ cursor: 'pointer', marginTop: 5 }}>
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search By Name. . ."
                />
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.scrollContainer} >
                    <div className={productStyle.header} style={{ paddingLeft: 20 }}>
                        <div className={customerStyle.customerStyle}> Customer </div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "firstName" } })}>
                            <Drop color="#858D9D" /> </div>
                        <div className={customerStyle.numberStyle}>Phone number</div>
                        <div className={customerStyle.emailStyle}>Email</div>
                        <div className={customerStyle.statusStyle}>Status</div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}> <Drop color="#858D9D" /> </div>
                        <div className={customerStyle.dateStyle}>Register Date</div>
                        <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}> <Drop color="#858D9D" /> </div>
                        <div className={customerStyle.actionStyle}>Action</div>
                    </div>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {customerData?.data?.length > 0 ? (
                                <>
                                    <div>
                                        {customerData?.data?.map((item, index) => {
                                            return (
                                                <div className={productStyle.info} key={index} style={{ paddingLeft: 20 }}>
                                                    <div className={customerStyle.customerStyle}>
                                                        {item?.profileImg?.length > 0 ? (
                                                            <img src={item.profileImg} alt='Avatar' style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} />
                                                        ) :
                                                            <div className={customerStyle.profileStyle}>
                                                                {item?.firstName?.charAt(0).toUpperCase()}
                                                            </div>
                                                        }
                                                        <div>
                                                            <span style={{ marginLeft: 5, color: '#1D1F2C' }}>{item?.firstName}{" "}{item?.lastName}</span>
                                                        </div>
                                                    </div>
                                                    <div className={productStyle.dropdownStyle} />
                                                    <div className={customerStyle.numberStyle}>
                                                        {item?.phone}
                                                    </div>

                                                    <div className={customerStyle.emailStyle}>
                                                        {item?.email}
                                                    </div>
                                                    <div
                                                        style={{
                                                            backgroundColor: item?.status === 'ACTIVE' ? "#E9FAF7" : '#F439391A',
                                                            width: '10%',
                                                            borderRadius: 10,
                                                            height: 30,
                                                            alignContent: 'center',
                                                            justifyContent: 'center',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            // marginLeft: 20,
                                                            alignSelf: 'center'
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontFamily: 'DM Sans',
                                                                fontSize: 14,
                                                                fontWeight: '600',
                                                                letterSpacing: 0.5,
                                                                textAlign: 'center',
                                                                color: item?.status === "ACTIVE" ? "#1DB41D" : '#F92929',
                                                            }}
                                                        >{item?.status === "ACTIVE" ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                    <div className={productStyle.dropdownStyle} />
                                                    <div className={customerStyle.dateStyle} style={{ color: '#667085' }}>
                                                        {formatDate(item?.createdAt)}
                                                    </div>
                                                    <div className={productStyle.dropdownStyle} />
                                                    <div className={customerStyle.actionStyle}>
                                                        <div
                                                            onClick={() => navigate(`/customer/Customers/CustomersDetails/${item?._id}`)}
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
                                            className={catStyle.entryView}
                                            style={{ padding: 20 }}
                                        >
                                            <div className={catStyle.showingText}>
                                                Showing {start}-{end} from {customerData?.totalItems}{" "}
                                            </div>
                                            <Pagination
                                                count={customerData?.totalPages}
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
            </div>
            <DeleteModal
                heading={"Delete Customer"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                description={'Do you want to delete this customer? '}
                handleSubject={deletedCustomer}
            />
        </div >
    )
}
