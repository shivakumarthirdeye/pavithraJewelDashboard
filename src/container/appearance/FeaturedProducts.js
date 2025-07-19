import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, MenuItem, Select, Checkbox, ListItemText } from '@mui/material'; 
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
import Toastify from "../../helper/Toastify";

const CustomAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    width: '70%',
    overflow: 'visible',
}));

export default function FeaturedProducts() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { featurerdProductsData } = useSelector((state) => state.appearance);
    const { exportProductsData } = useSelector((state) => state.products);
    const viewFeaturedproduct = featurerdProductsData?.data || [];
    const viewProductsData = exportProductsData?.data || [];
    const [selectedProducts, setSelectedProduct] = React.useState([]);

    React.useEffect(() => {
        dispatch(getFeaturerdProducts());
        dispatch(getExportProducts());
    }, [dispatch]);

    const schema = yup.object().shape({
        products: yup.array()
            .min(8, "You must select at least 8 products!")
            .max(8, "You can select only 8 products!")
            .required("Product is required!"),
    });

    const {
        handleSubmit,
        errors,
        touched,
        resetForm,
        setFieldValue,
    } = useFormik({
        initialValues: {
            products: [],
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }
    });

    React.useEffect(() => {
        if (viewFeaturedproduct.length > 0 && viewProductsData.length > 0) {
            const selectedIds = viewFeaturedproduct.map(p => p._id);
            const selectedObjs = viewProductsData.filter(p =>
                selectedIds.includes(p.productdetails?._id)
            );

            setSelectedProduct(selectedObjs);
            setFieldValue('products', selectedIds);
        }
    }, [viewFeaturedproduct, viewProductsData, setFieldValue]);

    const handleSubject = async (value) => {
        try {
            await dispatch(addFeaturerdProducts(value));
        } catch (error) {
            Toastify.error(error.message);
        }
    };

    const handleProductChange = (event) => {
        const selectedIds = event.target.value;
        const selectedObjs = viewProductsData.filter(p =>
            selectedIds.includes(p.productdetails?._id)
        );

        setSelectedProduct(selectedObjs);
        setFieldValue('products', selectedIds);
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(
            p => p.productdetails?._id !== productId
        );

        setSelectedProduct(updatedProducts);
        setFieldValue(
            'products',
            updatedProducts.map(p => p.productdetails?._id)
        );
    };

    const selectedIds = selectedProducts.map(p => p.productdetails?._id);

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
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            multiple
                            name='products'
                            value={selectedIds}
                            onChange={handleProductChange}
                            renderValue={(selected) =>
                                selected.length > 0
                                    ? selected.map(id => {
                                        const product = viewProductsData.find(
                                            p => p.productdetails?._id === id
                                        );
                                        return product?.productdetails?.productName;
                                    }).join(', ')
                                    : "Select Products"
                            }
                            MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: 500,
                                    '& .MuiMenuItem-root.Mui-selected::before': {
                                      content: 'none',
                                    },
                                  },
                                },
                                MenuListProps: {
                                  component: 'ul',
                                },
                              }}
                              sx={{
                                ...SelectStyle,
                                '& .MuiSelect-select': {
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  MozAppearance: 'none',
                                },
                              }}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {viewProductsData.map((product) => {
                                const productId = product?.productdetails?._id;
                                return (
                                    <MenuItem
                                        key={productId}
                                        value={productId}
                                        sx={{
                                            padding: '8px 16px',
                                            minHeight: 'auto'
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedIds.indexOf(productId) > -1}
                                            sx={{ padding: '4px' }}
                                        />
                                        <ListItemText
                                            primary={product?.productdetails?.productName}
                                            primaryTypographyProps={{
                                                fontSize: 12,
                                                fontFamily: "Poppins",
                                                fontWeight: 400,
                                            }}
                                        />
                                    </MenuItem>
                                );
                            })}
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
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, width: '100%', flexWrap: 'wrap' }}>
                        {selectedProducts?.map((item) => (
                            <div className={appearancStyle.categoriesStyle} key={item.productdetails?._id}>
                                <div className={appearancStyle.textStyle}>
                                    {item?.productdetails?.productName}
                                </div>
                                <div onClick={() => handleRemoveProduct(item.productdetails?._id)}>
                                    <CancelCateIcon />
                                </div>
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
                    <Button sx={custom} onClick={resetForm}>
                        Cancel
                    </Button>
                    <Button sx={saveChanges} onClick={handleSubmit}>Save Changes</Button>
                </Box>
            </CustomAccordion>
        </div >
    );
}
