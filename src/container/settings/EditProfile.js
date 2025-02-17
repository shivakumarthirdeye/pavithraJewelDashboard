import React, { useEffect, useState } from 'react';
import { HidePassword, HidePasswordIcon, PasswordVisible, UploadWhiteIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, IconButton, InputAdornment, TextField, } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from "yup";
import settingStyle from './settings.module.css'
import api from '../../helper/Api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';
import Toastify from '../../helper/Toastify';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { fieldText } from '../../MaterialsUI';
import { editProfile } from '../../redux/settingSlice';
import axios from 'axios';
import ChangePassword from '../../component/ChangePassword';



const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { user, } = useSelector((state) => state.user)


    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup
            .string()
            .email("Enter a valid email")
            .required("Email is required"),
        phone: yup
            .string()
            .matches(
                /^[0-9]{10}$/,
                "Primary number must be a valid 10-digit phone number"
            ).required("Phone is required")
    })

    const {
        errors,
        values,
        handleChange,
        touched,
        setValues,
        handleBlur,
        handleSubmit,
        setFieldValue,
    } = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: '',
            profileImg: [],
            recoveryEmail: ''
        },
        validationSchema: schema,
        onSubmit: (values) => {
            setData(values)
            updateSubject(values);
        }
    })


    const updateSubject = async (values) => {
        dispatch(editProfile(values))
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {

                if (user) {
                    console.log(user, "from useEffect");

                    setValues({
                        name: user?.name || "",
                        profileImg: user?.profileImg || [],
                        email: user?.email || "",
                        phone: user?.phone || ""
                    })

                }
            }
            catch (error) {
                console.log("error getting profile data", error)
            }
        }
        fetchProfile()
    }, [dispatch, user, setValues])

    const handleImageChange = async (e, attribute, repo) => {

        const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
        try {
            if (file) {

                const body = {
                    key: `${Date.now()}_${file.name}`,
                    fileName: file.name,
                }

                const { data, status } = await api.getPutSignedUrl(body);
                console.log(data);

                if (status === 200) {
                    await axios.put(data.data?.preSigned, file, {
                        headers: {
                            "Content-Type": file.type
                        }
                    })

                    setFieldValue('profileImg', data?.data?.url)
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };
    //function to show two letters of email

    const maskEmail = (email) => {
        if (!email || typeof email !== 'string') {
            return ""; // Return an empty string or a default masked email if the input is invalid
        }
        const [username, domain] = email?.split("@"); // Split into username and domain
        if (username.length <= 2) {
            // If the username is too short, keep only the first character and mask the rest
            return `${username[0]}***@${domain}`;
        }
        // Otherwise, keep the first two characters and mask the rest
        return `${username.substring(0, 2)}***@${domain}`;
    };

    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <h2 className={settingStyle.categoryText}>Account Settings</h2>
            <CustomSeparator dashboard="Dashboard" type="Account Settings" />
            <div className={settingStyle.cardContainer} style={{ paddingTop: 30 }}>
                <div className={settingStyle.accountCard}>
                    <h3>General Info</h3>
                    <div className={settingStyle.cardContainer} style={{ paddingTop: 20 }}>
                        <div style={{ width: '50%' }}>
                            <label className={settingStyle.labelStyle}>Full name</label>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                value={values.name}
                                placeholder='Enter'
                                name="name"
                                onChange={handleChange}
                                sx={fieldText}
                            />
                            {
                                errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                            }
                        </div>
                        <div style={{ width: '50%' }}>
                            <label className={settingStyle.labelStyle}>Email Id</label>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                value={values.email}
                                placeholder='Enter'
                                name="email"
                                onChange={handleChange}
                                sx={fieldText}
                            />
                            {
                                errors.email && touched.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>
                            }
                        </div>
                    </div>
                    <div className={settingStyle.cardContainer} style={{ paddingTop: 20 }}>
                        <div style={{ width: '50%' }}>
                            <label className={settingStyle.labelStyle}>Phone number</label>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                value={values.phone}
                                placeholder='Enter'
                                name="phone"
                                onChange={handleChange}
                                sx={fieldText}
                            />
                            {
                                errors.phone && touched.phone && <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>
                            }
                        </div>
                        <div style={{ width: '50%' }}>
                            <label className={settingStyle.labelStyle}>Recovery email id</label>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                value={values.recoveryEmail}
                                placeholder='Enter'
                                name="recoveryEmail"
                                onChange={handleChange}
                                sx={fieldText}
                            />
                            {
                                errors.recoveryEmail && touched.recoveryEmail && <p style={{ color: "red", fontSize: "12px" }}>{errors.recoveryEmail}</p>
                            }
                        </div>
                    </div>
                    <div className={settingStyle.saveButton} onClick={handleSubmit}>
                        <p> {loading ? <CircularProgress size="30px" color="inherit" /> : `Edit details`} </p>
                    </div>
                    <div className={settingStyle.bottomLine} />
                    <ChangePassword />
                </div>
                <div className={settingStyle.imageCard}>
                    <label htmlFor="upload-photo" className={settingStyle.uploadOverlay}>
                        {console.log(values.profileImg, "pImage")
                        }
                        {values.profileImg ? (
                            <img src={values.profileImg ? values.profileImg : '/ProfilePhoto.png'} alt="Profile" className={settingStyle.uploadedImage} />
                        ) : (
                            <div className={settingStyle.uploadPlaceholder}>Upload Photo</div>
                        )}
                        <div className={settingStyle.overlayText}><UploadWhiteIcon />Upload Photo</div>
                    </label>
                    <input
                        type="file"
                        id="upload-photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />

                    <p className={settingStyle.imageGuidelines}>
                        Image size 280 x 280, 1MB and image ratio needs to be 1:1
                    </p>
                </div>
            </div>
            {/* <OtpModal
                open={showModal}
                desc={` We have sent you an OTP to your  ${maskEmail(user?.email)}, please check and verify.`}
                closeModal={() => setShowModal(false)}
                data={data}

            /> */}
        </div >
    )
}

export default EditProfile;