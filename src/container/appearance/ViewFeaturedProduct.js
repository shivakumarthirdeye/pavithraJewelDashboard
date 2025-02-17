import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, MenuItem, Select } from '@mui/material';
import { custom, saveChanges, SelectStyle } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from "yup";
import { CancelCateIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturerdProducts } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function ViewFeaturedProducts() {
    const dispatch = useDispatch();

    const { featurerdProductsData } = useSelector(
        (state) => state.appearance);
    
    const viewCategories = featurerdProductsData?.data;
    console.log('viewCategories',viewCategories);
    
    
    
    React.useEffect(() => {
        dispatch(getFeaturerdProducts())
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

                    }}>Featured Products</Typography>
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
                    <Typography
                        sx={{
                            fontFamily: 'Public Sans',
                            fontSize: '12px',
                            fontWeight: '400',
                            lineHeight: '24px',
                            textAlign: 'left',
                            color: '#777980'
                        }}
                    >
                        You can select min 8 products
                    </Typography>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',gap:10,width:'100%',flexWrap:'wrap'}}>
                        {viewCategories?.products?.map((item, index) => (
                            <div className={appearancStyle.categoriesStyle} key={index}>
                                <div className={appearancStyle.textStyle}>{item.productName} </div>
                                <div style={{ marginTop: 5 }}><CancelCateIcon /></div>
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
            </CustomAccordion>
        </div >
    );
}
