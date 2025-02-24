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
import { editPendingPrice } from '../../redux/ordersSlice';

const EditPriceModal = ({ open, onClose, data }) => {
    const dispatch = useDispatch()
    

    const schema = yup.object().shape({
        weigthStatus: yup.string().required("Weigth status is required"),
        extraWeight: yup.string().required("Extra weight is required"),
        pendingAmount: yup.string().required("Pending amount is required"),
        customerNote: yup.string().required("Description is required"),
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
            weigthStatus: "",
            extraWeight: "",
            pendingAmount: "",
            customerNote: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleEdit(values)
            onClose()
        }

    })

    useEffect(() => {
        if (data) {
            setValues({
                pendingAmount:data?.data?.pendingAmount
            })
        }
    }, [data, setValues])

    const handleEdit = (val) => {
        dispatch(editPendingPrice({ url: `${data?.data?._id}`, val }))
    }


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
                    <img src={data?.singleProduct?.productId?.featurerdImage} alt='Jwellery' style={{ width: 126, height: 102, objectFit: 'cover' }} />
                    <div>
                        <p className={orderStyle.jwelleryText}>{data?.singleProduct?.productId?.productName}</p>
                        <p className={orderStyle.priceText}>₹{data?.singleProduct?.sellingPrice}</p>
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
                        name='weigthStatus'
                        value={values.weigthStatus || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="INCREASED">Increased</MenuItem>
                        <MenuItem value="DECREASED">Decreased</MenuItem>
                    </Select>
                    {
                        errors.weigthStatus && touched.weigthStatus && <p style={{ color: "red", fontSize: "12px" }}>{errors.weigthStatus}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Gold weight(g)**</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="extraWeight"
                        value={values.extraWeight || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.extraWeight && touched.extraWeight && <p style={{ color: "red", fontSize: "12px" }}>{errors.extraWeight}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Pending Price*</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="pendingAmount"
                        value={values.pendingAmount || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.pendingAmount && touched.pendingAmount && <p style={{ color: "red", fontSize: "12px" }}>{errors.pendingAmount}</p>
                    }
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={productStyle.label}>Notes to customer*</label>
                    <TextField
                        placeholder='Enter'
                        type={'text'}
                        name="customerNote"
                        value={values.customerNote || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={fieldText}
                    />
                    {
                        errors.customerNote && touched.customerNote && <p style={{ color: "red", fontSize: "12px" }}>{errors.customerNote}</p>
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