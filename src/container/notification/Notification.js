import React, { useCallback, useEffect, useRef, useState } from "react";
import catStyle from "../category/category.module.css";
import notificationStyle from "./notification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getNotification, markAsRead } from "../../redux/notificationSlice";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { UnreadIcon } from "../../svg";
import { useNavigate } from "react-router-dom";


const Notifications = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { incomingNotification, pagination, isLoading } = useSelector((state) => state.notification);

    const [page, setPage] = useState(1);
    const limit = 5;
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        dispatch(getNotification({ page, limit, sortBy, order }));
    }, [dispatch, page, sortBy, order]);

    // reset to page one when sorting or order changes
    useEffect(() => {
        setPage(1);
    }, [sortBy, order]);

    const formatDate = (dateString) => {
        if (!dateString) return "Invalid Date";

        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Date";

        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const handleViewMore = () => {
        if (pagination?.hasNext) {
            setPage(prevPage => prevPage + 1);
        }
    };


    const handleReadNotification = async (id) => {
        // Dispatch action to mark as read
        await dispatch(markAsRead(id));

    };

    const getNotificationPath = (notification) => {

        const id = notification?.userId;
        if (notification.title === "New user registered") {
            return `/customer/Customers/CustomersDetails/${id}`;
        }
        if (notification.title === "Order created" || notification.title === "Pending Amount paid") {
            if (notification?.isMutlipleOrder === false) {
                return `/orders/Orders/OrderDetails/${notification?.orderId}`;
            } else if (notification?.isMutlipleOrder === true) {
                return `/orders/Orders/MultiProductOrderDetails/${notification?.orderId}`;
            }
        }
        return null;
    };

    // const toggleOrder = () => {
    //     setOrder(prev => (prev === "asc" ? "desc" : "asc"));
    // };


    return (
        <div style={{ padding: 20, marginTop: 60 }}>
            <div className={catStyle.container}>
                <div>
                    <h2 className={catStyle.categoryText}>Notifications</h2>
                    <CustomSeparator dashboard="Dashboard" type="Notifications" />
                </div>
            </div>

            <div className={notificationStyle.cardContainer}>
                <div className={notificationStyle.headingStyle}>
                    <h3 className={notificationStyle.h3Style}>Notifications</h3>
                </div>
                <div>
                    {/* No Notifications for Received */}
                    {incomingNotification && incomingNotification.length === 0 && (
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 50 }}>
                            <p>You have no new notifications</p>
                        </div>
                    )}

                    <div className={notificationStyle.notificationList}>
                        {incomingNotification && incomingNotification?.map((notification, index) => (
                            <div
                                key={notification._id} 
                                className={notificationStyle.notificationItem}
                            >
                                {notification?.isRead === false && (
                                    <div className={notificationStyle.icon}>
                                        <UnreadIcon />
                                    </div>
                                )}
                                <div className={notificationStyle.notificationContent}>
                                    <h4 className={notificationStyle.notificationTitle}>

                                        {notification.title}
                                    </h4>
                                    <p className={notificationStyle.notificationDescription}>
                                        {notification.message}
                                    </p>
                                    <div
                                        className={notificationStyle.viewStyle}
                                        onClick={() => {
                                            const path = getNotificationPath(notification);
                                            if (path) {
                                                navigate(path);
                                                handleReadNotification(notification._id);
                                            }
                                        }}
                                    >
                                        View
                                    </div>
                                    <span className={notificationStyle.notificationTimestamp} style={{ paddingBottom: 20 }}
                                    >
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagination?.hasNext &&  (
                        <div className={notificationStyle.viewAllStyle} onClick={handleViewMore}>
                            <span>{isLoading ? 'Loading...' : 'View More'}</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
export default Notifications;
