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
            name: 'Category Name'
        },
        {
            id: 1,
            name: 'Category Name'
        },
        {
            id: 2,
            name: 'Category Name'
        },
        {
            id: 3,
            name: 'Category Name'
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

                    }}>Testimonials</Typography>
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
                    <Box sx={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: '100%',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{width:'50%'}}>
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
                                name="name"
                                // value={values.name || ''}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                sx={TextInput}
                            />
                        </div>
                        <div style={{width:'50%'}}>
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
                                name="name"
                                // value={values.name || ''}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
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
                            Their testimony
                        </Typography>
                        <TextField
                            placeholder='Enter'
                            type={'text'}
                            name="name"
                            // value={values.name || ''}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            sx={TextArea}
                            multiline
                            rows={4}
                        />
                        {/* {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    } */}
                    </Box>
                </AccordionDetails>
                <Box sx={{ marginBottom: '20px' }}>
                    <div className={appearancStyle.addButtonStyle}>
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
                    <Button sx={custom}>Cancel</Button>
                    <Button sx={saveChanges}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
