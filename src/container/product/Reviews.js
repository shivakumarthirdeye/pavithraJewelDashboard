import React, { useState,useEffect } from "react";
import "./ReviewCard.css";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { getReviewsForProducts } from "../../redux/productSlice";
import { EditIcon, EditReviewIcon, InfoIcon, } from "../../svg";
import EditReview from "./EditReview";

const Reviews = () => {

    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch()


   
    // console.log('first',customerReviewsData)
    // const ordersById = customerReviewsData?.data;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        dispatch(getReviewsForProducts(id))
    }, [dispatch,id])

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

    // const handleApprove = (val) => {
    //     let url = `${val}?action=approve`;
    //     dispatch(approveReject({ url, val }));  // Passing both url and val
    // }

    // const handleReject = (val) => {
    //     let url = `${val}?action=reject`;
    //     dispatch(approveReject({ url, val }));  // Ensure consistency with handleApprove
    // }

    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', // This will give abbreviated month names (e.g., Dec)
            year: 'numeric',
        });
        return formattedDate;
    }
    const ordersById = [
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
        <div >

        <div className="reviews-card" style={{ marginTop: 20 }}>
            {/* <div className={orderStyle.generalInfoStyle} style={{ padding: 20 }}>
                <div className={orderStyle.backgroundStyle}><InfoIcon /></div>
                <p className={orderStyle.customerText}>Customer Reviews</p>
            </div> */}
            <div className='product-container'>
                {ordersById?.map((item, index) => (
                        <div className='product-card'>
                            {/* <div className="products-info" key={index}>
                                <img src={item?.productId?.featuredImage} alt='' className="product-image" />
                                <div style={{ marginLeft: 20 }}>
                                    <h3 className="product-heading">{item?.productId?.name}</h3>
                                    <p className="product-price">₹{item?.productId?.basePrice}</p>
                                </div>
                            </div> */}
                            {/* <div className='review-line' /> */}
                            <div className="review-info">
                                <div className="reviewer-details">
                                    <div>
                                        <h4 className="reviewer-heading">{item?.userName}</h4>
                                        <p className="review-date">{formatDate(item?.createdAt)}</p>
                                    </div>
                                    <div className="rating">
                                        {"★".repeat(item?.rating)}
                                    </div>
                                </div>
                                <h4 className="review-title">{item?.comment}</h4>
                                <div className="review-images">
                                    {item?.images?.map((image, index) => (
                                        <img src={image} alt={`review-${index}`} key={index} className="review-image" />
                                    ))}
                                </div>
                                <div className="reviewer-details">
                                    <div className="product-attributes">
                                        Stud: {item.stud} 
                                    </div>
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
                                    <div className="statusActions">
                                        <div className="review-date">Status:</div>
                                        <div className="approve-btn" 
                                        // onClick={() => handleApprove(item?._id)}
                                        >Approve</div>
                                        <div className="rejection-btn" onClick={() => openRejectModal(item?._id)}>Reject</div>
                                        <div className="edit-btn" onClick={() => openModal(item)}>Edit <EditReviewIcon /></div>
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
        {/* <RejectionModal
            open={isRejectModalOpen}
            onClose={closeRejectModal}
            path={"review"}
            data={data}
            handleSubject={handleReject}
        /> */}
    </div>
    );
};

export default Reviews;
