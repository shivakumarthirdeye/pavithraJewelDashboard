import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import { CopyIcon, Customer, CustomerInfoIcon, DatePickerIcon, DownloadIcon, EmailIcon, ExportBlackIcon, ForwardIcon, HomeIcon, IDIcon, IncomeIcon, InfoIcon, InfoReviewIcon, InvoiceIcon, LocationIcon, Orders, PayIcon, PaymentIcon, PhoneIcon, ShipingIcon, ShipMethodIcon } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersDetails, getCustomerReviews, updateStatus } from '../../redux/ordersSlice';
import PreviewModal from '../../component/PreviewModal';
import { formatDate } from '../../helper/FormatDate';
import { MenuItem, Select } from '@mui/material';
import { formselect } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import { getGoldRate } from '../../redux/dashboardSlice';

export const ReadyToShipOrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();


    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh, } = useSelector((state) => state.orders);
    const { goldRateData } = useSelector((state) => state.dashboard);
    console.log('ordersDetailsData', ordersDetailsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [copied, setCopied] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [copiedPaymentid, setCopiedPaymentId] = useState(false);
    const [copiedShippingId, setCopiedShippingId] = useState(false);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [dispatch, id,isRefresh])

    

    useEffect(() => {
        dispatch(getCustomerReviews(id))
    }, [isRefresh, id, dispatch])

    useEffect(() => {
        dispatch(getGoldRate())
    }, [dispatch])

    const openModal = (data) => {
        setData(data);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };


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
            dispatch(updateStatus({ val: { status: selectedStatus, } , id: id, })); // Trigger API call
        }
    };
    const arr = ordersDetailsData?.data?.status;
    const lastValue = arr?.at(-1); 

    useEffect(() => {
        if (lastValue) {
            setValues({
                status: lastValue.name
            })
        }
    },[setValues,lastValue])

    // Variables to store total price and GST details
    let totalPriceBeforeGst = 0;

    // Iterate through products to extract price before GST and GST amounts
    const productsWithGst = ordersDetailsData?.data?.products?.map((item) => {
        const totalPriceWithGst = item?.totalPrice || 0;
        const gstInPercentage = item?.gst || 0;

        // Calculate price before GST for each product
        const priceBeforeGst = totalPriceWithGst / (1 + gstInPercentage / 100);
        
        // Calculate the GST amount for each product
        
        // Accumulate the total price before GST and total GST amount
        totalPriceBeforeGst += priceBeforeGst;
    });

    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Order {ordersDetailsData?.order_id}</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        Orders <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            {ordersDetailsData?.data?.orderType}
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

                    <div className={productStyle.buttonStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/OrdersInvoice/${ordersDetailsData?.data?._id}`)}>
                        <InvoiceIcon /><div className={productStyle.addcategoryText}> Invoice</div>
                    </div>
                    <div
                        className={productStyle.buttonStyle}
                        style={{ backgroundColor: '#E87819' }}
                        onClick={() => navigate('/orders/ReadyToShipOrders')}
                    >
                        <span className={productStyle.addcategoryText}>Back To List</span>
                    </div>
                </div>
            </div>
            <div className={orderStyle.cardWrap} style={{ marginBottom: 30 }}>
                <div>
                    <div className={orderStyle.productStockContainer} style={{ marginTop: 20, }}>
                        <div className={orderStyle.productStyle} style={{ padding: 20 }}>
                            <div className={orderStyle.iconStyle}>
                                <div className={orderStyle.textStyle}>
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
                                <div className={orderStyle.cardWrap} style={{ marginTop: 5, }}>
                                    <DatePickerIcon />
                                    <div className={orderStyle.filterTextStyle}>
                                        {formatDate(ordersDetailsData?.data?.updatedAt)}
                                        {/* 13 January 2023, 14:00 */}
                                    </div>
                                </div>
                                <div className={orderStyle.goldRateStyle}>
                                    Gold rate 18k: <span> ₹{goldRateData?.data?.k18}/g </span>
                                    <br />
                                    Gold rate 22k: <span> ₹{goldRateData?.data?.k22}/g </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: lastValue?.name === 'NEW' ? "#c7c8ca"
                                            : lastValue?.name === 'PROCESSING' ? '#F439391A'
                                                : lastValue?.name === 'SHIPPED' ? '#EAF8FF'
                                                                : '#E9FAF7',
                                        // width: '35%',
                                        borderRadius: 10,
                                        height: 30,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 10,
                                        alignSelf: 'center',
                                        marginLeft: 10
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'DM Sans',
                                            fontSize: 14,
                                            fontWeight: '600',
                                            letterSpacing: 0.5,
                                            textAlign: 'center',
                                            color: lastValue?.name === 'NEW' ? "#4A4C56"
                                                : lastValue?.name === 'PROCESSING' ? '#F86624'
                                                    : lastValue?.name === 'SHIPPED' ? '#2BB2FE'
                                                                    : '#1A9882',
                                        }}
                                    >{lastValue?.name === 'NEW' ? "New"
                                        : lastValue?.name === 'PROCESSING' ? 'Processing'
                                            : lastValue?.name === 'SHIPPED' ? 'Shipped'
                                                            : 'Delivered'
                                        }</span>
                                </div>
                            </div>
                        </div>
                        <div className={orderStyle.header}>
                            <div className={orderStyle.productTextStyle} style={{ width: '40%' }}>Product </div>
                            <div className={orderStyle.skuText}>SKU</div>
                            <div className={orderStyle.qytText}>QTY</div>
                            <div className={orderStyle.priceStyle}>Price </div>
                            <div className={orderStyle.totalAmountStyle}>Total </div>
                        </div>
                        <div>
                            {ordersDetailsData?.data?.products?.map((item, index) => {
                                return (
                                    <>
                                        <div className={orderStyle.info} key={index}>
                                            <div style={{ width: '40%' }}>
                                                <div className={orderStyle.productTextStyle}>
                                                    <div>
                                                        <img src={item?.productId?.featurerdImage} width={40} height={40} style={{ borderRadius: 5, objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ marginTop: 2, marginLeft: 5 }}>
                                                        <p className={orderStyle.proNameText}>
                                                            {item?.productId?.productName}
                                                        </p>
                                                        <p className={orderStyle.categoryStyle}>
                                                            {item?.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* {ordersDetailsData?.exchange?.products[0]?._id === item?.productId?._id ? (
                                                    <div className={orderStyle.exchangeStyle}>
                                                        Exchange request
                                                    </div>
                                                ) : null} */}
                                            </div>
                                            <div className={orderStyle.skuText} >{item?.productId?.inventory?.sku}</div>
                                            <div className={orderStyle.qytText}>{item?.quantity} pcs</div>
                                            <div className={orderStyle.priceStyle}>₹{item?.sellingPrice?.toFixed(2)} </div>
                                            <div className={orderStyle.totalAmountStyle}>₹{item?.quantity * item?.sellingPrice?.toFixed(2)} </div>

                                        </div>
                                        <div className={orderStyle.bottomLineStyle} />
                                    </>
                                )
                            })}

                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Subtotal </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.subTotal?.toFixed(2)}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Gold weight</div>
                                <div className={orderStyle.totalAmountStyle}>{ordersDetailsData?.data?.products[0]?.productId?.pricing?.goldWeight?.value}g</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Gold rate({ordersDetailsData?.data?.products[0]?.productId?.gold?.type === 'k18' ? '18k' : '22k'})</div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.products[0]?.productId?.pricing?.goldRate?.value}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>GST ({ordersDetailsData?.singleProduct?.gst}%) </div>
                                <div className={orderStyle.totalAmountStyle}>₹{(ordersDetailsData?.singleProduct?.sellingPrice * ordersDetailsData?.singleProduct?.gst / 100).toFixed(2)}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Stone charges </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.singleProduct?.stoneCharges}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Making charges </div>
                                <div className={orderStyle.totalAmountStyle}>{ordersDetailsData?.singleProduct?.makingCharges}%</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>Shipping Rate</div>
                                <div className={orderStyle.totalAmountStyle}>₹0 </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle} style={{ fontWeight: '500', fontSize: 18 }}>Grand Total</div>
                                <div className={orderStyle.totalAmountStyle} style={{ fontWeight: '500', fontSize: 18 }}>₹{ordersDetailsData?.data?.grandTotal?.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={orderStyle.cardWrap}>
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
                                </div>
                            </>
                        </div>
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
                    </div>
                </div>
                <div>
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
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Order Status</p>

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
                                {/* {ordersDetailsData?.payment_method} */}
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
                                    {/* SHP1092311 */}NA
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
                                {/* {ordersDetailsData?.shippingMode} */}
                                Regular
                            </div>
                        </>
                    </div>
                </div>
            </div>
            <PreviewModal
                // heading={"Delete Order"}
                onClose={closeModal}
                open={isModalOpen}
                data={datas}
            />


        </div >
    )
}
