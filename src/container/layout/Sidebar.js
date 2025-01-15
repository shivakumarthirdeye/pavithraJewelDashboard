import React, { useEffect, useState } from 'react';
import Styles from './layout.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { CategoryInActive, DashboardActive, SettingIcon, Drop, ProductInActive, OrdersInActive, CustomersInActive, AppearanceInActive, Notification, CouponIcon, CountryIcon } from '../../svg';


const Sidebar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [path, setPath] = useState('');
    const [subpath, setSubpath] = useState('');
    const pathname = location.pathname.split('/')[1];
    const subpathname = location.pathname.split('/')[2];




    useEffect(() => {
        setPath(pathname)
        setSubpath(subpathname)
    }, [pathname, subpathname])

    return (
        <div className={Styles.sideMenuBar}>
            <section className={Styles.left}>
                <div className={Styles.logo}>
                    <img src='/jewelsLogo.png' alt='logo' />
                </div>

                <div onClick={() => navigate('/dashboard')} className={path === 'dashboard' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {
                            path === "dashboard" ?
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <DashboardActive color='#fff' />
                                </div>
                                :
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <DashboardActive color='#858D9D' />
                                </div>
                        }
                        {path === "dashboard" ?
                            <div className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Dashboard
                            </div> :
                            <div className={Styles.dashboardText}>
                                Dashboard
                            </div>
                        }

                    </div>
                </div>

                <div onClick={() => navigate('/categories/Categories')} className={path === 'categories' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {
                            path === "categories" ?
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <CategoryInActive color='#fff' outline='#E87819' />
                                </div>
                                :
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <CategoryInActive outline='#fff' color='#858D9D' />
                                </div>
                        }
                        {path === "categories" ?
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Categories
                            </p> :
                            <p className={Styles.dashboardText}>
                                Categories
                            </p>
                        }
                    </div>
                    {path === 'categories' ? (
                        <div>
                            <Drop color='#fff' />
                        </div>
                    ) : <Drop color="#858D9D" />
                    }


                </div>
                {
                    path === 'categories' ?
                        <div className={Styles.subpaths}>
                            <div onClick={() => navigate('/categories/Categories')} className={subpath === 'Categories' ? Styles.submenu : Styles.menuText}>
                                Category
                            </div>
                            <div onClick={() => navigate('/categories/Subcategories')} className={subpath === 'Subcategories' ? Styles.submenu : Styles.menuText}>
                                Subcategory
                            </div>

                        </div> : ''
                }
                <div onClick={() => navigate('/product/Product')} className={path === 'product' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'product' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <ProductInActive color='#fff' outline='#E87819' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <ProductInActive outline='#fff' color='#858D9D' />
                            </div>
                        }
                        {path === 'product' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Products
                            </p>
                        ) :
                            <p className={Styles.dashboardText}>
                                Products
                            </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/orders/ReadyToShipOrders')} className={path === 'orders' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'orders' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <OrdersInActive color='#fff' outline='#E87819' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <OrdersInActive outline='#fff' color='#858D9D' />
                            </div>
                        }
                        {path === 'orders' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Orders
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Orders
                        </p>
                        }


                    </div>
                    {path === 'orders' ? (
                        <div>
                            <Drop color='#fff' />
                        </div>
                    ) : <Drop color="#858D9D" />
                    }
                </div>
                {
                    path === 'orders' ?
                        <div className={Styles.subpaths}>
                            <div onClick={() => navigate('/orders/ReadyToShipOrders')} className={subpath === 'ReadyToShipOrders' ? Styles.submenu : Styles.menuText}>
                                Ready To Ship Orders
                            </div>
                            <div onClick={() => navigate('/orders/MadeToOrders')} className={subpath === 'MadeToOrders' ? Styles.submenu : Styles.menuText}>
                                Made To Orders
                            </div>

                        </div> : ''
                }
                <div onClick={() => navigate('/customer/Customers')} className={path === 'customer' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'customer' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <CustomersInActive color='#fff' outline='#fff' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <CustomersInActive outline="#757589" color='#858D9D' />
                            </div>
                        }
                        {path === 'customer' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Customers
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Customers
                        </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/appearance/Appearance')} className={path === 'appearance' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'appearance' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <AppearanceInActive color='#fff' outline='#E87819' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <AppearanceInActive outline='#fff' color='#858D9D' />
                            </div>
                        }
                        {path === 'appearance' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Appearance
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Appearance
                        </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/coupons/Coupons')} className={path === 'coupons' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'coupons' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <CouponIcon color='#fff' outline='#E87819' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <CouponIcon outline='#fff' color='#858D9D' />
                            </div>
                        }
                        {path === 'coupons' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Coupons
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Coupons
                        </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/country/Country')} className={path === 'country' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'country' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <CountryIcon color='#fff' outline='#E87819' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <CountryIcon outline='#fff' color='#858D9D' />
                            </div>
                        }
                        {path === 'country' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Country
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Country
                        </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/notification/Notifications')} className={path === 'notification' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'notification' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <Notification color='#fff' outline='#fff' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <Notification outline='#858D9D' color='#858D9D' />
                            </div>
                        }
                        {path === 'notification' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Notification
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Notification
                        </p>
                        }
                    </div>
                </div>
                <div onClick={() => navigate('/settings/EditProfile')} className={path === 'settings' ? `${Styles.width} ${Styles.active}` : Styles.width}>
                    <div>
                        {path === 'settings' ?
                            (
                                <div style={{ width: 30, marginTop: 5 }}>
                                    <SettingIcon color='#E87819' outline='#fff' />
                                </div>
                            )
                            :
                            <div style={{ width: 30, marginTop: 5 }}>
                                <SettingIcon outline='#858D9D' color='#858D9D' />
                            </div>
                        }
                        {path === 'settings' ? (
                            <p className={Styles.dashboardText} style={{ color: '#fff' }}>
                                Settings
                            </p>
                        ) : <p className={Styles.dashboardText}>
                            Settings
                        </p>
                        }
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Sidebar;