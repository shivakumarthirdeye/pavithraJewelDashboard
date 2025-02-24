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
import { AddIcon, CancelCateIcon, DeletIcon } from '../../svg';
import appearancStyle from './appearance.module.css'
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addCounters, getCounters } from '../../redux/appearanceSlice';

const CustomAccordion = styled(Accordion)(({ theme }) => ({

    backgroundColor: '#fff',
    boxShadow: 'none',
    border: '1px solid #E0E2E7',
    borderRadius: '8px !important',
    // '&:before': { display: 'none' }, // Hides the default divider line
    width: '70%',
    overflow: 'visible',
}));
export default function Counters() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { countersData } = useSelector((state) => state.appearance);
    const viewCounters = countersData?.data?.counters;

    React.useEffect(() => {
        dispatch(getCounters())
    }, [dispatch])

    const schema = yup.object().shape({
        counters: yup.array().of(
            yup.object().shape({
                name: yup.string().required("Name is required"),
                counts: yup.number().typeError("Count must be a number").min(1, "Count is required"),
            })
        ).min(1, "At least one counter is required"),
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
        setValues
    } = useFormik({
        initialValues: {
            counters: [
                {
                    name: '',
                    counts: 0,
                }
            ]
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    React.useEffect(() => {
        if (viewCounters) {
            setValues({
                counters: viewCounters.map(item => ({
                    name: item?.name || '',
                    counts: item?.counts || 0,
                }))
            });
        }
    }, [viewCounters, setValues]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addCounters(value))

            unwrapResult(resultAction)

            navigate("/appearance/Appearance")
        } catch (error) {
            toast.error(error.message)
        }

    }
    const handleAddHeroBanner = () => {
        setFieldValue('counters', [
            ...values.counters,
            { name: '', counts: 0, }
        ]);
    };
    const handleRemoveCounter = (index) => {
        const updatedSliders = values.counters.filter((_, i) => i !== index);
        setFieldValue('counters', updatedSliders);
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

                    }}>Counters</Typography>
                </AccordionSummary>
                {values?.counters?.map((count, index) => (
                    <AccordionDetails
                        sx={{
                            backgroundColor: '#F8F9FF',
                            // width:'100%',
                            height: 'fit-content',
                            padding: '18px 29px',
                            margin: "0px 20px 20px 19px"
                        }}
                    >
                        <Box sx={{
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{ width: '50%' }}>
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
                                    Name
                                </Typography>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name={`counters[${index}].name`}
                                    value={count.name || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={TextInput}
                                />
                                {errors.counters?.[index]?.name && touched.counters?.[index]?.name && (
                                    <div style={{ color: "red" }}>{errors.counters[index].name}</div>
                                )}
                            </div>
                            <div style={{ width: '50%' }}>
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
                                    Counts
                                </Typography>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name={`counters[${index}].counts`}
                                    value={count.counts || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={TextInput}
                                />
                                {errors.counters?.[index]?.counts && touched.counters?.[index]?.counts && (
                                    <div style={{ color: "red" }}>{errors.counters[index].counts}</div>
                                )}
                            </div>
                            <div
                                className={appearancStyle.deleteBackgroundStyle}
                                onClick={() => handleRemoveCounter(index)}
                                style={{ marginTop: 30 }}
                            >
                                <DeletIcon />
                            </div>
                        </Box>

                    </AccordionDetails>
                ))}
                <div
                    className={appearancStyle.addButtonStyle}
                    onClick={handleAddHeroBanner}
                    style={{ marginTop: 30,marginLeft:20 }}
                >
                    <AddIcon /><span> Counter</span>
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
