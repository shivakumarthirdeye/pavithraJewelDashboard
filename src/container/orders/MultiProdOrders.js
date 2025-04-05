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

export const MultiProductOrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh } = useSelector((state) => state.orders);
    console.log('ordersDetailsData', ordersDetailsData);


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
            dispatch(updateStatus({ val: { status: selectedStatus }, id: id, orderType: 'Ready to ship orders' })); // Trigger API call
        }
    };
    const handleStatusChangeForMadeOrder = (event) => {
        const selectedStatus = event.target.value;
        if (selectedStatus) {
            setFieldValue("status", selectedStatus); // Update Formik state
            dispatch(updateStatus({ val: { status: selectedStatus }, id: id, orderType: 'Made to orders' })); // Trigger API call
        }
    };
    // useEffect(() => {
    //     if (lastValue) {
    //         setValues({
    //             status: lastValue.name
    //         })
    //     }
    // },[setValues,lastValue])


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
                        Orders <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Order Details
                        </span>
                        <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Order #{ordersDetailsData?.data?._id}
                        </span>
                    </div>
                </div>
                <div className={productStyle.attributeStyle} style={{ marginTop: 20 }}>
                    {/* <div className={orderStyle.exportStyle}>
                        <ExportBlackIcon /> Export
                    </div> */}
                    {/* {ordersDetailsData?.status === 'DELIVERED' && (
                        <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews/${ordersDetailsData?._id}`)}>
                            Customer reviews
                        </div>
                    )} */}
                    <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews/${ordersDetailsData?.data?._id}`)}>
                        Customer reviews
                    </div>
                    {/* <div className={productStyle.buttonStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/OrdersInvoice/${ordersDetailsData?.data?._id}`)}>
                        <InvoiceIcon /><div className={productStyle.addcategoryText}> Invoice</div>
                    </div> */}
                    <div
                        className={productStyle.buttonStyle}
                        style={{ backgroundColor: '#E87819' }}
                        onClick={() => navigate('/orders/Orders')}
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
                            <div className={orderStyle.textStyle}>
                                Products
                            </div>
                        </div>
                        <div className={orderStyle.iconStyle} style={{ gap: 10, alignItems: 'flex-start' }}>
                            <div className={orderStyle.dateStyle}>
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
                        <div style={{ width: "65%", overflowX: "scroll" }}>
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
                                </div>
                                <div>
                                    {ordersDetailsData?.data?.products?.map((item, index) => {
                                        console.log('items---------------------', item);

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
                                                    <div className={orderStyle.goldWeightText} style={{ letterSpacing: 1.5, textTransform: 'lowercase' }}>
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
                                                </div>
                                                <div className={orderStyle.bottomLineStyle} />
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />

                        </div>
                        <div style={{ width: "35%", borderLeft: "6px solid #EEEEEE", overflowX: 'scroll' }}>
                            <div className={orderStyle.scrollContainer} >
                                <div className={orderStyle.header}>
                                    <div className={orderStyle.qytText}>Status</div>
                                    <div className={orderStyle.pendingAmountStyle} style={{fontSize:14}}>Payment </div>
                                    <div className={orderStyle.priceStyle} >Total </div>
                                </div>
                                <div>
                                    {ordersDetailsData?.data?.products?.map((item, index) => {
                                        const arr = item?.status;
                                        const lastValue = arr?.at(-1);
                                        return (
                                            <>
                                                <div className={orderStyle.info} key={index}>
                                                    <div style={{ width: '34%' }}>
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
                                                                    fontSize: 12,
                                                                    fontWeight: '600',
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
                                                    {item?.selectedPaymentType === "Ad Paid" ? (
                                                        <div className={orderStyle.pendingAmountStyle} style={{ fontSize: 10 }}>
                                                            Ad paid: ₹{item?.adPaymentAmount?.toLocaleString("en-IN")} <br />
                                                            <p className={orderStyle.pendingAmount} onClick={() => openEditPriceModal(item)}>
                                                                Pending: ₹{item?.pendingAmount?.toLocaleString("en-IN")} <EditBlackIcon /></p>
                                                        </div>
                                                    ) : (
                                                        <div className={orderStyle.fullyPaid}>Fully paid</div>
                                                    )}
                                                    <div className={orderStyle.priceStyle}>₹{item?.sellingPrice?.toLocaleString("en-IN")}
                                                    </div>
                                                </div>
                                                <div className={orderStyle.bottomLineStyle} />
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.pendingAmountStyle}>Shipping Rate</div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.shippingRate} </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, }}>Grand Total</div>
                                <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, }}>₹{ordersDetailsData?.data?.grandTotal?.toLocaleString("en-IN")}</div>
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
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        {ordersDetailsData?.data?.payment?.id}
                                    </div>
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
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {/* {ordersDetailsData?.payment?.type} */}
                                    Razorpay
                                </div>
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
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Ready to ship orders status </p>

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
                            <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                <Orders />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Made to orders status </p>

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
                                    onChange={handleStatusChangeForMadeOrder} // Custom handler
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
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Ready to ship orders status </p>

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
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <Orders />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Made to orders status </p>

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
                                        onChange={handleStatusChangeForMadeOrder} // Custom handler
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
                                    <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                        {ordersDetailsData?.data?.payment?.id}
                                    </div>
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
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {/* {ordersDetailsData?.payment?.type} */}
                                    Razorpay
                                </div>
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
