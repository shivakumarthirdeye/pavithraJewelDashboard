import React, { useState } from 'react';
import Styles from '../component/styles.module.css';
import { Box, Modal } from '@mui/material';
import { CancelIcon, DownloadIcon } from '../svg';
import orderStyle from '../container/orders/orders.module.css';
import { saveAs } from 'file-saver'


const PreviewModal = ({ open, onClose, data }) => {
  console.log('data', data);

  const pancardUrl = '/pancard.png'; // Image URL

  const handleDownload = (e) => {
    // e.preventDefault(); // Prevent default behavior (if needed)
    
    // const imageUrl = e.target.href; // Get the image URL
    // window.open(imageUrl, "_blank"); // Open in a new tab
    console.log(e.target.href);
    fetch(e.target.href, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  const downloadImage = () => {
    saveAs(data, 'image.jpg') // Put your image URL here.
  }

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

        <a
          style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}
          className={orderStyle.downloadingButtonStyle}
          href={data}
          // download
          onClick={e => handleDownload(e)}
        >
          <DownloadIcon /> Download
        </a>
        <img src={data} style={{ width: '100%', height: "300px", objectFit: 'cover', minHeight: '20vh' }} alt='Pancard' />
      </Box>
    </Modal>
  );
};

export default PreviewModal;
