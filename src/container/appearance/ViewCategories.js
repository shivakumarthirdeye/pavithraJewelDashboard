import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, Checkbox, CircularProgress, ListItemText, MenuItem, Select } from '@mui/material';
import { custom, saveChanges, formselect } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from "yup";
import { CancelCateIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesExport } from '../../redux/categoriesSlice';
import { addAppearanceCategories, getAppearanceCategories } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewCategories() {
    const dispatch = useDispatch();

    const { appearanceCategoriesData, isLoading } = useSelector(
        (state) => state.appearance);

    const viewCategories = appearanceCategoriesData?.data?.categories


    React.useEffect(() => {
        dispatch(getAppearanceCategories())
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

                    }}>Categories</Typography>
                </AccordionSummary>
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
                            Categories
                        </Typography>

                    </Box>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {viewCategories?.length > 0 ? (

                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, width: '100%' }}>
                                    {viewCategories?.map((item, index) => (
                                        <div className={appearancStyle.categoriesStyle} key={index}>
                                            <div className={appearancStyle.textStyle}>{item.name} </div>
                                            <div style={{ marginTop: 5 }}><CancelCateIcon /></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    Categories not found
                                </div>
                            )}
                        </>
                    )}
                </AccordionDetails>
            </CustomAccordion>
        </div >
    );
}
