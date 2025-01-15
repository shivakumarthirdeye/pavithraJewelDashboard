import React, { useEffect, useState } from 'react';
import layoutStyles from './layout.module.css';
import { useNavigate } from 'react-router-dom';
import { Divider, Popover } from '@mui/material';
import { Drop, Dropdown, Notification } from '../../svg';
import { useDispatch, useSelector } from 'react-redux';
import { setLogOut } from '../../redux/userSlice';


const Header = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)
    console.log('user', user);


    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isLogout, setIsLogout] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [data, setData] = useState(null);
    const openModal = (data) => {
        setData(data)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // const logoutOpenModal = (data) => {
    //     setIsLogout(true);
    // };

    // const logoutCloseModal = () => {
    //     setIsLogout(false);
    // };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    // useEffect(() => {
    //     initializeLoginData(dispatch);
    // }, [dispatch]);

    // useEffect(() => {
    //     if (isRefresh || !notifications.notificationData) {
    //         dispatch(getNotification());
    //     }
    // }, [dispatch, isRefresh, notifications.notificationData]);


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
                    <div>
                        <Notification outline='#858D9D' color='#858D9D' />
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: '10px', marginRight: '10px' }} />
                    <div>
                        <img src='/profile.png' style={{ width: 30, height: 30, borderRadius: 15 }} alt='Avatar' />
                    </div>

                    <div style={{ paddingLeft: 5 }}>
                        <div className={layoutStyles.userName}>
                            {/* {adminDetails.name} */}
                            Supriya
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
                                onClick={logout}
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
        </div>
    )
}

export default Header