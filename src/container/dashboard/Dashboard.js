import React, { useEffect, useState } from "react";
import dashboardStyle from "./dashboard.module.css";
import SwitchTab from "../../component/SwicthTab";
import {
    CustomerIcon,
    IncomeIcon,
    OrderIcon,
    ProductIcon,
} from "../../svg";

export const Dashboard = () => {

    //state
    const [value, setValue] = useState([
        { val: "All Date", id: 0 },
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
            number: 3230,
        },
        {
            id: 1,
            icon: <OrderIcon />,
            name: "Orders",
            number: 2390,
        },
        {
            id: 2,
            icon: <ProductIcon />,
            name: "Products",
            number: 6456,
        },
        {
            id: 3,
            icon: <CustomerIcon />,
            name: "Customer",
            number: 860,
        },
    ];



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
                <div className={dashboardStyle.goldRateStyle} style={{gap:50,paddingTop:20}}>
                    <div>
                        <label className={dashboardStyle.labelStyle}>
                            22k gold
                        </label>
                        <div className={dashboardStyle.goldRateStyle}>
                            <div className={dashboardStyle.goldInputbox}>
                                <input
                                    type='text'
                                    // onBlur={handleBlur}
                                    placeholder="Rs."
                                    name='goldRate' // Map to Formik's skillsGained array
                                    // value={}
                                    // onChange={handleChange}
                                    maxLength={120}
                                />
                                <div className={dashboardStyle.perGram}>
                                    /g
                                </div>
                            </div>
                            <div className={dashboardStyle.changesStyke}>Change</div>
                        </div>
                    </div>
                    <div>
                        <label className={dashboardStyle.labelStyle}>
                            18k gold
                        </label>
                        <div className={dashboardStyle.goldRateStyle}>
                            <div className={dashboardStyle.goldInputbox}>
                                <input
                                    type='text'
                                    // onBlur={handleBlur}
                                    placeholder="Rs."
                                    name='goldRate' // Map to Formik's skillsGained array
                                    // value={}
                                    // onChange={handleChange}
                                    maxLength={120}
                                />
                                <div className={dashboardStyle.perGram}>
                                    /g
                                </div>
                            </div>
                            <div className={dashboardStyle.changesStyke}>Change</div>
                        </div>
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
                            <div className={dashboardStyle.numStyle}>{item?.number}</div>
                            {/* {isLoadingStatistics ? (
                <Skeleton variant="text" width="70%" height={60} style={{ marginBottom: "8px" }} />
              ) : (
                <div className={dashboardStyle.numStyle}>{item?.number}</div>
              )} */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
