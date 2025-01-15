import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ForwardIcon } from '../svg';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function CustomSeparator({ dashboard, type, subType }) {
    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            href="/"
            onClick={handleClick}
            sx={{
                fontFamily: 'Public Sans',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                letterSpacing: '0.005em',
                textAlign: 'left',
                color: '#000',
                paddingRight:'5px'
            }}
        >
            {dashboard}
        </Link>,
        <Link
            underline="hover"
            key="2"
            color="inherit"
            href="/material-ui/getting-started/installation/"
            onClick={handleClick}
            sx={{
                fontFamily: 'Public Sans',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                letterSpacing: '0.005em',
                textAlign: 'left',
                color: '#667085',
                paddingLeft:'5px'
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
