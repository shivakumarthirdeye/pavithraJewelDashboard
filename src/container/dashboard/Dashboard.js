import React, { useEffect, useState } from "react";
import dashboardStyle from "./dashboard.module.css";
import SwitchTab from "../../component/SwicthTab";
import {
    CustomerIcon,
    IncomeIcon,
    OrderIcon,
    ProductIcon,
} from "../../svg";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from 'formik';
import * as yup from "yup";
import { getGoldRate, getStatistics, setFilterValues, updateGoldRate } from "../../redux/dashboardSlice";
import { IconButton, InputAdornment, Skeleton, TextField } from "@mui/material";
import { fieldText } from "../../MaterialsUI";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { goldRateData, statisticsData, isRefresh, isLoading } = useSelector((state) => state.dashboard);
    console.log('statisticsData', statisticsData);

    //state
    const [value, setValue] = useState([
        { val: "All Dates", id: 0 },
        { val: "12 Months", id: 1 },
        { val: "30 Days", id: 2 },
        { val: "7 Days", id: 3 },
        { val: "24 Hour", id: 4 },
    ]);
    const [selected, setSelected] = useState(0);

    const changeID = (id) => {
        setSelected(id.id);
    };

    const data = [
        {
            id: 0,
            icon: <IncomeIcon />,
            name: "Income",
            number: statisticsData?.totalOrderRevenue?.toFixed(2),
        },
        {
            id: 1,
            icon: <OrderIcon />,
            name: "Orders",
            number: statisticsData?.totalOrders,
        },
        {
            id: 2,
            icon: <ProductIcon />,
            name: "Products",
            number: statisticsData?.totalProducts,
        },
        {
            id: 3,
            icon: <CustomerIcon />,
            name: "Customer",
            number: statisticsData?.totalUsers,
        },
    ];

    const schema = yup.object().shape({
        k22: yup.string().required("Price is required"),
        k18: yup.string().required("price is required"),
    })

    const {
        handleSubmit,
        errors,
        values,
        touched,
        handleChange,
        handleBlur,
    } = useFormik({
        initialValues: {
            k22: "",
            k18: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleSubject(values)
        }

    })
    const handleSubject = async (values) => {
        dispatch(updateGoldRate(values));
    };

    useEffect(() => {
        dispatch(getGoldRate())
    }, [dispatch, isRefresh])

    useEffect(() => {
        const selectedFilter = `filter=${value[selected].val}`;
        dispatch(getStatistics(selectedFilter));
    }, [dispatch, value, selected]);


    return (
        <div style={{ padding: 20 }}>
            <div className={dashboardStyle.mainStyle} style={{ marginTop: 20 }}>
                <div style={{ marginTop: 40 }}>
                    <h3 className={dashboardStyle.welcomeText}>Welcome Back!</h3>
                    <p className={dashboardStyle.description}>Lorem ipsum dolor si amet welcome back johny</p>
                </div>
                <div style={{ marginTop: 65 }}>
                    <SwitchTab
                        value={value}
                        selected={selected}
                        onChange={(id) => changeID(id)}
                    />
                </div>
            </div>
            <div className={dashboardStyle.boxStyle}>
                <div className={dashboardStyle.goldRateStyle}>
                    <IncomeIcon />
                    <span>Today’s Gold Rate</span>
                </div>
                <div className={dashboardStyle.goldRateStyle} style={{ gap: 50, paddingTop: 20 }}>
                    <div>
                        <label className={dashboardStyle.labelStyle}>
                            22k gold
                        </label>
                        <div className={dashboardStyle.goldRateStyle}>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                placeholder="Rs."
                                name='k22' // Map to Formik's skillsGained array
                                value={values.k22 || goldRateData?.data?.k22}
                                onChange={handleChange}
                                sx={fieldText}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="flex-start" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-start",
                                                    fontSize: '14px',
                                                    color: '#000000',
                                                    marginLeft: '-10px',
                                                    marginRight: '-15px',
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                Rs.
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="flex-end" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-end",
                                                    fontSize: '14px',
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    marginRight: '-10px'
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                /g
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div
                                className={dashboardStyle.changesStyke}
                                onClick={handleSubmit}
                            >Change</div>
                        </div>
                        {
                            errors.k22 && touched.k22 && <p style={{ color: "red", fontSize: "12px" }}>{errors.k22}</p>
                        }
                    </div>
                    <div>
                        <label className={dashboardStyle.labelStyle}>
                            18k gold
                        </label>
                        <div className={dashboardStyle.goldRateStyle}>
                            <TextField
                                type='text'
                                onBlur={handleBlur}
                                placeholder="Rs."
                                name='k18' // Map to Formik's skillsGained array
                                value={values.k18 || goldRateData?.data?.k18}
                                onChange={handleChange}
                                sx={fieldText}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="flex-start" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-start",
                                                    fontSize: '14px',
                                                    color: '#000000',
                                                    marginLeft: '-10px',
                                                    marginRight: '-15px',
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                Rs.
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="flex-end" sx={{
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}>
                                            <IconButton
                                                // edge="end"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    // padding: '8px',
                                                    border: "none",
                                                    display: 'flex',
                                                    justifyContent: "flex-end",
                                                    fontSize: '14px',
                                                    fontWeight: '400',
                                                    fontFamily: 'Public Sans',
                                                    marginRight: '-10px'
                                                    // marginBottom: '20px'
                                                }}
                                                disableRipple // disables ripple effect for a cleaner loo
                                            >
                                                /g
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div
                                className={dashboardStyle.changesStyke}
                                onClick={handleSubmit}
                            >Change</div>
                        </div>
                        {
                            errors.k18 && touched.k18 && <p style={{ color: "red", fontSize: "12px" }}>{errors.k18}</p>
                        }
                    </div>
                </div>
            </div>
            <div className={dashboardStyle.cardWrap}>
                {data?.map((item, index) => {
                    return (
                        <div className={dashboardStyle.cardStyle} key={index?.id}>
                            <div className={dashboardStyle.iconStyle}>
                                <div>{item.icon}</div>
                                <div
                                    className={dashboardStyle.nameStyle}
                                    style={{ marginLeft: 10 }}
                                >
                                    {item?.name}
                                </div>
                            </div>
                            {isLoading ? (
                                <Skeleton variant="text" width="70%" height={60} style={{ marginBottom: "8px" }} />
                            ) : (
                                <div className={dashboardStyle.numStyle}>{item?.number}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
