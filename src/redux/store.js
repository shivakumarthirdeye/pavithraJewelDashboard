import { configureStore } from "@reduxjs/toolkit";
// import loginSlice from "./loginSlice";
import userSlice from "./userSlice"
import productSlice from "./productSlice";
import ordersSlice from "./ordersSlice";
import customerSlice from "./customerSlice";
import notificationSlice from "./notificationSlice";
import categoriesSlice from "./categoriesSlice";
import subCategoriesSlice from "./subCategoriesSlice";
import dashboardSlice from "./dashboardSlice";
import couponSlice from "./couponSlice";
import countrySlice from "./countrySlice";
import settingSlice from "./settingSlice";
import appearanceSlice from "./appearanceSlice";
import termsConditionSlice from "./terms&ConditionSlice";


export const store = configureStore({
    reducer: {
        // login: loginSlice,
        user:userSlice,
        products: productSlice,
        orders: ordersSlice,
        customers: customerSlice,
        notification:notificationSlice,
        categories:categoriesSlice,
        subCategories:subCategoriesSlice,
        dashboard: dashboardSlice,
        coupons: couponSlice,
        country: countrySlice,
        settings: settingSlice,
        appearance:appearanceSlice,
        termscondition:termsConditionSlice
    }
})