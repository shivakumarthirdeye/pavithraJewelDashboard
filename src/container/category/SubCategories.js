import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Pagination, Typography } from "@mui/material";
import {
    DeleteIcon,
    Drop,
    EditIcon,
    ExportIcon,
    FilterIcon,
    PlusIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "./category.module.css";
import { changeDateFormat } from "../../helper/dateConversions";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import CheckIcon from '@mui/icons-material/Check';
import PopoverComponent from "../../component/Popover";
import { deleteSubCategories, getSubCategories, getSubCategoriesExport, setFilterValues } from "../../redux/subCategoriesSlice";
import { formatDate } from "../../helper/FormatDate";

const Subcategories = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //state
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    //   const [isLoading, setIsLoading] = useState(false);
    const [datas, setData] = useState([]);
    const [order, setOrder] = useState('asc')


    const { subCategoriesData, filterOptions, isLoading, isRefresh } = useSelector(
        (state) => state.subCategories
    );
    console.log('filterOptions', filterOptions);


    const calculateShowingRange = () => {
        const start = (subCategoriesData?.currentPage - 1) * subCategoriesData.limit + 1;
        const end = Math.min(
            subCategoriesData?.currentPage * subCategoriesData.limit,
            subCategoriesData?.totalItems
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
        setStatus(e.target.value)
        dispatch(setFilterValues({ status: e.target.value, page: 1 }));
    };
    const handleOpenMenu = (e) => {
        setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        dispatch(setFilterValues({ sortBy: e.target.value, order, page: 1 }))
    };
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                await dispatch(getSubCategories(filterOptions));
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
        dispatch(deleteSubCategories(value));
    };


    const exportToExcel = async () => {
        const result = await dispatch(getSubCategoriesExport()).unwrap();
        console.log("result", result);
        const excelData = result?.data?.map((item) => ({
            Category: item?.category?.name || "_",
            Subcategories: item?.name || "",
            Description: item?.description || '',
            CreatedDate: changeDateFormat(item?.createdAt) || "-",
            Status: item?.status === 'ACTIVE' ? `Active` : `Inactive` || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Subcategories");
        XLSX.writeFile(workbook, "Subcategories.xlsx");
    };
    
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
                onClick={() => handleFilterSelection({ target: { value: "ACTIVE" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "ACTIVE" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "ACTIVE"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Active
                </Typography>

            </Box>

            <Box
                onClick={() => handleFilterSelection({ target: { value: "INACTIVE" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "INACTIVE" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "INACTIVE"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Inactive
                </Typography>
            </Box>

        </div>
    );
    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <div>
                        <h2 className={catStyle.categoryText}>Sub-categories</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Sub categories" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                    <div
                        className={catStyle.exportFileStyle}
                        onClick={exportToExcel}
                    >
                        <ExportIcon />
                        <span>Export</span>

                    </div>
                    <div className={catStyle.addStyle} onClick={() => navigate('/categories/Subcategories/AddSubcategory')}>
                        <PlusIcon />
                        <span>Add Subcategory</span>
                    </div>
                </div>
            </div>
            <div className={catStyle.searchStyle} style={{ marginTop: 20 }}>
                <div style={{ width: '50%' }}>
                    <div className={catStyle.search} >

                        <div style={{ cursor: "pointer", marginTop: 5 }}>
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div
                    className={catStyle.filter}
                >
                    <PopoverComponent icon={<FilterIcon />} label="Status" content={statusContent} value={status} />
                </div>
            </div>
            <div
                className={catStyle.productStockContainer}
                style={{ marginTop: 20 }}
            >
                <div className={catStyle.header} style={{ paddingLeft: 20 }}>
                    <div className={catStyle.categoryHeadStyle}> Subcategory </div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "name" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.salesStyle}> Category </div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "parentId" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>

                    <div className={catStyle.status}>Status</div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.dateStyle}>Added</div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.action}>Actions</div>
                </div>
                <div>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {subCategoriesData?.data?.length > 0 ? (
                                <div>
                                    {subCategoriesData?.data?.map((item, index) => {
                                        return (
                                            <div
                                                className={catStyle.info}
                                                key={index}
                                                style={{ paddingLeft: 20 }}
                                            >

                                                <div className={catStyle.categoryHeadStyle}>
                                                    <img src={item.thumbnailPhoto ? item?.thumbnailPhoto : '/jweleryImage.png'} style={{height:50,width:50,objectFit:'cover'}} alt="img" />
                                                    <div>
                                                        <div style={{ marginLeft: 5, color: "#1D1F2C" }}>
                                                            {item?.name && item?.name?.length > 30 ? `${item?.name?.substring(0, 30)}...` : item?.name}
                                                        </div>
                                                        <span style={{ marginLeft: 5, color: "#667085", fontSize: 12, fontWeight: 400 }}>
                                                            {item?.description && item?.description?.length > 30 ? `${item?.description?.substring(0, 30)}...` : item?.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    className={catStyle.salesStyle}
                                                    style={{ color: "#667085", }}
                                                >
                                                    {item?.category?.name}
                                                </div>
                                                <div className={catStyle.dropdownStyle} />

                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            item?.status === 'ACTIVE' ? "#4DDB4D1A" : "#F29C9C5E",
                                                        width: "10%",
                                                        borderRadius: 8,
                                                        height: 30,
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
                                                            fontSize: 14,
                                                            fontWeight: "600",
                                                            lineHeight: 18.23,
                                                            letterSpacing: 0.5,
                                                            textAlign: "center",
                                                            color:
                                                                item?.status === 'ACTIVE' ? "#4DDB4D" : "#F92929",
                                                        }}
                                                    >
                                                        {item?.status === 'ACTIVE' ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    className={catStyle.dateStyle}
                                                    style={{ color: "#667085", }}
                                                >
                                                    {formatDate(item?.createdAt)}
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div className={catStyle.action}>
                                                    <div onClick={() => navigate(`/categories/Subcategories/EditSubcategory/${item?._id}`, { state: { item } })}><EditIcon /></div>
                                                    <div style={{ marginLeft: 10 }} onClick={() => openDeleteModal(item?._id)}><DeleteIcon /></div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div
                                        className={catStyle.entryView}
                                        style={{ padding: 20 }}
                                    >
                                        <div className={catStyle.showingText}>
                                            Showing {start}-{end} from {subCategoriesData?.totalItems}{" "}
                                        </div>
                                        <Pagination
                                            count={subCategoriesData?.totalPages}
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
                            ) : (
                                <ErrorPage />
                            )}
                        </>
                    )}
                </div>

            </div>

            <DeleteModal
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                heading={"Delete Subcategory"}
                handleSubject={deletedData}
                description={'Are you sure you want to delete this subcategory?'}
            />
        </div>
    );
};
export default Subcategories;
