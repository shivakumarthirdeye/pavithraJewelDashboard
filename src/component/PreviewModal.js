import React, { useState } from 'react';
import Styles from '../component/styles.module.css';
import { Box, Modal } from '@mui/material';
import { CancelIcon, DownloadIcon } from '../svg';
import orderStyle from '../container/orders/orders.module.css';

const PreviewModal = ({ open, onClose, data }) => {
  console.log('data', data);

  const pancardUrl = '/pancard.png'; // Image URL

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = data; // Set the image URL
    link.download = 'pancard.png'; // File name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className={Styles.notifText}>PAN Preview</div>
          <div className={Styles.notificationAll} onClick={onClose}>
            <CancelIcon />
          </div>
        </div>

        <div
          style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}
          className={orderStyle.downloadingButtonStyle}
          onClick={handleDownload}
        >
          <DownloadIcon /> Download
        </div>
        <img src={data} style={{ width: '100%', height: "300px", objectFit: 'cover', minHeight: '20vh' }} alt='Pancard' />
      </Box>
    </Modal>
  );
};

export default PreviewModal;
