import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DeleteIcon,
    Drop,
    EditIcon,
    ExportIcon,
    SearchIcon,
} from "../../svg";
import catStyle from "../category/category.module.css";
import { changeDateFormat } from "../../helper/dateConversions";
// import * as XLSX from "xlsx";
import ErrorPage from "../../component/ErrorPage";
import DeleteModal from "../../component/DeleteModal";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { Button, MenuItem, Pagination, Select } from "@mui/material";
import productStyle from '../product/product.module.css'
import countryStyle from './country.module.css'
import { cancle, formselect, saveData } from "../../MaterialsUI";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from 'formik';
import * as yup from "yup";
import EditCategory from "../category/EditCategory";
import EditCountry from "./EditCountry";

const Country = () => {
    const navigate = useNavigate();
    //state
    const [search, setSearch] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [datas, setData] = useState([]);

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        img: yup.array().min(1, "Image is required"),
    })

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        resetForm
    } = useFormik({
        initialValues: {
            name: "",
            description: "",
            status: "",
            img: [],

        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    const handleSubject = async (values) => {
        // dispatch(addCategories(values));
        navigate('/categories/Category')
    };
    //Delete User
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    //Edit Modal
    const openEditModal = (data) => {
        setData(data);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
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
            date: '27 Jan 2025',
            code: 'Gold',
            usageCount: '6',
            status: 'Active',
        },
        {
            id: 1,
            name: 'Supriya Raj',
            desc: 'Description in a line',
            date: '29 Feb 2025',
            code: 'Gold',
            usageCount: '2',
            status: 'Expired',
        },
    ]
    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <h2 className={catStyle.categoryText}>Country</h2>
                    <CustomSeparator dashboard="Dashboard" type="Country" />
                </div>
                <div
                    className={catStyle.exportFileStyle}
                //   onClick={exportToExcel}
                >
                    <ExportIcon />
                    <span>Export</span>

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
            </div>
            <div className={countryStyle.viewStyle} style={{ marginTop: 20 }}>
                <div
                    className={countryStyle.countryContainer}

                >
                    <div className={catStyle.header} style={{ paddingLeft: 20 }}>
                        <div className={countryStyle.slNoStyle}> Sl No</div>
                        <div className={catStyle.dropdownStyle}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.countryStyle}> Country </div>
                        <div className={catStyle.dropdownStyle}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.statusStyle}>Status</div>
                        <div className={catStyle.dropdownStyle}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.dateStyle}>Date</div>
                        <div className={catStyle.dropdownStyle}>
                            {" "}
                            <Drop color="#858D9D" />{" "}
                        </div>
                        <div className={countryStyle.action}>Actions</div>
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
                                            <div className={countryStyle.slNoStyle}> {index + 1}</div>
                                            <div className={catStyle.dropdownStyle} />
                                            <div className={countryStyle.countryStyle} style={{ color: "#1D1F2C" }}>
                                                {item?.name && item?.name?.length > 30 ? `${item?.name?.substring(0, 30)}...` : item?.name}
                                            </div>
                                            <div className={catStyle.dropdownStyle} />
                                            <div
                                                style={{
                                                    backgroundColor:
                                                        item?.status === 'Active' ? "#4DDB4D1A" : "#F29C9C5E",
                                                    width: "13%",
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
                                                className={countryStyle.dateStyle}
                                                style={{ color: "#667085", }}
                                            >
                                                {item?.date}
                                            </div>
                                            <div className={catStyle.dropdownStyle} />
                                            <div className={countryStyle.action}>
                                                <div onClick={() => openEditModal()}><EditIcon /></div>
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
                <div className={countryStyle.addCountryBox}>
                    <h3 className={countryStyle.h3Style}>Add Country</h3>
                    <div style={{ marginTop: 10 }}>
                        <label className={catStyle.label}>Country Name</label>
                        <br />
                        <Select
                            // className={categoryStyle.formselect}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={formselect}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='status'
                        // value={values.status}
                        // onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label className={catStyle.label}>Status</label>
                        <br />
                        <Select
                            // className={categoryStyle.formselect}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={formselect}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='status'
                        // value={values.status}
                        // onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </div>
                    <div className={catStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={handleSubmit} variant="contained" disableElevation={true}>Cancel</Button>

                        <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save</Button>

                    </div>
                </div>
            </div>
            <DeleteModal
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={datas}
                heading={"Delete Country"}
                // handleSubject={deletedData}
                description={'Are you sure you want to delete this country?'}
            />
            <EditCountry
                onClose={closeEditModal}
                open={isEditModalOpen}
                data={datas}
            />
        </div>
    );
};
export default Country;
