import React from 'react';
import styles from './styles.module.css';
import { Box, Button, Modal } from '@mui/material';
import { CancelIcon, DeleteDataIcon } from '../svg';
import { cancle, delet } from '../MaterialsUI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogOut } from '../redux/userSlice';
import { Logout } from '@mui/icons-material';

const LogoutModal = ({
    closeModal,
    open,
}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    

   
    const logout = async () => {
        try {
            localStorage.clear(); // Clear local storage
            dispatch(setLogOut()); // Dispatch logout action
            navigate('/', { replace: true }); // Navigate to the "Connect" screen
        } catch (error) {
            console.error("Logout failed:", error); // Handle any errors
        }
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        border: "none",
        padding: "27px 22px",
        height: "300px",
        display: "block",
        width: '380px',
        borderRadius: '7px',
        "&:focus": {
            outline: "none",
        },
    };
    return (
        <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className={styles.crossStyle} onClick={closeModal}>
                    <CancelIcon/>
                </div>
                <div className={styles.deleteModalStyle}>
                    <div className={styles.logoutStyle}>
                        <Logout sx={{color:'#E87819'}}/>
                    </div>
                    <div className={styles.notifText} style={{marginTop:10}}>
                        Are you sure you want to logout?
                    </div>
                </div>
                <div className={styles.deleteButtonStyle} style={{marginTop:40}}>
                    <Button sx={cancle} variant="contained" onClick={closeModal} disableElevation={true}>Cancel</Button>
                    <Button sx={delet} onClick={logout} variant="contained" disableElevation={true}>Logout</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default LogoutModal;