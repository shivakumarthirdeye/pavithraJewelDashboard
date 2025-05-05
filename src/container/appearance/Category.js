import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, Checkbox, CircularProgress, ListItemText, MenuItem, Select } from '@mui/material';
import { custom, saveChanges, formselect, SelectStyle } from '../../MaterialsUI';
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
import { toast } from 'react-toastify';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function Categories() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { appearanceCategoriesData } = useSelector(
        (state) => state.appearance);
    
    const viewCategories = appearanceCategoriesData?.data?.categories
    // console.log('viewCategories',viewCategories);
    
    
    React.useEffect(() => {
        dispatch(getAppearanceCategories())
    }, [dispatch])


    const { categoriesExportData,isLoading } = useSelector(
        (state) => state.categories);

    

    
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    console.log('selectedCategories',selectedCategories);
    

    const schema = yup.object().shape({
        categories: yup.array()
        .min(5, "You must select at least 5 categories")
        .required("Category is required"),
    });


    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        resetForm,
    } = useFormik({
        initialValues: {
            categories: [],
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewCategories?.length > 0) {
            const selectedIds = viewCategories?.map(category => category._id);
            setSelectedCategories(viewCategories); // Set the full category objects
            setFieldValue('categories', selectedIds, true); // Set only IDs in Formik
        }
    }, [viewCategories, setFieldValue]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addAppearanceCategories(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
    React.useEffect(() => {
        dispatch(getCategoriesExport())
    }, [dispatch])

    const handleCategoryChange = (event) => {
        const selectedCategoryIds = event.target.value;
    
        // Start with existing selected categories to preserve order
        const updatedSelectedCategories = [...selectedCategories];
    
        selectedCategoryIds.forEach((id) => {
            // If the category is not already in the selected list, add it
            const alreadySelected = updatedSelectedCategories.find(cat => cat._id === id);
            if (!alreadySelected) {
                const fullCategory = categoriesExportData?.data?.find(cat => cat._id === id);
                if (fullCategory) {
                    updatedSelectedCategories.push(fullCategory);
                }
            }
        });
    
        // Remove any that are no longer selected
        const finalSelectedCategories = updatedSelectedCategories.filter(cat =>
            selectedCategoryIds.includes(cat._id)
        );
    
        setSelectedCategories(finalSelectedCategories);
        setFieldValue('categories', selectedCategoryIds, true);
    };
    

    const handleRemoveCategory = (categoryId) => {
        // Filter out the removed category
        const updatedCategories = selectedCategories?.filter(cat => cat._id !== categoryId);
    
        // Update state
        setSelectedCategories(updatedCategories);
    
        // Update Formik's field value with the remaining category IDs
        setFieldValue('categories', updatedCategories?.map(cat => cat._id), true);
    };
    
    if(isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
              <CircularProgress />
            </div>
          )
    }
    if (categoriesExportData?.data?.length <= 0) {
        return (
            <div>
                No Categories found
            </div>
        )
    }
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
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={SelectStyle}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            multiple
                            name='categories'
                            value={selectedCategories?.map(category => category?._id)}
                            onChange={handleCategoryChange}
                            renderValue={(selected) =>
                                selected?.length > 0
                                    ? categoriesExportData?.data?.filter(category => selected?.includes(category?._id))?.map(category => category?.name).join(', ')
                                    : "Select Category"
                            }
                        >
                            <MenuItem value="">Select</MenuItem>
                            {categoriesExportData?.data?.length > 0 && categoriesExportData?.data?.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {/* <Checkbox checked={categoriesExportData.some(cat => cat._id === category._id)} /> */}
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            fontSize: 12,
                                            fontFamily: "Poppins",
                                            fontWeight: 400,
                                        }}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                        {
                            errors.categories && touched.categories && <p style={{ color: "red", fontSize: "12px" }}>{errors.categories}</p>
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
                        You need to select 5 categories
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, width: '100%',flexWrap:'wrap' }}>
                        {selectedCategories?.map((item, index) => (
                            <div className={appearancStyle.categoriesStyle} key={index}>
                                <div className={appearancStyle.textStyle}>{item.name} </div>
                                <div style={{ marginTop: 5,cursor:'pointer' }} onClick={() => handleRemoveCategory(item._id)}><CancelCateIcon /></div>
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
                    <Button sx={custom} onClick={resetForm}>Cancel</Button>
                    <Button sx={saveChanges} onClick={handleSubmit}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
