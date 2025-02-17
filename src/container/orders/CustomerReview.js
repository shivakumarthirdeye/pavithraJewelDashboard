import React, { useEffect, useState } from 'react';
import productStyle from '../../container/product/product.module.css'
import { EditIcon, EditReviewIcon, ForwardIcon, InfoIcon, InfoReviewIcon, } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { approveReject, getCustomerReviews, getOrdersDetails } from '../../redux/ordersSlice';
import orderStyle from './orders.module.css'
import EditReview from '../product/EditReview';
import RejectModal from '../../component/RejectModal';
import { formatDate } from '../../helper/FormatDate';
import ErrorPage from '../../component/ErrorPage';
import { Box, CircularProgress } from '@mui/material';

export const CustomerReview = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh, customerReviewsData,isLoading } = useSelector((state) => state.orders);
    console.log('customerReviewsData', customerReviewsData);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [dispatch, id])
    useEffect(() => {
        dispatch(getCustomerReviews(id))
    }, [dispatch, id, isRefresh])

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
    const handleApprove = (val) => {
        let url = {
            status:'APPROVED'
        };
        dispatch(approveReject({ url, val }));  // Passing both url and val
    }

    const handleReject = (val) => {
        let url = {
            status:'REJECTED'
        };
        dispatch(approveReject({ url, val }));  // Ensure consistency with handleApprove
    }
    
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}> Order #{ordersDetailsData?._id}</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        Orders <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Orders
                        </span>
                        <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Order #{ordersDetailsData?._id}
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
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {customerReviewsData?.length > 0 ? (
                            <div className={orderStyle.productContainer}>
                                {customerReviewsData?.map((item, index) => (
                                    <div className={orderStyle.productCard}>
                                        <div className={orderStyle.productsInfo} key={index}>
                                            <img src={item?.productId?.featurerdImage[0]} alt='' className={orderStyle.productImage} />
                                            <div style={{ marginLeft: 20 }}>
                                                <h3 className={orderStyle.productHeading}>{item?.productId?.productName}</h3>
                                                <p className={orderStyle.productPrice}>₹{item?.productId?.basePrice}</p>
                                            </div>
                                        </div>
                                        <div className={orderStyle.reviewLine} />
                                        <div className={orderStyle.reviewInfo}>
                                            <div className={orderStyle.reviewerDetails}>
                                                <div>
                                                    <h4 className={orderStyle.reviewerHeading}>{item?.userId?.firstName}{" "}{item?.userId?.lastName}</h4>
                                                    <p className={orderStyle.reviewDate}>{formatDate(item?.createdAt)}</p>
                                                </div>
                                                <div className={orderStyle.rating}>
                                                    {"★".repeat(item?.ratings)}
                                                </div>
                                            </div>
                                            <h4 className={orderStyle.reviewTitle}>{item?.review}</h4>
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
                                                            color: item?.status === 'APPROVED' ? '#1DB41D' : item?.status === 'PENDING' ? '#C86550' : '#F92929',

                                                        }}>{item?.status === 'PENDING' ? 'Pending' : item?.status === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
                                                </div>
                                            </div>
                                            {item?.status === "PENDING" && (
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
                        ) : (
                            <ErrorPage />
                        )}
                    </>
                )}
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
