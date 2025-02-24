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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addHeroBanner, getHeroBanner } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';
import Toastify from '../../helper/Toastify';

const CustomAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));


export default function HeroBanner() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { heroBannerData } = useSelector((state) => state.appearance);
    const viewHeroBanner = heroBannerData?.data?.banner;


    React.useEffect(() => {
        dispatch(getHeroBanner())
    }, [dispatch])

    const schema = yup.object().shape({
        banner: yup.array().of(
            yup.object().shape({
                title: yup.string().required("Title is required"),
                image: yup.string().required("At least one image is required"),
                description: yup.string().required("Description is required"),
                buttonText: yup.string().required("Button text is required"),
                buttonLink: yup.string().url("Invalid URL").required("Button link is required"),
            })
        ).min(1, "At least one slider is required"), // Ensure there's at least one slider
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
            banner: [
                {
                    title: '',
                    description: '',
                    image: '',
                    buttonText: '',
                    buttonLink: ''
                }
            ]
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addHeroBanner(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }

    React.useEffect(() => {
        if (viewHeroBanner) {
            setValues({
                banner: viewHeroBanner.map(item => ({
                    title: item?.title || '',
                    description: item?.description || '',
                    image: item?.image || '',  // Ensure correct property name
                    buttonText: item?.buttonText || '',
                    buttonLink: item?.buttonLink || ''
                }))
            });
        }
    }, [viewHeroBanner, setValues]);
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

                // Update the specific slider image in the array
                const updatedSliders = [...values.banner];
                updatedSliders[index].image = data?.data?.url;
                setFieldValue(`banner[${index}].image`, data?.data?.url);
            }
        }
    } catch (err) {
        console.log(err);
        Toastify.error("Error uploading file");
    }
};

const handleAddHeroBanner = () => {
    setFieldValue('banner', [
        ...values.banner,
        { title: '', description: '', image: '', buttonText: '', buttonLink: '' }
    ]);
};

const handleDeleteHeroBanner = (index) => {
    const updatedSliders = values.banner.filter((_, i) => i !== index);
    setFieldValue('banner', updatedSliders);
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

                }}>Hero Banner</Typography>
            </AccordionSummary>
            {values.banner.map((banners, index) => (
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
                            Slider {index + 1} Title
                        </Typography>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <TextField
                                placeholder='Enter'
                                type={'text'}
                                name={`banner[${index}].title`}
                                value={banners.title || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={TextInput}
                            />

                            <div className={appearancStyle.deleteBackgroundStyle} onClick={handleDeleteHeroBanner}>
                                <DeletIcon />
                            </div>
                        </div>
                        {errors.banner?.[index]?.title && touched.banner?.[index]?.title && (
                            <div style={{ color: "red" }}>{errors.banner[index].title}</div>
                        )}
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
                            name={`banner[${index}].description`}
                            value={banners.description || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={TextInput}
                        />
                        {errors.banner?.[index]?.description && touched.banner?.[index]?.description && (
                            <div style={{ color: "red" }}>{errors.banner[index].description}</div>
                        )}
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
                                {values.banner[index].image ? (
                                    <img
                                        src={values.banner[index].image}
                                        alt="Selected"
                                        style={{ maxWidth: '100%', marginTop: '0px', width: 200, height: 200 }}
                                    />
                                ) : (
                                    <>
                                        <ImageIcon />
                                        <div>
                                            <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                Drag and drop image here, or click add image
                                            </p>
                                        </div>
                                        <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`imageFile-${index}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageChange(e, index)}
                                            />
                                            <label htmlFor={`imageFile-${index}`} className={productStyle.uploadBox}>
                                                Add Image
                                            </label>
                                        </div>
                                    </>
                                )
                                }

                            </div>
                        </div>
                        {errors.banner?.[index]?.image && touched.banner?.[index]?.image && (
                            <div style={{ color: "red" }}>{errors.banner[index].image}</div>
                        )}
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
                                name={`banner[${index}].buttonText`}
                                value={banners.buttonText || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={TextInput}
                            />
                            {errors.banner?.[index]?.buttonText && touched.banner?.[index]?.buttonText && (
                                <div style={{ color: "red" }}>{errors.banner[index].buttonText}</div>
                            )}
                        </div>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <div className={appearancStyle.httpsStyle}>
                                https://
                            </div>
                            <TextField
                                placeholder='Add Redirection Link Here'
                                type={'text'}
                                name={`banner[${index}].buttonLink`}
                                value={banners.buttonLink || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={InputURL}
                            />

                            {errors.banner?.[index]?.buttonLink && touched.banner?.[index]?.buttonLink && (
                                <div style={{ color: "red" }}>{errors.banner[index].buttonLink}</div>
                            )}
                        </div>
                    </Box>

                </AccordionDetails>
            ))}
            <Box sx={{ marginBottom: '20px' }}>
                <div className={appearancStyle.addButtonStyle} onClick={handleAddHeroBanner}>
                    <AddIcon /> <span>Add Slider</span>
                </div>
            </Box>
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
