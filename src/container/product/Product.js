import React, { useEffect, useState } from 'react';
import productStyle from './product.module.css';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProducts, getProducts, getProductsWithoutParams, getAllSingleProductList } from '../../redux/productSlice';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import PopoverComponent from '../../component/Popover';
import * as XLSX from 'xlsx';
import moment from 'moment'
import ErrorPage from '../../component/ErrorPage';
import CheckIcon from '@mui/icons-material/Check';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { DatePickerIcon, DeleteIcon, Drop, EditIcon, ExportIcon, FilterIcon, PlusIcon, SearchIcon, ViewIcon } from '../../svg';
import DeleteModal from '../../component/DeleteModal';



const Product = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const getProductsData = useSelector((state) => state.products);
    const getProductDataForExport = getProductsData?.productsDataWithoutParam?.data
    console.log('getProductDataForExport', getProductDataForExport);

    // const {categoriesData} = useSelector((state) => state.categories)
    // const isLoading = useSelector((state) => state.products.isLoading);
    // const isRefresh = useSelector((state) => state.products.isRefresh);

    const getCategoriesData = useSelector((state) => state.subCategories);
    const categoryData = getCategoriesData?.catData?.data;
    console.log("categoryData", categoryData);

    // useEffect(() => {
    //     dispatch(getCateData());
    // }, [dispatch]);

    useEffect(() => {
        dispatch(getProductsWithoutParams())
    }, [dispatch])



    //Product data
    const productData = getProductsData?.productsData?.data;

    // Pagination
    const pagination = getProductsData?.productsData?.pagination;

    //Search data 
    const searchData = getProductsData?.searchData?.data;

    // Search Pagination
    const searchDataPagination = getProductsData?.searchData?.pagination;




    //states
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null)

    console.log('first', selectedDate)

    // Handler function to handle category click
    const handleCategorySelect = (cat) => {
        setSelectedCategory((prevFilter) =>
            prevFilter && prevFilter === cat._id ? null : cat._id // Use `null` to reset state
        );
    };


    const handleDateChange = (date) => {
        setSelectedDate((prevFilter) =>
            prevFilter && prevFilter.getTime() === date.getTime() ? '' : date
        );
    };


    //Deleting Modal
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };


    //Effects


    // useEffect(() => {
    //     if (search) {
    //         let data = `?name=${search}&page=${currentPage}&productType=single`;
    //         dispatch(getSearchProduct(data));
    //     } else if (selectedCategory || selectedDate || selectedFilter) {
    //         dispatch(
    //             filterProducts({
    //                 date: selectedDate,
    //                 status: selectedFilter,
    //                 category: selectedCategory,
    //                 productType: "single",
    //                 page: currentPage
    //             })
    //         );
    //     } else {
    //         let data = `?page=${currentPage}&productType=single`;
    //         dispatch(getProducts(data));
    //     }
    // }, [search, currentPage, selectedCategory, selectedDate, selectedFilter]);


    useEffect(() => {
        // Update pagination state when data changes
        if (search) {
            setCurrentPage(searchDataPagination?.currentPage)
            setTotalPages(searchDataPagination?.totalPages);
            setTotalItems(searchDataPagination?.totalItems);
            setItemsPerPage(searchDataPagination?.itemsPerPage || 10);
        } else {
            setCurrentPage(pagination?.currentPage);
            setTotalPages(pagination?.totalPages);
            setTotalItems(pagination?.totalItems);
            setItemsPerPage(pagination?.itemsPerPage || 10);
        }
    }, [pagination, search, searchDataPagination]);

    //Pagination Functionality
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

    //main data and search data and filter data 
    // let allProductsData = []
    // if (search) {
    //     allProductsData = searchData;
    // } else {
    //     allProductsData = productData;
    // }

    //Deleting dispatch function
    const deletedProduct = (value) => {
        dispatch(deleteProducts(value))
    }

    // useEffect(() => {
    //     let data = `?page=${currentPage}`
    //     dispatch(getCategories(data));
    // },[dispatch])




    //date format function
    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', // This will give abbreviated month names (e.g., Dec)
            year: 'numeric',
        });
        return formattedDate;
    }

    //Export Functionality
    const exportToExcel = async () => {
        // console.log(transaction)

        const result = await dispatch(getAllSingleProductList()).unwrap()
        const excelData = result?.data?.map((item) => ({
            Product: item?.name || '_',
            Variations: item?.variations?.length || '_',
            Product_ID: item?.productId || '_',
            Category: item?.category?.name || '-',
            Stock: item?.stockQuantity || '-',
            Sale_Price: item?.salePrice || '-',
            Date: moment(item?.createdAt).format('MMM DD,YYYY, HH:MMA'),
            Status: item?.status || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };

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

    const categoryContent = (
        <div style={{ height: "100%" }}>
            {categoryData?.map((cat) => (
                <p
                    key={cat._id} // Use cat._id as key for better optimization
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                        display: "flex",
                        padding: "8px 2px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: selectedCategory === cat._id ? "#F7F7F7" : "#FFFFFF",
                        borderRadius: "8px",
                        cursor: "pointer",
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        overflow: 'auto',
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
                            fontFamily: 'Poppins'
                        }}>
                        {selectedCategory === cat._id && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}{cat?.name}</Typography>


                </p>
            ))}
        </div>
    );

    const statusContent = (
        <div style={{ width: '150px' }}>
            <Box
                onClick={() => handleFilterSelection("PUBLISHED")}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "8px 12px",
                    backgroundColor: selectedFilter === "PUBLISHED" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                    marginBottom: "8px",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>
                    {selectedFilter === "PUBLISHED"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Published
                </Typography>

            </Box>

            <Box
                onClick={() => handleFilterSelection("STOCKOUT")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: selectedFilter === "STOCKOUT" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>
                    {selectedFilter === "STOCKOUT"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Stockout
                </Typography>
            </Box>
            <Box
                onClick={() => handleFilterSelection("DRAFT")}
                sx={{
                    display: "flex",
                    padding: "8px 12px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: selectedFilter === "DRAFT" ? "#F7F7F7" : "#FFFFFF",
                    cursor: "pointer",
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        fontSize: '12px',
                        lineHeight: '24px',
                        fontFamily: 'Poppins'
                    }}>
                    {selectedFilter === "DRAFT" && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}  Draft</Typography>
            </Box>
        </div>
    );

    const allProductsData = [
        {
            id: 0,
            featuredImage: '/jweleryImage.png',
            name: 'Product Name',
            description: 'description',
            productId: '2223',
            category: 'jhumka',
            stockQuantity: '32',
            salePrice: '445342',
            status: 'DRAFT',
            createdAt: '23 dec 2024',
        }
    ]

    return (
        <div style={{ padding: 20, marginTop: 40 }}>
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Product</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Product" />
                </div>
                <div className={productStyle.attributeStyle}>
                    <div className={productStyle.exportStyle} onClick={exportToExcel}>
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
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Product. . ."
                    />
                </div>
                <div className={productStyle.width}>
                    <div className={productStyle.dateStlye} >
                        <PopoverComponent icon={<DatePickerIcon />} label="Select Dates" content={dateContent} />
                    </div>
                    <div className={productStyle.dateStlye} style={{ width: '25%' }}>
                        <PopoverComponent icon={<FilterIcon />} label="Category" content={categoryContent} />
                    </div>
                    <div className={productStyle.filter}>
                        <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} />
                    </div>
                </div>
            </div>
            <div className={productStyle.productStockContainer} style={{ marginTop: 10, }}>
                <div className={productStyle.header}>
                    {/* <CustomizedCheckbox /> */}
                    <div className={productStyle.productMainStyle}> Product </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={productStyle.skuStyle}>ID</div>
                    <div className={productStyle.catStyle}>Category</div>
                    <div className={productStyle.stockStyle}>Stock </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={productStyle.priceStyle}>Price</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={productStyle.status}>Status</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={productStyle.addedStyle}>Added</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={productStyle.action}>Action</div>
                </div>
                {/* {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : ( */}
                <>
                    {allProductsData?.length > 0 ? (
                        <>
                            <div>
                                {allProductsData?.map((item, index) => {
                                    return (
                                        <div className={productStyle.info} key={index}>
                                            {/* <CustomizedCheckbox /> */}
                                            <div className={productStyle.productMainStyle}>

                                                <img src={item?.featuredImage} width={40} height={40} style={{ borderRadius: 5 }} />
                                                <div>
                                                    <span style={{ marginLeft: 5 }}>{item?.name && item.name.length > 10 ? `${item.name.substring(0, 10)}...` : item?.name}</span>
                                                    <br />
                                                    <p style={{ marginLeft: 5 }} className={productStyle.description}>{item?.description} </p>
                                                </div>
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div className={productStyle.skuStyle}>
                                                {item?.productId}
                                            </div>
                                            <div className={productStyle.catStyle} style={{ color: '#667085' }}>
                                                {item?.category}
                                            </div>
                                            <div className={productStyle.stockStyle}>
                                                {item?.stockQuantity}
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div className={productStyle.priceStyle}>
                                                Rs. {item?.salePrice}
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div
                                                style={{
                                                    backgroundColor: item?.status === 'DRAFT' ? '#F0F1F3' : item?.status === 'PUBLISHED' ? "#1A98821A" : '#F439391A',
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
                                                        color: item?.status === 'DRAFT' ? "#4A4C56" : item?.status === 'PUBLISHED' ? '#4DDB4D' : '#F92929',
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    {item?.status === 'DRAFT' ? 'Draft' : item?.status === 'PUBLISHED' ? 'Published' : 'Outofstock'}
                                                </span>
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div className={productStyle.addedStyle} style={{ color: '#667085' }}>
                                                {formatDate(item?.createdAt)}
                                            </div>
                                            <div className={productStyle.dropdownStyle} />
                                            <div className={productStyle.action}>
                                                <div onClick={() => navigate(`/product/Product/ProductViewDetails`)}>
                                                    <ViewIcon />
                                                </div>
                                                <div style={{ marginLeft: 12 }} onClick={() => navigate(`/product/Product/EditProduct${item._id}`, { state: { item } })}>
                                                    <EditIcon />
                                                </div>
                                                <div style={{ marginLeft: 12 }} onClick={() => openDeleteModal(item._id)}>
                                                    <DeleteIcon />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div
                                className={productStyle.entryView}
                                style={{ padding: 20,}}
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
                        <div>
                            <ErrorPage />
                        </div>
                    )}

                </>
                {/* )} */}
            </div >
            <DeleteModal
                heading={"Delete Product"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={data}
                desc={'Do you want to delete this product? '}
                handleSubject={deletedProduct}
            // isRefresh={isRefresh}
            />
        </div>
    )
}

export default Product;