import React from 'react'
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


const EditCoupon = () => {
    const navigate = useNavigate();
    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        img: yup.array().min(1, "Image is required"),
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
            status: "",
            img: [],
            details: {
                discountType: ''
            }
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    const handleSubject = async (values) => {
        // dispatch(addCategories(values));
        navigate('/categories/Category')
    };
    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {

    //         const body = new FormData()
    //         body.set('image', file)
    //         const { data, status } = await api.fileUpload(body)
    //         if (status === 200) {
    //             setFieldValue("img", data.data)
    //         }
    //     }
    // };
    const handleCheck = (e) => {
        setFieldValue('details.noLimits', e.target.checked);
        // if (e.target.checked) {
        //     setFieldValue('details.usageLimits', '');
        // }
    };
    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Edit Coupons</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Coupons" subType="Edit Coupons" />
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
                </Box>
                <div style={{ marginTop: 20 }}>
                    <label className={categoryStyle.label}>Description</label>
                    <br />
                    {/* <div className={categoryStyle.descriptionBox}> */}
                    <TextField
                        type='text'
                        onBlur={handleBlur}
                        value={values.na}
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

                    <div className={values.details.discountType === 'FIXED' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('details.discountType', 'FIXED')}
                    >
                        {values.details.discountType === 'FIXED' ? (
                            <ActivePriceDiscount />
                        ) :
                            <InActivePriceDiscount />
                        }

                        <p>
                            Fixed Discount
                        </p>
                    </div>
                    <div className={values.details.discountType === 'PERCENTAGE' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('details.discountType', 'PERCENTAGE')}
                    >
                        {values.details.discountType === 'PERCENTAGE' ? (
                            <ActivePercentageDiscount />
                        ) :
                            <InActivePercentageDiscount />
                        }
                        <p>
                            Percentage Discount
                        </p>
                    </div>
                    <div className={values.details.discountType === 'BANK' ?
                        couponStyle.activeBox : couponStyle.inActiveBox
                    }
                        onClick={() => setFieldValue('details.discountType', 'PERCENTAGE')}
                    >
                        {values.details.discountType === 'PERCENTAGE' ? (
                            <ActiveBankDiscount />
                        ) :
                            <InActiveBankDiscount />
                        }
                        <p>
                            Bank Discount
                        </p>
                    </div>
                    {
                        errors.details?.discountType && touched.details?.discountType && <p style={{ color: "red", fontSize: "12px" }}>{errors.details?.discountType}</p>
                    }
                </div>
                <div className={couponStyle.couponTypeStyle} style={{ marginTop: 20, }}>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Discount Value</label>
                        <br />
                        <div className={couponStyle.inputbox}>
                            <div className={couponStyle.inrBox}>
                                {values.details.discountType === 'FIXED' ? 'INR' : '%'}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder={values.details.discountType === 'FIXED' ? 'Amount' : 'Enter'}
                                    onBlur={handleBlur}
                                    value={values.details.discountValue}
                                    name='details.discountValue'
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (values.details.discountType === 'PERCENTAGE') {
                                            // Ensure the value is a number and within 0-100 range for percentage
                                            if (!isNaN(value) && value >= 0 && value <= 100) {
                                                setFieldValue('details.discountValue', value);
                                            }
                                        } else {
                                            setFieldValue('details.discountValue', value);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {
                            errors.details?.discountValue && touched.details?.discountValue && <p style={{ color: "red", fontSize: "12px" }}>{errors.details?.discountValue}</p>
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
                            name='status'
                            value={values.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className={couponStyle.couponTypeStyle} style={{ marginTop: 20, }}>
                    <div style={{ width: '50%' }}>
                        <label className={categoryStyle.label}>Minimum checkout value</label>
                        <br />
                        <div className={couponStyle.inputbox}>
                            <div className={couponStyle.inrBox}>
                                {values.details.discountType === 'FIXED' ? 'INR' : '%'}
                            </div>
                            <input
                                type="text"
                                placeholder={values.details.discountType === 'FIXED' ? 'Amount' : 'Enter'}
                                onBlur={handleBlur}
                                value={values.details.discountValue}
                                name='details.discountValue'
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (values.details.discountType === 'PERCENTAGE') {
                                        // Ensure the value is a number and within 0-100 range for percentage
                                        if (!isNaN(value) && value >= 0 && value <= 100) {
                                            setFieldValue('details.discountValue', value);
                                        }
                                    } else {
                                        setFieldValue('details.discountValue', value);
                                    }
                                }}
                            />
                        </div>
                        {
                            errors.details?.discountValue && touched.details?.discountValue && <p style={{ color: "red", fontSize: "12px" }}>{errors.details?.discountValue}</p>
                        }
                    </div>
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
                            errors.details?.discountValue && touched.details?.discountValue && <p style={{ color: "red", fontSize: "12px" }}>{errors.details?.discountValue}</p>
                        }
                        <div className={couponStyle.settingLimitStyle} style={{ marginTop: 5,marginLeft:-10 }}>
                            <CustomizedCheckbox
                                handleCheck={handleCheck}
                                checked={values.details.noLimits}
                                disabled={values.details.usageLimits}
                            />
                            <p className={couponStyle.limitText}>Don't set duration</p>
                        </div>
                    </div>
                    <div style={{  width: '50%' }}>
                        <label className={categoryStyle.label}>Usage limits</label>
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
                        <div className={couponStyle.settingLimitStyle} style={{ marginTop: 5,marginLeft:-10 }}>
                            <CustomizedCheckbox
                                handleCheck={handleCheck}
                                checked={values.details.noLimits}
                                disabled={values.details.usageLimits}
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

export default EditCoupon;