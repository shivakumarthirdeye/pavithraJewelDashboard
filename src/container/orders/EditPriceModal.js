import React, { useEffect, useState } from 'react';
import Styles from '../../component/styles.module.css';
import { Box, Button, MenuItem, Modal, Select, TextField } from '@mui/material';
import { CancelIcon, CrossIcon } from '../../svg';
import { cancle, fieldText, formselect, save, saveData } from '../../MaterialsUI';
import { useFormik } from 'formik';
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import productStyle from '../../container/product/product.module.css';
import orderStyle from './orders.module.css'
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

const EditPriceModal = ({ open, onClose, data }) => {
    const dispatch = useDispatch()

    const schema = yup.object().shape({
        comment: yup.string().required("Comment is required"),
        rating: yup.string().required("Rating is required"),
    })

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
            comment: "",
            rating: 0,
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            // handleEdit(values)
            onClose()
        }

    })
    console.log('data============', values);

    useEffect(() => {
        if (data) {
            setValues(data)
        }
    }, [data, setValues])

    // const handleEdit = (val) => {
    //     dispatch(editReviews({ url: `${data._id}`, val }))
    // }


    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        border: "none",
        padding: "27px 22px",
        height: "fit-content",
        display: "block",
        width: '420px',
        borderRadius: '7px',
        "&:focus": {
            outline: "none",
        },
        overflowY: 'auto',
        maxHeight: '100vh',
        // overflowX: 'none'
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className={Styles.notification}>
                    <div className={Styles.notifText}>
                        Edit Price
                    </div>
                    <div className={Styles.notificationAll} onClick={onClose}>
                        <CancelIcon />
                    </div>
                </div>
                <div className={orderStyle.jwelleryDetails}>
                    <img src='/necklash.png' alt='Jwellery' style={{ width: 126, height: 102, objectFit: 'cover' }} />
                    <div>
                        <p className={orderStyle.jwelleryText}>Jumka</p>
                        <p className={orderStyle.priceText}>₹585.00</p>
                    </div>
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Weight</label>
                    <br />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        sx={formselect}
                        IconComponent={(props) => (
                            <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                        )}
                        displayEmpty
                        defaultValue=''
                        name='category'
                        value={values.category}
                    // onChange={handleCategoryChange}
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="PUBLISHED">Increased</MenuItem>
                        <MenuItem value="STOCKOUT">Decreased</MenuItem>
                    </Select>
                    {
                        errors.category && touched.category && <p style={{ color: "red", fontSize: "12px" }}>{errors.category}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Gold weight(g)**</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="name"
                        value={values.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Pending Price*</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="name"
                        value={values.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Notes to customer*</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="name"
                        value={values.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                    }
                </div>
                <div className={orderStyle.buttonStyle} style={{ marginTop: 10 }}>
                        <Button sx={cancle} variant="contained" onClick={resetForm} disableElevation={true}>Clear</Button>
                    
                        <Button sx={saveData} variant="contained" onClick={handleSubmit} disableElevation={true}>Update</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default EditPriceModal;