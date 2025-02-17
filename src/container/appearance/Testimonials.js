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
import { AddIcon, CancelCateIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addHeroBanner, addTestimonials } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../helper/Api';
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
export default function Testimonials() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const schema = yup.object().shape({
        testimonials: yup.array().of(
            yup.object().shape({
                rating: yup.string().required("Rating is required"),
                customerName: yup.string().required("Customer Name is required"),
                customerRole: yup.string().required("Customer Role is required"),
                testimony: yup.string().required("Testimony is required")
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
        resetForm
    } = useFormik({
        initialValues: {
            testimonials: [
                {
                    rating: '',
                    customerName: '',
                    customerRole: '',
                    testimony: '',
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
            const resultAction = await dispatch(addTestimonials(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }

    const handleAddTestimonial = () => {
        setFieldValue('testimonials', [
            ...values.testimonials,
            { rating: '', customerName: '', customerRole: '', testimony: '', }
        ]);
    };

    const handleDeleteHeroBanner = (index) => {
        const updatedSliders = values.testimonials.filter((_, i) => i !== index);
        setFieldValue('testimonials', updatedSliders);
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

                    }}>Testimonials</Typography>
                </AccordionSummary>
                {values?.testimonials?.map((test, index) => (
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
