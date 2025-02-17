import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, TextField } from '@mui/material';
import { custom, saveChanges, TextArea, TextInput } from '../../MaterialsUI';
import productStyle from '../product/product.module.css';
import { ImageIcon } from '../../svg';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutus } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewAboutUs() {
    const dispatch = useDispatch();
    const {aboutUsData} = useSelector((state) => state.appearance)
    // console.log('aboutUsData',aboutUsData);
    
    const viewAboutus = aboutUsData?.data;

    React.useEffect(() => {
        dispatch(getAboutus())
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
                    }}
                >
                    <Typography component="span" sx={{
                        fontWeight: '500',
                        fontFamily: 'Public Sans',
                        fontSize: '16px',
                        lineHeight: '28px',
                        letterSpacing: '0.005em',
                        textAlign: 'left'

                    }}>About Us</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: '#F8F9FF',
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
                            Title
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            value={viewAboutus?.title}
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
                            Description
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            // name="name"
                            value={viewAboutus?.description}
                            sx={TextArea}
                            multiline
                            rows={4}
                            disabled
                        />
                    </Box>
                    <Box sx={{ marginBottom: '10px',display:'flex',gap:'10px',alignItems:'center' }}>
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
                                   <img src={viewAboutus?.image1} style={{width:225,height:200,objectFit:'cover'}}alt='sliderImage'/>
                                </div>
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
                            <div className={productStyle.imageView}>
                                   <img src={viewAboutus?.image2} style={{width:225,height:200,objectFit:'cover'}}alt='sliderImage'/>
                                </div>
                            </div>
                        </Box>
                        
                    </Box>
                </AccordionDetails>
                
            </CustomAccordion>
        </div >
    );
}
