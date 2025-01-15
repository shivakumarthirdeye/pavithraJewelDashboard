import { configureStore } from "@reduxjs/toolkit";
// import loginSlice from "./loginSlice";
import userSlice from "./userSlice"
import productSlice from "./productSlice";
import ordersSlice from "./ordersSlice";
import customerSlice from "./customerSlice";
import notificationSlice from "./notificationSlice";
// import categoriesSlice from "./categoriesSlice"
// import  subCategoriesSlice  from "./subCategoriesSlice";


export const store = configureStore({
    reducer: {
        // login: loginSlice,
        user:userSlice,
        products: productSlice,
        orders: ordersSlice,
        customers: customerSlice,
        notification:notificationSlice,
        // categories:categoriesSlice,
        // subCategories:subCategoriesSlice,
    }
})