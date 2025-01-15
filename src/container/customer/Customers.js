import React, { useEffect, useState } from 'react';
import productStyle from '../product/product.module.css'
import {DeleteIcon, Drop, Dropdown, ExportIcon, SearchIcon, ViewIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';
import customerStyle from './customer.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { deleteCustomers, getAllCustomers, searchCustomers, getAllCustomersList } from '../../redux/customerSlice';
import { Box, CircularProgress, Pagination } from '@mui/material';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import DeleteModal from '../../component/DeleteModal';

export const Customers = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const customersListData = useSelector((state) => state.customers);
    const isLoading = useSelector((state) => state.customers.isLoading);
    const isRefresh = useSelector((state) => state.customers.isRefresh);

    //Main Data
    const customerLists = customersListData?.customerData?.data?.users;

    // Pagination Data
    const pagination = customersListData?.customerData?.pagination;

    //Search Data
    const searchDatas = customersListData?.searchCustomerData?.data;

    //Search Pagination data
    const searchPaginationData = customersListData?.searchCustomerData?.pagination;


    //state
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datas, setData] = useState([]);

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

    //Effects getting the listing data
    useEffect(() => {
        if (search) {
            let data = `?name=${search}&page=${currentPage}`
            dispatch(searchCustomers(data))
        } else {
            let data = `?page=${currentPage}`
            dispatch(getAllCustomers(data));
        }
    }, [search, currentPage, isRefresh]);

    // Effect Getting the pagination data 
    useEffect(() => {
        // Update pagination state when data changes
        if (search) {
            setCurrentPage(searchPaginationData?.currentPage)
            setTotalPages(searchPaginationData?.totalPages);
            setTotalItems(searchPaginationData?.totalItems);
            setItemsPerPage(searchPaginationData?.itemsPerPage || 10);
        } else {
            setCurrentPage(pagination?.page);
            setTotalPages(pagination?.totalPages);
            setTotalItems(pagination?.totalCustomers);
            setItemsPerPage(pagination?.itemsPerPage || 10);
        }
    }, [pagination, search, searchPaginationData]);

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

    //Filtered the data from maindata and search data
    let allCustomerData = [];
    if (search) {
        allCustomerData = searchDatas;
    } else {
        allCustomerData = customerLists;
    }

    //Deleting Customer
    const deletedCustomer = (value) => {
        dispatch(deleteCustomers(value))
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

    //Export
    const exportToExcel = async () => {
        // console.log(transaction)

        const result = await dispatch(getAllCustomersList()).unwrap()

        console.log(result.data?.users)

        const excelData = result?.data?.users?.map((item) => ({
            Customers_Name: item?.name || '_',
            Phone: item?.phone || '_',
            Email: item?.email || '-',
            Date: moment(item?.updatedAt).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.status || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        XLSX.writeFile(workbook, 'customers.xlsx');
    };
    const Data = [
        {
            id:0,
            name:'Supriya Raj',
            img:'/jweleryImage.png',
            phone:'7089422259',
            email:'elikraj86028@gmail.com',
            status:true,
            updatedAt: '10 jan 2025'
        }
    ]
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search By Name. . ."
                />
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.header} style={{ paddingLeft: 20 }}>
                    <div className={customerStyle.customerStyle}> Customer </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={customerStyle.numberStyle}>Phone number</div>
                    <div className={customerStyle.emailStyle}>Email</div>
                    <div className={customerStyle.statusStyle}>Status</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={customerStyle.dateStyle}>Register Date</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={customerStyle.actionStyle}>Action</div>
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
                                            <div className={productStyle.info} key={index} style={{ paddingLeft: 20 }}>
                                                <div className={customerStyle.customerStyle}>
                                                    <img src={item.img} alt='Avatar'style={{width:40,height:40,borderRadius:10}}/>
                                                    <div>
                                                        <span style={{ marginLeft: 5, color: '#1D1F2C' }}>{item?.name}</span>
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
                                                        backgroundColor: item?.status === true ? "#E9FAF7" : '#F439391A',
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
                                                            color: item?.status === true ? "#1DB41D" : '#F92929',
                                                        }}
                                                    >{item?.status === true ? 'Active' : 'Inactive'}</span>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={customerStyle.dateStyle} style={{ color: '#667085' }}>
                                                    {formatDate(item?.updatedAt)}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={customerStyle.actionStyle}>
                                                    <div 
                                                    // onClick={() => navigate(`/customers/Customers/CustomersDetails/${item?._id}`)}
                                                    onClick={() => navigate(`/customer/Customers/CustomersDetails`)}
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
