import React, { useEffect, useState } from 'react';
import Styles from '../../component/styles.module.css';
import { Box, Button, Modal } from '@mui/material';
import { CancelIcon, CrossIcon } from '../../svg';
import "./ReviewCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as filledStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { cancle, save } from '../../MaterialsUI';
import { useFormik } from 'formik';
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import productStyle from './product.module.css'
import { editReviews } from '../../redux/ordersSlice';

const EditReview = ({ open, onClose, data }) => {
    const dispatch = useDispatch()

    const schema = yup.object().shape({
        review: yup.string().required("Comment is required"),
        ratings: yup.string().required("Rating is required"),
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
            // orderId: data.orderId,
            // productId: data.productId,
            ratings: 0,
            review: "",
            // images:[]
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleEdit(values)
            onClose()
        }

    })
    console.log('data============', data);

    useEffect(() => {
        if (data) {
            setValues(data)
        }
    }, [data, setValues])

    const handleEdit = (val) => {
        dispatch(editReviews({ url: `${data._id}`, val }))
    }

    // Function to delete an image
    const handleDeleteImage = (index) => {
        const updatedImages = values.images.filter((_, i) => i !== index);
        setFieldValue("images", updatedImages);
    };
    // Function to handle rating change
    const handleRatingChange = (newRating) => {
        // Toggle rating: if the clicked star is already filled, decrease the rating; otherwise, set the new rating
        if (newRating === values.ratings) {
            setFieldValue("ratings", newRating - 1); // Remove one star
        } else {
            setFieldValue("ratings", newRating); // Add stars up to the clicked star
        }
    };
    const fullStars = Math.floor(values.ratings);
    const halfStar = values.ratings % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
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
        width: '520px',
        borderRadius: '7px',
        "&:focus": {
            outline: "none",
        },
        overflowY: 'auto',
        maxHeight: '90vh',
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
                        Edit Review
                    </div>
                    <div className={Styles.notificationAll} onClick={onClose}>
                        <CancelIcon />
                    </div>
                </div>
                <div className="products-info">
                    <img src={values?.productId?.featurerdImage[0]} alt='featuredImage' className="product-image" />
                    <div style={{ marginLeft: 20 }}>
                        <h3 className="product-heading">{values?.productId?.productName}</h3>
                        <p className="product-price">₹{values?.productId?.salePrice} </p>
                    </div>
                </div>
                <div className='reviews' style={{ marginTop: 20 }}>
                    Review
                </div>
                <div>
                    <div className={productStyle.inputbox}>
                        <input type='text' onBlur={handleBlur} value={values.review} placeholder='Type comment name here. . .' name="review" onChange={handleChange} />
                    </div>
                    {
                        errors.review && touched.review && <p style={{ color: "red", fontSize: "12px" }}>{errors.review}</p>
                    }
                </div>
                <div className='reviews' style={{ marginTop: 20 }}>Ratings</div>
                <div className="rating">
                    {[...Array(5)]?.map((_, index) => (
                        <FontAwesomeIcon
                            key={index}
                            icon={index < fullStars ? filledStar : emptyStar}
                            className={`star ${index >= values.ratings ? 'empty-star' : ''}`}
                            color={index < fullStars ? '#FFB400' : '#ddd'}
                            onClick={() => handleRatingChange(index + 1)}
                        />
                    ))}
                </div>
                <div className='reviews' style={{ marginTop: 20 }}>Images</div>
                <div className="review-images" style={{ marginTop: 10 }}>
                    {values?.images?.map((image, index) => (
                        <>

                            <img src={image} alt={`review-${index}`} key={index} className="review-image" />
                            <div className='delete-image' onClick={() => handleDeleteImage(index)}><CrossIcon /></div>
                        </>
                    ))}
                </div>
                <div className="reviewer-Buttons" style={{ marginTop: 20 }}>
                    <div>
                        <Button sx={cancle} variant="contained" onClick={resetForm} disableElevation={true}>Clear</Button>
                    </div>
                    <div>
                        <Button sx={save} variant="contained" onClick={handleSubmit} disableElevation={true}>Update</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default EditReview;