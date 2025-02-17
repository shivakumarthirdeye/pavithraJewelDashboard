import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DeleteIcon,
    Drop,
    EditIcon,
    FilterIcon,
    PlusIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "../category/category.module.css";
// import * as XLSX from "xlsx";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import couponStyle from './coupon.module.css'
import { Box, CircularProgress, Pagination, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteCoupon, getAllCoupons, setFilterValues } from "../../redux/couponSlice";
import CheckIcon from '@mui/icons-material/Check';
import PopoverComponent from "../../component/Popover";
import { formatDate } from "../../helper/FormatDate";



const Coupons = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    //state
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    //   const [isLoading, setIsLoading] = useState(false);
    const [datas, setData] = useState([]);
    const [order, setOrder] = useState('asc')


    const { couponsData, filterOptions, isLoading, isRefresh } = useSelector(
        (state) => state.coupons);
    console.log('couponsData', couponsData);


    const calculateShowingRange = () => {
        const start = (couponsData?.currentPage - 1) * couponsData.limit + 1;
        const end = Math.min(
            couponsData?.currentPage * couponsData.limit,
            couponsData?.totalItems
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
                await dispatch(getAllCoupons(filterOptions));
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
        dispatch(deleteCoupon(value));
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
                onClick={() => handleFilterSelection({ target: { value: "active" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "active" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "active"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Active
                </Typography>

            </Box>

            <Box
                onClick={() => handleFilterSelection({ target: { value: "expired" } })}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: status === "expired" ? "#F7F7F7" : "#FFFFFF",
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
                    {status === "expired"
                        && <CheckIcon fontSize="small" sx={{ marginLeft: "4px" }} />}
                    Expired
                </Typography>
            </Box>

        </div>
    );
    // const exportToExcel = async () => {
    //     const result = await dispatch(getExportCountry()).unwrap();
    //     console.log("result", result);
    //     const excelData = result?.data?.data?.map((item) => ({
    //         Category: item?.name || "_",
    //         SubCategory: item?.subcategoryCount || 0,
    //         CreatedDate: changeDateFormat(item?.createdAt) || "-",
    //         Status: item?.status === true ? `Active` : `Inactive` || "-",
    //     }));
    //     const worksheet = XLSX.utils.json_to_sheet(excelData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Category");
    //     XLSX.writeFile(workbook, "Category.xlsx");
    // };


    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <div>
                        <h2 className={catStyle.categoryText}>Coupons</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Coupons" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>

                    <div className={catStyle.addStyle} onClick={() => navigate('/coupons/Coupons/AddCoupons')}>
                        <PlusIcon />
                        <span>Add Coupon</span>
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
                    <div className={couponStyle.couponNameStyle}> Coupons name </div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "name" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.couponCodeStyle}> Coupons code </div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "code" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>

                    <div className={couponStyle.usageCount}>Usage count</div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "usageCount" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.dateStyle}>Date</div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "createdAt" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.statusStyle}>Status</div>
                    <div className={catStyle.dropdownStyle} onClick={(e) => handleOpenMenu({ target: { value: "status" } })}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.action}>Actions</div>
                </div>
                <div>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {couponsData?.data?.length > 0 ? (
                                <div>
                                    {couponsData?.data?.map((item, index) => {
                                        return (
                                            <div
                                                className={catStyle.info}
                                                key={index}
                                                style={{ paddingLeft: 20 }}
                                            >

                                                <div className={couponStyle.couponNameStyle}>
                                                    <div>
                                                        <div style={{ color: "#1D1F2C" }}>
                                                            {item?.name && item?.name?.length > 30 ? `${item?.name?.substring(0, 30)}...` : item?.name}
                                                        </div>
                                                        <span style={{ color: "#667085", fontSize: 12, fontWeight: 400 }}>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    className={couponStyle.couponCodeStyle}
                                                    style={{ color: "#667085", }}
                                                >
                                                    {item?.code}
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    className={couponStyle.usageCount}
                                                    style={{ color: "#667085", }}
                                                >
                                                    {item?.usageLimit}
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    className={couponStyle.dateStyle}
                                                    style={{ color: "#667085", }}
                                                >
                                                    {formatDate(item?.startDate)}-{(formatDate(item?.endDate))}
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            item?.status === 'active' ? "#4DDB4D1A" : "#5A607F26",
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
                                                                item?.status === 'active' ? "#4DDB4D" : "#5A607F",
                                                        }}
                                                    >
                                                        {item?.status === 'active' ? "Active" : "Expired"}
                                                    </span>
                                                </div>
                                                <div className={catStyle.dropdownStyle} />
                                                <div className={couponStyle.action}>
                                                    <div onClick={() => navigate(`/coupons/Coupons/EditCoupon/${item?._id}`, { state: { item } })}><EditIcon /></div>
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
                                            Showing {start}-{end} from {couponsData?.totalItems}{" "}
                                        </div>
                                        <Pagination
                                            count={couponsData?.totalPages}
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
                heading={"Delete Coupon"}
                handleSubject={deletedData}
                description={'Are you sure you want to delete this coupon?'}
            />
        </div>
    );
};
export default Coupons;
