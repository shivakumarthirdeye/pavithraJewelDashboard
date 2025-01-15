import React, { useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import productStyle from './product.module.css';
import { ImageIcon, } from '../../svg';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Checkbox, IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { selectForm, formselect, inputText, fieldText, } from '../../MaterialsUI';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import api from '../../helper/Api';
import { useDispatch, useSelector } from 'react-redux';
import { addProducts } from '../../redux/productSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Toastify from '../../helper/Toastify';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { toast } from 'react-toastify';
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { CheckBox } from '@mui/icons-material';
import CustomizedCheckbox from '../../component/CustomizedCheckbox';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';

let Font = Quill.import('attributors/style/font');
Font.whitelist = ['Rubik'];

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register(Font, true);
const EditProduct = () => {
    const quillRef = useRef(null)
    const selectedImage = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const attributData = useSelector((state) => state.products)
    // const getCategoriesData = useSelector((state) => state.subCategories);
    // const categoryData = getCategoriesData?.catData?.data;
    // const subCateData = attributData.subCatData.data
    // const {supplierList} = useSelector((state) => state.suppliers)
    // const {attributeList} = useSelector((state => state?.attribute))



    const schema = yup.object().shape({
        productName: yup.string().required("Product name is required"),
        status: yup.string().required("Status is required"),
        description: yup.string().required("Description is required"),
        fabricDetails: yup.string().required("Fabric details are required"),
        tags: yup.string().required("Tags are required"),
        basePrice: yup.number().typeError("Base Price must be a number").min(1, "Base Price is required"),
        salePrice: yup.number().typeError("Sale Price must be a number").min(1, "Sale Price is required"),
        discountType: yup.string().required("Discount Type is required"),
        discountValue: yup.number().typeError("Discount Value be a number").min(1, "Discount Value is required"),
        // medias: yup.array().min(1, "At least one image is required"),
        featuredImage: yup.string().required("At least one image is required"),
        variations: yup.array().of(
            yup.object().shape({
                name: yup.string().required("Variation Type is required"),
                // type: yup.string().required("Variation Type is required"),
                // value: yup.array().of(yup.string().required()).min(1, "At least one image is required")
            })
        ).min(1, "At least one variation is required"),
        variationInventory: yup.array().of(
            yup.object().shape({
                SKU: yup.string().required("SKU is required"),
                additionalPrice: yup.number().typeError("Additional Price must be a number").required("Additional Price is required"),
                quantity: yup.number().typeError("Quantity must be a number").min(1, "Quantity is required"),
                color: yup.string().nullable().notRequired(),
                size: yup.string().nullable().notRequired(),
                images: yup.array().of(
                    yup.string().url().required("Image must be a valid URL")
                ).min(1, "At least one image is required"),
            })
        ).min(1, "At least one variation is required"),
        // discountStartDate: yup.date().required("Start Date is required"),
        // discountEndDate: yup.date().required("End Date is required"),
        category: yup.string().required("Category is required"),
        subCategory: yup.string().required("Subcategory is required"),
        GST: yup.number().typeError("GST must be a number").min(1, "GST is required"),
        productId: yup.string().required("Product ID is required"),
        supplier: yup.string().required("Supplier is required"),
        stockQuantity: yup.number().typeError("Stock Quantity must be a number").min(1, "Stock Quantity is required"),
        productDimensions: yup.object().shape({
            weight: yup.number().typeError("Weight must be a number").min(1, "Weight is required"),
            height: yup.number().typeError("Height must be a number").min(1, "Height is required"),
            length: yup.number().typeError("Length must be a number").min(1, "Length is required"),
            width: yup.number().typeError("Width must be a number").min(1, "Width is required"),
        }),
    });


    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
    } = useFormik({
        initialValues: {
            productName: "",
            // medias: [],
            description: "",
            fabricDetails: "",
            tags: "",
            features: {
                itemWeight: 0,
                stoneWeight: 0,
                stoneColor: '',
                productWidth: 0,
                productHeight: 0,
                feature: ''
            },
            media: {
                photo: [],
                video: []
            },
            metalType: '',
            pricing: {
                totalWeight: {
                    value: 0,
                    status: false
                },
                goldWeight: {
                    value: 0,
                    status: false
                },
                goldRate: {
                    value: 0,
                    status: false
                },
                makingCharges: {
                    value: 0,
                    status: false
                },
                stoneType: {
                    value: 0,
                    status: false
                },
                stoneCharges: {
                    value: 0,
                    status: false
                },
                diamondCarat: {
                    value: 0,
                    status: false
                },
                diamondPerCarat: {
                    value: 0,
                    status: false
                },
                diamondCost: {
                    value: 0,
                    status: false
                },
                polkiCarat: {
                    value: 0,
                    status: false
                },
                polkiPerCarat: {
                    value: 0,
                    status: false
                },
                polkiCost: {
                    value: 0,
                    status: false
                },
                gst: {
                    value: 0,
                    status: false
                },
                finalSalePrice: {
                    value: 0,
                    status: false
                },
            },
            discount: {
                discountValue: 0,
                discountStartdate: null,
                discountEnddate: null,
            },
            inventory: {
                totalstock: 0,
            },
            status: "",
            // variations:
            //     [{
            //         type: '',
            //         value: [],
            //         name: ''
            //     }],
            shipping: {
                weight: 0,
                height: 0,
                length: 0,
                width: 0,
            },
            category: {
                productCategory: '',
                productSubcategory: ''
            },
            gold: {
                type: "",
                orderType: ""
            },
            featurerdImage: [],
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addProducts(value))

            unwrapResult(resultAction)

            navigate("/product/Product")
        } catch (error) {
            toast.error(error.message)
        }

    }


    const handleFeatureImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {

            const body = new FormData()
            body.set('image', file)
            const { data, status } = await api.fileUpload(body)
            if (status === 200) {
                const imageUrl = Array.isArray(data.data) ? data.data[0] : data.data;
                setFieldValue("featuredImage", imageUrl);  // Store only the string
            }
        }
    };
    const calculateSalePrice = (basePrice, discountType, discountValue) => {
        let salePrice = 0;
        if (discountType === 'PERCENTAGE') {
            salePrice = basePrice - (basePrice * (discountValue / 100));
        } else if (discountType === 'FIXED') {
            salePrice = basePrice - discountValue;
        }
        setFieldValue('salePrice', parseFloat(salePrice.toFixed(2)));  // Update the sale price in the form
        setFieldValue("GST", salePrice * 18 / 100)
    };
    // Remove a variation

    const handleCategoryChange = (event) => {
        const selectedAttributeId = event.target.value; // This will be the base ID of the selected category
        setFieldValue("category", selectedAttributeId); // Update the formik state with the base ID

        setFieldValue("subCategory", []);
    };
    const handleSubcategoryChange = (event, index) => {
        const selectedValues = event.target.value;

        setFieldValue("subCategory", selectedValues);
    };
    // Add Variation



    // Function to calculate total stock
    const calculateTotalStock = () => {
        const totalStock = values.variationInventory.reduce((total, inventory) => {
            return total + (Number(inventory.quantity) || 0); // Ensure quantity is a number
        }, 0);
        setFieldValue("stockQuantity", totalStock);
    };

    // Use useEffect to recalculate total stock whenever variationInventory changes
    useEffect(() => {
        calculateTotalStock(); // Recalculate total stock whenever variationInventory changes
    }, [values.variationInventory]); // Listen to changes in variationInventory

    const handleDimensionChange = (e, dimensionType) => {
        const { value } = e.target;
        const numericValue = value ? parseFloat(value) : '';
        // Use Formik's setFieldValue to update the specific dimension
        setFieldValue(`productDimensions.${dimensionType}`, numericValue);
    };

    //Media Image
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const body = new FormData();
            body.append('image', file);

            try {
                const { data, status } = await api.fileUpload(body);
                if (status === 200) {
                    const imageUrl = Array.isArray(data.data) ? data.data[0] : data.data;
                    // Update medias array by spreading existing values and adding the new imageUrl
                    setFieldValue('medias', [...(values.medias || []), imageUrl]);
                } else {
                    console.error(`Upload failed with status: ${status}`);
                }
            } catch (error) {
                console.error('Error uploading file:', error.response ? error.response.data : error.message);
            }
        }
    };
    // Media Video
    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const body = new FormData();
            body.append('image', file);

            try {
                const { data, status } = await api.fileUpload(body);
                if (status === 200 && data.data) {
                    const videoUrl = Array.isArray(data.data) ? data.data[0] : data.data;
                    // Update medias array by spreading existing values and adding the new videoUrl
                    setFieldValue('medias', [...(values.medias || []), videoUrl]);
                } else {
                    console.error(`Upload failed with status: ${status}`);
                }
            } catch (error) {
                console.error('Error uploading file:', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleGold = (e) => {
        setFieldValue("metalType", values.metalType)
    }

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
                    const formData = new FormData();
                    formData.append("image", file)
                    const { data, status } = await api.fileUpload(formData);

                    const range = quillRef.current.getEditorSelecton();
                    var res = data.data[0];

                    quillRef.current.getEditor().insertEmbed(range.index, 'image', res);
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
    useEffect(() => {
        const quill = quillRef?.current?.getEditor();

        // Function to handle image click
        const handleClick = (evt) => {
            const img = evt.target.closest("img");
            if (img) {
                console.log("first", img)
                selectedImage.current = img;  // Set the selected image
            } else {
                selectedImage.current = null; // Clear the selected image if clicking elsewhere
            }
        };

        // Function to handle keydown event for image deletion
        const checkImage = (evt) => {
            if (selectedImage.current && (evt.keyCode === 46 || evt.keyCode === 8)) { // Delete or Backspace
                // Check if selectedImage.current exists and is a valid Quill image
                const quillImage = Quill.find(selectedImage.current);
                if (quillImage && quillImage.deleteAt) {  // Ensure deleteAt exists on the found element
                    quillImage.deleteAt(0); // Delete the image from the editor
                }
                selectedImage.current = null; // Clear the selected image after deletion
            }
        };

        // Add event listeners
        quill?.root?.addEventListener('click', handleClick);
        document.addEventListener('keydown', checkImage);

        // Cleanup event listeners on component unmount
        return () => {
            quill?.root?.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', checkImage);
        };
    }, []);
    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Add Product</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Product" subType="Edit Product" />
                </div>
                <div className={productStyle.attributeStyle}>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/product/Product')}>
                        <div className={productStyle.addcategoryText}>Back To List</div>
                    </div>
                </div>
            </div>
            <div className={productStyle.entryView} style={{ marginTop: 30 }}>
                <div style={{ width: '70%' }}>
                    {/* General Information */}
                    <div className={productStyle.variationStyle}>
                        <h6 className={productStyle.variationText}>
                            General Information
                        </h6>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Product Name</label>
                            <TextField
                                placeholder='Type product name here. . .'
                                type={'text'}
                                name="name"
                                value={values.name || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={fieldText}
                            />
                            {
                                errors.name && touched.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                            }
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Description</label>
                            <br />
                            <ReactQuill
                                // ref={quillRef}
                                value={values.description}
                                onChange={(event,) => {
                                    setFieldValue('description', event);
                                }}
                                modules={modules}
                                formats={formats}
                                placeholder="Type description here..."
                                style={{ borderRadius: 20 }}
                            />

                            {
                                errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                            }
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Tags</label>
                            <TextField
                                placeholder='Type and add'
                                type={'text'}
                                name="tags"
                                value={values.tags || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={fieldText}
                            />
                            {
                                errors.tags && touched.tags && <p style={{ color: "red", fontSize: "12px" }}>{errors.tags}</p>
                            }
                        </div>
                    </div>

                    {/* Features */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Feature
                        </h6>
                        <div className={productStyle.itemsStyle}>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Item weight</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.itemWeight"
                                    value={values.features.itemWeight || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.itemWeight && touched.features.itemWeight && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.itemWeight}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Stone Weight</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.stoneWeight"
                                    value={values.features.stoneWeight || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.stoneWeight && touched.features.stoneWeight && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.stoneWeight}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Stone color/type</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.stoneColor"
                                    value={values.features.stoneColor || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.features.stoneColor && touched.features.stoneColor && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.stoneColor}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle}>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Product Width</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    cm
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Product Height</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productHeight"
                                    value={values.features.productHeight || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    cm
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productHeight && touched.features.productHeight && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productHeight}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <label className={productStyle.label}>Feature</label>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.feature"
                                    value={values.features.feature || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.features.feature && touched.features.feature && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.feature}</p>
                                } */}
                            </div>
                        </div>

                    </div>
                    {/* Media */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>Media</h6>
                        {/* Photos */}
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Photo</label>
                            <br />
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.featuredImage ? (
                                        <div>
                                            <img
                                                src={values.featuredImage}
                                                alt="Selected"
                                                style={{ maxWidth: '100%', marginTop: '0px' }}
                                            />
                                            {/* <button onClick={handleUpload}>Upload</button> */}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon />
                                            <div>
                                                <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                    Drag and drop image here, or click add image
                                                </p>
                                            </div>
                                            <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="imageFile"
                                                    style={{ display: 'none' }}
                                                    onChange={handleImageChange}
                                                />
                                                <label htmlFor="imageFile" className={productStyle.uploadBox}>
                                                    Add Image
                                                </label>
                                            </div>
                                        </>
                                    )
                                    }

                                </div>
                            </div>
                            {
                                errors.featuredImage && touched.featuredImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featuredImage}</p>
                            }
                        </div>
                        {/* video */}
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Video</label>
                            <br />
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.featuredImage ? (
                                        <div>
                                            <video
                                                src={values.featuredImage}
                                                alt="Selected"
                                                controls
                                                style={{ maxWidth: '100%', marginTop: '0px' }}
                                            />
                                            {/* <button onClick={handleUpload}>Upload</button> */}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon />
                                            <div>
                                                <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                    Drag and drop image here, or click add image
                                                </p>
                                            </div>
                                            <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="videoFile"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFeatureImageChange}
                                                />
                                                <label htmlFor="videoFile" className={productStyle.uploadBox}>
                                                    Add Video
                                                </label>
                                            </div>
                                        </>
                                    )
                                    }

                                </div>
                            </div>
                            {
                                errors.featuredImage && touched.featuredImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featuredImage}</p>
                            }
                        </div>
                    </div>

                    {/* Metal type */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Metal Type
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ justifyContent: 'space-between', marginTop: 20 }}>
                            <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                <CustomizedCheckbox /> <span>Gold</span>
                            </div>
                            <div className={productStyle.checkBoxStyle}>
                                <CustomizedCheckbox /> <span>Diamond</span>
                            </div>
                            <div className={productStyle.checkBoxStyle}>
                                <CustomizedCheckbox /> <span>Polki</span>
                            </div>
                        </div>
                    </div>
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Pricing
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 20 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Total Weight</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Gold weight*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-end",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-10px'
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Gold rate*</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Making charges*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        fontWeight: '400',
                                                        fontFamily: 'Public Sans',
                                                        marginRight: '-15px',
                                                        marginLeft: '-10px',
                                                        color: '#000000',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Stone type</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Stone charges</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Diamond carat*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Diamond per carat*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Diamond cost*</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Polki carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Polki per carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Polki cost</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>GST</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '67%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox /> <span>Final sale price</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="flex-start" sx={{
                                                backgroundColor: 'transparent',
                                                '&:hover': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                                <IconButton
                                                    // edge="end"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        // padding: '8px',
                                                        border: "none",
                                                        display: 'flex',
                                                        justifyContent: "flex-start",
                                                        fontSize: '14px',
                                                        color: '#000000',
                                                        marginLeft: '-10px',
                                                        marginRight: '-15px',
                                                        // marginBottom: '20px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.noteTextStyle}>Note: Select checkbox to show in website</div>
                    </div>
                    {/* Discount */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Discount
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 20 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Discount value in %</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Discount start date</span>
                                </div>
                                <div className={productStyle.calendarBox}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            onChange={(val) => setFieldValue("discountStartDate", val.$d)}
                                            // placeholder={'discountStartDate'}
                                            sx={{
                                                width: '100%',
                                                // borderRadius: 8,
                                                "& .MuiOutlinedInput-root": {
                                                    fontSize: 14,
                                                    color: '#000',
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    borderRadius: 2,
                                                    height: 40, // custom height for the input field
                                                    "& fieldset": {
                                                        borderColor: "#E0E2E7", // Default border color
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#E0E2E7", // Border color on hover
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#E0E2E7", // Border color when focused
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    padding: "1px 12px", // adjust padding inside the input
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#0c0b0b", // Placeholder color
                                                    opacity: 0.7,
                                                    fontSize: 14,
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    letterSpacing: 0.1,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                                {
                                    errors.discountStartDate && touched.discountStartDate && <p style={{ color: "red", fontSize: "12px" }}>{errors.discountStartDate}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} > <span>Discount End Date</span>
                                </div>
                                <div className={productStyle.calendarBox}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            // sx={{ width: 330, borderRadius: 8 }}
                                            onChange={(val) => setFieldValue("discountEndDate", val.$d)}
                                            sx={{
                                                width: '100%',
                                                // borderRadius: 8,
                                                "& .MuiOutlinedInput-root": {
                                                    fontSize: 14,
                                                    color: '#000',
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    borderRadius: 2,
                                                    height: 40, // custom height for the input field
                                                    "& fieldset": {
                                                        borderColor: "#E0E2E7", // Default border color
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#E0E2E7", // Border color on hover
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#E0E2E7", // Border color when focused
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    padding: "1px 12px", // adjust padding inside the input
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#0c0b0b", // Placeholder color
                                                    opacity: 0.7,
                                                    fontSize: 14,
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    letterSpacing: 0.1,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                                {
                                    errors.discountEndDate && touched.discountEndDate && <p style={{ color: "red", fontSize: "12px" }}>{errors.discountEndDate}</p>
                                }
                            </div>
                        </div>
                    </div>
                    {/* Inventory */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Inventory
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 20 }}>
                            <div style={{ width: '50%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Product ID</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '50%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Total Stock</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Shipping
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 20 }}>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle}>
                                    <span>Weight</span>
                                </div>
                                <TextField
                                    placeholder='Product weight...'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.weight && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Height</span>
                                </div>
                                <TextField
                                    placeholder='Height(cm)...'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle}>
                                    <span>Length</span>
                                </div>
                                <TextField
                                    placeholder='Length(cm)...'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle}>
                                    <span>Width</span>
                                </div>
                                <TextField
                                    placeholder='Width(cm)...'
                                    type={'text'}
                                    name="features.productWidth"
                                    value={values.features.productWidth || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors.features.productWidth && touched.features.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors.features.productWidth}</p>
                                } */}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: '30%' }}>
                    <div className={productStyle.thumbanilStyle}>
                        <h6 className={productStyle.variationText}>Category</h6>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Product Category</label>
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
                                name='category'
                                value={values.category}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {/* {categoryData?.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                            {
                                errors.category && touched.category && <p style={{ color: "red", fontSize: "12px" }}>{errors.category}</p>
                            }
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Product Sub-Category</label>
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
                                name='subCategory'
                                value={values.subCategory}
                                onChange={handleSubcategoryChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {/* {subCateData?.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                        </div>
                        {
                            errors.subCategory && touched.subCategory && <p style={{ color: "red", fontSize: "12px" }}>{errors.subCategory}</p>
                        }
                    </div>
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>Featured image</h6>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Photo</label>
                            <br />
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.featuredImage ? (
                                        <div>
                                            <img
                                                src={values.featuredImage}
                                                alt="Selected"
                                                style={{ maxWidth: '100%', marginTop: '0px' }}
                                            />
                                            {/* <button onClick={handleUpload}>Upload</button> */}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon />
                                            <div>
                                                <p className={productStyle.uploadText} style={{ marginTop: 10 }}>
                                                    Drag and drop image here, or click add image
                                                </p>
                                            </div>
                                            <div className={productStyle.pixel} style={{ marginTop: 10 }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="featuredFile"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFeatureImageChange}
                                                />
                                                <label htmlFor="featuredFile" className={productStyle.uploadBox}>
                                                    Add Image
                                                </label>
                                            </div>
                                        </>
                                    )
                                    }

                                </div>
                            </div>
                            {
                                errors.featuredImage && touched.featuredImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featuredImage}</p>
                            }
                        </div>
                    </div>
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <div className={productStyle.catStatusStyle}>
                            <h6 className={productStyle.variationText}>Supplier</h6>

                        </div>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Select Supplier</label>
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
                                name='supplier'
                                value={values.supplier}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {/* {supplierList?.data?.map((item) => (
                                    <MenuItem value={item._id} key={item._id}>{item.name}</MenuItem>
                                ))} */}
                            </Select>
                        </div>
                        {
                            errors.supplier && touched.supplier && <p style={{ color: "red", fontSize: "12px" }}>{errors.supplier}</p>
                        }
                    </div>
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <div className={productStyle.catStatusStyle}>
                            <h6 className={productStyle.variationText}>Status</h6>
                            <div className={productStyle.draftStyle}>
                                Draft
                            </div>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Product Status</label>
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
                                name='status'
                                value={values.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="PUBLISHED">Published</MenuItem>
                                <MenuItem value="STOCKOUT">Out of Stock</MenuItem>
                                <MenuItem value="DRAFT">Draft</MenuItem>
                            </Select>
                        </div>
                        {
                            errors.status && touched.status && <p style={{ color: "red", fontSize: "12px" }}>{errors.status}</p>
                        }
                    </div>
                </div>
            </div>
            <div className={productStyle.saveProductStyle} style={{ marginTop: 20 }}>
                <div className={productStyle.cancelStyle}>
                    Cancel
                </div>
                <div className={productStyle.buttonStyle} onClick={handleSubmit}>
                    <div className={productStyle.addcategoryText}>Save Changes</div>
                </div>
            </div>
        </div>
    )
}

export default EditProduct;