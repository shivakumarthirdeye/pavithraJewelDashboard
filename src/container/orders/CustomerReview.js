import React, { useEffect, useState } from 'react';
import productStyle from '../../container/product/product.module.css'
import { EditIcon, EditReviewIcon, ForwardIcon, InfoIcon, InfoReviewIcon, } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { approveReject, getCustomerReviews } from '../../redux/ordersSlice';
import orderStyle from './orders.module.css'
import EditReview from '../product/EditReview';
import RejectModal from '../../component/RejectModal';

export const CustomerReview = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const orderDetail = useSelector((state) => state.orders);
    const isRefresh = useSelector((state) => state.orders.isRefresh); 
    const ordersById = orderDetail?.customerReviewsData?.data; 
    
    useEffect(() => {
        dispatch(getCustomerReviews(id))
    }, [isRefresh])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [data, setData] = useState(null);
    
    const openModal = (data) => {
        setData(data)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openRejectModal = (data) => {
        setData(data)
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
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
    const handleApprove = (val) => {
        let url = `${val}?action=approve`;
        dispatch(approveReject({ url, val }));  // Passing both url and val
    }

    const handleReject = (val) => {
        let url = `${val}?action=reject`;
        dispatch(approveReject({ url, val }));  // Ensure consistency with handleApprove
    }
    const Data = [
        {
            id:0,
            productId: {
                featuredImage:'/jweleryImage.png',
                name: 'necklesh',
                basePrice:'3454'
            },
            stud:'Ruby',
            userName:'supriya',
            createdAt:'23 jan 2025',
            rating: '3.5',
            images:[
                "/jweleryImage.png",
                "/jweleryImage.png",
                "/jweleryImage.png"
            ],
            comment:'good to know that you like this product',
            isApproved:'APPROVED'
        },
        {
            id:1,
            productId: {
                featuredImage:'/jweleryImage.png',
                name: 'necklesh',
                basePrice:'3454'
            },
            stud:'Ruby',
            userName:'supriya Raj',
            createdAt:'23 jan 2025',
            rating: '3.5',
            images:[
                "/jweleryImage.png",
                "/jweleryImage.png",
                "/jweleryImage.png"
            ],
            comment:'good to know that you like this product',
            isApproved:'PENDING'
        },
    ]
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}> Order #{orderDetail?.ordersDetailsData?.data?.order_id}</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        Orders <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Orders
                        </span>
                        <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Order #{orderDetail?.ordersDetailsData?.data?.order_id}
                        </span>
                    </div>
                </div>
                <div className={productStyle.attributeStyle} style={{ marginTop: 20 }}>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/orders/Orders/OrdersDetails/:id')}>
                        <div className={productStyle.addcategoryText}>Back to details</div>
                    </div>
                </div>
            </div>
            <div className={orderStyle.reviewsCard} style={{ marginTop: 20 }}>
                <div className={orderStyle.generalInfoStyle} style={{ padding: 20 }}>
                    <div className={orderStyle.backgroundStyle}><InfoReviewIcon /></div>
                    <p className={orderStyle.customerText}>Customer Reviews</p>
                </div>
                <div className={orderStyle.productContainer}>
                    {Data?.map((item, index) => (
                            <div className={orderStyle.productCard}>
                                <div className={orderStyle.productsInfo} key={index}>
                                    <img src={item?.productId?.featuredImage} alt='' className={orderStyle.productImage} />
                                    <div style={{ marginLeft: 20 }}>
                                        <h3 className={orderStyle.productHeading}>{item?.productId?.name}</h3>
                                        <p className={orderStyle.productPrice}>₹{item?.productId?.basePrice}</p>
                                    </div>
                                </div>
                                <div className={orderStyle.reviewLine} />
                                <div className={orderStyle.reviewInfo}>
                                    <div className={orderStyle.reviewerDetails}>
                                        <div>
                                            <h4 className={orderStyle.reviewerHeading}>{item?.userName}</h4>
                                            <p className={orderStyle.reviewDate}>{formatDate(item?.createdAt)}</p>
                                        </div>
                                        <div className={orderStyle.rating}>
                                            {"★".repeat(item?.rating)}
                                        </div>
                                    </div>
                                    <h4 className={orderStyle.reviewTitle}>{item?.comment}</h4>
                                    <div className={orderStyle.reviewImages}>
                                        {item?.images.map((image, index) => (
                                            <img src={image} alt={`review-${index}`} key={index} className={orderStyle.reviewImage} />
                                        ))}
                                    </div>
                                    <div className={orderStyle.reviewerDetails}>
                                        <p className={orderStyle.productAttributes}>
                                            Stud: {item.stud} 
                                        </p>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: '400',
                                                    letterSpacing: 0.14,
                                                    color: item?.isApproved === 'APPROVED' ? '#1DB41D' : item?.isApproved === 'PENDING' ? '#C86550' : '#F92929',

                                                }}>{item?.isApproved === 'PENDING' ? 'Pending' : item?.isApproved === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
                                        </div>
                                    </div>
                                    {item?.isApproved === "PENDING" && (
                                        <div className={orderStyle.statusActions}>
                                            <div className={orderStyle.reviewDate}>Status:</div>
                                            <div className={orderStyle.approveBtn} onClick={() => handleApprove(item?._id)}>Approve</div>
                                            <div className={orderStyle.rejectionBtn} onClick={() => openRejectModal(item?._id)}>Reject</div>
                                            <div className={orderStyle.editBtn} onClick={() => openModal(item)}>Edit <EditReviewIcon /></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                    ))}
                </div>
            </div >
            <EditReview
                open={isModalOpen}
                onClose={closeModal}
                data={data}
            />
            <RejectModal
                open={isRejectModalOpen}
                onClose={closeRejectModal}
                path={"review"}
                data={data}
                handleSubject={handleReject}
            />
        </div>
    )
}
