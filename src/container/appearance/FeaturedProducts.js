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

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function FeaturedProducts() {
    const schema = yup.object().shape({
        category: yup.string().required("Category is required"),

    });


    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
    } = useFormik({
        initialValues: {
            category: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            // handleSubject(values)
        }

    })
    const handleCategoryChange = (event) => {
        const selectedAttributeId = event.target.value; // This will be the base ID of the selected category
        setFieldValue("category", selectedAttributeId); // Update the formik state with the base ID

        setFieldValue("subCategory", []);
    };
    const data = [
        {
            id: 0,
            name: 'Product Name'
        },
        {
            id: 1,
            name: 'Product Name'
        },
        {
            id: 2,
            name: 'Product Name'
        },
        {
            id: 3,
            name: 'Product Name'
        },
    ]
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
                            Products
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
                            name='category'
                            value={values.category}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {/* {categoryData?.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))} */}
                        </Select>
                        {
                            errors.category && touched.category && <p style={{ color: "red", fontSize: "12px" }}>{errors.category}</p>
                        }
                    </Box>
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
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',gap:10,width:'100%'}}>
                        {data?.map((item, index) => (
                            <div className={appearancStyle.categoriesStyle} key={index}>
                                <div className={appearancStyle.textStyle}>{item.name} </div>
                                <div style={{ marginTop: 5 }}><CancelCateIcon /></div>
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
                <Box sx={{
                    marginBottom: '20px',
                    marginRight: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Button sx={custom}>Cancel</Button>
                    <Button sx={saveChanges}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
