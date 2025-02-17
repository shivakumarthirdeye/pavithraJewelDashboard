import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import { CopyIcon, Customer, DatePickerIcon, DownloadIcon, EditIcon, EditReviewIcon, EmailIcon, ExportBlackIcon, ForwardIcon, HomeIcon, IDIcon, IncomeIcon, InfoIcon, InfoReviewIcon, InvoiceIcon, LocationIcon, Orders, PayIcon, PaymentIcon, PhoneIcon, ShipingIcon, ShipMethodIcon } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersDetails, getCustomerReviews } from '../../redux/ordersSlice';
import PreviewModal from '../../component/PreviewModal';
import EditPriceModal from './EditPriceModal';
import { formselect } from '../../MaterialsUI';
import { MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

export const MadeToOrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const dispatch = useDispatch();
    const { ordersDetailsData, isRefresh, } = useSelector((state) => state.orders);
    console.log('ordersDetailsData', ordersDetailsData);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [dispatch, id, isRefresh])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [datas, setData] = useState([]);



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
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
    } = useFormik({
        initialValues: {
            productName: "",
        },
        onSubmit: async (values) => {
            // handleSubject(values)
        }

    })

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
                    <div className={orderStyle.exportStyle}>
                        <ExportBlackIcon /> Export
                    </div>
                    {/* {ordersDetailsData?.status === 'DELIVERED' && (
                        <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews/${ordersDetailsData?._id}`)}>
                            Customer reviews
                        </div>
                    )} */}
                    <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews/${ordersDetailsData?._id}`)}>
                        Customer reviews
                    </div>
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/orders/ReadyToShipOrders/ReadyToShipOrderDetails/OrdersInvoice')}>
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
                                <div className={orderStyle.goldRateStyle}>
                                    Gold rate 18k: <span> ₹{ordersDetailsData?.data?.goldRate18k}/g </span>
                                    <br />
                                    Gold rate 22k: <span> ₹{ordersDetailsData?.data?.goldRate22k}/g </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: ordersDetailsData?.singleProduct?.productId?.status === 'NEW' ? "#4A4C561A"
                                            : ordersDetailsData?.singleProduct?.productId?.status === 'PROCESSING' ? '#F439391A'
                                                : ordersDetailsData?.singleProduct?.productId?.status === 'SHIPPED' ? '#EAF8FF'
                                                    : ordersDetailsData?.singleProduct?.productId?.status === "DELIVERED" ? "#E9FAF7"
                                                        : ordersDetailsData?.singleProduct?.productId?.status === "CONFIRMED" ? "#e7f9bb"
                                                            : '#B93ED71A',
                                        // width: '35%',
                                        borderRadius: 10,
                                        height: 30,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 5,
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
                                            color: ordersDetailsData?.singleProduct?.productId?.status === 'NEW' ? "#4A4C56"
                                                : ordersDetailsData?.singleProduct?.productId?.status === 'PROCESSING' ? '#F86624'
                                                    : ordersDetailsData?.singleProduct?.productId?.status === 'SHIPPED' ? '#2BB2FE'
                                                        : ordersDetailsData?.singleProduct?.productId?.status === "DELIVERED" ? "#1A9882"
                                                            : ordersDetailsData?.singleProduct?.productId?.status === "CONFIRMED" ? "#97d30c"
                                                                : "#c723ca",
                                        }}
                                    >{ordersDetailsData?.singleProduct?.productId?.status === 'NEW' ? "New"
                                        : ordersDetailsData?.singleProduct?.productId?.status === 'PROCESSING' ? 'Processing'
                                            : ordersDetailsData?.singleProduct?.productId?.status === 'SHIPPED' ? 'Shipped'
                                                : ordersDetailsData?.singleProduct?.productId?.status === "DELIVERED" ? "Delivered"
                                                    : ordersDetailsData?.singleProduct?.productId?.status === "CONFIRMED" ? "Confirmed"
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
                                                {ordersDetailsData?.singleProduct?.productId?.features?.stoneColor}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={orderStyle.skuText} >{ordersDetailsData?.singleProduct?.productId?.inventory?.sku}</div>
                                <div className={orderStyle.qytText}>{ordersDetailsData?.singleProduct?.quantity} pcs <br /> 50gm</div>
                                <div className={orderStyle.pendingAmountStyle}>₹{ordersDetailsData?.singleProduct?.sellingPrice} </div>
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
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.pendingAmountStyle}>GST ({ordersDetailsData?.data?.gst}%) </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersDetailsData?.data?.subTotal * ordersDetailsData?.data?.gst / 100}</div>
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
                                <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, fontSize: 18 }}>Grand Total</div>
                                <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, fontSize: 18 }}>₹{ordersDetailsData?.data?.grandTotal}</div>
                            </div>
                            {ordersDetailsData?.data?.status === 'NEW' || ordersDetailsData?.data?.status === 'PROCESSING' || ordersDetailsData?.data?.status === 'READY TO SHIP' ? (
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
                                        <div className={orderStyle.pendingAmountStyle} style={{ fontWeight: 500, fontSize: 16, color: '#F92929' }}>Pending Amount</div>
                                        <div className={orderStyle.totalAmountStyle} style={{ fontWeight: 500, fontSize: 18, }} onClick={() => openEditPriceModal(ordersDetailsData)}>₹{ordersDetailsData?.data?.pendingAmount} <EditIcon /></div>
                                    </div>
                                </>
                            ) : null}
                            {ordersDetailsData?.status === 'DELIVERED' || ordersDetailsData?.status === 'SHIPPED' && (
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
                            )}
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
                                    defaultValue=''
                                    name='status'
                                    value={values.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="NEW">New</MenuItem>
                                    <MenuItem value="PROCESSING">Processing</MenuItem>
                                    <MenuItem value="SHIPPED">Shipped</MenuItem>
                                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                                    <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                    <MenuItem value="Ready to ship">Ready to ship</MenuItem>
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
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {ordersDetailsData?.data?.userId?.email}
                                </div>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <CopyIcon />
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
                            <div style={{ marginTop: 20 }}>
                                <CopyIcon />
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
                            <div style={{ marginTop: 20 }}>
                                <CopyIcon />
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
                            <div style={{ marginTop: 20 }}>
                                <CopyIcon />
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
