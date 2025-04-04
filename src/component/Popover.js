import React, { useState } from 'react';
import { Popover, Typography } from '@mui/material';

const PopoverComponent = ({ icon, label, content,value }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <div onClick={handleClick} style={{ cursor: 'pointer', display: 'flex',justifyContent:"center",alignItems:"center",width:"100%",gap:'10px'}}>
                <span >{icon}</span>  <span style={{fontSize:14}}>{label}</span>
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                value={value}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {content}
            </Popover>
        </>
    );
};

export default PopoverComponent;
