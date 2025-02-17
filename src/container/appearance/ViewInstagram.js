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
import { useDispatch, useSelector } from 'react-redux';
import { getInstagram } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewInstagram() {
    const dispatch = useDispatch();
    const { instagramData } = useSelector((state) => state.appearance);
    const viewInsta = instagramData?.data?.instagram;


    React.useEffect(() => {
        dispatch(getInstagram())
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

                    }}>Instagram</Typography>
                </AccordionSummary>
                {viewInsta?.map((insta, index) => (
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
                                    <img src={insta.image1} style={{maxWidth: '100%', width: 250, height: 200, objectFit: 'cover' }} alt='sliderImage' />
                                </div>
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
                                    <img src={insta.image2} style={{maxWidth: '100%', width: 250, height: 200, objectFit: 'cover' }} alt='sliderImage' />
                                </div>
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
                                    // name="name"
                                    value={insta.buttonLink}
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
