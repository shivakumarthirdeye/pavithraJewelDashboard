import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { custom, saveChanges, SelectStyle, TextArea, TextInput } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from "yup";
import { AddIcon, CancelCateIcon, CrossIcon, ImageIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addHeroBanner, addTestimonials, getTestimonials } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../helper/Api';
import axios from 'axios';
import Toastify from '../../helper/Toastify';
import productStyle from '../product/product.module.css'

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function Testimonials() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { testimonialsData } = useSelector((state) => state.appearance);
    const viewTestimonials = testimonialsData?.data;
    console.log('viewTestimonials', viewTestimonials);



    React.useEffect(() => {
        dispatch(getTestimonials())
    }, [dispatch])

    const schema = yup.object().shape({

        image: yup.array().min(1, "At least one image is required")

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
            customerName: '',
            image: []
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewTestimonials) {
            setValues({
                customerName: viewTestimonials?.customerName || '',
                image: viewTestimonials?.image || []
            })
        }
    }, [viewTestimonials, setValues]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addTestimonials(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }


    const handleImageChange = async (e, index) => {
        const files = e.target?.files; // Get all selected files
        // if (!files) return;

        try {
            if (files) {
                const uploadedImages = []; // Temporary array to store image URLs
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const body = {
                        key: `${Date.now()}_${file.name}`,
                        fileName: file.name,
                    };

                    const { data, status } = await api.getPutSignedUrl(body);

                    console.log('data',data);
                    
                    if (status === 200) {
                        await axios.put(data.data?.preSigned, file, {   
                            headers: {
                                "Content-Type": file.type,
                            },
                        });

                        const imageUrl = data?.data?.url;
                        uploadedImages.push(imageUrl); // Add uploaded image URL to the array
                    }
                }

                // Update medias.photo by appending new images
                setFieldValue('image', [...(values.image || []), ...uploadedImages]);
                // setTimeout(() => {
                //     e.target.value = null; // Reset input value
                //   }, 100);
            }   // Reset input value to allow selecting more images

        } catch (err) {
            console.error("error",err);
            Toastify.error("Error uploading images");
        }
    };
  

//     const handleImageChange = async (e, index) => {
//     const files = e.target?.files;

//     if (!files || files.length === 0) {
//         console.warn("No files selected.");
//         return;
//     }

//     try {
//         const uploadedImages = [];

//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];

//             const body = {
//                 key: `${Date.now()}_${file.name}`,
//                 fileName: file.name,
//             };

//             try {
//                 console.log("Requesting signed URL for:", file.name);

//                 // Request pre-signed URL from your backend
//                 const { data, status } = await api.getPutSignedUrl(body);

//                 console.log("Signed URL response:", data);

//                 if (status === 200) {
//                     // Upload the file to S3 using the pre-signed URL
//                     await axios.put(data.data?.preSigned, file, {
//                         headers: {
//                             "Content-Type": file.type,
//                         },
//                     });

//                     const imageUrl = data?.data?.url;
//                     console.log("Uploaded image URL:", imageUrl);

//                     uploadedImages.push(imageUrl);
//                 } else {
//                     console.error("Failed to get signed URL for", file.name);
//                 }
//             } catch (uploadErr) {
//                 console.error(`Error uploading ${file.name}:`, uploadErr);
//                 Toastify.error(`Error uploading ${file.name}`);
//             }
//         }

//         // Append uploaded images to form field
//         setFieldValue('image', [...(values.image || []), ...uploadedImages]);
//         console.log("Final uploaded image array:", [...(values.image || []), ...uploadedImages]);

//     } catch (err) {
//         console.error("Unexpected error while uploading images:", err);
//         Toastify.error("Error uploading images");
//     }
// };

  
    const handleDeleteImage = (imageUrl, imgIndex) => {

        // Remove the selected image by filtering it out from the media.photo array
        const updatedImages = values.image.filter((_, index) => index !== imgIndex);

        // Update the state with the new array
        setFieldValue("image", updatedImages);
    };
    // console.log('log for image', values.image);

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

                    }}>Happy Clients</Typography>
                </AccordionSummary>
                {/* {values?.testimonials?.map((test, index) => (
                    <AccordionDetails
                        key={index}
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
                                Rating
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
                                name={`testimonials[${index}].rating`}
                                value={test.rating}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="1">1</MenuItem>

                            </Select>
                            {
                                errors.testimonials?.[index]?.rating && touched.testimonials?.[index]?.rating && <p style={{ color: "red", fontSize: "12px" }}>{errors.testimonials?.[index]?.rating}</p>
                            }
                        </Box>
                        <Box sx={{
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
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
                                    Customer Name
                                </Typography>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name={`testimonials[${index}].customerName`}
                                    value={test.customerName || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={TextInput}
                                />
                                {errors.testimonials?.[index]?.customerName && touched.testimonials?.[index]?.customerName && (
                                    <div style={{ color: "red" }}>{errors.testimonials[index].customerName}</div>
                                )}
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
                                    Customer Role
                                </Typography>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name={`testimonials[${index}].customerRole`}
                                    value={test.customerRole || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={TextInput}
                                />
                                {errors.testimonials?.[index]?.customerRole && touched.testimonials?.[index]?.customerRole && (
                                    <div style={{ color: "red" }}>{errors.testimonials[index].customerRole}</div>
                                )}
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
                                Their testimony
                            </Typography>
                            <TextField
                                placeholder='Enter'
                                type={'text'}
                                name={`testimonials[${index}].testimony`}
                                value={test.testimony || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={TextArea}
                                multiline
                                rows={4}
                            />
                            {errors.testimonials?.[index]?.testimony && touched.testimonials?.[index]?.testimony && (
                                <div style={{ color: "red" }}>{errors.testimonials[index].testimony}</div>
                            )}
                        </Box>
                    </AccordionDetails>
                ))}
                <Box sx={{ marginBottom: '20px' }}>
                    <div className={appearancStyle.addButtonStyle} onClick={handleAddTestimonial}>
                        <AddIcon /> <span>Add another</span>
                    </div>
                </Box> */}
                <div style={{ margin: "0px 20px 20px 19px" }}>
                    <label className={productStyle.label}>Photo</label>
                    <br />
                    <div className={productStyle.imageUpload1}>
                        <div className={productStyle.imageView}>
                            <>
                                {values?.image?.length > 0 ? (
                                    <>
                                        <div className={productStyle.imageContainer}>
                                            {values?.image?.map((img, imgIndex) => (
                                                <div key={imgIndex} className={productStyle.imageWrapper}>
                                                    <div
                                                        className={productStyle.deleteImageStyles}
                                                        style={{ zIndex: 1 }}
                                                        onClick={() => handleDeleteImage(img, imgIndex)} // Pass inventoryIndex and image URL to delete function
                                                    >
                                                        <CrossIcon />  {/* This is the delete icon */}
                                                    </div>
                                                    <img src={img} alt="Uploaded" className={productStyle.inventoryImage} />

                                                </div>
                                            ))}

                                        </div>
                                        <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="imageProfileFile"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                                // value={values.imageFile}
                                                multiple
                                            />
                                            <label htmlFor="imageProfileFile" className={productStyle.uploadBox}>
                                                Add Images
                                            </label>
                                        </div>
                                    </>
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
                                                id="imageProfileFile"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                                // value={values.imageFile}
                                                multiple
                                            />
                                            <label htmlFor="imageProfileFile" className={productStyle.uploadBox}>
                                                Add Images
                                            </label>
                                        </div>
                                    </>
                                )}
                            </>

                        </div>
                    </div>
                    {
                        errors?.image && touched?.image && <p style={{ color: "red", fontSize: "12px" }}>{errors?.image}</p>
                    }
                </div>
                <div style={{ width: '100%', padding: 20 }}>
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
                        Customer Name
                    </Typography>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name={`customerName`}
                        value={values.customerName || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={TextInput}
                    />
                </div>
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
