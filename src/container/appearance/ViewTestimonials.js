import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress, MenuItem, Select, TextField } from '@mui/material';
import { custom, saveChanges, SelectStyle, TextArea, TextInput } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from "yup";
import { AddIcon, CancelCateIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { getTestimonials } from '../../redux/appearanceSlice';
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
export default function ViewTestimonials() {
    const dispatch = useDispatch();
    const { testimonialsData, isLoading } = useSelector((state) => state.appearance);
    const viewTestimonials = testimonialsData?.data;
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

                    }}>Happy Clients</Typography>
                </AccordionSummary>
                <div style={{ margin: "0px 20px 20px 19px" }}>
                    <label className={productStyle.label}>Photos</label>
                    <br />
                    <div className={productStyle.imageUpload1test}>
                        <div className={productStyle.imageViewtest}>

                            {viewTestimonials?.image?.length > 0 ? (
                                <>
                                    <div className={productStyle.imageContainertest}>
                                        {viewTestimonials?.image?.map((img, imgIndex) => (
                                            <div key={imgIndex} className={productStyle.imageWrappertest}>

                                                <img src={img} alt="Uploaded" className={productStyle.inventoryImagetest} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div>
                                    No Clients
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CustomAccordion >
        </div >
    );
}
