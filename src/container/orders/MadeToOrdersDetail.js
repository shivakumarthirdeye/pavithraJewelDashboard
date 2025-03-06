import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import { CopyIcon, Customer, DatePickerIcon, DownloadIcon, EditBlackIcon, EditIcon, EditReviewIcon, EmailIcon, ExportBlackIcon, ForwardIcon, HomeIcon, IDIcon, IncomeIcon, InfoIcon, InfoReviewIcon, InvoiceIcon, LocationIcon, Orders, PayIcon, PaymentIcon, PhoneIcon, ShipingIcon, ShipMethodIcon } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersDetails, getCustomerReviews, updateStatus } from '../../redux/ordersSlice';
import PreviewModal from '../../component/PreviewModal';
import EditPriceModal from './EditPriceModal';
import { formselect } from '../../MaterialsUI';
import { MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { getGoldRate } from '../../redux/dashboardSlice';

export const MadeToOrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh } = useSelector((state) => state.orders);
    const { goldRateData } = useSelector((state) => state.dashboard);
    console.log('ordersDetailsData', ordersDetailsData);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [dispatch, id, isRefresh])

    useEffect(() => {
        dispatch(getGoldRate())
    }, [dispatch])

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
        values
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
            dispatch(updateStatus({ val: { status: selectedStatus }, id: id, })); // Trigger API call
        }
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
    const arr = ordersDetailsData?.data?.status;
    const lastValue = arr?.at(-1);

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
                        onClick={() => navigate(-1)}
                    >
                        <span className={productStyle.addcategoryText}>Back To List</span>
                    </div>
                </div>
            </div>
            <div className={orderStyle.cardWrap} style={{ marginBottom: 30 }}>
                {/* Product info */}
                <div>
                    <div className={orderStyle.productStockContainer} style={{ marginTop: 20, }}>
                        <div className={orderStyle.productStyle} style={{ padding: 20 }}>
                            <div className={orderStyle.iconStyle}>
                                <div className={orderStyle.textStyle}>
                                    Products
                                </div>
                            </div>
                            <div className={orderStyle.iconStyle} style={{ gap: 10, alignItems: 'flex-start' }}>
                                <div className={orderStyle.cardWrap} style={{ gap: 8 }}>
                                    <DatePickerIcon />
                                    <div className={orderStyle.filterTextStyle}>
                                        {formatDate(ordersDetailsData?.data?.updatedAt)}
                                        {/* 13 January 2023, 14:00 */}
                                    </div>
                                </div>
                                {ordersDetailsData?.singleProduct?.productId?.metalType[0] === 'GOLD' && (
                                    <div className={orderStyle.goldRateStyle}>
                                        {ordersDetailsData?.singleProduct?.productId?.gold?.type === 'k18' ? (
                                            <>
                                                Gold rate 18k: <span> ₹{goldRateData?.data?.k18}/g </span>
                                                <br />
                                            </>
                                        ) : (
                                            <>
                                                Gold rate 22k: <span> ₹{goldRateData?.data?.k22}/g </span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div
                                    style={{
                                        backgroundColor: lastValue?.name === 'NEW' ? "#4A4C561A"
                                            : lastValue?.name === 'PROCESSING' ? '#F439391A'
                                                : lastValue?.name === 'SHIPPED' ? '#EAF8FF'
                                                    : lastValue?.name === "DELIVERED" ? "#E9FAF7"
                                                        : lastValue?.name === "CONFIRMED" ? "#e7f9bb"
                                                            : '#B93ED71A',
                                        // width: '35%',
                                        borderRadius: 10,
                                        height: 30,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        paddingLeft:10,
                                        paddingRight:10,
                                        alignSelf: 'center',
                                        marginLeft: 10
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'DM Sans',
                                            fontSize: 12,
                                            fontWeight: '400',
                                            letterSpacing: 0.1,
                                            textAlign: 'center',
                                            color: lastValue?.name === 'NEW' ? "#4A4C56"
                                                : lastValue?.name === 'PROCESSING' ? '#F86624'
                                                    : lastValue?.name === 'SHIPPED' ? '#2BB2FE'
                                                        : lastValue?.name === "DELIVERED" ? "#1A9882"
                                                            : "#c723ca",
                                        }}
                                    >{lastValue?.name === 'NEW' ? "New"
                                        : lastValue?.name === 'PROCESSING' ? 'Processing'
                                            : lastValue?.name === 'SHIPPED' ? 'Shipped'
                                                : lastValue?.name === "DELIVERED" ? "Delivered"
                                                    : 'Ready to ship'
                                        }</span>
                                </div>
                            </div>
                        </div>
                        <div className={orderStyle.header}>
                            <div className={orderStyle.productTextStyle} style={{ width: '40%' }}>Product </div>
                            <div className={orderStyle.skuText}>SKU</div>
                            <div className={orderStyle.qytText}>QTY</div>
                            <div className={orderStyle.pendingAmountStyle}>Price </div>
                            <div className={orderStyle.totalAmountStyle}>Total </div>
                        </div>
                        <div>

                            <div className={orderStyle.info}>
                                <div style={{ width: '40%' }}>
                                    <div className={orderStyle.productTextStyle}>
                                        <div>
                                            <img
                                                // src={item?.productId?.featuredImage}
                                                src='/jweleryImage.png'
                                                width={40}
                                                height={40}
                                                style={{ borderRadius: 5 }}
                                                alt='featuredImage'
                                            />
                                        </div>
                                        <div style={{ marginTop: 2, marginLeft: 5 }}>
                                            <p className={orderStyle.proNameText}>
                                                {ordersDetailsData?.singleProduct?.productId?.productName}
                                            </p>
                                            <p className={orderStyle.categoryStyle}>
                                                {ordersDetailsData?.singleProduct?.productId?.pricing?.stoneType?.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={orderStyle.skuText} >{ordersDetailsData?.singleProduct?.productId?.inventory?.sku}</div>
                                <div className={orderStyle.qytText}>{ordersDetailsData?.singleProduct?.quantity} pcs <br /><p> {ordersDetailsData?.singleProduct?.totalWeight}gm</p></div>
                                <div className={orderStyle.pendingAmountStyle}>₹{(ordersDetailsData?.singleProduct?.sellingPrice)?.toFixed(2)} </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.singleProduct?.sellingPrice * ordersDetailsData?.singleProduct?.quantity} </div>

                            </div>
                            <div className={orderStyle.bottomLineStyle} />


                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>Subtotal </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.subTotal}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            {ordersDetailsData?.singleProduct?.productId?.metalType[0] === 'GOLD' && (
                                <div className={orderStyle.info} >
                                    <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                    <div className={orderStyle.skuText} ></div>
                                    <div className={orderStyle.qytText}></div>
                                    <div className={orderStyle.pendingAmountStyle}>Gold Weight</div>
                                    <div className={orderStyle.totalAmountStyle}>{ordersDetailsData?.singleProduct?.productId?.pricing?.goldWeight?.value}gm</div>
                                </div>
                            )}
                            <div className={orderStyle.bottomLineStyle} />
                            {ordersDetailsData?.singleProduct?.productId?.metalType[0] === 'GOLD' && (
                                <div className={orderStyle.info} >
                                    <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                    <div className={orderStyle.skuText} ></div>
                                    <div className={orderStyle.qytText}></div>
                                    <div className={orderStyle.pendingAmountStyle}>Gold Rate</div>
                                    <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.singleProduct?.productId?.pricing?.goldRate?.value}</div>
                                </div>
                            )}

                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>Making charges </div>
                                <div className={orderStyle.totalAmountStyle}>{ordersDetailsData?.singleProduct?.makingCharges || 0}%</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>Stone charges </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.singleProduct?.stoneCharges || 0}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>GST ({ordersDetailsData?.singleProduct?.gst}%) </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.singleProduct?.sellingPrice * ordersDetailsData?.singleProduct?.gst / 100}</div>
                            </div>


                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>Shipping Rate</div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.shippingRate} </div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, }}>Grand Total</div>
                                <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, }}>₹{ordersDetailsData?.data?.grandTotal}</div>
                            </div>
                            {lastValue?.name === 'NEW' || lastValue?.name === 'PROCESSING' || lastValue?.name === 'READY TO SHIP' ? (
                                <>
                                    <div className={orderStyle.bottomLineStyle} />
                                    <div className={orderStyle.info} >
                                        <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                        <div className={orderStyle.skuText} ></div>
                                        <div className={orderStyle.qytText}></div>
                                        <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, fontSize: 14 }}>Advance paid</div>
                                        <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, fontSize: 14, color: '#1DB41D' }}>₹{ordersDetailsData?.data?.advancePaid}</div>
                                    </div>
                                    <div className={orderStyle.bottomLineStyle} />
                                    <div className={orderStyle.info} >
                                        <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                        <div className={orderStyle.skuText} ></div>
                                        <div className={orderStyle.qytText} style={{ width: '28%', }}>Extra weight: <span style={{ fontWeight: 600, }}>{ordersDetailsData?.data?.extraWeight}g</span></div>
                                        <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, color: '#F92929' }}>Pending Amount</div>
                                        <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, }} onClick={() => openEditPriceModal(ordersDetailsData)}>₹{ordersDetailsData?.data?.pendingAmount} <EditBlackIcon /></div>
                                    </div>
                                </>
                            ) : null}
                            {lastValue?.name === 'DELIVERED' || lastValue?.name === 'SHIPPED' ? (
                                <>
                                    <div className={orderStyle.bottomLineStyle} />
                                    <div className={orderStyle.info} >
                                        <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                        <div className={orderStyle.skuText} ></div>
                                        <div className={orderStyle.qytText}></div>
                                        <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, fontSize: 18, color: '#1DB41D' }}>Paid</div>
                                        <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, fontSize: 18, color: '#1DB41D' }}>₹{ordersDetailsData?.data?.grandTotal}</div>
                                    </div>
                                </>
                            ) : null}
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
                                    {/* Jay Hadgunson
                                    1833 Bel Meadow Drive, Fontana, California 92335, USA */}
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
                {/* General Information */}
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
                                    value={values.status || lastValue?.name}
                                    onChange={handleStatusChange} // Custom handler
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="NEW">New</MenuItem>
                                    <MenuItem value="PROCESSING">Processing</MenuItem>
                                    <MenuItem value="SHIPPED">Shipped</MenuItem>
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
                                    {ordersDetailsData?.payment?.id}
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
                                    SHP1092311
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
            <EditPriceModal
                onClose={closeEditPriceModal}
                open={isEditPriceModalOpen}
                data={datas}
            />

            {/* <ExchangeRequest
                // heading={"Delete Order"}
                closeModal={closeExchangeModal}
                open={isExchangeModalOpen}
                data={ordersDetailsData?.exchange}
            /> */}

        </div >
    )
}
