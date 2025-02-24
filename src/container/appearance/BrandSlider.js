import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import { Box, Button, TextField } from '@mui/material';
import { custom, saveChanges, TextInput } from '../../MaterialsUI';
import { DeletIcon, PlusIcon } from '../../svg';
import appearancStyle from './appearance.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { addBrandSlider, getBrandSlider } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function BrandSlider() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { brandSliderData } = useSelector((state) => state.appearance)
    // console.log('brandSliderData', brandSliderData);

    React.useEffect(() => {
        dispatch(getBrandSlider())
    }, [dispatch])

    const schema = yup.object().shape({
        brandSliders: yup.array().min(1, "At least one slider is required"), // Ensure there's at least one slider
    });

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        resetForm
    } = useFormik({
        initialValues: {
            brandSliders: []
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addBrandSlider(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }

    React.useEffect(() => {
        if (brandSliderData.length > 0) {
            setFieldValue("brandSliders", brandSliderData.map(brand => brand));
        }
    }, [brandSliderData, setFieldValue]);

    React.useEffect(() => {
        if (values.brandSliders.length === 0) {
            setFieldValue("brandSliders", [""]); // Ensures at least one input field
        }
    }, []);
    const handleAddBrandSlider = () => {
        setFieldValue("brandSliders", [...values.brandSliders, ""]);
    };

    const handleRemoveBrandSlider = (index) => {
        const updatedSliders = values.brandSliders.filter((_, i) => i !== index);
        setFieldValue('brandSliders', updatedSliders);
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

                    }}>Brand Slider</Typography>
                </AccordionSummary>
                {values.brandSliders.length > 0 && values.brandSliders.map((brand, index) => (
                    <AccordionDetails
                        key={index}
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
                                Brand Name
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
                                    name={`brandSliders.${index}`} // Correct Formik naming convention
                                    value={values.brandSliders[index] || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={TextInput}
                                />

                                <div className={appearancStyle.deleteBackgroundStyle} onClick={() => handleRemoveBrandSlider(index)}>
                                    <DeletIcon />
                                </div>
                            </div>
                            {errors.brandSliders?.[index] && touched.brandSliders?.[index] && (
                                <p style={{ color: "red", fontSize: "12px" }}>
                                    {errors.brandSliders[index]}
                                </p>
                            )}
                        </Box>
                    </AccordionDetails>
                ))}
                <div className={appearancStyle.addBackgroundStyle} onClick={handleAddBrandSlider} style={{marginLeft:20}}>
                    <PlusIcon />
                </div>
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
