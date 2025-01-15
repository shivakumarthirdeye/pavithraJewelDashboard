import React, { useState } from 'react';
import Styles from '../../component/styles.module.css';
import { Box, Button, MenuItem, Modal, Select } from '@mui/material';
import { CancelIcon } from '../../svg';
import { cancle, saveData } from '../../MaterialsUI';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import countryStyle from './country.module.css';
import catStyle from '../category/category.module.css'
import { formselect } from '../../MaterialsUI';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

const EditCountry = ({ open, onClose, path, handleSubject, data }) => {

    const dispatch = useDispatch();
    const { id } = useParams();

    const [reasonForRejection, setReasonForRejection] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setReasonForRejection(e.target.value);
    };

    console.log("reasonForRejection", reasonForRejection)

    
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
                    <div className={Styles.notifText}>Edit Country</div>
                    <div className={Styles.notificationAll} onClick={onClose}>
                        <CancelIcon />
                    </div>
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={catStyle.label}>Country Name</label>
                    <br />
                    <Select
                        // className={categoryStyle.formselect}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        sx={formselect}
                        IconComponent={(props) => (
                            <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                        )}
                        displayEmpty
                        defaultValue=''
                        name='status'
                    // value={values.status}
                    // onChange={handleChange}
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                </div>
                <div style={{ marginTop: 10 }}>
                    <label className={catStyle.label}>Status</label>
                    <br />
                    <Select
                        // className={categoryStyle.formselect}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        sx={formselect}
                        IconComponent={(props) => (
                            <ArrowDropDownIcon {...props} style={{ fontSize: "18px" }} />
                        )}
                        displayEmpty
                        defaultValue=''
                        name='status'
                    // value={values.status}
                    // onChange={handleChange}
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                </div>
                <div className={catStyle.buttons} style={{ marginTop: 20 }}>
                    <Button
                        sx={cancle}
                        // onClick={handleSubmit} 
                        variant="contained"
                        disableElevation={true}>Cancel</Button>

                    <Button
                        sx={saveData}
                        // onClick={handleSubmit}
                        variant="contained"
                        disableElevation={true}
                    >Save</Button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditCountry;
