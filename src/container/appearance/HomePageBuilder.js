import React from 'react';
import productStyle from '../product/product.module.css'
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { useNavigate } from 'react-router-dom';
import HeroBanner from './HeroBanner';
import Categories from './Category';
import AboutUs from './AboutUs';
import Slider from './Slider';
import BrandSlider from './BrandSlider';
import FeaturedProducts from './FeaturedProducts';
import appearanceStyle from './appearance.module.css'
import OffersBanner from './OffersBanner';
import Testimonials from './Testimonials';
import Counters from './Counters';
import Instagram from './Instagram';

const HomePageBuilder = () => {
    const navigate = useNavigate()
    return (
        <div style={{ padding: 20, marginTop: 60 }} >
            <div className={productStyle.container} style={{paddingBottom:20}}>
                <div>
                    <h2 className={productStyle.categoryText}>Home Page Builder </h2>
                    <CustomSeparator dashboard="Dashboard" type="Page Appearance " subType="Home Page Builder" />
                </div>
                <div
                    className={appearanceStyle.backToStyle}
                    style={{ marginTop: 10 }}
                    onClick={() => navigate("/appearance/Appearance")}
                >
                    Back to list
                </div>
            </div>
            <HeroBanner />
            <Categories />
            <AboutUs />
            {/* <Slider /> */}
            <BrandSlider />
            <FeaturedProducts />
            <OffersBanner/>
            <Testimonials/>
            <Counters/>
            <Instagram/>
        </div >
    )
}

export default HomePageBuilder