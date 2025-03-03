import React, { useEffect, useState } from 'react';
import productStyle from './product.module.css';
import { DeleteRedIcon, EditBlackIcon, ForwardIcon, LineIcon, RatingIcon, ZoomInIcon, } from '../../svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProducts, getProductsDetails } from '../../redux/productSlice';
import { Tab, Tabs } from '@mui/material';
import DeleteModal from '../../component/DeleteModal';
import Reviews from './Reviews';


const ProductViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const productsDetail = useSelector((state) => state.products);
    const productById = productsDetail?.productsDetailsData?.data;
    const getAllReview = productsDetail?.productsDetailsData?.allreviews;
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    // console.log('productsDetail', productsDetail);


    useEffect(() => {
        dispatch(getProductsDetails(id))
    }, [id, dispatch])

    useEffect(() => {
        if (productById?.featurerdImage) {
            setSelectedImage(productById?.featurerdImage);
        }
    }, [productById]);  // This will run every time productById changes


    const [tabValue, setTabValue] = useState(0);
    const [selected, setSelected] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(productById?.featurerdImage);

    const changeID = (id) => {
        setSelected(id.id);
    };

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };


    //Deleting Modal
    const openDeleteModal = (data) => {
        setData(data);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    //Exchange request
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    //Deleting dispatch function
    const deletedProduct = (value) => {
        dispatch(deleteProducts(value))
    }
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true,
        arrows: false,
    };




    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', // This will give abbreviated month names (e.g., Dec)
            year: 'numeric',
        });
        return formattedDate;
    }


    const handleTabChange = async (event, newValue) => {


        setTabValue(newValue);
    };


    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Product</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        Dashboard <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10, textTransform: "capitalize" }}>
                            {path === "Product" ? "Product" : "Combo Product"}
                        </span>
                        <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            {productById?.productName}
                        </span>
                    </div>
                </div>
                <div className={productStyle.attributeStyle} >
                    <div
                        className={productStyle.DeleteStyle}
                        onClick={() => openDeleteModal(productById._id)}
                        style={{ marginTop: 10 }}
                    >
                        <DeleteRedIcon /> Delete
                    </div>
                    <div
                        className={productStyle.editButtonStyle}
                        onClick={() => navigate(`/product/Product/EditProduct/${id}`, { state: { item: productById } })}
                        style={{ marginTop: 10 }}
                    >
                        <EditBlackIcon />
                        Edit Product
                    </div>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/product/Product')}>
                        <p className={productStyle.addcategoryText}>Back to list</p>
                    </div>
                </div>
            </div>
            <div>
                {/* <Tab
                    value={value}
                    selected={selected}
                    onChange={(id) => changeID(id)}
                /> */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    // variant="fullWidth"
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "capitalize",
                            fontFamily: "Figtree",
                            fontSize: "14px",
                            fontWeight: "500",
                            lineHeight: "22px",
                            textAlign: "left",
                            color: "#6E7485",
                            paddingLeft: "20px",
                            letterSpacing: '-0.01em',
                            borderBottom: "1px solid #E9EAF0",
                            display: 'flex',
                            justifyContent: 'flex-start',
                            // width:'100%',
                            "&.Mui-selected": {
                                color: "#1D2026",
                                fontWeight: "600",
                                width: '5%'
                            },
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#1D83F8",
                            height: "2px",
                        },
                    }}
                >
                    <Tab
                        label='Details'
                    />
                    <Tab
                        label='Review'
                    />
                </Tabs>
            </div>
            {tabValue === 0 ? (
                <div className={productStyle.productDetailsBox} style={{ marginTop: 20 }}>
                    <div className={productStyle.productImageStyle}>
                        <div style={{ position: 'relative' }} className={productStyle.imageViewForProduct}>
                            {/* Main Image */}
                            <img
                                src={selectedImage}
                                alt="Product"
                                width={300}
                                height={300}
                                style={{ borderRadius: 5 }}
                            />
                            <div
                                className={productStyle.zoomStyle}
                                onClick={openModal}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    cursor: 'pointer',
                                }}
                            >
                                <ZoomInIcon />
                            </div>
                        </div>
                        <div className={productStyle.sliderContainer} style={{ marginTop: 20 }}>
                            {productById?.media?.photo?.map((item, index) => (
                                <div className={productStyle.catStatusStyle} key={index}>
                                    <img
                                        src={item}
                                        alt={`Product Image ${index + 1}`}
                                        className={productStyle.sliderImage}
                                        onClick={() => handleThumbnailClick(item)} // Update the selected image when thumbnail is clicked
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>

                            ))}
                        </div>
                    </div>
                    <div className={productStyle.productStockBox} style={{ padding: 20 }}>
                        <div className={productStyle.productIdRowStyle} >
                            <div className={productStyle.colorVariantStyle}>
                                Product ID:<span style={{ color: '#1D1F2C', marginLeft: 5 }}>#{productById?.inventory?.sku}</span>
                            </div>
                            <div className={productStyle.colorVariantStyle}>
                                Created:<span style={{ color: '#1D1F2C', marginLeft: 5 }}>{formatDate(productById?.createdAt)}</span>
                            </div>
                        </div>
                        <div className={productStyle.catStatusStyle} style={{ paddingTop: 20 }}>
                            <h4 className={productStyle.h4Style}>
                                {productById?.productName}
                                {/* Product Name */}
                            </h4>
                            <div style={{
                                width: 87,
                                height: 28,
                                // padding: 15,
                                borderRadius: 8,
                                backgroundColor: productById?.status === 'DRAFT' ? '#F0F1F3' : productById?.status === 'PUBLISHED' ? "#1A98821A" : '#F439391A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{
                                    fontFamily: 'Public Sans',
                                    fontSize: 13,
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    color: productById?.status === 'DRAFT' ? "#4A4C56" : productById?.status === 'PUBLISHED' ? '#4DDB4D' : '#F92929',
                                }}>
                                    {productById?.status === 'DRAFT' ? 'Draft' : productById?.status === 'PUBLISHED' ? 'Published' : 'Out of stock'}
                                </span>
                            </div>
                        </div>
                        <div className={productStyle.categoryStyle} style={{ marginTop: 15, }}>
                            <div className={productStyle.textStyle}>
                                Category: <span>{productById?.category?.productCategory?.name}</span>
                            </div>
                                <LineIcon />
                            <div className={productStyle.textStyle}>
                                Sold: <span>{productById?.soldItems}</span>
                            </div>
                                <LineIcon />
                            <div className={productStyle.textStyle}>
                                Rating: <span style={{ }}><RatingIcon /></span><span>4.5/5</span>
                            </div>
                            <LineIcon />
                            <div className={productStyle.textStyle}>
                                Stock: <span>{productById?.inventory?.totalstock}</span>
                            </div>
                            <LineIcon />
                            {/* <div className={productStyle.textStyle}>
                                Message: <span>25</span>
                            </div> */}
                        </div>
                        <div className={productStyle.dollarSyle}>
                            ₹{(productsDetail?.productsDetailsData?.sellingPrice)?.toFixed(2)} <span> ₹{productsDetail?.productsDetailsData?.totalPrice}</span>
                        </div>
                        <div className={productStyle.colorVariantStyle} style={{ marginTop: 20, }}>
                            Description:
                            <div className={productStyle.textStyle} dangerouslySetInnerHTML={{ __html: productById?.description }}>
                                {/* <span style={{ marginTop: 10, }}>
            {productById?.description}
        </span> */}
                            </div>
                        </div>
                        <div className={productStyle.colorVariantStyle} style={{ marginTop: 20, }}>
                            Features
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <div className={productStyle.featureBoxStyle} >
                                    <div className={productStyle.featureRowStyle}>
                                        <div className={productStyle.featuresHeading}>
                                            Item Weight
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.itemWeight?.value}</div>
                                        </div>
                                        <div className={productStyle.borderRight} />
                                        <div className={productStyle.featuresHeading}>
                                            Stone Weight
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.stoneWeight?.value}</div>
                                        </div>
                                        <div className={productStyle.borderRight} />
                                        <div className={productStyle.featuresHeading}>
                                            Stone Color/Type
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.stoneColor?.value}</div>
                                        </div>
                                    </div>
                                    <div className={productStyle.middleBorder} />
                                    <div className={productStyle.featureRowStyle}>
                                        <div className={productStyle.featuresHeading}>
                                            Product Width
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.productWidth?.value}</div>
                                        </div>
                                        <div className={productStyle.borderRight} />
                                        <div className={productStyle.featuresHeading}>
                                            Product Height
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.productHeight?.value}</div>
                                        </div>
                                        <div className={productStyle.borderRight} />
                                        <div className={productStyle.featuresHeading}>
                                            Feature
                                            <br />
                                            <div className={productStyle.featureValue}>{productById?.features?.feature?.value}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            ) : (
                <Reviews data={getAllReview}/>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Zoomed Image"
                className={productStyle.modal}
                overlayClassName={productStyle.overlay}
            >
                <img src={productById?.featurerdImage} alt="Zoomed Product" className={productStyle.zoomedImage} />
                <button onClick={closeModal} className={productStyle.closeButton}>Close</button>
            </Modal>
            <DeleteModal
                heading={"Delete Product"}
                closeModal={closeDeleteModal}
                open={isDeleteModalOpen}
                data={data}
                description={'Do you want to delete this product? '}
                handleSubject={deletedProduct}
            // isRefresh={isRefresh}
            />
        </div>
    )
}

export default ProductViewDetails;