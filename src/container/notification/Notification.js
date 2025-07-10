import React, { useCallback, useEffect, useRef, useState } from "react";
import catStyle from "../category/category.module.css";
import notificationStyle from "./notification.module.css";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getNotification, markAsRead } from "../../redux/notificationSlice";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { UnreadIcon } from "../../svg";
import { useNavigate } from "react-router-dom";


const Notifications = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const { incomingNotification } = useSelector((state) => state.notification);

    const [viewAll, setViewAll] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("asc");

    const [loading, setLoading] = useState(false); // Prevent multiple calls
    const observer = useRef();

    // Infinite Scroll Observer
    const lastNotificationRef = useCallback(
        (node) => {
            if (loading || viewAll) return; // Stop observing if View All is active
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setLoading(true);
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, viewAll]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getNotification({ page, limit, sortBy, order }));
        }, 500);
        return () => clearTimeout(timer);
    }, [dispatch, page, limit, sortBy, order]);

    const formattedDate = (date = new Date()) => {
        const dateFromMongoDB = new Date(date);

        if (isToday(dateFromMongoDB)) {
            return `Today, ${format(dateFromMongoDB, "hh:mm a")}`;
        } else if (isYesterday(dateFromMongoDB)) {
            return `Yesterday, ${format(dateFromMongoDB, "hh:mm a")}`;
        } else {
            const differenceInDays = Math.floor(
                (new Date() - dateFromMongoDB) / (1000 * 60 * 60 * 24)
            );
            if (differenceInDays < 7) {
                return `${formatDistanceToNow(dateFromMongoDB)} ago`;
            } else {
                const formattedDate = format(dateFromMongoDB, "dd MMM yyyy");
                const formattedTime = format(dateFromMongoDB, "hh:mm a");
                return `${formattedDate}, ${formattedTime}`;
            }
        }
    };

    const handleViewAll = () => {
        setViewAll(true);
        setLimit(999);
        setPage(1);
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
        if (notification.title === "Order created" || "Pending Amount paid") {
            if (notification?.isMutlipleOrder === false) {
                return `/orders/Orders/OrderDetails/${notification?.orderId}`;
            } else if (notification?.isMutlipleOrder === true) {
                return `/orders/Orders/MultiProductOrderDetails/${notification?.orderId}`;
            }
        }
        return null;
    };

    const toggleOrder = () => {
        setOrder(prev => (prev === "asc" ? "desc" : "asc"));
    };


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
                                key={notification._id} // Unique key for each notification
                                className={notificationStyle.notificationItem}
                                ref={index === incomingNotification.length - 1 ? lastNotificationRef : null}
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
                                        {formattedDate(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={notificationStyle.viewAllStyle} onClick={handleViewAll}>
                        <span> View All</span>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Notifications;
