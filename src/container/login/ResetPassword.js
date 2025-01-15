import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { HidePasswordIcon, LockIcon, PasswordVisible } from '../../svg';
import { inputText, save } from '../../MaterialsUI';
import { resetPassword } from '../../redux/loginSlice';

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const schema = yup.object().shape({
        password: yup.string()
            .required("Password is required"),
        confirmPassword: yup.string()
            .required("Password is required"),
    });

    const {
        errors, values, handleChange, touched, handleBlur, handleSubmit
    } = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await dispatch(resetPassword(values));
                // console.log("hii logged in successfully")
                navigate('/');
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
                                                {<LockIcon/>}
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
                        <div style={{marginBottom:40}}>
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
                                                {<LockIcon/>}
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
