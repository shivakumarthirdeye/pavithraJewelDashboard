import React, { useState } from 'react';
import Styles from '../component/styles.module.css';
import { Box, Button, Modal } from '@mui/material';
import { CancelIcon } from '../svg';
import orderStyle from '../container/orders/orders.module.css';
import { cancle, save, saveData } from '../MaterialsUI';
import { exchangeProduct } from '../redux/ordersSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const RejectModal = ({ open, onClose,path,handleSubject,data }) => {

  console.log("path",path)

  
  const dispatch = useDispatch();
  const { id } = useParams();

  const [reasonForRejection, setReasonForRejection] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setReasonForRejection(e.target.value);
  };

  console.log("reasonForRejection",reasonForRejection)

  const handleRejectClick = () => {
    if (!reasonForRejection) {
      setError('Reason is required');
      return;
    }

    if(path === "exchange"){
      dispatch(exchangeProduct({
        orderId: id,
        reasonForRejection: reasonForRejection,
      }));
    }
    else{
      handleSubject(data)
    }

 
    setReasonForRejection('');
    setError('');

    onClose(); // Close the modal after submission
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    border: "none",
    padding: "27px 22px",
    height: "fit-content",
    display: "block",
    width: '520px',
    borderRadius: '7px',
    "&:focus": {
      outline: "none",
    },
    overflowY: 'auto',
    maxHeight: '90vh',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}  // Close the modal when backdrop is clicked
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={Styles.notification}>
          <div className={Styles.notifText}>Reason for rejection</div>
          <div className={Styles.notificationAll} onClick={onClose}>
            <CancelIcon />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label className={orderStyle.label}>Reason</label>
          <div className={orderStyle.inputbox}>
            <input
              type='text'
              value={reasonForRejection}
              placeholder='Enter the reason here...'
              name="reasonForRejection"
              onChange={handleChange}
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
        </div>

        <div className={orderStyle.reviewStatus}>
          <Button  sx={cancle} onClick={onClose}>Cancel</Button>
          <Button  sx={saveData} onClick={handleRejectClick}>Submit</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RejectModal;
