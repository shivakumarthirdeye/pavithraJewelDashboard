import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, TextField } from '@mui/material';
import { custom, saveChanges, TextArea, TextInput } from '../../MaterialsUI';
import appearancStyle from './appearance.module.css';
import productStyle from '../product/product.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import { ImageIcon } from '../../svg';
import api from '../../helper/Api';
import { addAboutus, getAboutus } from '../../redux/appearanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Toastify from '../../helper/Toastify';
import axios from 'axios';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function AboutUs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { aboutUsData } = useSelector((state) => state.appearance)
    // console.log('aboutUsData',aboutUsData);

    const viewAboutus = aboutUsData?.data;

    React.useEffect(() => {
        dispatch(getAboutus())
    }, [dispatch])

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        image: yup.array().min(1, "At least one image is required"),

    });


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
            title: "",
            description: "",
            image1: '',
            image2: ''
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    // console.log('valuessssssssssssssssssssss'.values);
    React.useEffect(() => {
        if (viewAboutus) {
            setValues({
                title: viewAboutus?.title,
                description: viewAboutus?.description,
                image1: viewAboutus?.image1,
                image2: viewAboutus?.image2
            })
        }
    }, [viewAboutus, setValues])

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addAboutus(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
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

                    setFieldValue('image1', data?.data?.url)
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };
    const handleImage2Change = async (e, attribute, repo) => {

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

                    setFieldValue('image2', data?.data?.url)
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };
    return (
        <div style={{ marginTop: 20 }}>
            <CustomAccordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        '& .MuiSvgIcon-root': { color: '#000000' }, // Custom color for the icon
                    }}
                >
                    <Typography component="span" sx={{
                        fontWeight: '500',
                        fontFamily: 'Public Sans',
                        fontSize: '16px',
                        lineHeight: '28px',
                        letterSpacing: '0.005em',
                        textAlign: 'left'

                    }}>About Us</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: '#F8F9FF',
                        // width:'100%',
                        height: 'fit-content',
                        padding: '18px 29px',
                        margin: "0px 20px 20px 19px"
                    }}
                >
                    <Box sx={{ marginBottom: '10px' }}>
                        <Typography
                            sx={{
                                fontWeight: '500',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                                lineHeight: '28px',
                                letterSpacing: '0.005em',
                                textAlign: 'left',
                                color: '#777980'
                            }}>
                            Title
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            name="title"
                            value={values.title || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={TextInput}
                        />
                        {
                            errors.title && touched.title && <p style={{ color: "red", fontSize: "12px" }}>{errors.title}</p>
                        }
                    </Box>
                    <Box sx={{ marginBottom: '10px' }}>
                        <Typography
                            sx={{
                                fontWeight: '500',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                                lineHeight: '28px',
                                letterSpacing: '0.005em',
                                textAlign: 'left',
                                color: '#777980'
                            }}>
                            Description
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            name="description"
                            value={values.description || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={TextArea}
                            multiline
                            rows={4}
                        />
                        {
                            errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                        }
                    </Box>
                    <Box sx={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: '500',
                                    fontFamily: 'Public Sans',
                                    fontSize: '14px',
                                    lineHeight: '28px',
                                    letterSpacing: '0.005em',
                                    textAlign: 'left',
                                    color: '#777980'
                                }}>
                                Image 1
                            </Typography>
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.image1?.length > 0 ? (
                                        <div>
                                            <img
                                                src={values.image1}
                                                alt="Selected"
                                                style={{ maxWidth: '100%', marginTop: '0px', width: 200, height: 100, objectFit: 'cover' }}
                                            />
                                            {/* <button onClick={handleUpload}>Upload</button> */}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon />
                                            <div>
                                                <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                    Drag and drop image here, or click add image
                                                </p>
                                            </div>

                                        </>
                                    )
                                    }
                                    <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="imageFile"
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="imageFile" className={productStyle.uploadBox}>
                                            Add Image
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {/* {
                                errors.featuredImage && touched.featuredImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featuredImage}</p>
                            } */}
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: '500',
                                    fontFamily: 'Public Sans',
                                    fontSize: '14px',
                                    lineHeight: '28px',
                                    letterSpacing: '0.005em',
                                    textAlign: 'left',
                                    color: '#777980'
                                }}>
                                Image 2
                            </Typography>
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.image2?.length > 0 ? (
                                        <div>
                                            <img
                                                src={values.image2}
                                                alt="Selected"
                                                style={{ maxWidth: '100%', marginTop: '0px', width: 200, height: 100, objectFit: 'cover' }}
                                            />
                                            {/* <button onClick={handleUpload}>Upload</button> */}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon />
                                            <div>
                                                <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                    Drag and drop image here, or click add image
                                                </p>
                                            </div>

                                        </>
                                    )
                                    }
                                    <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="imageTwoFile"
                                            style={{ display: 'none' }}
                                            onChange={handleImage2Change}
                                        />
                                        <label htmlFor="imageTwoFile" className={productStyle.uploadBox}>
                                            Add Image
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {
                                errors.image && touched.image && <p style={{ color: "red", fontSize: "12px" }}>{errors.image}</p>
                            }
                        </Box>
                    </Box>
                </AccordionDetails>
                <Box sx={{
                    marginBottom: '20px',
                    marginRight: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Button sx={custom} onClick={resetForm}>Cancel</Button>
                    <Button sx={saveChanges} onClick={handleSubmit}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
