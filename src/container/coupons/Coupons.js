import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DeleteIcon,
    Drop,
    EditIcon,
    ExportIcon,
    FilterIcon,
    PlusIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "../category/category.module.css";
import { changeDateFormat } from "../../helper/dateConversions";
// import * as XLSX from "xlsx";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import couponStyle from './coupon.module.css'
import { Pagination } from "@mui/material";
import productStyle from '../product/product.module.css'

const Coupons = () => {
    const navigate = useNavigate();
    //state
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    //   const [isLoading, setIsLoading] = useState(false);
    const [datas, setData] = useState([]);
    //   const [itemsPerPage, setItemsPerPage] = useState(10);




    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };


    //   const calculateShowingRange = () => {
    //     const start = (categoriesData?.currentPage - 1) * itemsPerPage + 1;
    //     const end = Math.min(
    //       categoriesData?.currentPage * itemsPerPage,
    //       categoriesData?.totalCategories
    //     );
    //     return { start, end };
    //   };

    //   const { start, end } = calculateShowingRange();



    //   const handlePageChange = (event, page) => {
    //     console.log("page", page);
    //     dispatch(setFilterValues({ page }));
    //   };

    //   const handleSearch = (e) => {
    //     setSearch(e.target.value);
    //     dispatch(setFilterValues({ name: e.target.value, page: 1 }));
    //   };

    //   useEffect(() => {
    //     const getAllCategories = async () => {
    //       try {
    //         await dispatch(getCategories(filterOptions));
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    //     getAllCategories();
    //   }, [dispatch,filterOptions,isRefresh]);

    //   const deletedData = (value) => {
    //     dispatch(deleteCategories(value));
    //   };

    //   const exportToExcel = async () => {
    //     const result = await dispatch(getCategoryCSV()).unwrap();
    //     console.log("result", result);
    //     const excelData = result?.data?.data?.map((item) => ({
    //       Category: item?.name || "_",
    //       SubCategory: item?.subcategoryCount || 0,
    //       CreatedDate: changeDateFormat(item?.createdAt) || "-",
    //       Status: item?.status === true ? `Active` : `Inactive` || "-",
    //     }));
    //     const worksheet = XLSX.utils.json_to_sheet(excelData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Category");
    //     XLSX.writeFile(workbook, "Category.xlsx");
    //   };

    const data = [
        {
            id: 0,
            name: 'Supriya',
            desc: 'Description in a line',
            date: '27 Jan 2025-26 March 2025',
            code: 'Gold',
            usageCount: '6',
            status: 'Active',
        },
        {
            id: 1,
            name: 'Supriya Raj',
            desc: 'Description in a line',
            date: '29 Feb 2025-26 March 2025',
            code: 'Gold',
            usageCount: '2',
            status: 'Expired',
        },
    ]
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
                            onChange={(e) => setSearch(e)}
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <div>
                    <div
                        className={catStyle.filter}
                    //   onClick={exportToExcel}
                    >
                        <FilterIcon />
                        <span>Status</span>
                    </div>
                </div>
            </div>
            <div
                className={catStyle.productStockContainer}
                style={{ marginTop: 20 }}
            >
                <div className={catStyle.header} style={{ paddingLeft: 20 }}>
                    <div className={couponStyle.couponNameStyle}> Coupons name </div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.couponCodeStyle}> Coupons code </div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>

                    <div className={couponStyle.usageCount}>Usage count</div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.dateStyle}>Date</div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.statusStyle}>Status</div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={couponStyle.action}>Actions</div>
                </div>
                <div>
                    {data?.length > 0 ? (
                        <div>
                            {data?.map((item, index) => {
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
                                                <span style={{ color: "#667085", fontSize: 12, fontWeight: 400 }}>{item.desc}</span>
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
                                            {item?.usageCount}
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div
                                            className={couponStyle.dateStyle}
                                            style={{ color: "#667085", }}
                                        >
                                            {item?.date}
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div
                                            style={{
                                                backgroundColor:
                                                    item?.status === 'Active' ? "#4DDB4D1A" : "#5A607F26",
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
                                                        item?.status === 'Active' ? "#4DDB4D" : "#5A607F",
                                                }}
                                            >
                                                {item?.status === 'Active' ? "Active" : "Expired"}
                                            </span>
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div className={couponStyle.action}>
                                            <div onClick={() => navigate('/coupons/Coupons/EditCoupon')}><EditIcon /></div>
                                            <div style={{ marginLeft: 10 }} onClick={() => openDeleteModal()}><DeleteIcon /></div>
                                        </div>
                                    </div>
                                );
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
                    ) : (
                        <ErrorPage />
                    )}
                </div>

            </div>

            <DeleteModal
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                heading={"Delete Coupon"}
                // handleSubject={deletedData}
                description={'Are you sure you want to delete this coupon?'}
            />
        </div>
    );
};
export default Coupons;
