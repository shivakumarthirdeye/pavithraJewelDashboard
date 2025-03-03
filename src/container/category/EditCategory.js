import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import categoryStyle from './category.module.css';
import { ImageIcon } from '../../svg';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { cancle, formselect, saveData } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import api from '../../helper/Api';
import { addCategories, editCategories, getCategoryById } from '../../redux/categoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Toastify from '../../helper/Toastify';
import { unwrapResult } from '@reduxjs/toolkit';

const EditCategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { id } = useParams();
    const {categoryByIdData} = useSelector(
        (state) => state.categories
    );
    console.log('categoryByIdData',categoryByIdData);


    useEffect(() => {
        dispatch(getCategoryById(id))
    },[dispatch,id])

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        status: yup.string().required("Status is required"),
        // description: yup.string().required("Description is required"),
        // thumbnailPhoto: yup.string().required("Image is required"),
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

        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    useEffect(() => {
        if (categoryByIdData) {
            setValues({
                name: categoryByIdData?.name || "",
                description: categoryByIdData?.description || '',
                thumbnailPhoto: categoryByIdData?.thumbnailPhoto || '',
                status: categoryByIdData?.status || '',
                _id: id

            });
        }
    }, [categoryByIdData, setValues, id]);

    const handleCancel = () => {
        if (categoryByIdData) {
            setValues({
                name: categoryByIdData?.name || "",
                description: categoryByIdData?.description || '',
                thumbnailPhoto: categoryByIdData?.thumbnailPhoto || '',
                status: categoryByIdData?.status || false,
                _id: categoryByIdData?._id,
            });
        }
    };

    const handleSubject = async (values) => {
        const result = await dispatch(editCategories(values));
        unwrapResult(result)
        navigate('/categories/Categories')
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

    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Edit Category</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Category" subType="Edit Category" />
                </div>
                <div className={categoryStyle.backToListStyle} onClick={() => navigate('/categories/Categories')}>
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
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder='Type category name here. . .'
                            name="name"
                            onChange={handleChange}
                            sx={{
                                width: '100%',
                                height: '40px',
                                // borderRadius: 8,
                                "& .MuiOutlinedInput-root": {
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: '400',
                                    fontFamily: 'Public Sans',
                                    borderRadius: 2.5,
                                    height: '40px',
                                    padding: '0 14px',
                                    "& fieldset": {
                                        borderColor: "#E0E2E7", // Default border color
                                        borderWidth: '1px'
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#E0E2E7", // Border color on hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#E0E2E7", // Border color when focused
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "1px 0px", // adjust padding inside the input
                                },
                            }}
                            style={{
                                fontSize: 12
                            }}
                        />
                    </div>
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Description</label>
                        <br />
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.description}
                            placeholder='Type category description here. . .'
                            name="description"
                            onChange={handleChange}
                            multiline={true}
                            rows={4}
                            sx={{
                                width: '100%',
                                // borderRadius: 8,
                                "& .MuiOutlinedInput-root": {
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: '400',
                                    fontFamily: 'Public Sans',
                                    borderRadius: 2.5,
                                    "& fieldset": {
                                        borderColor: "#E0E2E7", // Default border color
                                        borderWidth: '1px'
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#E0E2E7", // Border color on hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#E0E2E7", // Border color when focused
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "1px 0px", // adjust padding inside the input
                                },
                            }}
                        />
                        {/* {
                            errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                        } */}
                    </div>

                    <div className={categoryStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={handleCancel} variant="contained" disableElevation={true}>Cancel</Button>

                        <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save Changes</Button>

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
                        
                    </div>
                    <div className={categoryStyle.catStatusStyle}>
                        <h6 className={categoryStyle.variationText}>Status</h6>
                        <div style={{ marginTop: 15 }}>
                            <label className={categoryStyle.label}>Category Status</label>
                            <br />
                            <Select
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
                            {
                                errors.status && touched.status && <p style={{ color: "red", fontSize: "12px" }}>{errors.status}</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;