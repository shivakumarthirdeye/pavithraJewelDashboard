import React, { useState } from 'react';
import Styles from '../component/styles.module.css';
import { Box, Modal } from '@mui/material';
import { CancelIcon, DownloadIcon } from '../svg';
import orderStyle from '../container/orders/orders.module.css';
import { saveAs } from 'file-saver'


const PreviewModal = ({ open, onClose, data }) => {
  console.log('data', data);

  // Function to handle image download
  const handleDownload = async () => {
    try {
      const response = await fetch(data, {
        mode: 'cors'
    });
    console.log('response',response);
    
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      console.log('blob',blob);
      console.log('blobURL',blobUrl);
      
      // Create a temporary link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "image.png"); // Set file name
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  // window.open(data, '_blank');

  // const handleDownload = async () => {
  //   try {
  //     const response = await fetch(data);
  //     console.log('response',response);
      
  //     const blob = await response.blob();
  //     saveAs(blob, "image.jpg");
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //   }
  // };
  

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

        {/* <a
          style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}
          className={orderStyle.downloadingButtonStyle}
          href={data}
          download
          onClick={e => handleDownload(e)}
        >
          <DownloadIcon /> Download
        </a> */}
         <div onClick={handleDownload} className={orderStyle.downloadingButtonStyle} style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
          <DownloadIcon /> Download
        </div>
        <img src={data} style={{ width: '100%', height: "300px", objectFit: 'cover', minHeight: '20vh' }} alt='Pancard' />
      </Box>
    </Modal>
  );
};

export default PreviewModal;
