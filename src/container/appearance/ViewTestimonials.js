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
import { useDispatch, useSelector } from 'react-redux';
import { getTestimonials } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewTestimonials() {
    const dispatch = useDispatch();
    const { testimonialsData } = useSelector((state) => state.appearance);
    const viewTestimonials = testimonialsData?.data?.testimonials;
    console.log('viewTestimonials', viewTestimonials);



    React.useEffect(() => {
        dispatch(getTestimonials())
    }, [dispatch])


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
                {viewTestimonials?.map((banners, index) => (
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
                                Rating
                            </Typography>
                            <TextField
                                placeholder='Enter'
                                type={'text'}
                                value={banners?.rating }
                                sx={TextInput}
                                disabled
                            />
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
                                    value={banners?.customerName}
                                    sx={TextInput}
                                    disabled
                                />
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
                                    value={banners?.customerRole}
                                    sx={TextInput}
                                    disabled
                                />
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
                                value={banners.testimony}
                                sx={TextArea}
                                multiline
                                rows={4}
                                disabled
                            />

                        </Box>
                    </AccordionDetails>
                ))}
            </CustomAccordion>
        </div >
    );
}
