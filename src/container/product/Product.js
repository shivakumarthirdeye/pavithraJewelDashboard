import React, { useEffect, useState } from 'react';
import productStyle from './product.module.css';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProducts, getExportProducts, getProducts, setFilterValues } from '../../redux/productSlice';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CheckIcon from '@mui/icons-material/Check';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { DatePickerIcon, DeleteIcon, Drop, EditIcon, ExportIcon, FilterIcon, PlusIcon, SearchIcon, ViewIcon } from '../../svg';
import DeleteModal from '../../component/DeleteModal';
import { formatDate } from '../../helper/FormatDate';
import { getCategoriesExport } from '../../redux/categoriesSlice';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';



const Product = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()


    //states
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [order, setOrder] = useState('asc')


    const { productsData, filterOptions, isLoading, isRefresh,exportProductsData } = useSelector(
        (state) => state.products
    );
    const { categoriesExportData } = useSelector(
        (state) => state.categories
    );
    console.log('categoriesExportData', categoriesExportData);


    const calculateShowingRange = () => {
        const start = (productsData?.currentPage - 1) * productsData.limit + 1;
        const end = Math.min(
            productsData?.currentPage * productsData.limit,
            productsData?.totalItems
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

    const handleCategorySelect = (e) => {
        setSelectedCategory(e.target.value);
        dispatch(setFilterValues({ category: e.target.value, page: 1 }))
    };


    const handleStartDateChange = (e) => {
        console.log('e==============', e);

        setSelectedDate(e);
        dispatch(setFilterValues({ startDate: e, page: 1 }))
    };
    const handleEndDateChange = (e) => {
        console.log('e==============', e);

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
                await dispatch(getProducts(filterOptions));
            } catch (error) {
                console.log(error);
            }
        };
        getAllCategories();
    }, [dispatch, filterOptions, isRefresh]);

    useEffect(() => {
        dispatch(getCategoriesExport())
    }, [dispatch])

    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const deletedData = (value) => {
        dispatch(deleteProducts(value));
    };




    console.log('first', selectedDate)




    //Export Functionality
    const exportToExcel = async () => {
        // console.log(transaction)

        const result = await dispatch(getExportProducts()).unwrap()
        const excelData = result?.data?.map((item) => ({
            Product: item?.productdetails?.productName || '_',
            Sku: item?.productdetails?.inventory?.sku || '_',
            Product_ID: item?.productdetails?._id || '_',
            SubCategory: item?.productdetails?.category?.productSubcategory?.name || '-',
            Stock: item?.productdetails?.inventory?.totalstock || '-',
            Sale_Price: item?.sellingPrice || '-',
            Date: moment(item?.productdetails?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.productdetails?.status || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };


    const dateContent = (
        <div style={{ width: "300px" }}>
            {/* <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                maxDate={new Date()}
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                    // value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(newValue) => {
                        const [startDate, endDate] = newValue;
                        handleStartDateChange( startDate ? dayjs(startDate).format('YYYY-MM-DD') : null);
                        handleEndDateChange( endDate ? dayjs(endDate).format('YYYY-MM-DD') : null);
                    }}
                    calendars={1} 
                />
            </LocalizationProvider>
        </div>
    );

    const categoryContent = (
        <div style={{ height: "100%", width: '100%' }}>
            <Box
                onClick={() => handleCategorySelect({ target: { value: "" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "8px 0px",
                    backgroundColor: selectedCategory === "" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderBottom: '1px solid #E0E2E7',
                    borderBottomWidth: '100%',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 400, display: "flex", alignItems: "center", fontSize: 12, color: '#822D32', marginLeft: 12, marginRight: 1, fontFamily: 'Poppins' }}> Clear All</Typography>
            </Box>
            {categoriesExportData?.length > 0 ? (
            < >
            {categoriesExportData?.map((cat) => (
                <Box
                    key={cat._id} // Use cat._id as key for better optimization
                    onClick={() => handleCategorySelect({ target: { value: cat?._id } })}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: selectedCategory === cat._id ? "#F7F7F7" : "#FFFFFF",
                        cursor: "pointer",
                        overflow: 'auto',
                        padding: "8px 0",
                        borderBottom: '1px solid #E0E2E7',
                        borderBottomWidth: '100%',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx=
                        {{
                            fontWeight: 400,
                            display: "flex",
                            alignItems: "center",
                            fontSize: '12px',
                            lineHeight: '24px',
                            fontFamily: 'Poppins',
                            marginLeft: 5,
                            marginRight: 10
                        }}>
                        {selectedCategory === cat._id && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}{cat?.name}</Typography>
                </Box>
            ))}
            </>
            ) : (
                <Box>
                    <Typography>No Categories</Typography>
                </Box>
            )}
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
                onClick={() => handleFilterSelection({ target: { value: "PUBLISHED" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "PUBLISHED" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "PUBLISHED"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Published
                </Typography>

            </Box>

            <Box
                onClick={() => handleFilterSelection({ target: { value: "STOCKOUT" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "STOCKOUT" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "STOCKOUT"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Stockout
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection({ target: { value: "DRAFT" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "DRAFT" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "DRAFT"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Draft
                </Typography>
            </Box>

        </div>
    );

    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Product</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Product" />
                </div>
                <div className={productStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} 
                    onClick={exportToExcel}
                    >
                        <ExportIcon /> <p style={{ marginLeft: 5 }}>Export</p>
                    </div>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/product/Product/AddProduct')}>
                        <PlusIcon />
                        <div className={productStyle.addcategoryText}>Add Product</div>
                    </div>
                </div>
            </div>
            <div className={productStyle.filterBoxStyle} style={{ marginTop: 10 }}>
                <div className={productStyle.search} >
                    <div style={{ cursor: 'pointer', marginTop: 5 }}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search Product. . ."
                    />
                </div>
                <div className={productStyle.width}>
                    <div className={productStyle.dateStlye} >
                        <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                    </div>
                    <div className={productStyle.dateStlye} style={{ width: '25%' }}>
                        <PopoverComponent icon={<FilterIcon />} label="Category" content={categoryContent} value={selectedCategory} />
                    </div>
                    <div className={productStyle.filter}>
                        <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} value={status} />
                    </div>
                </div>
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10, }}>
                <div className={productStyle.header}>
                    {/* <CustomizedCheckbox /> */}
                    <div className={productStyle.productMainStyle}> Product </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "productName" } })}>
                        <Drop color="#858D9D" />
                    </div>
                    <div className={productStyle.skuStyle}>ID</div>
                    <div className={productStyle.catStyle}>Category</div>
                    <div className={productStyle.stockStyle}>Stock </div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "stock" } })}>
                        <Drop color="#858D9D" />
                    </div>
                    <div className={productStyle.priceStyle}>Price</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "price" } })}>
                        <Drop color="#858D9D" />
                    </div>
                    <div className={productStyle.status}>Status</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}>
                        <Drop color="#858D9D" />
                    </div>
                    <div className={productStyle.addedStyle}>Added</div>
                    <div className={productStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}>
                        <Drop color="#858D9D" />
                    </div>
                    <div className={productStyle.action}>Action</div>
                </div>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {productsData?.data?.length > 0 ? (
                            <>
                                <div>
                                    {productsData?.data?.map((item, index) => {
                                        return (
                                            <div className={productStyle.info} key={index}>
                                                {/* <CustomizedCheckbox /> */}
                                                <div className={productStyle.productMainStyle}>

                                                    <img src={item?.productdetails?.featurerdImage} style={{height:40,width:40,objectFit:'cover',borderRadius: 5}} alt='featurerdImage' />
                                                    <div>
                                                        <span style={{ marginLeft: 5 }}>{item?.productdetails?.productName && item?.productdetails?.productName?.length > 10 ? `${item?.productdetails?.productName?.substring(0, 10)}...` : item?.productdetails?.productName}</span>
                                                        <br />
                                                        <p style={{ marginLeft: 5 }} className={productStyle.description}>{item?.productdetails?.inventory?.sku} </p>
                                                    </div>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={productStyle.skuStyle}>
                                                    {item?.productdetails?._id}
                                                </div>
                                                <div className={productStyle.catStyle} style={{ color: '#667085' }}>
                                                    {item?.productdetails?.category?.productCategory?.name}
                                                </div>
                                                <div className={productStyle.stockStyle}>
                                                    {item?.productdetails?.inventory?.totalstock}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={productStyle.priceStyle}>
                                                    Rs. {item?.sellingPrice}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div
                                                    style={{
                                                        backgroundColor: item?.productdetails?.status === 'DRAFT' ? '#F0F1F3' : item?.productdetails?.status === 'PUBLISHED' ? "#1A98821A" : '#F439391A',
                                                        width: '13%',
                                                        borderRadius: 8,
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
                                                            fontSize: 12,
                                                            fontWeight: '600',
                                                            // lineHeight: 20,
                                                            letterSpacing: 0.5,
                                                            textAlign: 'center',
                                                            color: item?.productdetails?.status === 'DRAFT' ? "#4A4C56" : item?.productdetails?.status === 'PUBLISHED' ? '#4DDB4D' : '#F92929',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {item?.productdetails?.status === 'DRAFT' ? 'Draft' : item?.productdetails?.status === 'PUBLISHED' ? 'Published' : 'Outofstock'}
                                                    </span>
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={productStyle.addedStyle} style={{ color: '#667085' }}>
                                                    {formatDate(item?.productdetails?.createdAt)}
                                                </div>
                                                <div className={productStyle.dropdownStyle} />
                                                <div className={productStyle.action}>
                                                    <div onClick={() => navigate(`/product/Product/ProductViewDetails/${item?.productdetails?._id}`)}>
                                                        <ViewIcon />
                                                    </div>
                                                    <div style={{ marginLeft: 12 }} onClick={() => navigate(`/product/Product/EditProduct/${item?.productdetails?._id}`, { state: { item } })}>
                                                        <EditIcon />
                                                    </div>
                                                    <div style={{ marginLeft: 12 }} onClick={() => openDeleteModal(item?.productdetails?._id)}>
                                                        <DeleteIcon />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div
                                    className={productStyle.entryView}
                                    style={{ padding: 20, }}
                                >
                                    <div className={productStyle.showingText}>
                                        Showing {start}-{end} from {productsData?.totalItems}{" "}

                                    </div>
                                    <Pagination
                                        count={productsData?.totalPages}
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
                            </>
                        ) : (
                            <div>
                                <ErrorPage />
                            </div>
                        )}

                    </>
                )}
            </div >
            <DeleteModal
                heading={"Delete Product"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={data}
                desc={'Do you want to delete this product? '}
                handleSubject={deletedData}
            />
        </div>
    )
}

export default Product;