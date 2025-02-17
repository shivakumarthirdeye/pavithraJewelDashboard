import React, { useState } from 'react'
import settingStyle from '../container/settings/settings.module.css'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from "yup";
import { changePassword } from '../redux/settingSlice';
import { useDispatch } from 'react-redux';
import { fieldText } from '../MaterialsUI';
import { HidePassword, HidePasswordIcon, PasswordVisible } from '../svg';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const schema = yup.object().shape({
        currentPassword: yup.string().required("Current Password is required"),
        password: yup.string().required("New Password is required"),
        confirmPassword: yup.string().required("Confirm Password is required"),        
    })

    const {
        errors,
        values,
        handleChange,
        touched,
        handleBlur,
        handleSubmit,
    } = useFormik({
        initialValues: {
            currentPassword: "",
            password: "",
            confirmPassword: '',
        },
        validationSchema: schema,
        onSubmit: (values) => {
            updateSubject(values);
        }
    })


    const updateSubject = async (values) => {
        dispatch(changePassword(values))
    }
    return (
        <div><div className={settingStyle.updatePassword}>Update Password</div>
            <div style={{ width: '50%', paddingTop: 20 }}>
                <label className={settingStyle.labelStyle}>Old password</label>
                <div>
                    <TextField
                        placeholder='Password'
                        id="password"
                        // label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={fieldText}
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
                                            marginRight:'-10px'
                                        }}
                                        disableRipple // disables ripple effect for a cleaner loo
                                    >
                                        {showPassword ? <PasswordVisible /> : < HidePasswordIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),

                        }}
                    />
                    {
                        errors.currentPassword && touched.currentPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.currentPassword}</p>
                    }
                </div>
            </div>
            <div className={settingStyle.cardContainer}>
                <div style={{ width: '50%', paddingTop: 20 }}>
                    <label className={settingStyle.labelStyle}>New password</label>
                    <div>
                        <TextField
                            placeholder='Password'
                            id="password"
                            // label="Password"
                            variant="outlined"
                            type={showNewPassword ? 'text' : 'password'}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={fieldText}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="flex-end" sx={{
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'transparent'
                                        }
                                    }}>
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            // edge="end"
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: "none",
                                                display: 'flex',
                                                justifyContent: "flex-end",
                                                marginRight:'-10px'
                                            }}
                                            disableRipple // disables ripple effect for a cleaner loo
                                        >
                                            {showNewPassword ? <PasswordVisible /> : < HidePasswordIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),

                            }}
                        />
                        {
                        errors.password && touched.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>
                    }
                    </div>
                </div>
                <div style={{ width: '50%', paddingTop: 20 }}>
                    <label className={settingStyle.labelStyle}>Confirm new password</label>
                    <div>
                        <TextField
                            placeholder='Password'
                            id="password"
                            // label="Password"
                            variant="outlined"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={fieldText}
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
                                                border: "none",
                                                display: 'flex',
                                                justifyContent: "flex-end",
                                                marginRight:'-10px'
                                            }}
                                            disableRipple // disables ripple effect for a cleaner loo
                                        >
                                            {showConfirmPassword ? <PasswordVisible /> : < HidePasswordIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),

                            }}
                        />
                        {
                        errors.confirmPassword && touched.confirmPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.confirmPassword}</p>
                    }
                    </div>
                </div>
            </div>
            <div className={settingStyle.saveButton} onClick={handleSubmit}>
                <p> Save Password</p>
            </div>
        </div>
    )
}

export default ChangePassword