import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import categoryStyle from '../category/category.module.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, TextField } from '@mui/material';
import { cancle, saveData, TextArea } from '../../MaterialsUI';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { addCategories } from '../../redux/categoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { addTermsCondition, getTermsCondition } from '../../redux/terms&ConditionSlice';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';
import axios from 'axios';
import Toastify from '../../helper/Toastify';
import api from '../../helper/Api';

let Font = Quill.import('attributors/style/font');
Font.whitelist = ['Rubik'];

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register(Font, true);

const AddTermsCondition = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const quillRef = useRef(null)
    const { termsConditionData } = useSelector((state) => state.termscondition)
    console.log('termsConditionData', termsConditionData);
    

    React.useEffect(() => {
        dispatch(getTermsCondition())
    }, [dispatch])

    const schema = yup.object().shape({
        termsAndCondition: yup.string().required("Terms and Conditions are required"),
    })

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setValues,
        setFieldValue,
        resetForm
    } = useFormik({
        initialValues: {
            termsAndCondition: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            dispatch(addTermsCondition(values))
        }

    })
    React.useEffect(() => {
        if (termsConditionData) {
            setValues({
                termsAndCondition: termsConditionData?.termsAndCondition,
            })
        }
    }, [termsConditionData, setValues])
    const imageHandler = async () => {

        const input = document.createElement('input')

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            let file = input.files[0];

            try {
                if (file.size > 100000000) {
                    Toastify.error("Error occured", "Please upload file of less than 1 mb")
                } else {
                    const body = {
                        key: `${Date.now()}_${file.name}`,
                        fileName: file.name,
                    }
                    const { data, status } = await api.getPutSignedUrl(body);
                    if (status === 200) {
                        await axios.put(data.data?.preSigned, file, {
                            headers: {
                                "Content-Type": file.type
                            }
                        })
                        const range = quillRef.current.getEditorSelecton();
                        var res = data?.data?.url;

                        quillRef.current.getEditor().insertEmbed(range.index, 'image', res);
                    }

                }
            } catch (err) {
                console.log(err)
                Toastify.error("Error occured", "File upload error")
            }
        };
    }
    const modules = useMemo(() => ({

        toolbar: {
            container: [
                [{ 'font': Font.whitelist }, { 'size': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            'handlers': {
                image: imageHandler
            },
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        },
        blotFormatter: {}
    }), []);

    var formats = [
        "header", "height", "bold", "italic",
        "underline", "strike", "blockquote",
        "list", "color", "bullet", "indent",
        "link", "image", "align", "size", "formula", "width", "style"
    ];

    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={categoryStyle.container}>
                <div>
                    <div>
                        <h2 className={categoryStyle.categoryText}>Terms And Conditions</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Terms&Conditions" subType="Add Terms&Conditions" />
                </div>
            </div>
            <div className={categoryStyle.entryView} style={{ marginTop: 30 }}>
                <div className={categoryStyle.variationStyle}>
                    <h6 className={categoryStyle.variationText}>
                        Terms And Conditions
                    </h6>

                    <div style={{ marginTop: 20 }}>
                        <label className={categoryStyle.label}>Terms and conditions</label>
                        <br />
                        <ReactQuill
                            // ref={quillRef}
                            value={values.termsAndCondition}
                            onChange={(event,) => {
                                setFieldValue('termsAndCondition', event);
                            }}
                            modules={modules}
                            formats={formats}
                            placeholder="Type terms and condition here..."
                            style={{ borderRadius: 20 }}
                        />
                        {
                            errors.termsAndCondition && touched.termsAndCondition && <p style={{ color: "red", fontSize: "12px" }}>{errors.termsAndCondition}</p>
                        }
                    </div>

                    <div className={categoryStyle.buttons} style={{ marginTop: 20 }}>
                        <Button sx={cancle} onClick={resetForm} variant="contained" disableElevation={true}>Cancel</Button>

                        <Button sx={saveData} onClick={handleSubmit} variant="contained" disableElevation={true}>Save Changes</Button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTermsCondition;