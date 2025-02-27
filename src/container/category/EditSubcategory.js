import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import categoryStyle from './category.module.css';
import { ImageIcon } from '../../svg';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { cancle, fieldText, formselect, saveData, TextArea } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesExport } from '../../redux/categoriesSlice';
import { addSubCategories, editSubCategories } from '../../redux/subCategoriesSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import api from '../../helper/Api';
import axios from 'axios';
import Toastify from '../../helper/Toastify';

const EditSubcategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { id } = useParams();
    const location = useLocation();
    const item = location.state;
    const data = item?.item;
    const { categoriesExportData } = useSelector(
        (state) => state.categories
    );
    console.log('categoriesExportData', categoriesExportData);

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        thumbnailPhoto: yup.string().required("Image is required"),
        parentId: yup.string().required("Category is required"),
    })

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        resetForm,
        setValues
    } = useFormik({
        initialValues: {
            name: "",
            description: "",
            status: "",
            thumbnailPhoto: "",
            parentId: ""
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    useEffect(() => {
        if (data) {
            setValues({
                name: data?.name || "",
                description: data?.description || '',
                thumbnailPhoto: data?.thumbnailPhoto || '',
                status: data?.status || '',
                parentId: data?.parentId || "",
                _id: id

            });
        }
    }, [data, setValues, id]);

    const handleSubject = async (values) => {
        const result = await dispatch(editSubCategories(values));
        unwrapResult(result)
        navigate('/categories/Subcategories')
    };

    const handleImageChange = async (e, attribute, repo) => {

        const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
        try {
            if (file) {

                const body = {
                    key: `${Date.now()}_${file.name}`,
                    fileName: file.name,
                }

                const { data, status } = await api.getPutSignedUrl(body);
                console.log(data);

                if (status === 200) {
                    await axios.put(data.data?.preSigned, file, {
                        headers: {
                            "Content-Type": file.type
                        }
                    })

                    setFieldValue('thumbnailPhoto', data?.data?.url)
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };

    useEffect(() => {
        dispatch(getCategoriesExport())
    }, [dispatch])


    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Edit Subcategory</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Categories" subType="Edit Subcategory" />
                </div>
                <div className={categoryStyle.backToListStyle} onClick={() => navigate('/categories/Subcategories')}>
                    <span>Back to list</span>
                </div>
            </div>
            <div className={categoryStyle.entryView} style={{ marginTop: 30 }}>
                <div className={categoryStyle.variationStyle}>
                    <h6 className={categoryStyle.variationText}>
                        General Information
                    </h6>
                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Category Name</label>
                        <Select
                            // className={categoryStyle.formselect}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={{
                                ...formselect,
                                "& .MuiSelect-select": {
                                    fontWeight: values.parentId ? "500" : "400",
                                    color: values.parentId ? "#081735" : "#858D9D",
                                },
                            }}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='parentId'
                            value={values.parentId}
                            onChange={handleChange}
                        >
                            <MenuItem value="" sx={{ color: "#858D9D" }}>Select</MenuItem>
                            {categoriesExportData?.data?.length > 0 && categoriesExportData?.data?.map((category) => (
                                <MenuItem
                                    key={category._id}
                                    value={category._id}
                                    sx={{
                                        color: values.parentId === category._id ? "#081735" : "inherit",
                                        fontWeight: values.parentId === category._id ? "600" : "normal",
                                    }}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    {
                        errors.parentId && touched.parentId && <p style={{ color: "red", fontSize: "12px" }}>{errors.parentId}</p>
                    }
                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Subcategory Name</label>
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder='Type subcategory name here. . .'
                            name="name"
                            onChange={handleChange}
                            sx={fieldText}
                        />
                    </div>
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Description</label>
                        <br />
                        {/* <div className={categoryStyle.descriptionBox}> */}
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.description}
                            placeholder='Type category description here. . .'
                            name="description"
                            onChange={handleChange}
                            multiline={true}
                            rows={4}
                            sx={TextArea}
                        />
                        {/* </div> */}
                        {
                            errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                        }
                    </div>

                    <div className={categoryStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={resetForm} variant="contained" disableElevation={true}>Cancel</Button>
                        <div>
                            <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save</Button>
                        </div>
                    </div>
                </div>
                <div className={categoryStyle.thumbanilStyle}>
                    <h6 className={categoryStyle.variationText}>Thumbnail</h6>
                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Photo</label>
                        <br />
                        <div className={categoryStyle.imageUpload1}>
                            <div className={categoryStyle.imageView}>
                                {values?.thumbnailPhoto?.length > 0 ? (
                                    <div>
                                        <img
                                            src={values.thumbnailPhoto}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', marginTop: '0px' }}
                                        />
                                        {/* <button onClick={handleUpload}>Upload</button> */}
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon />
                                        
                                    </>
                                )
                                }
                                <div>
                                    <label htmlFor='catFile' className={categoryStyle.uploadBox}>
                                        <p className={categoryStyle.uploadText} style={{ marginTop: 10 }}>
                                            Drag and drop image here, or click add image
                                        </p>
                                    </label>
                                    <input
                                        type='file'
                                        accept="image/*"
                                        id='catFile'
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                        value={values.catFile}
                                    />
                                </div>
                                <div className={categoryStyle.pixel} style={{ marginTop: 10 }}>
                                    <label htmlFor='catFile'>
                                        Update Image
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            errors.img && touched.img && <p style={{ color: "red", fontSize: "12px" }}>{errors.img}</p>
                        }
                    </div>
                    <div className={categoryStyle.catStatusStyle}>
                        <h6 className={categoryStyle.variationText}>Status</h6>
                        <div style={{ marginTop: 15 }}>
                            <label className={categoryStyle.label}>Category Status</label>
                            <br />
                            <Select
                                // className={categoryStyle.formselect}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.status ? "500" : "400",
                                        color: values.status ? "#081735" : "#858D9D",
                                    },
                                }}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                defaultValue=''
                                name='status'
                                value={values.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="INACTIVE">Inactive</MenuItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditSubcategory;