import React, { useCallback, useEffect, useState } from 'react';
import styles from './login.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { HidePasswordIcon, LockIcon, PasswordVisible } from '../../svg';
import { inputText, save } from '../../MaterialsUI';
import { resetPassword } from '../../redux/loginSlice';
import { jwtDecode } from 'jwt-decode';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    console.log('location', location);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const schema = yup.object().shape({
        password: yup.string()
            .required("Password is required"),
        confirmPassword: yup.string()
            .required("Confirmed password is required"),
        token: yup.string().required('Token is required')
    });

    const {
        errors, values, handleChange, touched, handleBlur, handleSubmit, setFieldValue
    } = useFormik({
        initialValues: {
            password: '',
            token: '',
            confirmPassword: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleLogin(values)
        }
    });

    console.log('valuesssssssss', values);

    const handleLogin = useCallback(async (values) => {
        setLoading(true);
        try {
            const result = await dispatch(resetPassword(values));
            unwrapResult(result)
            // console.log("hii logged in successfully")
            navigate('/');// Navigate to home or dashboard after login
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const tokenFromUrl = pathParts[pathParts.length - 1];
    
        console.log('Extracted token from URL:', tokenFromUrl);
    
        if (tokenFromUrl) {
            try {
                const decoded = jwtDecode(tokenFromUrl);
                console.log('Decoded token:', decoded);
                setFieldValue('token', decoded.token || tokenFromUrl); // Fallback if decoded token is not structured
            } catch (error) {
                console.warn('Not a JWT or failed to decode. Using raw token.', error);
                setFieldValue('token', tokenFromUrl); // Use raw token directly
            }
        }
    }, [location.pathname, setFieldValue]);
    

    return (
        <div className={styles.main}>
            <div className={styles.mainContainer}>
                <img src="/logo.png" alt="Container" className={styles.imgView} />
            </div>
            <div className={styles.login}>
                <div className={styles.content}>
                    <h3 style={{ paddingBottom: 20 }}>Reset Password!</h3>

                    <Box component="form" noValidate autoComplete="off" >
                        <div className={styles.labelText} style={{ marginTop: 20 }}>New password</div>
                        <div>
                            <TextField
                                placeholder='Enter'
                                id="password"
                                // label="Password"
                                // variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                // error={touched.password && Boolean(errors.password)}
                                // helperText={touched.password && errors.password}
                                fullWidth
                                sx={inputText}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="flex-end" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-end",
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                {showPassword ? <PasswordVisible /> : < HidePasswordIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    startAdornment: (
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
                                                {<LockIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {
                                errors.password && touched.password && <div className={styles.errorMessage}>{errors.password}</div>
                            }
                        </div>
                        <div className={styles.labelText} style={{ marginTop: 20 }}>Confirm New Password</div>
                        <div style={{ marginBottom: 40 }}>
                            <TextField
                                placeholder='Enter'
                                id="password"
                                // label="Password"
                                // variant="outlined"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                // error={touched.password && Boolean(errors.password)}
                                // helperText={touched.password && errors.password}
                                fullWidth
                                sx={inputText}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="flex-end" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-end",
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                {showConfirmPassword ? <PasswordVisible /> : < HidePasswordIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    startAdornment: (
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
                                                {<LockIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {
                                errors.confirmPassword && touched.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>
                            }
                        </div>
                        <Button sx={save} onClick={handleSubmit} color='#E87819'>
                            {loading ? (
                                <CircularProgress size={25} thickness={4.5} sx={{ color: "#fff" }} />
                            ) : "Save"}
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
