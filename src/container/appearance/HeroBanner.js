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
    const schema = yup.object().shape({
        productName: yup.string().required("Product name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        fabricDetails: yup.string().required("Fabric details are required"),
        tags: yup.string().required("Tags are required"),
        basePrice: yup.number().typeError("Base Price must be a number").min(1, "Base Price is required"),
        salePrice: yup.number().typeError("Sale Price must be a number").min(1, "Sale Price is required"),
        discountType: yup.string().required("Discount Type is required"),
        discountValue: yup.number().typeError("Discount Value be a number").min(1, "Discount Value is required"),
        // medias: yup.array().min(1, "At least one image is required"),
        featuredImage: yup.string().required("At least one image is required"),
        variations: yup.array().of(
            yup.object().shape({
                name: yup.string().required("Variation Type is required"),
                // type: yup.string().required("Variation Type is required"),
                // value: yup.array().of(yup.string().required()).min(1, "At least one image is required")
            })
        ).min(1, "At least one variation is required"),
        variationInventory: yup.array().of(
            yup.object().shape({
                SKU: yup.string().required("SKU is required"),
                additionalPrice: yup.number().typeError("Additional Price must be a number").required("Additional Price is required"),
                quantity: yup.number().typeError("Quantity must be a number").min(1, "Quantity is required"),
                color: yup.string().nullable().notRequired(),
                size: yup.string().nullable().notRequired(),
                images: yup.array().of(
                    yup.string().url().required("Image must be a valid URL")
                ).min(1, "At least one image is required"),
            })
        ).min(1, "At least one variation is required"),
        // discountStartDate: yup.date().required("Start Date is required"),
        // discountEndDate: yup.date().required("End Date is required"),
        category: yup.string().required("Category is required"),
        subCategory: yup.string().required("Subcategory is required"),
        GST: yup.number().typeError("GST must be a number").min(1, "GST is required"),
        productId: yup.string().required("Product ID is required"),
        supplier: yup.string().required("Supplier is required"),
        stockQuantity: yup.number().typeError("Stock Quantity must be a number").min(1, "Stock Quantity is required"),
        productDimensions: yup.object().shape({
            weight: yup.number().typeError("Weight must be a number").min(1, "Weight is required"),
            height: yup.number().typeError("Height must be a number").min(1, "Height is required"),
            length: yup.number().typeError("Length must be a number").min(1, "Length is required"),
            width: yup.number().typeError("Width must be a number").min(1, "Width is required"),
        }),
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
            fabricDetails: "",
            tags: "",
            features: {
                itemWeight: 0,
                stoneWeight: 0,
                stoneColor: '',
                productWidth: 0,
                productHeight: 0,
                feature: ''
            },
            media: {
                photo: [],
                video: []
            },
            metalType: '',
            pricing: {
                totalWeight: {
                    value: 0,
                    status: false
                },
                goldWeight: {
                    value: 0,
                    status: false
                },
                goldRate: {
                    value: 0,
                    status: false
                },
                makingCharges: {
                    value: 0,
                    status: false
                },
                stoneType: {
                    value: 0,
                    status: false
                },
                stoneCharges: {
                    value: 0,
                    status: false
                },
                diamondCarat: {
                    value: 0,
                    status: false
                },
                diamondPerCarat: {
                    value: 0,
                    status: false
                },
                diamondCost: {
                    value: 0,
                    status: false
                },
                polkiCarat: {
                    value: 0,
                    status: false
                },
                polkiPerCarat: {
                    value: 0,
                    status: false
                },
                polkiCost: {
                    value: 0,
                    status: false
                },
                gst: {
                    value: 0,
                    status: false
                },
                finalSalePrice: {
                    value: 0,
                    status: false
                },
            },
            discount: {
                discountValue: 0,
                discountStartdate: null,
                discountEnddate: null,
            },
            inventory: {
                totalstock: 0,
            },
            status: "",
            // variations:
            //     [{
            //         type: '',
            //         value: [],
            //         name: ''
            //     }],
            shipping: {
                weight: 0,
                height: 0,
                length: 0,
                width: 0,
            },
            category: {
                productCategory: '',
                productSubcategory: ''
            },
            gold: {
                type: "",
                orderType: ""
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
                            Slider 1 Title
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
                    </Box>

                </AccordionDetails>
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
                            Slider 2 Title
                        </Typography>
                        <div style={{
                            display:'flex',
                            justifyContent:'flex-start',
                            alignItems:'center',
                            gap:'10px'
                        }}>
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
                            <div className={appearancStyle.deleteBackgroundStyle}>
                                <DeletIcon />
                            </div>
                        </div>
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
                            name="name"
                            // value={values.name || ''}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            sx={TextArea}
                            multiline
                            rows={4}
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
                    </Box>

                </AccordionDetails>
                <Box sx={{ marginBottom: '20px' }}>
                    <div className={appearancStyle.addButtonStyle}>
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
                    <Button sx={custom}>Cancel</Button>
                    <Button sx={saveChanges}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
