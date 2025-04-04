import React, { useEffect, useState } from 'react';
import layoutStyles from './layout.module.css';
import { useNavigate } from 'react-router-dom';
import { Divider, Popover } from '@mui/material';
import { Drop, Dropdown, Notification } from '../../svg';
import { useDispatch, useSelector } from 'react-redux';
import { setLogOut } from '../../redux/userSlice';
import customerStyle from '../customer/customer.module.css'
import { getNotification } from '../../redux/notificationSlice';
import LogoutModal from '../../component/LogoutModal';


const Header = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)
    const {notificationData} = useSelector((state) => state.notification)
console.log('user============',user);

    const notificationCount = notificationData?.data?.unReadedNotifications || 0

    useEffect(() => {
        dispatch(getNotification())

    }, [dispatch])


    const [isLogout, setIsLogout] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [data, setData] = useState(null);
    
    const logoutOpenModal = (data) => {
        setIsLogout(true);
    };

    const logoutCloseModal = () => {
        setIsLogout(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    

    const logout = async () => {
        try {
            localStorage.clear(); // Clear local storage
            dispatch(setLogOut()); // Dispatch logout action
            navigate('/', { replace: true }); // Navigate to the "Connect" screen
        } catch (error) {
            console.error("Logout failed:", error); // Handle any errors
        }
    };
    return (
        <div className={layoutStyles.wrapper}>
            <div className={layoutStyles.headermenu}>

                <div className={layoutStyles.menuStyle}>
                    <div onClick={() => navigate('/notification/Notifications')} style={{position:'relative'}}>
                    {notificationCount > 0 &&
                                        <div style={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -2,
                                            background: 'red',
                                            color: 'white',
                                            fontSize: 10,
                                            borderRadius: '50%',
                                            minWidth: 15,
                                            minHeight: 15,
                                            textAlign: 'center',
                                            zIndex: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // padding:5
                                        }}
                                        >{notificationCount}
                                        </div>
                                    }
                        <Notification outline='#858D9D' color='#858D9D' />
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: '10px', marginRight: '10px' }} />
                    <div>
                        {user?.profileImg?.length > 0 ? (
                            <img src={user?.profileImg} alt='Avatar' style={{ width: 30, height: 30, borderRadius: 15 }} />
                        ) :
                            <div className={customerStyle.profileStyle}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        }
                    </div>

                    <div style={{ paddingLeft: 5 }}>
                        <div className={layoutStyles.userName}>
                            {user.name}
                        </div>
                        <span className={layoutStyles.admin}>
                            Admin
                        </span>


                    </div>
                    <div style={{ marginLeft: 10 }} onClick={handleClick}>
                        <Drop color="#858D9D" />
                    </div>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        style={{ borderRadius: 30 }}
                    >
                        <div style={{
                            padding: 15,
                        }}>
                            <div
                                className={layoutStyles.settingStyle}
                                onClick={() => logoutOpenModal()}
                            >
                                <p style={{ marginLeft: 10 }}>Logout</p>
                            </div>
                        </div>
                    </Popover>
                </div>

            </div>
            <div className={layoutStyles.main}>
                {children}
            </div>
            <LogoutModal
                open={isLogout}
                closeModal={logoutCloseModal}
                data={data}
            />
        </div>
    )
}

export default Header