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
    const schema = yup.object().shape({
        productName: yup.string().required("Product name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        featuredImage: yup.string().required("At least one image is required"),

    });


    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
    } = useFormik({
        initialValues: {
            productName: "",
            // medias: [],
            description: "",
            media: {
                photo: [],
                video: []
            },
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            // handleSubject(values)
        }

    })
    //Media Image
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const body = new FormData();
            body.append('image', file);

            try {
                const { data, status } = await api.fileUpload(body);
                if (status === 200) {
                    const imageUrl = Array.isArray(data.data) ? data.data[0] : data.data;
                    // Update medias array by spreading existing values and adding the new imageUrl
                    setFieldValue('featuredImage', imageUrl);
                } else {
                    console.error(`Upload failed with status: ${status}`);
                }
            } catch (error) {
                console.error('Error uploading file:', error.response ? error.response.data : error.message);
            }
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

                    }}>Instagram</Typography>
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
                                    {values?.featuredImage?.length > 0 ? (
                                        <div>
                                            <img
                                                src={values.featuredImage}
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
                                        </>
                                    )
                                    }

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
                                    {values?.featuredImage?.length > 0 ? (
                                        <div>
                                            <img
                                                src={values.featuredImage}
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
                                        </>
                                    )
                                    }

                                </div>
                            </div>
                            {/* {
                                errors.featuredImage && touched.featuredImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featuredImage}</p>
                            } */}
                        </Box>
                    </Box>
                    <Box sx={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '50%' }}>
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
                                    name="name"
                                    // value={values.name || ''}
                                    // onChange={handleChange}
                                    // onBlur={handleBlur}
                                    sx={InputURL}
                                />

                                {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
                            </div>
                        </div>
                        <div style={{ width: '50%' }}>
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
                                    name="name"
                                    // value={values.name || ''}
                                    // onChange={handleChange}
                                    // onBlur={handleBlur}
                                    sx={InputURL}
                                />

                                {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
                            </div>
                        </div>
                    </Box>
                </AccordionDetails>
                <Box sx={{ marginBottom: '20px' }}>
                    <div className={appearancStyle.addButtonStyle}>
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
                    <Button sx={custom}>Cancel</Button>
                    <Button sx={saveChanges}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
