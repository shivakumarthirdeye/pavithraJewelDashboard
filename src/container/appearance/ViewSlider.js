import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, CircularProgress, TextField } from '@mui/material';
import { InputURL, TextArea, TextInput } from '../../MaterialsUI';
import appearancStyle from './appearance.module.css';
import productStyle from '../product/product.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getSliders } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewSlider() {

    const dispatch = useDispatch();

    const { slidersData, isLoading } = useSelector((state) => state.appearance);
    const viewSlider = slidersData?.data?.sliders


    React.useEffect(() => {
        dispatch(getSliders())
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

                    }}>Sliders</Typography>
                </AccordionSummary>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {viewSlider?.length > 0 ? (
                            <>
                                {viewSlider?.map((slider, index) => (
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
                                                Slider {index + 1}
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
                                                    name={`sliders[${index}].title`}
                                                    value={slider.title}
                                                    disabled={true}
                                                    sx={TextInput}
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
                                                Description
                                            </Typography>
                                            <TextField
                                                placeholder='Enter'
                                                type={'text'}
                                                name={`sliders[${index}].description`}
                                                value={slider.description}
                                                sx={TextArea}
                                                multiline
                                                rows={4}
                                                fullWidth
                                                disabled={true}
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
                                                Slider {index + 1} Image
                                            </Typography>
                                            <div className={productStyle.imageUpload1}>
                                                <div className={productStyle.imageView}>
                                                    <img src={slider.image} style={{ width: 200, height: 200, objectFit: 'cover' }} alt='sliderImage' />
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
                                                    name={`sliders[${index}].buttonText`}
                                                    value={slider.buttonText}
                                                    disabled={true}
                                                    sx={TextInput}
                                                />
                                            </div>
                                            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                                <div className={appearancStyle.httpsStyle}>
                                                    https://
                                                </div>
                                                <TextField
                                                    placeholder='Add Redirection Link Here'
                                                    type={'text'}
                                                    name={`sliders[${index}].buttonLink`}
                                                    value={slider.buttonLink}
                                                    disabled={true}
                                                    sx={InputURL}
                                                />
                                            </div>
                                        </Box>

                                    </AccordionDetails>
                                ))}
                            </>
                        ) : (
                            <div>
                                Sliders not found
                            </div>
                        )}
                    </>
                )}
            </CustomAccordion>
        </div >
    );
}
