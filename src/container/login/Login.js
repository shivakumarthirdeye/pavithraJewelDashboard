import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { HidePasswordIcon, LockIcon, MailBoxIcon, PasswordVisible } from '../../svg';
import { inputText, save } from '../../MaterialsUI';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/loginSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const schema = yup.object().shape({
        email: yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
        password: yup.string()
            .required("Password is required")
    });

    const {
        errors, values, handleChange, touched, handleBlur, handleSubmit
    } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await dispatch(login(values));
                // console.log("hii logged in successfully")
                navigate('/dashboard');
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
                    <h3 style={{ paddingBottom: 20 }}>Hi, Welcome Back!</h3>
                    <p>Login to you account to enjoy</p>

                    <Box component="form" noValidate autoComplete="off" >
                        <div className={styles.labelText} style={{ marginTop: 40 }}>Email address</div>
                        <div >
                            <TextField
                                id="outlined-error"
                                // label="Email"
                                // label="Outlined" 
                                variant="outlined"
                                placeholder='Email'
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                                // helperText={touched.email && errors.email}
                                fullWidth
                                sx={inputText}
                                InputProps={{
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
                                                {<MailBoxIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        {
                            errors.email && touched.email && <div className={styles.errorMessage}>{errors.email}</div>
                        }
                        <div className={styles.labelText} style={{ marginTop: 20 }}>Password</div>
                        <div>
                            <TextField
                                placeholder='Password'
                                id="password"
                                // label="Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
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
                        </div>
                        {
                            errors.password && touched.password && <div className={styles.errorMessage}>{errors.password}</div>
                        }
                        <div className={styles.forgotText} onClick={() => navigate('/login/forgotPassword')}>
                            Forgot your password?
                        </div>
                        <div className={styles.bottomLine} />
                        <Button sx={save} onClick={handleSubmit}>
                            {loading ? (
                                <CircularProgress size={25} thickness={4.5} sx={{ color: "#fff" }} />
                            ) : "Log In"}
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default Login;
