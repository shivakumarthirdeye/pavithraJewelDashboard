import React, { useEffect } from "react";
import catStyle from "../category/category.module.css";
import notificationStyle from "./notification.module.css";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getNotification, markAsRead } from "../../redux/notificationSlice";
import CustomSeparator from "../../component/CustomizedBreadcrumb";
import { Dropdown, UnreadIcon } from "../../svg";
import { useNavigate } from "react-router-dom";





const Notifications = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const { notificationData, isRefresh } = useSelector((state) => state.notification)

    const incomingNotification = notificationData?.data?.notifications || []

    console.log(incomingNotification, "incoming");


    // console.log("users", user);

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

    const handleReadNotification = async (id) => {
        // Dispatch action to mark as read
        await dispatch(markAsRead(id));

    };


    // const handleMarkAll=()=>{
    //     dispatch(markAllAsRead(user?.data?._id))
    // }


    console.log(user?.user?._id, "ied");

    useEffect(() => {
        dispatch(getNotification())

    }, [dispatch, isRefresh])


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
                    <div className={notificationStyle.allStyle}>All <Dropdown /></div>
                </div>
                <div>
                    {/* No Notifications for Received */}
                    {incomingNotification && incomingNotification.length === 0 && (
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 50 }}>
                            <p>You have no new notifications</p>
                        </div>
                    )}

                        <div className={notificationStyle.notificationList}>
                            {incomingNotification?.map((notification) => (
                                <div
                                    key={notification._id} // Unique key for each notification
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
                                        {notification?.notificationType === 'ORDER' && notification?.orderType === 'Ready to ship orders' && (
                                            <div className={notificationStyle.viewStyle}
                                                onClick={() => {
                                                    navigate(`/orders/ReadyToShipOrders/ReadyToShipOrderDetails/${notification?.orderId}`);
                                                    handleReadNotification(notification._id);
                                                }}
                                            >
                                                View
                                            </div>
                                        )}
                                        {notification?.notificationType === 'ORDER' && notification?.orderType === 'Made to orders' && (
                                            <div className={notificationStyle.viewStyle}
                                                onClick={() => {
                                                    navigate(`/orders/MadeToOrders/MadeToOrderDetails/${notification?.orderId}`);
                                                    handleReadNotification(notification._id);
                                                }}
                                            >
                                                View
                                            </div>
                                        )}
                                        <span className={notificationStyle.notificationTimestamp} style={{ paddingBottom: 20 }}
                                        >
                                            {formattedDate(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    <div className={notificationStyle.viewAllStyle}>
                        <span> View All</span>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Notifications;
