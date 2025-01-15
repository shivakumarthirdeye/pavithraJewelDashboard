import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Pagination } from "@mui/material";
import {
    DeleteIcon,
    Drop,
    Dropdown,
    EditIcon,
    ExportIcon,
    FilterIcon,
    ForwardIcon,
    PlusIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "./category.module.css";
import { changeDateFormat } from "../../helper/dateConversions";
// import * as XLSX from "xlsx";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";

const Categories = () => {
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
            desc: 'Subtitle of the category or description',
            date: '29 Dec 2022',
            sales: '2,300',
            status: 'Active',
            img: ['/jweleryImage.png']
        },
        {
            id: 1,
            name: 'Supriya Raj',
            desc: 'Subtitle of the category or description',
            date: '29 Dec 2022',
            sales: '2,300',
            status: 'Inactive',
            img: ['/jweleryImage.png']
        },
    ]
    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <div>
                        <h2 className={catStyle.categoryText}>Category</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Category" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                    <div
                        className={catStyle.exportFileStyle}
                    //   onClick={exportToExcel}
                    >
                        <ExportIcon />
                        <span>Export CSV</span>

                    </div>
                    <div className={catStyle.addStyle} onClick={() => navigate('/categories/Categories/AddCategory')}>
                        <PlusIcon />
                        <span>Add New Category</span>
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
                    <div className={catStyle.categoryHeadStyle}> Categories </div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.salesStyle}> Sales </div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>

                    <div className={catStyle.status}>Status</div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.dateStyle}>Added</div>
                    <div className={catStyle.dropdownStyle}>
                        {" "}
                        <Drop color="#858D9D" />{" "}
                    </div>
                    <div className={catStyle.action}>Actions</div>
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

                                        <div className={catStyle.categoryHeadStyle}>
                                            <img src={item.img[0]} height={50} width={50} />
                                            <div>
                                                <div style={{ marginLeft: 5, color: "#1D1F2C" }}>
                                                    {item?.name && item?.name?.length > 30 ? `${item?.name?.substring(0, 30)}...` : item?.name}
                                                </div>
                                                <span style={{ marginLeft: 5, color: "#667085", fontSize: 12, fontWeight: 400 }}>{item.desc}</span>
                                            </div>
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div
                                            className={catStyle.salesStyle}
                                            style={{ color: "#667085", }}
                                        >
                                            {item?.sales}
                                        </div>
                                        <div className={catStyle.dropdownStyle} />

                                        <div
                                            style={{
                                                backgroundColor:
                                                    item?.status === 'Active' ? "#4DDB4D1A" : "#F29C9C5E",
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
                                                        item?.status === 'Active' ? "#4DDB4D" : "#F92929",
                                                }}
                                            >
                                                {item?.status === 'Active' ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div
                                            className={catStyle.dateStyle}
                                            style={{ color: "#667085", }}
                                        >
                                            {/* {changeDateFormat(item?.date)} */}
                                            {item?.date}
                                        </div>
                                        <div className={catStyle.dropdownStyle} />
                                        <div className={catStyle.action}>
                                            <div onClick={() => navigate('/categories/Categories/EditCategory')}><EditIcon /></div>
                                            <div style={{ marginLeft: 10 }} onClick={() => openDeleteModal()}><DeleteIcon /></div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* <div
                  className={catStyle.entryView}
                  style={{ margin: 20, marginBottom: 20 }}
                >
                  <div className={catStyle.showingText}>
                    Showing {start}-{end} from {categoriesData?.totalCategories}{" "} 
                  </div>
                  <Pagination
                    count={categoriesData?.totalPages}
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
                        backgroundColor: "#1D83F8  !important", // custom color for selected page
                      },
                      "& .MuiPaginationItem-root:hover": {
                        color: "#fff",
                        backgroundColor: "#1D83F8", // custom hover color
                      },
                    }}
                  />
                </div> */}
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
                heading={"Delete Category"}
                // handleSubject={deletedData}
                description={'Are you sure you want to delete this category?'}
            />
        </div>
    );
};
export default Categories;
