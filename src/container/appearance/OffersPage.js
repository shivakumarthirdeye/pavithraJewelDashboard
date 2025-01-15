import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { custom, InputURL, saveChanges, SelectStyle, TextInput } from '../../MaterialsUI';
import { AddIcon, DeletIcon, ImageIcon } from '../../svg';
import productStyle from '../product/product.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import api from '../../helper/Api';
import appearanceStyle from './appearance.module.css'
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { useNavigate } from 'react-router-dom';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

const CustomAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));


export default function OffersPage() {
    const navigate = useNavigate();
    const schema = yup.object().shape({
        productName: yup.string().required("Product name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        
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
            featuredImage: [],
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
    const handleCategoryChange = (event) => {
        const selectedAttributeId = event.target.value; // This will be the base ID of the selected category
        setFieldValue("category", selectedAttributeId); // Update the formik state with the base ID

        setFieldValue("subCategory", []);
    };
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container} style={{paddingBottom:20}}>
                <div>
                    <h2 className={productStyle.categoryText}>Offers Page </h2>
                    <CustomSeparator dashboard="Dashboard" type="Page Appearance " subType="Offer Page Builder" />
                </div>
                <div
                    className={appearanceStyle.backToStyle}
                    style={{ marginTop: 10 }}
                    onClick={() => navigate("/appearance/Appearance")}
                >
                    Back to list
                </div>
            </div>
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
                            name="name"
                            // value={values.name || ''}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            sx={TextInput}
                        />
                        {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
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
                            name="name"
                            // value={values.name || ''}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            sx={TextInput}
                        />
                        {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
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
                                {values?.featuredImage.length > 0 ? (
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
                    <Box sx={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: '100%',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{width:'32%'}}>
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
                                Category
                            </Typography>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={SelectStyle}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='category'
                            value={values.category}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {/* {categoryData?.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))} */}
                        </Select>
                        {
                            errors.category && touched.category && <p style={{ color: "red", fontSize: "12px" }}>{errors.category}</p>
                        }
                        </div>
                        <div style={{width:'32%'}}>
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
                                Offer start range in %
                            </Typography>
                            <TextField
                                placeholder='Select...'
                                type={'number'}
                                name="name"
                                // value={values.name || ''}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                sx={TextInput}
                            />
                        </div>
                        <div style={{width:'32%'}}>
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
                                Offer end range in %
                            </Typography>
                            <TextField
                                placeholder='Select...'
                                type={'number'}
                                name="name"
                                // value={values.name || ''}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                sx={TextInput}
                            />
                        </div>
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
                                name="name"
                                // value={values.name || ''}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                sx={TextInput}
                            />
                            {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
                        </div>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <div className={appearanceStyle.httpsStyle}>
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
                    </Box>

                </AccordionDetails>
                <Box sx={{ marginBottom: '20px' }}>
                    <div className={appearanceStyle.addButtonStyle}>
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
        </div>
    );
}
