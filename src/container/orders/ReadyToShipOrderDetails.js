import React, { useEffect, useState } from 'react';
import orderStyle from './orders.module.css';
import productStyle from '../../container/product/product.module.css'
import { CopyIcon, Customer, CustomerInfoIcon, DatePickerIcon, DownloadIcon, EmailIcon, ExportBlackIcon, ForwardIcon, HomeIcon, IDIcon, IncomeIcon, InfoIcon, InfoReviewIcon, InvoiceIcon, LocationIcon, Orders, PayIcon, PaymentIcon, PhoneIcon, ShipingIcon, ShipMethodIcon } from '../../svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersDetails, getCustomerReviews } from '../../redux/ordersSlice';
import PreviewModal from '../../component/PreviewModal';

export const ReadyToShipOrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();


    const dispatch = useDispatch();
    const orderDetail = useSelector((state) => state.orders);
    const ordersById = orderDetail?.ordersDetailsData?.data;
    console.log('ordersById', ordersById);

    const isRefresh = useSelector((state) => state.orders.isRefresh);


    useEffect(() => {
        dispatch(getOrdersDetails(id))
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
    const [datas, setData] = useState([]);

    useEffect(() => {
        dispatch(getCustomerReviews(id))
    }, [isRefresh])

    const openModal = (data) => {
        setData(data);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openExchangeModal = (data) => {
        setData(data);
        setIsExchangeModalOpen(true);
    };
    const closeExchangeModal = () => {
        setIsExchangeModalOpen(false);
    };

    const Data = [
        {
            id: 0,
            productId: {
                featuredImage: '/jweleryImage.png'
            },
            name: 'Bangles',
            type: 'Black stone',
            sku: '23343',
            units: '2',
            selling_price: '34333'
        },
        {
            id: 2,
            productId: {
                featuredImage: '/jweleryImage.png'
            },
            name: 'Bangles',
            type: 'Black stone',
            sku: '20343',
            units: '3',
            selling_price: '34333'
        },
    ]
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container}>
                <div>
                    <div>
                        <h2 className={productStyle.categoryText}>Order {ordersById?.order_id}</h2>
                    </div>
                    <div className={productStyle.home} style={{ marginTop: 10 }}>
                        Orders <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Orders
                        </span>
                        <div style={{ marginLeft: 10 }} ><ForwardIcon /></div>{" "}
                        <span style={{ marginLeft: 10 }}>
                            Order #{ordersById?.order_id}
                        </span>
                    </div>
                </div>
                <div className={productStyle.attributeStyle} style={{ marginTop: 20 }}>
                    <div className={orderStyle.exportStyle}>
                        <ExportBlackIcon /> Export
                    </div>
                    {/* {ordersById?.status === 'DELIVERED' && (
                        <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews/${ordersById?._id}`)}>
                            Customer reviews
                        </div>
                    )} */}
                    <div className={orderStyle.exportStyle} onClick={() => navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/CustomerReviews`)}>
                            Customer reviews
                        </div>
                    {ordersById?.status === 'EXCHANGE REQUEST' && (
                        <div className={orderStyle.exchangeStyle} onClick={() => openExchangeModal()}>
                            Exchange request
                        </div>
                    )}
                    <div className={productStyle.buttonStyle} onClick={() => navigate('/orders/ReadyToShipOrders/ReadyToShipOrderDetails/OrdersInvoice')}>
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
                                        {/* {ordersById?.order_items?.length} */}
                                        2
                                    </span>
                                </div>
                            </div>
                            <div className={orderStyle.iconStyle}>
                                <div className={orderStyle.cardWrap} style={{ marginTop: 5, }}>
                                    <DatePickerIcon />
                                    <div className={orderStyle.filterTextStyle}>
                                        {/* {ordersById?.order_date} */}
                                        13 January 2023, 14:00
                                    </div>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: ordersById?.status === 'NEW' ? "#c7c8ca"
                                            : ordersById?.status === 'PROCESSING' ? '#F439391A'
                                                : ordersById?.status === 'SHIPPED' ? '#EAF8FF'
                                                    : ordersById?.status === "EXCHANGE REQUEST" ? "#E9FAF7"
                                                        : ordersById?.status === "EXCHANGED" ? "#e7f9bb"
                                                            : ordersById?.status === "EXCHANGE REJECTED" ? "#f7e5f9"
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
                                            color: ordersById?.status === 'NEW' ? "#4A4C56"
                                                : ordersById?.status === 'PROCESSING' ? '#F86624'
                                                    : ordersById?.status === 'SHIPPED' ? '#2BB2FE'
                                                        : ordersById?.status === "EXCHANGE REQUEST" ? "#1A9882"
                                                            : ordersById?.status === "EXCHANGED" ? "#97d30c"
                                                                : ordersById?.status === "EXCHANGE REJECTED" ? "#c723ca"
                                                                    : '#1A9882',
                                        }}
                                    >{ordersById?.status === 'NEW' ? "New"
                                        : ordersById?.status === 'PROCESSING' ? 'Processing'
                                            : ordersById?.status === 'SHIPPED' ? 'Shipped'
                                                : ordersById?.status === "EXCHANGE REQUEST" ? "Delivered"
                                                    : ordersById?.status === "EXCHANGED" ? "Exchanged"
                                                        : ordersById?.status === "EXCHANGE REJECTED" ? "Exchange Rejected"
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
                            {Data?.map((item, index) => {
                                return (
                                    <>
                                        <div className={orderStyle.info} key={index}>
                                            <div style={{ width: '40%' }}>
                                                <div className={orderStyle.productTextStyle}>
                                                    <div>
                                                        <img src={item?.productId?.featuredImage} width={40} height={40} style={{ borderRadius: 5 }} />
                                                    </div>
                                                    <div style={{ marginTop: 2, marginLeft: 5 }}>
                                                        <p className={orderStyle.proNameText}>
                                                            {item?.name}
                                                        </p>
                                                        <p className={orderStyle.categoryStyle}>
                                                            {item?.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* {ordersById?.exchange?.products[0]?._id === item?.productId?._id ? (
                                                    <div className={orderStyle.exchangeStyle}>
                                                        Exchange request
                                                    </div>
                                                ) : null} */}
                                            </div>
                                            <div className={orderStyle.skuText} >{item?.sku}</div>
                                            <div className={orderStyle.qytText}>{item?.units} pcs</div>
                                            <div className={orderStyle.priceStyle}>₹{(item?.selling_price - item?.selling_price * 18 / 100).toFixed(2)} </div>
                                            <div className={orderStyle.totalAmountStyle}>₹{(item?.units * item?.selling_price - item?.selling_price * 18 / 100).toFixed(2)} </div>

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
                                <div className={orderStyle.totalAmountStyle}>₹{(ordersById?.sub_total - ordersById?.sub_total * 18 / 100).toFixed(2)}</div>
                            </div>
                            <div className={orderStyle.bottomLineStyle} />
                            <div className={orderStyle.info} >
                                <div className={orderStyle.productTextStyle} style={{ width: '40%' }}></div>
                                <div className={orderStyle.skuText} ></div>
                                <div className={orderStyle.qytText}></div>
                                <div className={orderStyle.priceStyle}>GST (18%) </div>
                                <div className={orderStyle.totalAmountStyle}>₹{ordersById?.sub_total * 18 / 100}</div>
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
                                <div className={orderStyle.totalAmountStyle} style={{ fontWeight: '500', fontSize: 18 }}>₹{ordersById?.grandTotal}</div>
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
                                    {/* {ordersById?.billing_customer_name}{" "}{ordersById?.billing_last_name}
                                    {ordersById?.billing_address}{", "}{ordersById?.billing_city}{", "}{ordersById?.billing_state}
                                    {' '}{ordersById?.billing_pincode}{","}{ordersById?.billing_country} */}
                                    Jay Hadgunson
                                    1833 Bel Meadow Drive, Fontana, California 92335, USA
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
                                    {/* {ordersById?.billing_customer_name}{" "}{ordersById?.billing_last_name}
                                    {ordersById?.billing_address}{", "}{ordersById?.billing_city}{", "}{ordersById?.billing_state}
                                    {' '}{ordersById?.billing_pincode}{","}{ordersById?.billing_country} */}
                                    Jay Hadgunson
                                    1833 Bel Meadow Drive, Fontana, California 92335, USA
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
                            <div className={orderStyle.statusStyling} style={{ marginLeft: 30, marginTop: 10 }}>
                                {ordersById?.status === 'NEW' ? "New"
                                    : ordersById?.status === 'PROCESSING' ? 'Processing'
                                        : ordersById?.status === 'SHIPPED' ? 'Shipped'
                                            : ordersById?.status === "EXCHANGE REQUEST" ? "Delivered"
                                                : ordersById?.status === "EXCHANGED" ? "Exchanged"
                                                    : ordersById?.status === "EXCHANGE REJECTED" ? "Exchange Rejected"
                                                        : 'Delivered'}

                            </div>
                        </>
                        <>
                            <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                <Customer />
                                <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Customer</p>

                            </div>
                            <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                {/* {ordersById?.billing_customer_name} {ordersById?.billing_last_name} */}
                                Jay Hadgunson
                            </div>
                        </>
                        <div className={orderStyle.iconStyle}>
                            <div>
                                <div className={orderStyle.generalInfoStyle} style={{ marginTop: 20, }}>
                                    <EmailIcon />
                                    <p className={orderStyle.textStyle} style={{ paddingLeft: 10 }}>Email</p>

                                </div>
                                <div className={orderStyle.proNameText} style={{ marginLeft: 30, marginTop: 10 }}>
                                    {/* {ordersById?.billing_email} */}
                                    jay.hadgunson@mail.com
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
                                    {/* {ordersById?.billing_phone} */}
                                    050 414 8788
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
                                    NDRC1245
                                </div>
                            </div>
                            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20 }}
                                onClick={() => openModal()}
                            >
                                <DownloadIcon />
                                <div>
                                    <img src='/panImg.png' alt='pancard' />
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
                                    490392238192
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
                                {/* {ordersById?.payment_method} */}
                                VISA
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
                                {ordersById?.shippingMode}
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
            {/* <ExchangeRequest
                // heading={"Delete Order"}
                closeModal={closeExchangeModal}
                open={isExchangeModalOpen}
                data={ordersById?.exchange}
            /> */}

        </div >
    )
}
