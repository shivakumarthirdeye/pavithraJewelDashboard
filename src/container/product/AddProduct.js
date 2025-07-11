import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import productStyle from './product.module.css';
import { CrossIcon, ImageIcon, } from '../../svg';
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
import axios from 'axios';
import { getGoldRate } from '../../redux/dashboardSlice';
import { getCategoriesExport } from '../../redux/categoriesSlice';
import { getSubCategoriesExport } from '../../redux/subCategoriesSlice';
import Delete from '@mui/icons-material/Delete';


let Font = Quill.import('attributors/style/font');
Font.whitelist = ['Rubik'];

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register(Font, true);

const AddProduct = () => {
    const quillRef = useRef(null)
    const selectedImage = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tag, setTag] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const { categoriesExportData } = useSelector(
        (state) => state.categories
    );
    const { subCategoiesExportData } = useSelector(
        (state) => state.subCategories
    );

    //State
    const [filteredSubcategory, setFilteredSubcategories] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [goldRates, setGoldRates] = useState({});

    useEffect(() => {
        dispatch(getCategoriesExport())
    }, [dispatch])

    useEffect(() => {
        dispatch(getSubCategoriesExport())
    }, [dispatch])

    const schema = yup.object().shape({
        productName: yup.string().required("Product name is required"),
        status: yup.string().required("Status is required"),
        // description: yup.string().required("Description is required"),
        // tags: yup
        //     .string()
        //     .required("Tags are required")
        //     .matches(
        //         /^([a-zA-Z0-9]+[\s,]*)+$/,
        //         "Tags must be separated by commas or spaces and contain only alphanumeric characters"
        //     ),
        // featurerdImage: yup.array().min(1, "At least one image is required"),
        featurerdImage: yup.string().required("Image is required"),
        // media: yup.object().shape({
        //     photo: yup.array().min(1, "At least one image is required"),
        //     // video: yup.array().min(1, "At least one video is required")
        // }),
        // discount: yup.object().shape({
        //     discountValue: yup.number().typeError("Discount Value must be a number").min(1, "Discount Value is required"),
        //     discountStartdate: yup.date().required("Start Date is required"),
        //     discountEnddate: yup.date().required("End Date is required"),
        // }),
        // shipping: yup.object().shape({
        //     weight: yup.number().typeError("Weight must be a number").min(1, "Weight is required"),
        //     height: yup.number().typeError("Height must be a number").min(1, "Height is required"),
        //     length: yup.number().typeError("Length must be a number").min(1, "Length is required"),
        //     width: yup.number().typeError("Width must be a number").min(1, "Width is required"),
        // }),
        features: yup.object().shape({
            // itemWeight: yup.number().typeError("Item weight must be a number").min(1, "Item weight is required"),
            // stoneWeight: yup.number().typeError("Stone weight must be a number").min(1, "Stone weight is required"),
            // stoneColor: yup.string().required("Stone color is required"),
            // feature: yup.string().required("feature is required"),
            // productWidth: yup.number().typeError("Product width must be a number").min(1, "Product width is required"),
            productHeight: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Product length must be a number")
                    // .min(1, "Product length is required")
                    .when("status", (status, schema) =>
                        status === "active" ? schema.required("Product length is required") : schema
                    ),
            }),
        }),
        metalType: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(["GOLD", "DIAMOND", "POLKI"], "Invalid metal type selected")
            )
            .min(1, "At least one metal type is required")
            .required("Metal type is required"),
        pricing: yup.object().shape({
            totalWeight: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Total weight must be a number")
                    .when("$status", (status, schema) =>
                        status === "active" ? schema.required("Total weight is required") : schema
                    ),
            }),
            goldWeight: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Gold weight must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("GOLD")
                            ? schema.required("Gold weight is required")
                            : schema
                    ),
            }),
            goldRate: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Gold rate must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("GOLD")
                            ? schema.required("Gold rate is required")
                            : schema
                    ),
            }),
            diamondCarat: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Diamond carat must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("DIAMOND")
                            ? schema.required("Diamond carat is required")
                            : schema
                    ),
            }),
            diamondPerCarat: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Diamond per carat must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("DIAMOND")
                            ? schema.required("Diamond per carat is required")
                            : schema
                    ),
            }),
            polkiCarat: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Polki carat must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("POLKI")
                            ? schema.required("Polki carat is required")
                            : schema
                    ),
            }),
            polkiPerCarat: yup.object().shape({
                value: yup
                    .number()
                    .typeError("Polki per carat must be a number")
                    .when("$metalType", (metalType, schema) =>
                        Array.isArray(metalType) && metalType.includes("POLKI")
                            ? schema.required("Polki per carat is required")
                            : schema
                    ),
            }),
            gst: yup.object().shape({
                value: yup
                    .number()
                    .typeError("GST must be a number")
                    .when("$status", (status, schema) =>
                        status === "active" ? schema.required("GST is required") : schema
                    ),
            }),
        }),

        category: yup.object().shape({
            productCategory: yup.string().required("Category is required"),
        }),

        inventory: yup.object().shape({
            // sku: yup.string().required("Sku is required"),
            totalstock: yup.number().typeError("Total stock must be a number").min(0, "Total stock is required"),
        }),
        gold: yup.object().shape({
            type: yup.string().required("Gold type is required"),
            orderType: yup.string().required("Order type is required"),
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
        resetForm,
        setValues
    } = useFormik({
        initialValues: {
            productName: "",
            description: "",
            tags: [],
            features: {
                itemWeight: {
                    value: 0,
                    status: false
                },
                stoneWeight: {
                    value: 0,
                    status: false
                },
                stoneColor: {
                    value: '',
                    status: false
                },
                productWidth: {
                    value: 0,
                    status: false
                },
                productHeight: {
                    value: 0,
                    status: false
                },
                feature: {
                    value: '',
                    status: false
                },
            },
            media: {
                photo: [],
                video: []
            },
            metalType: [],
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
                    value: '',
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
                sku: null,
                totalstock: 0,
            },
            status: "",
            shipping: {
                weight: 0,
                height: 0,
                length: 0,
                width: 0,
            },
            category: {
                productCategory: '',
                productSubcategory: null
            },
            gold: {
                type: null,
                orderType: ""
            },
            featurerdImage: "",
        },
        validationSchema: schema,


        onSubmit: async (values) => {
            handleSubject(values)
        }

    })

    useEffect(() => {
        if (goldRates?.gst !== undefined) {
            setFieldValue("pricing.gst.value", goldRates.gst);
        }
    }, [goldRates, setFieldValue]);

    const handleSubject = async (value) => {
        try {
            const resultAction = await dispatch(addProducts(value))

            unwrapResult(resultAction)

            navigate("/product/Product")
        } catch (error) {
            toast.error(error.message)
        }

    }

    const handleTag = () => {
        let tags = [];

        if (values.tags.length > 0) {
            tags = [...values.tags];
        }

        if (tag) {
            tags.push(tag)

            setFieldValue("tags", tags);
            setTag("")
        }
    }

    const handleTagRemove = (index) => {
        let tags = [];

        if (values.tags.length > 0) {
            tags = [...values.tags];
        }

        if (tags.length > 0) {
            tags.splice(index, 1)

            setFieldValue("tags", tags);
        }
    }

    // handleCategoryChange
    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value; // Get the selected category ID
        setFieldValue("category.productCategory", selectedCategoryId); // Update the category value in Formik

        // Reset subcategory selection
        setFieldValue("category.productSubcategory", null);

        // Fetch subcategories for the selected category (assuming you have a function to fetch them)
        const filteredSubcategories = subCategoiesExportData?.data?.filter(
            (subCategory) => subCategory.parentId === selectedCategoryId
        );

        // Optionally, update local state if needed for other purposes
        setFilteredSubcategories(filteredSubcategories);
    };

    //handleSubcategoryChange
    const handleSubcategoryChange = (event) => {
        const selectedSubCategoryId = event.target.value;
        setFieldValue("category.productSubcategory", selectedSubCategoryId); // Update the subcategory value in Formik
    };

    //Media Image
    const handleImageChange = async (e, index) => {
        const files = e.target?.files; // Get all selected files
        // if (!files) return;

        try {
            if (files) {
                const uploadedImages = []; // Temporary array to store image URLs
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const body = {
                        key: `${Date.now()}_${file.name}`,
                        fileName: file.name,
                    };

                    const { data, status } = await api.getPutSignedUrl(body);
                    if (status === 200) {
                        await axios.put(data.data?.preSigned, file, {
                            headers: {
                                "Content-Type": file.type,
                            },
                        });

                        const imageUrl = data?.data?.url;
                        uploadedImages.push(imageUrl); // Add uploaded image URL to the array
                    }
                }

                // Update medias.photo by appending new images
                setFieldValue('media.photo', [...(values.media.photo || []), ...uploadedImages]);
                // setTimeout(() => {
                //     e.target.value = null; // Reset input value
                //   }, 100);
            }   // Reset input value to allow selecting more images

        } catch (err) {
            console.error(err);
            Toastify.error("Error uploading images");
        }
    };
    // const handleImageChange = async (e, index, values) => {
    //     const files = e.target?.files; // Get all selected files
    //     if (!files || files.length === 0) return;

    //     try {
    //         const uploadedImages = []; // Temporary array to store uploaded image URLs

    //         for (const file of files) {
    //             const body = {
    //                 key: `${Date.now()}_${file.name}`,
    //                 fileType: file.type,
    //                 fileName: file.name,
    //             };

    //             const { data, status } = await api.getPutSignedUrl(body);

    //             if (status === 200) {
    //                 await axios.put(data.data?.preSigned, file, {
    //                     headers: { "Content-Type": file.type },
    //                 });

    //                 uploadedImages.push(data?.data?.url); // Add the uploaded image URL to the array
    //             }
    //         }

    //         // Add the uploaded images to the product at the specified index
    //         const updatedProducts = values?.map((product, idx) =>
    //             index === idx
    //                 ? {
    //                       ...product,
    //                       images: [...(product.images || []), ...uploadedImages], // Append new images
    //                   }
    //                 : product
    //         );

    //         setFieldValue("media.photo", updatedProducts);

    //         console.log("Uploaded Images:", uploadedImages);
    //     } catch (err) {
    //         console.error("Error uploading files", err);
    //         toast.error("Error uploading files");
    //     }
    // };


    // Media Video
    const handleVideoChange = async (e, attribute, repo) => {

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

                    setFieldValue('media.video', [...(values.media.video || []), data?.data?.url])
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };

    //Metal Type
    const handleGold = (e, name) => {
        const isChecked = e.target.checked;

        // Update metalType array in Formik's state
        setFieldValue(
            "metalType",
            isChecked
                ? [...values.metalType, name] // Add the selected metal
                : values.metalType.filter((type) => type !== name) // Remove the unselected metal
        );
    };

    //pricing
    const handleCheckTotalWeight = (e) => {
        setFieldValue('pricing.totalWeight.status', e.target.checked);
    };
    const handleCheckGoldWeight = (e) => {
        setFieldValue('pricing.goldWeight.status', e.target.checked);
    };
    const handleCheckGoldRate = (e) => {
        setFieldValue('pricing.goldRate.status', e.target.checked);
    };
    const handleCheckMakingCharges = (e) => {
        setFieldValue('pricing.makingCharges.status', e.target.checked);
    };
    const handleCheckStoneType = (e) => {
        setFieldValue('pricing.stoneType.status', e.target.checked);
    };
    const handleCheckStoneCharges = (e) => {
        setFieldValue('pricing.stoneCharges.status', e.target.checked);
    };
    const handleCheckDiamondCarat = (e) => {
        setFieldValue('pricing.diamondCarat.status', e.target.checked);
    };
    const handleCheckDiamondPerCarat = (e) => {
        setFieldValue('pricing.diamondPerCarat.status', e.target.checked);
    };
    const handleCheckDiamondCost = (e) => {
        setFieldValue('pricing.diamondCost.status', e.target.checked);
    };
    const handleCheckPolkiCarat = (e) => {
        setFieldValue('pricing.polkiCarat.status', e.target.checked);
    };
    const handleCheckPolkiPerCarat = (e) => {
        setFieldValue('pricing.polkiPerCarat.status', e.target.checked);
    };
    const handleCheckPolkiCost = (e) => {
        setFieldValue('pricing.polkiCost.status', e.target.checked);
    };
    const handleCheckGst = (e) => {
        setFieldValue('pricing.gst.status', e.target.checked);
    };
    const handleCheckFinalSalePrice = (e) => {
        setFieldValue('pricing.finalSalePrice.status', e.target.checked);
    };

    //handleCheckFeatures
    const handleCheckItemWeight = (e) => {
        setFieldValue('features.itemWeight.status', e.target.checked);
    };
    const handleCheckStoneWeight = (e) => {
        setFieldValue('features.stoneWeight.status', e.target.checked);
    };
    const handleCheckStoneColor = (e) => {
        setFieldValue('features.stoneColor.status', e.target.checked);
    };
    const handleCheckProductWidth = (e) => {
        setFieldValue('features.productWidth.status', e.target.checked);
    };
    const handleCheckProductHeight = (e) => {
        setFieldValue('features.productHeight.status', e.target.checked);
    };
    const handleCheckFeature = (e) => {
        setFieldValue('features.feature.status', e.target.checked);
    };

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

    //Featured Image
    const handleFeatureImageChange = async (e, attribute, repo) => {

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

                    setFieldValue('featurerdImage', data?.data?.url)
                }
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error uploading file")
        }
    };

    const handleDeleteFeaturedImage = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            const urlParts = values.featurerdImage.split('/');
            const key = urlParts[urlParts.length - 1];

            const { status } = await api.deleteImage({ key });
            if (status === 200) {
                setFieldValue('featurerdImage', '');
                Toastify.success("Image deleted successfully");
            }
        } catch (err) {
            console.log(err);
            Toastify.error("Error deleting image");
        } finally {
            setIsDeleting(false);
        }
    };


    const handleDeleteImage = (imageUrl, imgIndex) => {
        // Remove the selected image by filtering it out from the media.photo array
        const updatedImages = values.media.photo.filter((_, index) => index !== imgIndex);

        // Update the state with the new array
        setFieldValue("media.photo", updatedImages);
    };
    const metalTypeData = [
        {
            id: 0,
            name: 'GOLD',
            label: 'Gold'
        },
        {
            id: 1,
            name: 'DIAMOND',
            label: 'Diamond'
        },
        {
            id: 2,
            name: 'POLKI',
            label: 'Polki'
        },
    ]


    // Assuming you fetch the gold rates from your API and update the state
    const fetchGoldRates = async () => {
        try {
            const response = await dispatch(getGoldRate()); // Replace with your API endpoint
            const data = response.payload.data;
            console.log('data==================', data);

            setGoldRates({
                k22: data.k22,
                k18: data.k18,
                gst: data.gst
            });
        } catch (error) {
            console.error("Error fetching gold rates:", error);
        }
    };

    // Call this function on component mount or when required
    useEffect(() => {
        fetchGoldRates();
    }, []);

    // Function to calculate gold cost
    const calculateGoldCost = (goldType, goldWeight) => {
        console.log('goldType,goldWeight', goldType, goldWeight);

        const rate = goldRates[goldType] || 0; // Use the appropriate gold rate (k22 or k18)
        return goldWeight ? goldWeight * rate : 0;
    };

    // // // Example: Update gold cost whenever `goldType` or `goldWeight` changes
    useEffect(() => {
        // Only calculate if we have valid gold rates and weight
        if (values.gold.type && values.pricing.goldWeight.value) {
            const goldCost = calculateGoldCost(values.gold.type, values.pricing.goldWeight.value);
            setFieldValue("pricing.goldRate.value", goldCost);
        }
    }, [values.gold.type, values.pricing.goldWeight.value, goldRates, setFieldValue]);

    // // // Example: Update gold cost whenever `diamond` or `diamond cost` changes
    useEffect(() => {
        if (values.pricing.diamondCarat.value && values.pricing.diamondPerCarat.value) {
            const diamondCost = values.pricing.diamondCarat.value * values.pricing.diamondPerCarat.value;
            setFieldValue("pricing.diamondCost.value", diamondCost); // Set calculated cost
        }
    }, [values.pricing.diamondCarat.value, values.pricing.diamondPerCarat.value, setFieldValue]);

    useEffect(() => {
        if (values.pricing.polkiCarat.value && values.pricing.polkiPerCarat.value) {
            const polkiCost = values.pricing.polkiCarat.value * values.pricing.polkiPerCarat.value;
            setFieldValue("pricing.polkiCost.value", polkiCost); // Set calculated cost
        }
    }, [values.pricing.polkiCarat.value, values.pricing.polkiPerCarat.value, setFieldValue]);



    useEffect(() => {
        if (
            values?.pricing?.goldWeight?.value ||
            values?.pricing?.goldRate?.value ||
            values?.pricing?.stoneCharges?.value ||
            values?.pricing?.makingCharges?.value ||
            values?.pricing?.diamondCost?.value ||
            values?.pricing?.polkiCost?.value
        ) {
            // ✅ Calculate gold price
            const goldRate = values?.pricing?.goldRate?.value || 0;
            // const goldPrice = goldWeight * goldRate; // ✅ Corrected

            // ✅ Calculate making charges (percentage of goldPrice, NOT goldRate)
            const makingChargesPercentage = values?.pricing?.makingCharges?.value || 0;
            const makingCharges = (goldRate * makingChargesPercentage) / 100;

            // ✅ Calculate subtotal (before GST)
            const stoneCharges = values?.pricing?.stoneCharges?.value || 0;
            const diamondCost = values?.pricing?.diamondCost?.value || 0;
            const polkiCost = values?.pricing?.polkiCost?.value || 0;

            const subtotal = goldRate + makingCharges + stoneCharges + diamondCost + polkiCost;

            // ✅ Apply GST correctly
            const gstPercentage = goldRates?.gst || 0;
            const gstAmount = (subtotal * gstPercentage) / 100; // ✅ Corrected GST calculation

            const finalSalePrice = subtotal + gstAmount; // ✅ Add GST separately

            // ✅ Update form values
            setFieldValue('pricing.finalSalePrice.value', finalSalePrice.toFixed(2));
        }
    }, [
        values?.pricing?.goldWeight?.value,
        values?.pricing?.goldRate?.value,
        values?.pricing?.diamondCost?.value,
        values?.pricing?.polkiCost?.value,
        values?.pricing?.makingCharges?.value,
        values?.pricing?.stoneCharges?.value,
        goldRates?.gst,
        setFieldValue
    ]);

    const handleDeleteVideo = () => {
        setFieldValue('media.video', ''); // or null, depending on how you handle it
    };

    return (
        <div style={{ marginTop: 50, padding: 20 }}>
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Add Product</h2>
                    </div>
                    <CustomSeparator dashboard="Dashboard" type="Product" subType="Add Product" />
                </div>
                <div className={productStyle.attributeStyle}>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/product/Product')}>
                        <span className={productStyle.addcategoryText}>Back To List</span>
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
                            <label className={productStyle.label}>Product Name*</label>
                            <TextField
                                placeholder='Type product name here. . .'
                                type={'text'}
                                name="productName"
                                value={values.productName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={fieldText}
                            />
                            {
                                errors.productName && touched.productName && <p style={{ color: "red", fontSize: "12px" }}>{errors.productName}</p>
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

                            {/* {
                                errors.description && touched.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                            } */}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Tags</label>
                            <div style={{ display: "flex", gap: 10 }}>

                                <TextField
                                    placeholder='Type and add'
                                    name='tags'
                                    type={'text'}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // Add your action here
                                            handleTag();
                                        }
                                    }}
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)} // Update currentTag value

                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                <div className={productStyle.buttonStyle} onClick={handleTag}>
                                    <div className={productStyle.addcategoryText}>Add</div>
                                </div>
                            </div>



                            {
                                values.tags?.length > 0 && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 15 }}>
                                    {
                                        values.tags.map((tag, index) => (
                                            <div key={index} style={{ background: "rgb(224, 224, 224)", padding: "5px 10px", borderRadius: 20, color: "rgb(51, 51, 51)", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                                                {tag}

                                                <div style={{ display: "flex", alignItems: "center" }} onClick={() => handleTagRemove(index)}>
                                                    <Delete style={{ fontSize: "18px" }} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }


                            {/* {
                                errors.tags && touched.tags && <p style={{ color: "red", fontSize: "12px" }}>{errors.tags}</p>
                            } */}
                        </div>
                    </div>

                    {/* Features */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Feature
                        </h6>
                        <div className={productStyle.itemsStyle}>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckItemWeight} checked={values.features.itemWeight.status} /> <span>Item weight</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="features.itemWeight.value"
                                    value={values.features.itemWeight.value || ''}
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
                                    errors?.features?.itemWeight && touched?.features?.itemWeight && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.itemWeight}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckStoneWeight} checked={values.features.stoneWeight.status} /> <span>Stone Weight</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="features.stoneWeight.value"
                                    value={values.features.stoneWeight.value || ''}
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
                                    errors?.features?.stoneWeight && touched?.features?.stoneWeight && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.stoneWeight}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckStoneColor} checked={values.features.stoneColor.status} /> <span>Stone color/type</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.stoneColor.value"
                                    value={values.features.stoneColor.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.features?.stoneColor && touched?.features?.stoneColor && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.stoneColor}</p>
                                } */}
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle}>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckProductWidth} checked={values.features.productWidth.status} /> <span>Product Width</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="features.productWidth.value"
                                    value={values.features.productWidth.value || ''}
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
                                    errors?.features?.productWidth && touched?.features?.productWidth && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.productWidth}</p>
                                } */}
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckProductHeight} checked={values.features.productHeight.status} /> <span>Product Length</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="features.productHeight.value"
                                    value={values.features.productHeight.value || ''}
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
                                {
                                    errors?.features?.productHeight?.value && touched?.features?.productHeight?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.productHeight?.value}</p>
                                }
                            </div>
                            <div style={{ marginTop: 20, width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckFeature} checked={values.features.feature.status} /> <span>Feature</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="features.feature.value"
                                    value={values.features.feature.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.features?.feature && touched?.features?.feature && <p style={{ color: "red", fontSize: "12px" }}>{errors?.features?.feature}</p>
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
                                    <>
                                        {values?.media?.photo?.length > 0 ? (
                                            <div className={productStyle.imageContainer}>
                                                {values?.media?.photo?.map((image, imgIndex) => (
                                                    <div key={imgIndex} className={productStyle.imageWrapper}>
                                                        <div
                                                            className={productStyle.deleteImageStyles}
                                                            style={{ zIndex: 1 }}
                                                            onClick={() => handleDeleteImage(image, imgIndex)} // Pass inventoryIndex and image URL to delete function
                                                        >
                                                            <CrossIcon />  {/* This is the delete icon */}
                                                        </div>
                                                        <img src={image} alt="Uploaded" className={productStyle.inventoryImage} />

                                                    </div>
                                                ))}
                                                {/* <img
                                                src={values.media.photo}
                                                alt="Selected"
                                                style={{ maxWidth: '100%', marginTop: '0px', width: '50px', height: '50px' }}
                                            /> */}
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
                                                        // value={values.imageFile}
                                                        multiple
                                                    />
                                                    <label htmlFor="imageFile" className={productStyle.uploadBox}>
                                                        Add Image
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </>

                                </div>
                            </div>
                            {/* {
                                errors?.media?.photo && touched?.media?.photo && <p style={{ color: "red", fontSize: "12px" }}>{errors?.media?.photo}</p>
                            } */}
                        </div>
                        {/* video */}
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Video</label>
                            <br />
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.media?.video?.length ? (
                                        <div className={productStyle.imageWrapper}>
                                            <div
                                                className={productStyle.deleteImageStyles}
                                                style={{ zIndex: 1, marginTop: 10 }}
                                                onClick={handleDeleteVideo} // Pass inventoryIndex and image URL to delete function
                                            >
                                                <CrossIcon />  {/* This is the delete icon */}
                                            </div>
                                            <video
                                                src={values.media.video}
                                                alt="Selected"
                                                controls
                                                style={{ maxWidth: '100%', marginTop: '0px', width: '100%', height: '200px' }}
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
                                                    accept="video/*"
                                                    id="videoFile"
                                                    style={{ display: 'none' }}
                                                    onChange={handleVideoChange}
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
                            {/* {
                                errors?.media?.video && touched?.media?.video && <p style={{ color: "red", fontSize: "12px" }}>{errors?.media?.video}</p>
                            } */}
                        </div>
                    </div>

                    {/* Metal type */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Metal Type*
                        </h6>
                        <div style={{ display: 'flex', width: '70%', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                            {metalTypeData?.map((item, index) => (

                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }} key={index}>
                                    <CustomizedCheckbox
                                        handleCheck={(e) => handleGold(e, item?.name)}
                                        checked={values.metalType?.includes(item?.name)}
                                    />
                                    <span style={{ textTransform: 'capitalize' }}>{item.label}</span>
                                </div>

                            ))}
                        </div>
                        {
                            errors?.metalType && touched?.metalType && <p style={{ color: "red", fontSize: "12px" }}>{errors?.metalType}</p>
                        }
                    </div>

                    {/* pricing */}
                    <div className={productStyle.variationStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>
                            Pricing
                        </h6>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 20 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckTotalWeight} checked={values.pricing.totalWeight.status} /> <span>Total Weight</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.totalWeight.value"
                                    value={values.pricing.totalWeight.value || ''}
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
                                                        marginRight: '-10px',
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {
                                    errors?.pricing?.totalWeight?.value && touched?.pricing?.totalWeight?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.totalWeight?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckGoldWeight} checked={values.pricing.goldWeight.status} /> <span>Gold weight*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.goldWeight.value"
                                    value={values.pricing.goldWeight.value || ''}
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
                                                        marginRight: '-10px',
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    grams
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {
                                    errors?.pricing?.goldWeight?.value && touched?.pricing?.goldWeight?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.goldWeight?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckGoldRate} checked={values.pricing.goldRate.status} /> <span>Gold rate*</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type='number'
                                    name="pricing.goldRate.value"
                                    value={values.pricing.goldRate.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        readOnly: true,
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
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />

                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckMakingCharges} checked={values.pricing.makingCharges.status} /> <span>Making charges in %*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.makingCharges.value"
                                    value={values.pricing.makingCharges.value || ''}
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
                                                    %
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {/* {
                                    errors?.pricing?.makingCharges?.value && touched?.pricing?.makingCharges?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.makingCharges?.value}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckStoneType} checked={values.pricing.stoneType.status} /> <span>Stone type</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="pricing.stoneType.value"
                                    value={values.pricing.stoneType.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                />

                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckStoneCharges} checked={values.pricing.stoneCharges.status} /> <span>Stone charges</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.stoneCharges.value"
                                    value={values.pricing.stoneCharges.value || ''}
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

                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckDiamondCarat} checked={values.pricing.diamondCarat.status} /> <span>Diamond carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.diamondCarat.value"
                                    value={values.pricing.diamondCarat.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {
                                    errors?.pricing?.diamondCarat?.value && touched?.pricing?.diamondCarat?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.diamondCarat?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckDiamondPerCarat} checked={values.pricing.diamondPerCarat.status} /> <span>Diamond per carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type='number'
                                    name="pricing.diamondPerCarat.value"
                                    value={values.pricing.diamondPerCarat.value || ''}
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
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {
                                    errors?.pricing?.diamondPerCarat?.value && touched?.pricing?.diamondPerCarat?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.diamondPerCarat?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckDiamondCost} checked={values.pricing.diamondCost.status} /> <span>Diamond cost</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type='number'
                                    name="pricing.diamondCost.value"
                                    value={values.pricing.diamondCost.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        readOnly: true,
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
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckPolkiCarat} checked={values.pricing.polkiCarat.status} /> <span>Polki carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="pricing.polkiCarat.value"
                                    value={values.pricing.polkiCarat.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {
                                    errors?.pricing?.polkiCarat?.value && touched?.pricing?.polkiCarat?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.polkiCarat?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckPolkiPerCarat} checked={values.pricing.polkiPerCarat.status} /> <span>Polki per carat</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="pricing.polkiPerCarat.value"
                                    value={values.pricing.polkiPerCarat.value || ''}
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
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                                {
                                    errors?.pricing?.polkiPerCarat?.value && touched?.pricing?.polkiPerCarat?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.polkiPerCarat?.value}</p>
                                }
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckPolkiCost} checked={values.pricing.polkiCost.status} /> <span>Polki cost</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type={'number'}
                                    name="pricing.polkiCost.value"
                                    value={values.pricing.polkiCost.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    InputProps={{
                                        readOnly: true,
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
                                                        marginBottom: '2px'
                                                    }}
                                                    disableRipple // disables ripple effect for a cleaner loo
                                                >
                                                    Rs.
                                                </IconButton>
                                            </InputAdornment>
                                        ),

                                    }}
                                />
                            </div>
                        </div>
                        <div className={productStyle.itemsStyle} style={{ marginTop: 10 }}>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckGst} checked={values.pricing.gst.status} /> <span>GST in %</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    // type={'number'}
                                    // name="pricing.gst.value"
                                    value={values.pricing.gst.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors?.pricing?.gst?.value && touched?.pricing?.gst?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.gst?.value}</p>
                                } */}
                            </div>
                            <div style={{ width: '67%' }}>
                                <div className={productStyle.checkBoxStyle} style={{ marginLeft: -10 }}>
                                    <CustomizedCheckbox handleCheck={handleCheckFinalSalePrice} checked={values.pricing.finalSalePrice.status} /> <span>Final sale price*</span>
                                </div>
                                <TextField
                                    placeholder='auto'
                                    type={'number'}
                                    // name="pricing.finalSalePrice.value"
                                    value={values.pricing.finalSalePrice.value || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    // disabled
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
                                                        marginBottom: '2px'
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
                                    errors?.pricing?.finalSalePrice?.value && touched?.pricing?.finalSalePrice?.value && <p style={{ color: "red", fontSize: "12px" }}>{errors?.pricing?.finalSalePrice?.value}</p>
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
                                    type={'number'}
                                    name="discount.discountValue"
                                    value={values.discount.discountValue || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors?.discount?.discountValue && touched?.discount?.discountValue && <p style={{ color: "red", fontSize: "12px" }}>{errors?.discount?.discountValue}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Discount start date</span>
                                </div>
                                <div className={productStyle.calendarBox}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            onChange={(val) => setFieldValue("discount.discountStartdate", val.$d)}
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
                                {/* {
                                    errors.discountStartDate && touched.discountStartDate && <p style={{ color: "red", fontSize: "12px" }}>{errors.discountStartDate}</p>
                                } */}
                            </div>
                            <div style={{ width: '33%' }}>
                                <div className={productStyle.checkBoxStyle} > <span>Discount End Date</span>
                                </div>
                                <div className={productStyle.calendarBox}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            // sx={{ width: 330, borderRadius: 8 }}
                                            onChange={(val) => setFieldValue("discount.discountEnddate", val.$d)}
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
                                {/* {
                                    errors.discountEndDate && touched.discountEndDate && <p style={{ color: "red", fontSize: "12px" }}>{errors.discountEndDate}</p>
                                } */}
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
                                    <span>Product ID(optional)</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'text'}
                                    name="inventory.sku"
                                    value={values.inventory.sku || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}

                                />
                                {/* {
                                    errors?.inventory?.sku && touched?.inventory?.sku && <p style={{ color: "red", fontSize: "12px" }}>{errors?.inventory?.sku}</p>
                                } */}
                            </div>
                            <div style={{ width: '50%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Total Stock*</span>
                                </div>
                                <TextField
                                    placeholder='Enter'
                                    type={'number'}
                                    name="inventory.totalstock"
                                    value={values.inventory.totalstock || 0}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                    fullWidth
                                />
                                {
                                    errors?.inventory?.totalstock && touched?.inventory?.totalstock && <p style={{ color: "red", fontSize: "12px" }}>{errors?.inventory?.totalstock}</p>
                                }
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
                                    type={'number'}
                                    name="shipping.weight"
                                    value={values.shipping.weight || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.shipping?.weight && touched?.shipping?.weight && <p style={{ color: "red", fontSize: "12px" }}>{errors?.shipping?.weight}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle} >
                                    <span>Height</span>
                                </div>
                                <TextField
                                    placeholder='Height(cm)...'
                                    type={'number'}
                                    name="shipping.height"
                                    value={values.shipping.height || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.shipping?.height && touched?.shipping?.height && <p style={{ color: "red", fontSize: "12px" }}>{errors?.shipping?.height}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle}>
                                    <span>Length</span>
                                </div>
                                <TextField
                                    placeholder='Length(cm)...'
                                    type={'number'}
                                    name="shipping.length"
                                    value={values.shipping.length || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.shipping?.length && touched?.shipping?.length && <p style={{ color: "red", fontSize: "12px" }}>{errors?.shipping?.length}</p>
                                } */}
                            </div>
                            <div style={{ width: '25%' }}>
                                <div className={productStyle.checkBoxStyle}>
                                    <span>Width</span>
                                </div>
                                <TextField
                                    placeholder='Width(cm)...'
                                    type={'number'}
                                    name="shipping.width"
                                    value={values.shipping.width || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={fieldText}
                                />
                                {/* {
                                    errors?.shipping?.width && touched?.shipping?.width && <p style={{ color: "red", fontSize: "12px" }}>{errors?.shipping?.width}</p>
                                } */}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: '30%' }}>
                    {/* categories */}
                    <div className={productStyle.thumbanilStyle}>
                        <h6 className={productStyle.variationText}>Category</h6>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Product Category*</label>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.category.productCategory ? "500" : "400",
                                        color: values.category.productCategory ? "#081735" : "#858D9D",
                                    },
                                }}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                defaultValue=''
                                name='category.productCategory'
                                value={values.category.productCategory}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                {categoriesExportData?.data?.length > 0 && categoriesExportData?.data?.map((category) => (
                                    <MenuItem
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {
                                errors?.category?.productCategory && touched?.category?.productCategory && <p style={{ color: "red", fontSize: "12px" }}>{errors?.category?.productCategory}</p>
                            }
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <label className={productStyle.label}>Product Sub-Category(optional)</label>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.category.productSubcategory ? "500" : "400",
                                        color: values.category.productSubcategory ? "#081735" : "#858D9D",
                                    },
                                }}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                defaultValue=''
                                name='category.productSubcategory'
                                value={values.category.productSubcategory}
                                onChange={handleSubcategoryChange}
                            >
                                <MenuItem value={null}>Select</MenuItem>
                                {filteredSubcategory?.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        {/* {
                            errors.category?.productSubcategory && touched?.category?.productSubcategory && <p style={{ color: "red", fontSize: "12px" }}>{errors?.category?.productSubcategory}</p>
                        } */}
                    </div>

                    {/* Gold */}
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <div className={productStyle.catStatusStyle}>
                            <h6 className={productStyle.variationText}>Gold</h6>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Gold Type*</label>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.gold.type ? "500" : "400",
                                        color: values.gold.type ? "#081735" : "#858D9D",
                                    },
                                }}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                // defaultValue=''
                                name='gold.type'
                                value={values.gold.type}
                                onChange={handleChange}
                            >
                                <MenuItem value={null}>Select</MenuItem>
                                <MenuItem value="k22">22k</MenuItem>
                                <MenuItem value="k18">18k</MenuItem>

                            </Select>
                        </div>
                        {
                            errors?.gold?.type && touched?.gold?.type && <p style={{ color: "red", fontSize: "12px" }}>{errors?.gold?.type}</p>
                        }
                        <div style={{ marginTop: 10 }}>
                            <label className={productStyle.label}>Order Type*</label>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.gold.orderType ? "500" : "400",
                                        color: values.gold.orderType ? "#081735" : "#858D9D",
                                    },
                                }}
                                IconComponent={(props) => (
                                    <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                                )}
                                displayEmpty
                                defaultValue=''
                                name='gold.orderType'
                                value={values.gold.orderType}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="Ready to ship orders">Ready to ship</MenuItem>
                                <MenuItem value="Made to orders">Made to order</MenuItem>

                            </Select>
                        </div>
                        {
                            errors?.gold?.orderType && touched?.gold?.orderType && <p style={{ color: "red", fontSize: "12px" }}>{errors?.gold?.orderType}</p>
                        }
                    </div>

                    {/* Featured image */}
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <h6 className={productStyle.variationText}>Featured image</h6>
                        <div style={{ marginTop: 20 }}>
                            <label className={productStyle.label}>Photo*</label>
                            <br />
                            <div className={productStyle.imageUpload1}>
                                <div className={productStyle.imageView}>
                                    {values?.featurerdImage?.length > 0 ? (
                                        <div className={productStyle.imagePreviewContainer}>
                                            <img
                                                src={values.featurerdImage}
                                                alt="Selected"
                                                className={productStyle.previewImage}
                                            />
                                            <button
                                                type="button"
                                                className={productStyle.deleteButton}
                                                onClick={handleDeleteFeaturedImage}
                                                disabled={isDeleting}
                                                aria-busy={isDeleting}
                                                aria-label="Delete featured image"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                            </button>
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
                                                    Add
                                                </label>
                                            </div>
                                        </>
                                    )
                                    }

                                </div>
                            </div>
                            {
                                errors.featurerdImage && touched.featurerdImage && <p style={{ color: "red", fontSize: "12px" }}>{errors.featurerdImage}</p>
                            }
                        </div>
                    </div>

                    {/* Status */}
                    <div className={productStyle.thumbanilStyle} style={{ marginTop: 20 }}>
                        <div className={productStyle.catStatusStyle}>
                            <h6 className={productStyle.variationText}>Status</h6>
                            <div className={productStyle.draftStyle}>
                                Draft
                            </div>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <label className={productStyle.label}>Product Status*</label>
                            <br />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{
                                    ...formselect,
                                    "& .MuiSelect-select": {
                                        fontWeight: values.status ? "500" : "400",
                                        color: values.status ? "#081735" : "#858D9D",
                                    },
                                }}
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
                                <MenuItem value="OUT OF STOCK">Out of Stock</MenuItem>
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
                <div className={productStyle.cancelStyle} onClick={resetForm}>
                    Cancel
                </div>
                <div className={productStyle.buttonStyle} onClick={handleSubmit}>
                    <div className={productStyle.addcategoryText}>Save Product</div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct;