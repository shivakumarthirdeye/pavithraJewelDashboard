import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, TextField } from '@mui/material';
import { custom, InputURL, saveChanges, TextArea, TextInput } from '../../MaterialsUI';
import appearancStyle from './appearance.module.css';
import productStyle from '../product/product.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import { AddIcon, ImageIcon } from '../../svg';
import api from '../../helper/Api';
import Toastify from '../../helper/Toastify';
import axios from 'axios';
import { addInstagram, getInstagram } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
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
export default function Instagram() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { instagramData } = useSelector((state) => state.appearance);
    const viewInsta = instagramData?.data?.instagram;


    React.useEffect(() => {
        dispatch(getInstagram())
    }, [dispatch])

    const schema = yup.object().shape({
        instagram: yup.array().of(
            yup.object().shape({
                image1: yup.string().required("Image one is required"),
                image2: yup.string().required("Image two is required"),
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
            instagram: [
                {
                    image1: '',
                    image2: '',
                    buttonLink: ''
                }
            ]
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewInsta) {
            setValues({
                instagram: viewInsta.map(item => ({
                    image1: item?.image1 || '',
                    image2: item?.image2 || '',
                    buttonLink: item?.buttonLink || '',
                }))
            });
        }
    }, [viewInsta, setValues]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addInstagram(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
    //Media Image

    const handleImageOneChange = async (e, index) => {
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
                    setFieldValue(`instagram[${index}].image1`, data?.data?.url);
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file");
        }
    };
    const handleImageTwoChange = async (e, index) => {
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

                    setFieldValue(`instagram[${index}].image2`, data?.data?.url);
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file");
        }
    };

    const handleAddInstagram = () => {
        setFieldValue('instagram', [
            ...values.instagram,
            { image1: '', image2: '', buttonLink: '' }
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
                    }}
                >
                    <Typography component="span" sx={{
                        fontWeight: '500',
                        fontFamily: 'Public Sans',
                        fontSize: '16px',
                        lineHeight: '28px',
                        letterSpacing: '0.005em',
                        textAlign: 'left'

                    }}>Instagram</Typography>
                </AccordionSummary>
                {values?.instagram?.map((insta, index) => (
                    <AccordionDetails
                        sx={{
                            backgroundColor: '#F8F9FF',
                            // width:'100%',
                            height: 'fit-content',
                            padding: '18px 29px',
                            margin: "0px 20px 20px 19px"
                        }}
                    >
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
                                        {values?.instagram[index]?.image1.length > 0 ? (
                                            <div>
                                                <img
                                                    src={values?.instagram[index]?.image1}
                                                    alt="Selected"
                                                    style={{ maxWidth: '100%', marginTop: '0px', width: 250, height: 200, objectFit: 'cover' }}
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
                                                <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`imageOneFile-${index}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleImageOneChange(e, index)}
                                                    />
                                                    <label htmlFor={`imageOneFile-${index}`} className={productStyle.uploadBox}>
                                                        Add Image
                                                    </label>
                                                </div>
                                            </>
                                        )
                                        }
                                        {values?.instagram[index]?.image1.length > 0 && (
                                            <>
                                                <div>
                                                    <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                        Drag and drop image here, or click add image
                                                    </p>
                                                </div>
                                                <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`imageOneFile-${index}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleImageOneChange(e, index)}
                                                    />
                                                    <label htmlFor={`imageOneFile-${index}`} className={productStyle.uploadBox}>
                                                        Change Image
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {
                                    errors.instagram?.[index]?.image1 && touched.instagram?.[index]?.image1 && <p style={{ color: "red", fontSize: "12px" }}>{errors.instagram?.[index]?.image1}</p>
                                }
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
                                        {values?.instagram[index]?.image2?.length > 0 ? (
                                            <div>
                                                <img
                                                    src={values?.instagram[index]?.image2}
                                                    alt="Selected"
                                                    style={{ maxWidth: '100%', marginTop: '0px', width: 250, height: 200, objectFit: 'cover' }}
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
                                                <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`imageTwoFile-${index}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleImageTwoChange(e, index)}
                                                    />
                                                    <label htmlFor={`imageTwoFile-${index}`} className={productStyle.uploadBox}>
                                                        Add Image
                                                    </label>
                                                </div>
                                            </>
                                        )
                                        }
                                        {values?.instagram[index]?.image2?.length > 0 && (
                                            <>

                                                <div>
                                                    <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                        Drag and drop image here, or click add image
                                                    </p>
                                                </div>
                                                <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`imageTwoFile-${index}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleImageTwoChange(e, index)}
                                                    />
                                                    <label htmlFor={`imageTwoFile-${index}`} className={productStyle.uploadBox}>
                                                        Change Image
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.instagram?.[index]?.image2 && touched.instagram?.[index]?.image2 && (
                                    <div style={{ color: "red" }}>{errors.instagram?.[index]?.image2}</div>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ marginBottom: '10px', }}>
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
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <div className={appearancStyle.httpsStyle}>
                                    https://
                                </div>
                                <TextField
                                    placeholder='Add Redirection Link Here'
                                    type={'text'}
                                    name={`instagram[${index}].buttonLink`}
                                    value={insta.buttonLink || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={InputURL}
                                />


                            </div>
                            {errors.instagram?.[index]?.buttonLink && touched.instagram?.[index]?.buttonLink && (
                                <div style={{ color: "red" }}>{errors.instagram?.[index]?.buttonLink}</div>
                            )}
                        </Box>
                    </AccordionDetails>
                ))}
                <Box sx={{ marginBottom: '20px' }}>
                    <div
                        className={appearancStyle.addButtonStyle}
                        onClick={handleAddInstagram}
                    >
                        <AddIcon /> <span>Add another</span>
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
