
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './container/login/Login';
import ForgotPassword from './container/login/ForgotPassword';
import ResendConfirmation from './container/login/ResendConfirmation';
import ResetPassword from './container/login/ResetPassword';
import Layout from './container/layout/Layout';
import { Dashboard } from './container/dashboard/Dashboard';
import Categories from './container/category/Categories';
import AddCategory from './container/category/AddCategory';
import EditCategory from './container/category/EditCategory';
import Subcategories from './container/category/SubCategories';
import AddSubcategory from './container/category/AddSubcategory';
import EditSubcategory from './container/category/EditSubcategory';
import { ToastContainer } from 'react-toastify';
import Product from './container/product/Product';
import AddProduct from './container/product/AddProduct';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './MaterialsUI';
import EditProduct from './container/product/EditProduct';
import ProductViewDetails from './container/product/ProductViewDetails';
import {ReadyToShipOrders} from './container/orders/ReadyToShipOrders';
import { ReadyToShipOrderDetails } from './container/orders/ReadyToShipOrderDetails';
import { CustomerReview } from './container/orders/CustomerReview';
import { TrashReadyToShip } from './container/orders/TrashReadyToShip';
import OrdersInvoice from './container/orders/OrdersInvoice';
import { MadeToOrders } from './container/orders/MadeToOrders';
import { MadeToOrderDetails } from './container/orders/MadeToOrdersDetail';
import { Customers } from './container/customer/Customers';
import { CustomersDetails } from './container/customer/CustomerDetails';
import Appearance from './container/appearance/Appearance';
import HomePageBuilder from './container/appearance/HomePageBuilder';
import OffersPage from './container/appearance/OffersPage';
import Coupons from './container/coupons/Coupons';
import AddCoupon from './container/coupons/AddCoupon';
import EditCoupon from './container/coupons/EditCoupon';
import Country from './container/country/Country';
import Notifications from './container/notification/Notification';
import EditProfile from './container/settings/EditProfile';
import { TrashMadeToOrders } from './container/orders/TrashMadeToOrders';
import ViewHomePageBuilder from './container/appearance/ViewHomePageBuilder';
import AddTermsCondition from './container/termsAndCondition/AddTermsCondition';
import { Orders } from './container/orders/Orders';
import { OrderDetails } from './container/orders/OrderDetails';
import { MultiProductOrderDetails } from './container/orders/MultiProdOrders';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme='dark'
          style={{ width: "350px" }}
        >
        </ToastContainer>
        <Layout>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login/forgotPassword' element={<ForgotPassword />} />
            <Route path='/login/resendConfirmation' element={<ResendConfirmation />} />
            <Route path='/login/resetPassword/:token' element={<ResetPassword />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/categories/Categories' element={<Categories />} />
            <Route path='/categories/Categories/AddCategory' element={<AddCategory />} />
            <Route path='/categories/Categories/EditCategory/:id' element={<EditCategory />} />
            <Route path='/categories/Subcategories' element={<Subcategories />} />
            <Route path='/categories/Subcategories/AddSubcategory' element={<AddSubcategory />} />
            <Route path='/categories/Subcategories/EditSubcategory/:id' element={<EditSubcategory />} />
            <Route path='/product/Product' element={<Product />} />
            <Route path='/product/Product/AddProduct' element={<AddProduct />} />
            <Route path='/product/Product/EditProduct/:id' element={<EditProduct />} />
            <Route path='/product/Product/ProductViewDetails/:id' element={<ProductViewDetails />} />
            <Route path='/orders/Orders' element={<Orders />} />
            <Route path='/orders/Orders/OrderDetails/:id' element={<OrderDetails />} />
            <Route path='/orders/Orders/MultiProductOrderDetails/:id' element={<MultiProductOrderDetails />} />
            {/* <Route path='/orders/ReadyToShipOrders' element={<ReadyToShipOrders />} /> */}
            {/* <Route path='/orders/MadeToOrders' element={<MadeToOrders />} /> */}
            {/* <Route path='/orders/ReadyToShipOrders/ReadyToShipOrderDetails/:id' element={<ReadyToShipOrderDetails />} /> */}
            <Route path='/orders/Orders/CustomerReviews/:id' element={<CustomerReview />} />
            {/* <Route path='/orders/ReadyToShipOrders/TrashReadyToShip' element={<TrashReadyToShip />} /> */}
            <Route path='/orders/Orders/OrdersInvoice/:id' element={<OrdersInvoice />} />
            {/* <Route path='/orders/MadeToOrders/MadeToOrderDetails/:id' element={<MadeToOrderDetails />} /> */}
            <Route path='/orders/Orders/TrashOrders' element={<TrashMadeToOrders />} />
            <Route path='/customer/Customers' element={<Customers />} />
            <Route path='/customer/Customers/CustomersDetails/:id' element={<CustomersDetails />} />
            <Route path='/appearance/Appearance' element={<Appearance />} />
            <Route path='/appearance/Appearance/HomePageBuilder' element={<HomePageBuilder />} />
            <Route path='/appearance/Appearance/ViewHomePageBuilder' element={<ViewHomePageBuilder />} />
            <Route path='/appearance/Appearance/OffersPage' element={<OffersPage />} />
            <Route path='/coupons/Coupons' element={<Coupons />} />
            <Route path='/coupons/Coupons/AddCoupons' element={<AddCoupon />} />
            <Route path='/coupons/Coupons/EditCoupon/:id' element={<EditCoupon />} />
            <Route path='/country/Country' element={<Country />} />
            <Route path='/notification/Notifications' element={<Notifications />} />
            <Route path='/settings/EditProfile' element={<EditProfile />} />
            <Route path='/termsAndCondition/AddTermsCondition' element={<AddTermsCondition />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
