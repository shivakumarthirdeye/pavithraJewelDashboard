import React from 'react';
import productStyle from '../product/product.module.css'
import CustomSeparator from '../../component/CustomizedBreadcrumb';
import { useNavigate } from 'react-router-dom';
import appearanceStyle from './appearance.module.css'
import Testimonials from './Testimonials';
import Counters from './Counters';
import Instagram from './Instagram';
import ViewSlider from './ViewSlider';
import ViewHeroBanner from './ViewHeroBanner';
import ViewCategories from './ViewCategories';
import ViewAboutUs from './ViewAboutUs';
import ViewBrandSlider from './ViewBrandSlider';
import ViewFeaturedProducts from './ViewFeaturedProduct';
import ViewOffersBanner from './ViewOfferBanner';
import ViewTestimonials from './ViewTestimonials';
import ViewCounters from './ViewCounters';
import ViewInstagram from './ViewInstagram';

const ViewHomePageBuilder = () => {
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
            <ViewHeroBanner />
            <ViewCategories />
            <ViewAboutUs />
            <ViewSlider />
            <ViewBrandSlider />
            <ViewFeaturedProducts />
            <ViewOffersBanner/>
            <ViewTestimonials/>
            <ViewCounters/>
            <ViewInstagram/>
        </div >
    )
}

export default ViewHomePageBuilder