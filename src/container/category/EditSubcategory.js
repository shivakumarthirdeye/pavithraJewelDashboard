import React from 'react'
import { useNavigate } from 'react-router-dom';
import categoryStyle from './category.module.css';
import { ImageIcon } from '../../svg';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { cancle, formselect, saveData } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import CustomSeparator from '../../component/CustomizedBreadcrumb';

const EditSubcategory = () => {
    const navigate = useNavigate();
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
    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {

    //         const body = new FormData()
    //         body.set('image', file)
    //         const { data, status } = await api.fileUpload(body)
    //         if (status === 200) {
    //             setFieldValue("img", data.data)
    //         }
    //     }
    // };
    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Edit Subcategory</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Categories" subType="Edit Subcategory" />
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
                            value={values.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </div>
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
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
                        {/* <div className={categoryStyle.descriptionBox}> */}
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder='Type category description here. . .'
                            name="name"
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
                            style={{
                                fontSize: 12
                            }}
                        />
                        {/* </div> */}
                        {
                            errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                        }
                    </div>

                    <div className={categoryStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={handleSubmit} variant="contained" disableElevation={true}>Cancel</Button>
                        <div>
                            <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save Changes</Button>
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
                                {values?.img?.length > 0 ? (
                                    <div>
                                        <img
                                            src={values.img[0]}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', marginTop: '0px' }}
                                        />
                                        {/* <button onClick={handleUpload}>Upload</button> */}
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon />
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
                                                // onChange={handleImageChange}
                                                value={values.catFile}
                                            />
                                        </div>
                                        <div className={categoryStyle.pixel} style={{ marginTop: 10 }}>
                                            <label htmlFor='catFile'>
                                                Add Image
                                            </label>
                                        </div>
                                    </>
                                )
                                }

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
                                sx={formselect}
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
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditSubcategory;