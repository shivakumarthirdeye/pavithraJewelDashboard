import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { MailBoxIcon, } from '../../svg';
import { inputText, save } from '../../MaterialsUI';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/loginSlice';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const schema = yup.object().shape({
        email: yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
    });

    const {
        errors, values, handleChange, touched, handleBlur, handleSubmit
    } = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
               const result = await dispatch(forgotPassword(values));
               unwrapResult(result)
                console.log("hii logged in successfully")
                navigate('/login/resendConfirmation');
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
                <img src="/logo.png" alt="Container" className={styles.imgView} />
            </div>
            <div className={styles.login}>
                <div className={styles.content} style={{paddingLeft:60,paddingRight:60}}>
                    <h3 style={{ paddingBottom: 20,paddingTop:50 }}>Forgot password</h3>
                    <p>Enter the registered email id</p>

                    <Box component="form" noValidate autoComplete="off" >
                        <div className={styles.labelText} style={{ marginTop: 40 }}>Email address</div>
                        <div >
                            <TextField
                                id="email"
                                // label="Email"
                                variant="outlined"
                                placeholder='Email'
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                // helperText={touched.email && errors.email}
                                fullWidth
                                sx={inputText}
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="flex-start" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                // onClick={() => setShowPassword(!showPassword)}
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-start",
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                {<MailBoxIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        
                        
                        {/* <div className={styles.bottomLine} /> */}
                        <Button sx={save} onClick={handleSubmit} style={{marginTop:30}}>
                            {loading ? (
                                <CircularProgress size={25} thickness={4.5} sx={{ color: "#fff" }} />
                            ) : "Submit"}
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
