import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { ForwardIcon } from '../svg';
import { useNavigate } from 'react-router-dom';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function CustomSeparator({ dashboard, type, subType }) {
    const navigate = useNavigate();
    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            // href="/"
            onClick={() => navigate('/dashboard')}
            sx={{
                fontFamily: 'Public Sans',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                letterSpacing: '0.005em',
                textAlign: 'left',
                color: '#000',
                paddingRight:'5px',
                cursor:'pointer'
            }}
        >
            {dashboard}
        </Link>,
        <Link
            underline="hover"
            key="2"
            color="inherit"
            // href="/material-ui/getting-started/installation/"
            onClick={() => navigate(-1)}
            sx={{
                fontFamily: 'Public Sans',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                letterSpacing: '0.005em',
                textAlign: 'left',
                color: '#667085',
                paddingLeft:'5px',
                cursor:'pointer'
            }}
        >
            {type}
        </Link>,
    ];

    // Add `subType` conditionally
    if (subType) {
        breadcrumbs.push(
            <Typography
                key="3"
                sx={{
                    fontFamily: 'Public Sans',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '20px',
                    letterSpacing: '0.005em',
                    color: '#667085',
                    textAlign: 'left',
                }}
            >
                {subType}
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            <Breadcrumbs separator={<ForwardIcon />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Stack>
    );
}
