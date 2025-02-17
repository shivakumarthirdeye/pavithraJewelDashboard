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


export default function ViewHeroBanner() {

    const dispatch = useDispatch();
    const {heroBannerData} = useSelector((state) => state.appearance);
    const viewHeroBanner = heroBannerData?.data?.banner;
    

    React.useEffect(() => {
        dispatch(getHeroBanner())
    },[dispatch])

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
                {viewHeroBanner?.map((banners, index) => (
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
                                Banner Subtitle
                            </Typography>
                            <TextField
                                placeholder='Enter'
                                type={'text'}
                                name={`banner[${index}].description`}
                                value={banners.description}
                                disabled
                                sx={TextInput}
                            />
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
                                   <img src={banners.image} style={{width:300,height:200,objectFit:'cover'}}alt='sliderImage'/>
                                </div>
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
                                    name={`banner[${index}].buttonText`}
                                    value={banners.buttonText}
                                    sx={TextInput}
                                    disabled
                                />
                               </div>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <div className={appearancStyle.httpsStyle}>
                                    https://
                                </div>
                                <TextField
                                    placeholder='Add Redirection Link Here'
                                    type={'text'}
                                    name={`banner[${index}].buttonLink`}
                                    value={banners.buttonLink}
                                    sx={InputURL}
                                    disabled
                                />

                            </div>
                        </Box>

                    </AccordionDetails>
                ))}
            </CustomAccordion>
        </div >
    );
}
