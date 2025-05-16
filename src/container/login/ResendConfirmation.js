import React, { useEffect, useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Divider from '@mui/material/Divider';
import { SuccessfullyIcon } from '../../svg';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/loginSlice';

const ResendConfirmation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('email');
    console.log('email',email);
    
    

    const schema = yup.object().shape({
        email: yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
    });

    const {
         handleSubmit
    } = useFormik({
        initialValues: {
            email: email,
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const result = await dispatch(forgotPassword(values));
                unwrapResult(result)
                // console.log("hii logged in successfully")
                // navigate('/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className={styles.main}>
            <div className={styles.mainContainer}>
                <img src="/pavithrajewelslogo.png" alt="Container" className={styles.imgView} />
            </div>
            <div className={styles.login}>
                <div className={styles.content} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SuccessfullyIcon />
                    <h3 style={{ paddingBottom: 20 }}>Almost There!</h3>
                    <p>Check your email inbox and confirm your account</p>

                    <Divider
                        sx={{
                            width: '100%',
                            borderColor: '#E6E9F4',
                            borderWidth: 1,
                            marginTop: '50px',
                        }} />
                    <p style={{ paddingTop: 20, paddingBottom: 20 }}>
                        Didn’t receive any mail?
                    </p>
                    <div className={styles.resendButtonStyle} onClick={handleSubmit}>
                        Resend Confirmation
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResendConfirmation;
