import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import categoryStyle from '../category/category.module.css';
import { ActiveBankDiscount, ActivePercentageDiscount, ActivePriceDiscount, ImageIcon, InActiveBankDiscount, InActivePercentageDiscount, InActivePriceDiscount } from '../../svg';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { cancle, fieldText, formselect, saveData, TextArea } from '../../MaterialsUI';
import { ArrowDropDownIcon, CalendarIcon, LocalizationProvider } from '@mui/x-date-pickers';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import couponStyle from './coupon.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import CustomizedCheckbox from '../../component/CustomizedCheckbox';
import { useDispatch } from 'react-redux';
import { addCoupons } from '../../redux/couponSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import Toastify from '../../helper/Toastify';


const AddCoupon = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDatePickerDisabled, setIsDatePickerDisabled] = useState(false);
    const [isUsageLimitDisabled, setIsUsageLimitDisabled] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        code: yup.string().required("Code is required"),
        description: yup.string().required("Description is required"),
        type: yup.string().required("Discount type is required"),
        discountValue: yup.number().min(1, "Discount value is required"),
        minimumCheckoutValue: yup.number().min(1, "Minimum checkout value is required"),
        appliesTo: yup.string().required("Applies to is required"),
        startDate: yup.date().required("Applies to is required"),
        endDate: yup.date().required("Applies to is required"),
    })

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
            name: "",
            description: "",
            code: "",
            type: "",
            discountValue: 0,
            minimumCheckoutValue: 0,
            appliesTo: "",
            startDate: null,
            endDate: null,
            usageLimit: 0,
            noDurationLimit: false,
            noUsageLimit: false
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    console.log('vaslue==========================', values);

    const handleSubject = async (values) => {
        try {
            const resultAction = await dispatch(addCoupons(values))

            unwrapResult(resultAction)

            navigate("/coupons/Coupons")
        } catch (error) {
            Toastify.error(error.message)
        }
    };

    const handleCheck = (e) => {
        const isChecked = e.target.checked
        setFieldValue('noDurationLimit', isChecked);
        setIsDatePickerDisabled(isChecked)
    };
    const handleLimitCheck = (e) => {
        const isChecked = e.target.checked
        setFieldValue('noUsageLimit', isChecked);
        setIsUsageLimitDisabled(isChecked)
    };
    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Add Coupons</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Coupons" subType="Add Coupons" />
                </div>
                <div className={categoryStyle.backToListStyle} onClick={() => navigate('/coupons/Coupons')}>
                    <span>Back to list</span>
                </div>
            </div>
            <div className={couponStyle.couponInfoBox}>
                <h6 className={couponStyle.headingText}>
                    Coupon Information
                </h6>
                <p className={couponStyle.description}>Code will be used by users in checkout</p>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', gap: '20px' }}>
                    <div style={{ marginTop: 20, width: '50%' }}>
                        <label className={categoryStyle.label}>Coupon Name</label>
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder='Enter'
                            name="name"
                            onChange={handleChange}
                            sx={fieldText}
                            style={{
                                fontSize: 12
                            }}
                        />
                        {
                            errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                        }
                    </div>
                    <div style={{ marginTop: 20, width: '50%' }}>
                        <label className={categoryStyle.label}>Coupon Code</label>
                        <TextField
                            type='text'
                            onBlur={handleBlur}
                            value={values.code}
                            placeholder='Enter'
                            name="code"
                            onChange={handleChange}
                            sx={fieldText}
                            style={{
                                fontSize: 12
                            }}
                        />

                        {
                            errors.code && touched.code && <p style={{ color: "red", fontSize: "12px" }}>{errors.code}</p>
                        }
                    </div>
                </Box>
                <div style={{ marginTop: 20 }}>
                    <label className={categoryStyle.label}>Description</label>
                    <br />
                    {/* <div className={categoryStyle.descriptionBox}> */}
                    <TextField
                        type='text'
                        onBlur={handleBlur}
                        value={values.description}
                        placeholder='Enter'
                        name="description"
                        onChange={handleChange}
                        multiline={true}
                        rows={4}
                        sx={TextArea}
                        style={{
                            fontSize: 12
                        }}
                    />
                    {/* </div> */}
                    {
                        errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                    }
                </div>
                <div className={couponStyle.lineStyle} />
                <h6 className={couponStyle.headingText}>
                    Coupon Type
                </h6>
                <p className={couponStyle.description}>Code will be used by users in checkout</p>
                <div className={couponStyle.couponTypeStyle}>

                    <div className={values.type === 'Fixed Discount' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('type', 'Fixed Discount')}
                    >
                        {values.type === 'Fixed Discount' ? (
                            <ActivePriceDiscount />
                        ) :
                            <InActivePriceDiscount />
                        }

                        <p>
                            Fixed Discount
                        </p>
                    </div>
                    <div className={values.type === 'Percentage Discount' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('type', 'Percentage Discount')}
                    >
                        {values.type === 'Percentage Discount' ? (
                            <ActivePercentageDiscount />
                        ) :
                            <InActivePercentageDiscount />
                        }
                        <p>
                            Percentage Discount
                        </p>
                    </div>
                    <div className={values.type === 'Bank Discount' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('type', 'Bank Discount')}
                    >
                        {values.type === 'Bank Discount' ? (
                            <ActiveBankDiscount />
                        ) :
                            <InActiveBankDiscount />
                        }
                        <p>
                            Bank Discount
                        </p>
                    </div>
                    {
                        errors.type && touched.type && <p style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                    }
                </div>
                <div className={couponStyle.couponTypeStyle} style={{ marginTop: 20, }}>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Discount Value</label>
                        <br />
                        <div className={couponStyle.inputbox}>
                            <div className={couponStyle.inrBox}>
                                {values.type === 'Percentage Discount' ? '%' : 'INR'}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder={values.type === 'Percentage Discount' ? 'Enter' : 'Amount'}
                                    onBlur={handleBlur}
                                    value={values.discountValue || ''}
                                    name='discountValue'
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (values.type === 'Percentage Discount') {
                                            // Ensure the value is a number and within 0-100 range for percentage
                                            if (!isNaN(value) && value >= 0 && value <= 100) {
                                                setFieldValue('discountValue', value);
                                            }
                                        } else {
                                            setFieldValue('discountValue', value);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {
                            errors.discountValue && touched.discountValue && <p style={{ color: "red", fontSize: "12px" }}>{errors.discountValue}</p>
                        }
                    </div>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Applies to</label>
                        <br />
                        <Select
                            // className={categoryStyle.formselect}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            sx={formselect}
                            IconComponent={(props) => (
                                <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                            )}
                            displayEmpty
                            defaultValue=''
                            name='appliesTo'
                            value={values.appliesTo}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value='All'>All</MenuItem>
                            <MenuItem value='Checkout'>Checkout</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className={couponStyle.couponTypeStyle} style={{ marginTop: 20, }}>
                    {values.appliesTo ? (
                        <div style={{ width: '50%' }}>
                            <label className={categoryStyle.label}>Minimum checkout value</label>
                            <br />
                            <div className={couponStyle.inputbox}>
                                <div className={couponStyle.inrBox}>
                                    {'INR'}
                                </div>
                                <input
                                    type="number"
                                    placeholder={'Amount'}
                                    onBlur={handleBlur}
                                    value={values.minimumCheckoutValue || ''}
                                    name='minimumCheckoutValue'
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (values.type === 'Percentage Discount') {
                                            // Ensure the value is a number and within 0-100 range for percentage
                                            if (!isNaN(value) && value >= 0 && value <= 100) {
                                                setFieldValue('minimumCheckoutValue', value);
                                            }
                                        } else {
                                            setFieldValue('minimumCheckoutValue', value);
                                        }
                                    }}
                                />
                            </div>
                            {
                                errors.minimumCheckoutValue && touched.minimumCheckoutValue && <p style={{ color: "red", fontSize: "12px" }}>{errors.minimumCheckoutValue}</p>
                            }
                        </div>
                    ) : null}
                    {values.type === 'Bank Discount' ? (
                        <div style={{ width: '50%' }}>
                            <label className={categoryStyle.label}>Bank Card</label>
                            <br />
                            <Select
                                // className={categoryStyle.formselect}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={formselect}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                defaultValue=''
                                name='status'
                                value={values.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </Select>
                        </div>
                    ) : null}
                </div>
                <div className={couponStyle.couponTypeStyle} style={{ marginTop: 20, }}>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Duration (Start and end date) </label>
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateRangePicker
                                calendars={1}
                                onChange={(newValue) => {
                                    const [startDate, endDate] = newValue;
                                    setFieldValue('startDate', startDate ? dayjs(startDate).format('YYYY-MM-DD') : null);
                                    setFieldValue('endDate', endDate ? dayjs(endDate).format('YYYY-MM-DD') : null);
                                }}
                                slots={{ field: SingleInputDateRangeField }}
                                slotProps={{ textField: { InputProps: { endAdornment: <CalendarIcon /> } } }}
                                disablePast={true}
                                disabled={isDatePickerDisabled}
                                sx={{
                                    width: '100%',
                                    height: '40px',
                                    '& .MuiInputBase-root': {
                                        //   p: 1,
                                        fontSize: '14px',
                                        color: '#858D9D',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        height: '40px',
                                        opacity: 1,
                                        borderColor: '#E0E2E7'
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: '#858D9D', // Placeholder color
                                        opacity: 1, // Ensures the color is not transparent
                                    },
                                    '& .MuiInputAdornment-root': {
                                        color: '#858D9D',
                                    },
                                    '& .MuiDateRangePickerDay-root': {
                                        bgcolor: '#e3f2fd',
                                    },
                                    '& .MuiDateRangePickerDay-root.Mui-selected': {
                                        bgcolor: '#E87819',
                                        color: '#fff',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E0E2E7',
                                        color: '#8D8D8D',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E0E2E7',
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        {
                            errors.startDate && touched.startDate && <p style={{ color: "red", fontSize: "12px" }}>{errors.startDate}</p>
                        }
                        <div className={couponStyle.settingLimitStyle} style={{ marginTop: 5, marginLeft: -10 }}>
                            <CustomizedCheckbox
                                handleCheck={handleCheck}
                                checked={values.noDurationLimit}
                                disabled={values.noDurationLimit}
                            />
                            <p className={couponStyle.limitText}>Don't set duration</p>
                        </div>
                    </div>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Usage limits</label>
                        <TextField
                            type='number'
                            onBlur={handleBlur}
                            value={values.usageLimit || ''}
                            placeholder='Enter'
                            name="usageLimit"
                            onChange={handleChange}
                            sx={fieldText}
                            style={{
                                fontSize: 12
                            }}
                            disabled={isUsageLimitDisabled}
                        />
                        {
                            errors.usageLimit && touched.usageLimit && <p style={{ color: "red", fontSize: "12px" }}>{errors.usageLimit}</p>
                        }
                        <div className={couponStyle.settingLimitStyle} style={{ marginTop: 5, marginLeft: -10 }}>
                            <CustomizedCheckbox
                                handleCheck={handleLimitCheck}
                                checked={values.noUsageLimit}
                                disabled={values.noUsageLimit}
                            />
                            <p className={couponStyle.limitText}>Don't limit amount of uses</p>
                        </div>
                    </div>
                </div>
                <div className={categoryStyle.buttons} style={{ marginTop: 20 }}>
                    <Button sx={cancle} onClick={handleSubmit} variant="contained" disableElevation={true}>Cancel</Button>
                    <div>
                        <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCoupon;