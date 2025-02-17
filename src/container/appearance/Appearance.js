import React from 'react';
import productStyle from '../product/product.module.css'
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import appearanceStyle from './appearance.module.css'
import { Drop, EditIcon, ViewIcon } from '../../svg';
import { useNavigate } from 'react-router-dom';


const Appearance = () => {
    const navigate = useNavigate()
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div>
                <h2 className={productStyle.categoryText}>Page Appearance </h2>
                <CustomSeparator dashboard="Dashboard" type="Page Appearance " />
            </div>
            <div className={appearanceStyle.productStockContainer} style={{ marginTop: 10 }}>
                <div className={productStyle.header} style={{ paddingLeft: 20 }}>
                    <div className={appearanceStyle.idStyle}> ID </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={appearanceStyle.pageStyle}>Page </div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={appearanceStyle.lastUpdateStyle}>Last Update</div>
                    <div className={productStyle.dropdownStyle}> <Drop color="#858D9D" /> </div>
                    <div className={appearanceStyle.actionStyle}>Action</div>
                </div>

                <div className={appearanceStyle.info} style={{ paddingLeft: 20 }}>
                    <div className={appearanceStyle.idStyle}> 1 </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.pageStyle} style={{ color: '#1D1F2C' }}>
                        Home Page
                    </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.lastUpdateStyle}>
                        20 Dec 2024
                    </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.actionStyle}>
                        <div
                            // onClick={() => navigate(`/customers/Customers/CustomersDetails/${item?._id}`)}
                            onClick={() => navigate(`/appearance/Appearance/ViewHomePageBuilder`)}
                        >
                            <ViewIcon />
                        </div>
                        <div style={{ marginLeft: 12 }} onClick={() => navigate(`/appearance/Appearance/HomePageBuilder`)}>
                            <EditIcon />
                        </div>
                    </div>
                </div>
                <div className={appearanceStyle.info} style={{ paddingLeft: 20 }}>
                    <div className={appearanceStyle.idStyle}> 2 </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.pageStyle} style={{ color: '#1D1F2C' }}>
                        Offer Page
                    </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.lastUpdateStyle}>
                        23 Dec 2024
                    </div>
                    <div className={productStyle.dropdownStyle} />
                    <div className={appearanceStyle.actionStyle}>
                        <div
                            onClick={() => navigate(`/appearance/Appearance/OffersPage`)}
                        >
                            <ViewIcon />
                        </div>
                        <div style={{ marginLeft: 12 }}>
                            <EditIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Appearance