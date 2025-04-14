import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { Box, Button, Modal } from '@mui/material';
import { useFormik } from 'formik';
import { CancelIcon, DeleteDataIcon } from '../svg';
import { cancle, delet } from '../MaterialsUI';
const DeleteModal = ({
    closeModal,
    open,
    heading,
    data,
    description,
    handleSubject,
    isRefresh
}) => {
    const {
        handleSubmit,
        setValues
    } = useFormik({

        onSubmit: (values) => {
            handleSubject(values);
            closeModal()
        }
    })

    useEffect(() => {
        if (data) {
            setValues(data)
        }
    }, [data,setValues,isRefresh])

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        border: "none",
        padding: "27px 22px",
        height: "328px",
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
                    <div>
                        <DeleteDataIcon />
                    </div>
                    <div className={styles.notifText} style={{marginTop:10}}>
                        {heading}
                    </div>
                    <div className={styles.desc} style={{marginTop:10}}>
                        {description}
                    </div>
                </div>
                <div className={styles.deleteButtonStyle} style={{marginTop:40}}>
                    <Button sx={cancle} variant="contained" onClick={closeModal} disableElevation={true}>Cancel</Button>
                    <Button sx={delet} onClick={handleSubmit} variant="contained" disableElevation={true}>Delete</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default DeleteModal;