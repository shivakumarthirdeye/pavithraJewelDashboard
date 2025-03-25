import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, ListItemText, MenuItem, Select } from '@mui/material';
import { custom, saveChanges, SelectStyle } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from "yup";
import { CancelCateIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFeaturerdProducts, getFeaturerdProducts } from '../../redux/appearanceSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getExportProducts, getProducts } from '../../redux/productSlice';
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
export default function FeaturedProducts() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { featurerdProductsData } = useSelector(
        (state) => state.appearance);
    
    const viewFeaturedproduct = featurerdProductsData?.data?.products;
    console.log('viewFeaturedproduct', viewFeaturedproduct);
    
    
    React.useEffect(() => {
        dispatch(getFeaturerdProducts())
    }, [dispatch])

    const { exportProductsData } = useSelector(
        (state) => state.products);
    console.log('exportProductsData', exportProductsData);
    const viewProductsData = exportProductsData?.data

    const [selectedProducts, setSelectedProduct] = React.useState([]);
    console.log('selectedProducts',selectedProducts);
    

    const schema = yup.object().shape({
        products: yup.array()
        .max(8, "You can select only 8 products")
        .required("Product is required"),
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
            products: [],
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewFeaturedproduct && viewFeaturedproduct.length > 0) {
            const selectedIds = viewFeaturedproduct.map(product => product._id);
            setSelectedProduct(viewFeaturedproduct); // Store full product objects
            setFieldValue('products', selectedIds, true); // Update Formik field
        }
    }, [viewFeaturedproduct, setFieldValue]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addFeaturerdProducts(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
    

    React.useEffect(() => {
        dispatch(getExportProducts())
    }, [dispatch])

    const handleProductChange = (event) => {
        const selectedProductIds = event.target.value; // Get selected product IDs
        // Find the full product objects based on selected IDs
        const selectedProductData = viewProductsData?.filter((product) =>
            selectedProductIds?.includes(product?.productdetails?._id)
        );

        setSelectedProduct(selectedProductData);
        setFieldValue('products', selectedProductIds, true); // Store only the IDs in Formik
    };
    const handleRemoveProduct = (productId) => {
        if (!selectedProducts || selectedProducts.length === 0) return; // Ensure list is not empty
    
        const updatedProducts = selectedProducts.filter(
            (product) => product?._id !== productId
        );
    
        console.log("Updated Products:", updatedProducts); // Debugging step
    
        setSelectedProduct(updatedProducts); // Update state
    
        // Ensure Formik gets updated correctly
        setFieldValue(
            'products',
            updatedProducts.map(product => product?._id),
            true
        );
    };
    
    

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
                            multiple
                            name='products'
                            value={selectedProducts.map(product => product?.productdetails?._id) || selectedProducts?.map(i => i?._id)}
                            onChange={handleProductChange}
                            renderValue={(selected) =>
                                selected?.length > 0
                                    ? viewProductsData
                                        ?.filter(product => selected.includes(product?.productdetails?._id))
                                        .map(product => product?.productdetails?.productName)
                                        .join(', ')
                                    : "Select Products"
                            }
                        >
                            <MenuItem value="">Select</MenuItem>
                            {viewProductsData?.length > 0 && viewProductsData?.map((product) => (
                                <MenuItem key={product?.productdetails?._id} value={product?.productdetails?._id}>
                                    {/* <Checkbox checked={categoriesExportData.some(cat => cat._id === product._id)} /> */}
                                    <ListItemText
                                        primary={product?.productdetails?.productName}
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
                            errors.products && touched.products && <p style={{ color: "red", fontSize: "12px" }}>{errors.products}</p>
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
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, width: '100%',flexWrap:'wrap' }}>
                        {selectedProducts?.map((item, index) => (
                            <div className={appearancStyle.categoriesStyle} key={index}>
                                <div className={appearancStyle.textStyle}>{item?.productdetails?.productName || item?.productName} </div>
                                <div style={{ marginTop: 5 }} onClick={() => handleRemoveProduct(item?._id)}><CancelCateIcon /></div>
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
