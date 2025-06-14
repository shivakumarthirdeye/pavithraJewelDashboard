import React, { useEffect, useState } from 'react';
import orderStyle from './orderDetails.module.css';
import productStyle from '../../container/product/product.module.css'
import { CopyIcon, Customer, DatePickerIcon, DownloadIcon, EditBlackIcon, EmailIcon, ForwardIcon, HomeIcon, IDIcon, InfoReviewIcon, InvoiceIcon, LocationIcon, Orders, PayIcon, PaymentIcon, PhoneIcon, ShipingIcon, ShipMethodIcon } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersDetails, getCustomerReviews, updateStatus } from '../../redux/ordersSlice';
import PreviewModal from '../../component/PreviewModal';
import EditPriceModal from './EditPriceModal';
import { formselect } from '../../MaterialsUI';
import { MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import CustomSeparator from '../../component/CustomizedBreadcrumb';

export const OrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh } = useSelector((state) => state.orders);
    // console.log('ordersDetailsData', ordersDetailsData);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [dispatch, id, isRefresh])


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [copied, setCopied] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [copiedPaymentid, setCopiedPaymentId] = useState(false);
    const [copiedShippingId, setCopiedShippingId] = useState(false);


    const openModal = (data) => {
        setData(data);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openEditPriceModal = (data) => {
        setData(data);
        setIsEditPriceModalOpen(true);
    };
    const closeEditPriceModal = () => {
        setIsEditPriceModalOpen(false);
    };
    const formatDate = (date) => {
        const dateFromMongoDB = new Date(date);
        const formattedDate = dateFromMongoDB.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long', // This will give full month names (e.g., January)
            year: 'numeric',
        });
        const formattedTime = dateFromMongoDB.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // This will give a 24-hour format
        });
        return `${formattedDate}, ${formattedTime}`;
    };

    const {
        setFieldValue,
        values,
        setValues
    } = useFormik({
        initialValues: {
            status: "",
        },
        onSubmit: async (values) => {
            // dispatch(updateStatus({ values, id }));
        }
    });


    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        if (selectedStatus) {
            setFieldValue("status", selectedStatus); // Update Formik state
            dispatch(updateStatus({ val: { status: selectedStatus }, id: id, orderType: ordersDetailsData?.data?.orderType })); // Trigger API call
        } else {
            setValues({
                status: selectedStatus
            })
        }
    };

    useEffect(() => {
        if (ordersDetailsData?.data?.products) {
            ordersDetailsData.data.products.forEach((item) => {
                const statusArray = item?.status;
                const lastStatus = statusArray?.at(-1); // Get the last status

                if (lastStatus) {
                    // You can distinguish whether it's readyToShip or madeToOrder based on your data
                    if (item.orderType === 'Ready to ship orders') {
                        setFieldValue("status", lastStatus.name);
                    } else if (item.orderType === 'Made to orders') {
                        setFieldValue("status", lastStatus.name);
                    }
                }
            });
        }
    }, [ordersDetailsData, setFieldValue]);

    const handleCopyEmail = () => {
        const email = ordersDetailsData?.data?.userId?.email;
        if (email) {
            navigator.clipboard.writeText(email)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };
    const handleCopyPhone = () => {
        const phone = ordersDetailsData?.data?.userId?.phone
        if (phone) {
            navigator.clipboard.writeText(phone)
                .then(() => {
                    setCopiedPhone(true);
                    setTimeout(() => setCopiedPhone(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };
    const handleCopyPaymentId = () => {
        const paymentId = ordersDetailsData?.data?.payment?.id
        if (paymentId) {
            navigator.clipboard.writeText(paymentId)
                .then(() => {
                    setCopiedPaymentId(true);
                    setTimeout(() => setCopiedPaymentId(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };
    const handleCopyShippingId = () => {
        const shippingId = ordersDetailsData?.data?.payment?.id
        if (shippingId) {
            navigator.clipboard.writeText(shippingId)
                .then(() => {
                    setCopiedShippingId(true);
                    setTimeout(() => setCopiedShippingId(false), 2000); // Reset after 2 sec
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };

    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Order {ordersDetailsData?.data?._id}</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        <CustomSeparator dashboard="Dashboard" type="Orders" subType={`Order #${ordersDetailsData?.data?._id}`} />
                    </div>
                </div>
                <div className={productStyle.attributeStyle} style={{ marginTop: 20 }}>

                    <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/Orders/CustomerReviews/${ordersDetailsData?.data?._id}`)}>
                        Customer reviews
                    </div>
                    {/* <div className={productStyle.buttonStyle} onClick={() => navigate(`/orders/Orders/OrdersInvoice/${ordersDetailsData?.data?._id}`)}>
                        <InvoiceIcon /><div className={productStyle.addcategoryText}> Invoice</div>
                    </div> */}
                    <div
                        className={productStyle.buttonStyle}
                        style={{ backgroundColor: '#E87819' }}
                        onClick={() => navigate('/orders/Orders?tab=0')}
                    >
                        <span className={productStyle.addcategoryText}>Back To List</span>
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: 30 }}>
                {/* Product info */}
                <div className={orderStyle.productStockContainer} style={{ marginTop: 20, }}>
                    <div className={orderStyle.productStyle} style={{ padding: 20 }}>
                        <div className={orderStyle.iconStyle}>
                            <div className={orderStyle.textStyle} style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>
                                Products
                            </div>
                            <div style={{
                                marginLeft: 10,
                                width: 30,
                                height: 28,
                                borderRadius: 8,
                                backgroundColor: '#E9FAF7',
                                textAlign: 'center'
                            }}>
                                <span style={{
                                    color: '#1A9882',
                                    fontSize: 14,
                                    fontWeight: '600'
                                }}>
                                    {ordersDetailsData?.data?.products?.length}

                                </span>
                            </div>
                        </div>
                        <div className={orderStyle.iconStyle} style={{ gap: 10, alignItems: 'flex-start' }}>
                            <div className={orderStyle.dateStyle} style={{ gap: 8 }}>
                                <DatePickerIcon />
                                <div className={orderStyle.filterTextStyle}>
                                    {formatDate(ordersDetailsData?.data?.updatedAt)}
                                    {/* 13 January 2023, 14:00 */}
                                </div>
                            </div>
                            <div className={orderStyle.goldRateStyle}>
                                Gold rate 18k: <span> ₹{ordersDetailsData?.data?.goldRate18k}/g </span>
                                <br />
                                Gold rate 22k: <span> ₹{ordersDetailsData?.data?.goldRate22k}/g </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", width: '100%' }}>
                        <div style={{ width: "60%", overflowX: "scroll" }}>
                            <div className={orderStyle.scrollContainer} >
                                <div className={orderStyle.header}>
                                    <div className={orderStyle.productTextStyle}>Product </div>
                                    <div className={orderStyle.goldTypeText}>Gold Type</div>
                                    <div className={orderStyle.goldWeightText}>Gold Weight</div>
                                    <div className={orderStyle.goldRateText}>Gold Rate</div>
                                    <div className={orderStyle.makingChargesText}>Making Charges</div>
                                    <div className={orderStyle.stoneChargesText}>Stone Charges</div>
                                    <div className={orderStyle.diamondCaratText}>Diamond Carat</div>
                                    <div className={orderStyle.diamondPerCaratText}>Diamond Per Carat</div>
                                    <div className={orderStyle.diamondCostText}>Diamond Cost</div>
                                    <div className={orderStyle.polkiCarateText}>Polki Carat</div>
                                    <div className={orderStyle.polkiPerCaratText}>Polki Per Carat</div>
                                    <div className={orderStyle.polkiCostText}>Polki Cost</div>
                                    <div className={orderStyle.gstText}>Gst</div>
                                    <div className={orderStyle.finalPriceText}>Final Sale Price</div>
                                </div>
                                <div>
                                    {ordersDetailsData?.data?.products?.map((item, index) => {
                                        // console.log('items---------------------', item);

                                        return (
                                            <>
                                                <div className={orderStyle.info} key={index}>
                                                    <div className={orderStyle.productTextStyle}>
                                                        <div>
                                                            <img src={item?.productId?.featurerdImage} width={40} height={40} style={{ borderRadius: 5, objectFit: 'cover' }} />
                                                        </div>
                                                        <div style={{ marginLeft: 5 }}>
                                                            <div className={orderStyle.orderTypeStyle}>{item?.orderType === 'Made to orders' ? 'Made to order' : 'Ready to ship'}</div>
                                                            <p className={orderStyle.proNameText}>
                                                                {/* {item?.productId?.productName} */}
                                                                {item?.productId?.productName && item?.productId?.productName?.length > 25 ? `${item?.productId?.productName?.substring(0, 25)}...` : item?.productId?.productName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={orderStyle.goldTypeText}>{item?.productId?.gold?.type === 'k18' ? '18k' : '22k'}</div>
                                                    <div className={orderStyle.goldWeightText} style={{ letterSpacing: '-0.5px', textTransform: 'lowercase' }}>
                                                        {item?.productId?.pricing?.goldWeight?.value || '-'}g
                                                        <br />
                                                        {ordersDetailsData?.data?.extraWeight > 0 ? (
                                                            <p className={orderStyle.exWeighttyle}>Ex:{ordersDetailsData?.data?.extraWeight}g</p>
                                                        ) : null}
                                                    </div>
                                                    <div className={orderStyle.goldRateText}>₹{item?.productId?.pricing?.goldRate?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.makingChargesText}>{item?.productId?.pricing?.makingCharges?.value || '-'}%</div>
                                                    <div className={orderStyle.stoneChargesText}>₹{item?.productId?.pricing?.stoneCharges?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.diamondCaratText}>{item?.productId?.pricing?.diamondCarat?.value || '-'}</div>
                                                    <div className={orderStyle.diamondPerCaratText}>₹{item?.productId?.pricing?.diamondPerCarat?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.diamondCostText}>₹{item?.productId?.pricing?.diamondCost?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.polkiCarateText}>{item?.productId?.pricing?.polkiCarat?.value || '-'}</div>
                                                    <div className={orderStyle.polkiPerCaratText}>₹{item?.productId?.pricing?.polkiPerCarat?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.polkiCostText}>₹{item?.productId?.pricing?.polkiCost?.value?.toLocaleString("en-IN") || '-'}</div>
                                                    <div className={orderStyle.gstText}>{item?.productId?.pricing?.gst?.value}%</div>
                                                    <div className={orderStyle.finalPriceText}>₹{item?.sellingPrice?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                </div>
                                                <div className={orderStyle.bottomLineStyle} />
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />

                        </div>
                        <div style={{ width: "40%", borderLeft: "6px solid #EEEEEE", overflowX: 'scroll' }}>
                            <div className={orderStyle.scrollContainer} >
                                <div className={orderStyle.header}>
                                    <div className={orderStyle.qytText}>Status</div>
                                    <div className={orderStyle.pendingAmountStyle} style={{ fontSize: 14 }}>Payment </div>
                                    <div className={orderStyle.priceStyle}>Total </div>
                                </div>
                                <div>
                                    {ordersDetailsData?.data?.products?.map((item, index) => {
                                        const arr = item?.status;
                                        const lastValue = arr?.at(-1);
                                        return (
                                            <>
                                                <div className={orderStyle.info} key={index}>
                                                    <div style={{ width: '35%' }}>
                                                        <div
                                                            style={{
                                                                backgroundColor: lastValue?.name === 'NEW'
                                                                    ? "#4A4C561A" : lastValue?.name === 'PROCESSING'
                                                                        ? '#F439391A' : lastValue?.name === 'DELIVERED'
                                                                            ? '#EAF8FF' : '#3250FF1A',
                                                                width: '80%',
                                                                borderRadius: 10,
                                                                height: 30,
                                                                alignContent: 'center',
                                                                justifyContent: 'center',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                // marginLeft: 20,
                                                                alignSelf: 'center',
                                                                paddingLeft: 7,
                                                                paddingRight: 7
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontFamily: 'DM Sans',
                                                                    fontSize: 11,
                                                                    fontWeight: '400',
                                                                    lineHeight: 18.23,
                                                                    letterSpacing: 0.1,
                                                                    textAlign: 'center',
                                                                    // textTransform: 'capitalize',
                                                                    color: lastValue?.name === 'NEW'
                                                                        ? "#4A4C56" : lastValue?.name === 'PROCESSING'
                                                                            ? '#F86624' : lastValue?.name === 'DELIVERED'
                                                                                ? '#2BB2FE' : '#3250FF',
                                                                }}
                                                            >{lastValue?.name === 'NEW'
                                                                ? "New" : lastValue?.name === 'PROCESSING'
                                                                    ? 'Processing' : lastValue?.name === 'DELIVERED'
                                                                        ? 'Delivered' : 'Out for delivery'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {ordersDetailsData?.data?.pendingAmount !== 0 ? (
                                                        <div className={orderStyle.pendingAmountStyle} style={{ fontSize: 10 }}>
                                                            Ad paid: ₹{ordersDetailsData?.data?.advancePaid?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br />
                                                            <p className={orderStyle.pendingAmount} onClick={() => openEditPriceModal(ordersDetailsData)}>
                                                                Pending: ₹{ordersDetailsData?.data?.pendingAmount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} <EditBlackIcon /></p>
                                                        </div>
                                                    ) : (
                                                        <div className={orderStyle.fullyPaid}>Fully paid</div>
                                                    )}
                                                    <div className={orderStyle.priceStyle}>₹ {ordersDetailsData?.data?.total?.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    </div>
                                                </div>
                                                <div className={orderStyle.bottomLineStyle} />
                                            </>
                                        )
                                    })}
                                </div>

                                <div className={orderStyle.bottomLineStyle} />
                                <div className={orderStyle.info} >
                                    <div className={orderStyle.pendingAmountStyle}>Shipping Rate</div>
                                    <div className={orderStyle.totalAmountStyle}>₹ {ordersDetailsData?.data?.shippingRate} </div>
                                </div>
                                <div className={orderStyle.bottomLineStyle} />
                                <div className={orderStyle.info} >
                                    <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, }}>Grand Total</div>
                                    <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, }}>₹ {ordersDetailsData?.data?.grandTotal?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                                {/* <div className={orderStyle.bottomLineStyle} />
                                <div className={orderStyle.info} >
                                    <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500,color:'green' }}>Paid Amount</div>
                                    <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, color:'green' }}>₹ {ordersDetailsData?.data?.paidAmount?.toLocaleString("en-IN")}</div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>
                <div className={orderStyle.cardWrap}>
                    <div>
                        <div className={orderStyle.shipingCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><LocationIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Shipping Address
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, width: 290 }} />
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <HomeIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Address</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.shippingAddress?.firstName}{" "}{ordersDetailsData?.data?.shippingAddress?.lastName},
                                    <br />
                                    {ordersDetailsData?.data?.shippingAddress?.unit}{", "}{ordersDetailsData?.data?.shippingAddress?.streetAddress}{", "}{ordersDetailsData?.data?.shippingAddress?.city}
                                    {' '}{ordersDetailsData?.data?.shippingAddress?.state} {ordersDetailsData?.data?.shippingAddress?.pincode}{","}{ordersDetailsData?.data?.shippingAddress?.country}
                                    {/* Jay Hadgunson
                                    1833 Bel Meadow Drive, Fontana, California 92335, USA */}
                                </div>
                            </>
                        </div>
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><PaymentIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Pancard details
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <PayIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Pan no</p>

                                    </div>
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        {ordersDetailsData?.data?.panNumber}
                                    </div>
                                </div>
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20 }}
                                    onClick={() => openModal(ordersDetailsData?.data?.panImage)}
                                >
                                    <DownloadIcon />
                                    <div>
                                        <img src={ordersDetailsData?.data?.panImage} alt='pancard' style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={orderStyle.shipingCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><LocationIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Billing Address
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, width: 290 }} />
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <HomeIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Address</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.billingAddress?.firstName}{" "}{ordersDetailsData?.data?.billingAddress?.lastName},
                                    <br />
                                    {ordersDetailsData?.data?.billingAddress?.unit}{", "}{ordersDetailsData?.data?.billingAddress?.streetAddress}{", "}{ordersDetailsData?.data?.billingAddress?.city}
                                    {' '}{ordersDetailsData?.data?.billingAddress?.state} {ordersDetailsData?.data?.billingAddress?.pincode}{","}{ordersDetailsData?.data?.billingAddress?.country}
                                </div>
                            </>
                        </div>
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><PaymentIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Payment
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />


                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <IDIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>ID</p>

                                    </div>
                                    {ordersDetailsData?.data?.payment?.method === 'HDFC' ? (
                                        <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                            {ordersDetailsData?.data?.hdfc_order_id}
                                        </div>
                                    ) : (
                                        <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                            {ordersDetailsData?.data?.payment?.id}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyPaymentId}>
                                    <CopyIcon />
                                    {copiedPaymentid && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                                </div>
                            </div>
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <PayIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Payment Method</p>

                                </div>
                                {ordersDetailsData?.data?.payment?.method === 'HDFC' ? (
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        HDFC
                                    </div>
                                ) : (
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        Razorpay
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                    {/* General Information */}
                    <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                        <div className={orderStyle.generalInfoStyle}>
                            <div className={orderStyle.backgroundStyle}><InfoReviewIcon /></div>
                            <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                General Information
                            </div>
                        </div>
                        <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />
                        <>
                            <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                <Orders />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Order status </p>

                            </div>
                            <div style={{ marginLeft: 30, marginTop: 10 }}>
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
                                    defaultValue=""
                                    name="status"
                                    value={values.status}
                                    onChange={handleStatusChange} // Custom handler
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="NEW">New</MenuItem>
                                    <MenuItem value="PROCESSING">Processing</MenuItem>
                                    <MenuItem value="SHIPPED">Out for delivery</MenuItem>
                                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                                </Select>
                            </div>

                        </>
                        <>
                            <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                <Customer />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Customer</p>

                            </div>
                            <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                {ordersDetailsData?.data?.userId?.firstName} {ordersDetailsData?.data?.userId?.lastName}

                            </div>
                        </>
                        <div className={orderStyle.iconStyle}>
                            <div>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <EmailIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Email</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10, textTransform: 'none' }}>
                                    {ordersDetailsData?.data?.userId?.email}
                                </div>
                            </div>
                            <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyEmail}>
                                <CopyIcon />
                                {copied && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                            </div>
                        </div>
                        <div className={orderStyle.iconStyle}>
                            <div>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <PhoneIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Phone Number</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.userId?.phone}
                                </div>
                            </div>
                            <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyPhone}>
                                <CopyIcon />
                                {copiedPhone && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* tabView */}
                <div className={orderStyle.tabViewCard}>
                    <div >
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><InfoReviewIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    General Information
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <Orders />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Order status </p>

                                </div>
                                <div style={{ marginLeft: 30, marginTop: 10 }}>
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
                                        defaultValue=""
                                        name="status"
                                        value={values.status}
                                        onChange={handleStatusChange} // Custom handler
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="NEW">New</MenuItem>
                                        <MenuItem value="PROCESSING">Processing</MenuItem>
                                        <MenuItem value="SHIPPED">Out for delivery</MenuItem>
                                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                                    </Select>
                                </div>

                            </>
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <Customer />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Customer</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.userId?.firstName} {ordersDetailsData?.data?.userId?.lastName}

                                </div>
                            </>
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <EmailIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Email</p>

                                    </div>
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10, textTransform: 'none' }}>
                                        {ordersDetailsData?.data?.userId?.email}
                                    </div>
                                </div>
                                <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyEmail}>
                                    <CopyIcon />
                                    {copied && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                                </div>
                            </div>
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <PhoneIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Phone Number</p>

                                    </div>
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        {ordersDetailsData?.data?.userId?.phone}
                                    </div>
                                </div>
                                <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyPhone}>
                                    <CopyIcon />
                                    {copiedPhone && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                                </div>
                            </div>
                        </div>
                        <div className={orderStyle.shipingCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><LocationIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Shipping Address
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, width: 290 }} />
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <HomeIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Address</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.shippingAddress?.firstName}{" "}{ordersDetailsData?.data?.shippingAddress?.lastName},
                                    <br />
                                    {ordersDetailsData?.data?.shippingAddress?.unit}{", "}{ordersDetailsData?.data?.shippingAddress?.streetAddress}{", "}{ordersDetailsData?.data?.shippingAddress?.city}
                                    {' '}{ordersDetailsData?.data?.shippingAddress?.state} {ordersDetailsData?.data?.shippingAddress?.pincode}{","}{ordersDetailsData?.data?.shippingAddress?.country}
                                    {/* Jay Hadgunson
                                    1833 Bel Meadow Drive, Fontana, California 92335, USA */}
                                </div>
                            </>
                        </div>
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><PaymentIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Pancard details
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <PayIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Pan no</p>

                                    </div>
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        {ordersDetailsData?.data?.panNumber}
                                    </div>
                                </div>
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20 }}
                                    onClick={() => openModal(ordersDetailsData?.data?.panImage)}
                                >
                                    <DownloadIcon />
                                    <div>
                                        <img src={ordersDetailsData?.data?.panImage} alt='pancard' style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={orderStyle.shipingCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><LocationIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Billing Address
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, width: 290 }} />
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <HomeIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Address</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.billingAddress?.firstName}{" "}{ordersDetailsData?.data?.billingAddress?.lastName},
                                    <br />
                                    {ordersDetailsData?.data?.billingAddress?.unit}{", "}{ordersDetailsData?.data?.billingAddress?.streetAddress}{", "}{ordersDetailsData?.data?.billingAddress?.city}
                                    {' '}{ordersDetailsData?.data?.billingAddress?.state} {ordersDetailsData?.data?.billingAddress?.pincode}{","}{ordersDetailsData?.data?.billingAddress?.country}
                                </div>
                            </>
                        </div>
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><PaymentIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Payment
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />


                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <IDIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>ID</p>

                                    </div>
                                    {ordersDetailsData?.data?.payment?.method === 'HDFC' ? (
                                        <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                            {ordersDetailsData?.data?.hdfc_order_id}
                                        </div>
                                    ) : (
                                        <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                            {ordersDetailsData?.data?.payment?.id}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: 20, cursor: 'pointer' }} onClick={handleCopyPaymentId}>
                                    <CopyIcon />
                                    {copiedPaymentid && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                                </div>
                            </div>
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <PayIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Payment Method</p>

                                </div>
                                {ordersDetailsData?.data?.payment?.method === 'HDFC' ? (
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        HDFC
                                    </div>
                                ) : (
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        Razorpay
                                    </div>
                                )}
                            </>
                        </div>
                        <div className={orderStyle.viewCardStyle} style={{ marginTop: 20, padding: 20 }}>
                            <div className={orderStyle.generalInfoStyle}>
                                <div className={orderStyle.backgroundStyle}><ShipingIcon /></div>
                                <div className={orderStyle.generalInfoTextStyle} style={{ paddingLeft: 10 }}>
                                    Shipping
                                </div>
                            </div>
                            <div className={orderStyle.lineStyle} style={{ marginTop: 20, }} />
                            <div className={orderStyle.iconStyle}>
                                <div>
                                    <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                        <IDIcon />
                                        <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Shipping ID</p>

                                    </div>
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        NA
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }} onClick={handleCopyShippingId}>
                                    <CopyIcon />
                                    {copiedShippingId && <span style={{ marginLeft: 5, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>Copied!</span>}
                                </div>
                            </div>
                            <>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <ShipMethodIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Shipping Method</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    Regular
                                </div>
                            </>
                        </div>
                    </div>

                </div>
            </div>
            <PreviewModal
                // heading={"Delete Order"}
                onClose={closeModal}
                open={isModalOpen}
                data={datas}
            />
            <EditPriceModal
                onClose={closeEditPriceModal}
                open={isEditPriceModalOpen}
                data={datas}
            />

        </div >
    )
}
