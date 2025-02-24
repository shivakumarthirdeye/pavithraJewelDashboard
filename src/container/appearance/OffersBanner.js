import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { cancle, custom, fieldText, InputURL, saveChanges, saveData, TextArea, TextInput } from '../../MaterialsUI';
import { AddIcon, DeletIcon, ImageIcon } from '../../svg';
import productStyle from '../product/product.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import api from '../../helper/Api';
import appearancStyle from './appearance.module.css'
import Toastify from '../../helper/Toastify';
import axios from 'axios';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import { addOfferbanner, getOfferbanner } from '../../redux/appearanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));


export default function OffersBanner() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { offerBannerData } = useSelector((state) => state.appearance);
    const viewOfferBanner = offerBannerData?.data;

    React.useEffect(() => {
        dispatch(getOfferbanner())
    }, [dispatch])

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        image: yup.string().required("At least one image is required"),
        subtitle: yup.string().required("Sub title is required"),
        buttonText: yup.string().required("Button text is required"),
        buttonLink: yup.string().url("Invalid URL").required("Button link is required"),
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
            title: '',
            subtitle: '',
            image: '',
            buttonText: '',
            buttonLink: ''
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewOfferBanner) {
            setValues({
                title: viewOfferBanner?.title,
                subtitle: viewOfferBanner?.subtitle,
                image: viewOfferBanner?.image,
                buttonText: viewOfferBanner?.buttonText,
                buttonLink: viewOfferBanner?.buttonLink,
            })
        }
    }, [viewOfferBanner, setValues])

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addOfferbanner(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
    //Media Image

    const handleImageChange = async (e, index) => {
        const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
        try {
            if (file) {
                const body = {
                    key: `${Date.now()}_${file.name}`,
                    fileName: file.name,
                };

                const { data, status } = await api.getPutSignedUrl(body);
                if (status === 200) {
                    await axios.put(data.data?.preSigned, file, {
                        headers: { "Content-Type": file.type }
                    });

                    setFieldValue('image', data?.data?.url);
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file");
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
                        // padding:'20px'
                    }}
                >
                    <Typography component="span" sx={{
                        fontWeight: '500',
                        fontFamily: 'Public Sans',
                        fontSize: '16px',
                        lineHeight: '28px',
                        letterSpacing: '0.005em',
                        textAlign: 'left'

                    }}>Offers Banner</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: '#F8F9FF',
                        // width:'100%',
                        height: 'fit-content',
                        padding: '18px 29px',
                        margin: "0px 20px 20px 19px"
                    }}>
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
                            Banner Title
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
                            Banner Subtitle
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            name="subtitle"
                            value={values.subtitle || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={TextInput}
                        />
                        {
                            errors.subtitle && touched.subtitle && <p style={{ color: "red", fontSize: "12px" }}>{errors.subtitle}</p>
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
                            Banner Image
                        </Typography>
                        <div className={productStyle.imageUpload1}>
                            <div className={productStyle.imageView}>
                                {values?.image?.length > 0 ? (
                                    <div>
                                        <img
                                            src={values.image}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', marginTop: '0px' }}
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
                                        id="bannerImageFile"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="bannerImageFile" className={productStyle.uploadBox}>
                                        Add Image
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            errors.image && touched.image && <p style={{ color: "red", fontSize: "12px" }}>{errors.image}</p>
                        }
                    </Box>
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
                        Button Link
                    </Typography>
                    <Box
                        sx={{
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                        <div style={{ width: '30%' }}>
                            <TextField
                                placeholder='Button Text'
                                type={'text'}
                                name="buttonText"
                                value={values.buttonText || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={TextInput}
                            />
                            {
                                errors.buttonText && touched.buttonText && <p style={{ color: "red", fontSize: "12px" }}>{errors.buttonText}</p>
                            }
                        </div>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <div className={appearancStyle.httpsStyle}>
                                https://
                            </div>
                            <TextField
                                placeholder='Add Redirection Link Here'
                                type={'text'}
                                name="buttonLink"
                                value={values.buttonLink || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={InputURL}
                            />

                            {
                                errors.buttonLink && touched.buttonLink && <p style={{ color: "red", fontSize: "12px" }}>{errors.buttonLink}</p>
                            }
                        </div>
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
