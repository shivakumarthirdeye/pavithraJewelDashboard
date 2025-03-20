import axios from "axios";
import FormData from "form-data";

const getToken = async () => {
    try {
        const token = localStorage.getItem("token");
        return token;
    } catch (error) {
        return null;
    }
};

class Api {
    constructor() {
        this.client = null;
        this.api_url = process.env.NODE_ENV === "development" ? "https://backend.pavithra.nagalikardiagnostic.com/api" : `https://backend.pavithra.nagalikardiagnostic.com/api`;
        // this.api_url = process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : `http://localhost:4000/api`;
        
    }

    init = (type) => {

        let headers;

        headers = {
            Accept: "application/json",
        }

        if (type === "multipart/form-data") {
            headers = {
                'Content-Type': 'multipart/form-data',
            }
        }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        this.client.interceptors.request.use(async (config) => {
            const token = await getToken();

            config.headers["Authorization"] = `Bearer ${token}`
            return config;
        }, (error) => {
            throw error;
        })

        return this.client;
    };


    // login
    getProfile = (data, config) => {
        return this.init().get("/admin/getadminprofile", data)
    }
    adminLogin = (data) =>{
        return this.init().post("/admin/login",data)
    }
    forgotPassword = (data) =>{
        return this.init().post("/admin/forgetPassword",data)
    }
    verifyOtp = (data) =>{
        return this.init().post("/admin/auth/verify-otp",data)
    }
    resetPassword = (data) =>{
        return this.init().post("/admin/resetPassword",data)
    }
    
    updateProfile = (data) => {
        return this.init().put(`/admin/update-bio`,data)
    }
    updateConfirmProfile = (data) => {
        return this.init().put(`/admin/confirm/edit-bio`,data)
    }
    updatePassword = (data) => {
        return this.init().put(`/admin/update-password`,data)
    }
    fileUpload = (data, config) => {
        return this.init('multipart/form-data').post("/admin/upload-file", data)
    }
    getPutSignedUrl = (data, config) => {
        return this.init('multipart/form-data').post("/admin/get-put-url", data)
    }

    //Categories
    addCategories = (data) => {
        return this.init().post("/admin/category", data)
    }
    getCategories = (data) => {
        return this.init().get(`/admin/category?${data}`, data)
    }
    getCategoriesExport = (data) => {
        return this.init().get('/admin/allcategories', data)
    }
    editCategories = (data) => {
        return this.init().put(`/admin/category/${data?._id}`, data)
    }
    getCategoryById = (data) => {
        return this.init().get(`/admin/category/${data}`, data)
    }
    deleteCategories = (data) => {
        return this.init().delete(`/admin/category/${data}`, data)
    }
    
    //Subcategories

    addSubCategories = (data) => {
        return this.init().post("/admin/subcategory", data)
    }
    getSubCategories = (data) => {
        return this.init().get(`/admin/subcategory?${data}`, data)
    }
    getSubCategoriesById = (data) => {
        return this.init().get(`/admin/subcategory/${data}`, data)
    }
    editSubCategories = (data) => {
        return this.init().put(`/admin/subcategory/${data?._id}`, data)
    }
    deleteSubCategories = (data) => {
        return this.init().delete(`/admin/subcategory/${data}`, data)
    }
    getSubCategoriesExport = (data) => {
        return this.init().get('/admin/allsubcategories', data)
    }

    //Dasboards Api 
    updateGoldRate = (data) => {
        return this.init().post('/admin/goldrate',data)
    }
    getGoldRate = (data) => {
        return this.init().get('/admin/goldrate', data)
    }
    getStatistics = (data) => {
        return this.init().get(`/admin/dashboard/get-statistics?${data}`, data)
    }

    // get Products
    getProducts = (data) => {
        return this.init().get(`/admin/product?${data}`, data)
    }
    getExportProducts = (data) => {
        return this.init().get('/admin/exportproduct', data)
    }
    getProductsWithoutParams = () => {
        return this.init().get(`/admin/product/get-all-products`)
    }
    getProductsDetails = (data) => {
        return this.init().get(`/admin/product/${data}`, data)
    }
    addProduct = (data) => {
        return this.init().post("/admin/product", data)
    }
    editProduct = (data) => {
        return this.init().put(`/admin/product/${data?._id}`, data)
    }
    deleteProduct = (data) => {
        return this.init().delete(`/admin/product/${data}`, data)
    }
    
    
    // Order
    orderStatistics = (data) => {
        return this.init().get(`/admin/getOrderStatistics${data}`, data)
    }
    getOrders = (data) => {
        return this.init().get(`/admin/orders?${data}`, data)
    }
    getTrashOrders = (data) => {
        return this.init().get(`/admin/trashorder?${data}`, data)
    }
    getAllOrderExport = (data) => {
        return this.init().get(`/admin/getAllOrderExport?${data}`, data)
    }
    getOrdersDetails = (data) => {
        return this.init().get(`/admin/orders/${data}`, data)
    }
    deleteOrders = (data) => {        
        return this.init().put(`/admin/trashorder/${data.value}`, data)
    }
    revertOrders = (data) => {        
        return this.init().put(`/admin/revert-deleted-order/${data}`, data)
    }
    getCustomerReviews = (data) => {
        // console.log('data=============================',data);
        
        return this.init().get(`/admin/reviews/${data}`, data)
    }
    editPendingPrice = ({url,val}) => {
        return this.init().put(`/admin/updatePendingOrder/${url}`, val)
    } 
    editReviews = ({url,val}) => {
        return this.init().put(`/admin/reviews/${url}`, val)
    }
    approveReject = (url) => {
        return this.init().put(`/admin/rejectorapprove/${url?.val}`, url?.url);  
    } 
    updateStatus = (data) => {
        console.log('url',data);
        
        return this.init().put(`/admin/updateOrderstatus/${data?.id}`, data?.val);  
    } 

    // Customer 
    getAllCustomers = (data) => {
        return this.init().get(`/admin/customer?${data}`, data)
    }
    getCustomersDetail = (data) => {
        return this.init().get(data)
    }
    getExportsCustomers = (data) => {
        return this.init().get(`/admin/exportCustomer`, data)
    }
    deleteCustomers = (data) => {
        return this.init().delete(`/admin/customer/${data}`, data)
    }
    // Coupons 
    getAllCoupons = (data) => {
        return this.init().get(`/admin/coupons?${data}`, data)
    }
    addCoupons = (data) => {
        return this.init().post('/admin/coupons', data)
    }
    editCoupons = (data) => {
        return this.init().put(`/admin/coupons/${data?._id}`, data)
    }
    deleteCoupons = (data) => {
        return this.init().delete(`/admin/coupons/${data}`, data)
    }
    // Country 
    getAllCountry = (data) => {
        return this.init().get(`/admin/country?${data}`, data)
    }
    addCountry = (data) => {
        return this.init().post('/admin/country', data)
    }
    editCountry = (data) => {
        return this.init().put(`/admin/country/${data?._id}`, data)
    }
    getCountryById = (data) => {
        return this.init().get(`/admin/country/${data}`)
    }
    deleteCountry = (data) => {
        return this.init().delete(`/admin/country/${data}`, data)
    }
    getExportCountry = (data) => {
        return this.init().get(`/admin/exportCountries`, data)
    }
    // Country 
    editProfile = (data) => {
        return this.init().put('/admin/updateAdminProfile', data)
    }
    changePassword = (data) => {
        return this.init().put('/admin/changePassword', data)
    }
    // Appearances 
    getSliders = () => {
        return this.init().get('/admin/appearance/slider')
    }
    addSliders = (data) => {
        return this.init().post('/admin/appearance/slider', data)
    }
    getHeroBanner = () => {
        return this.init().get('/admin/appearance/herobanner')
    }
    addHeroBanner = (data) => {
        return this.init().post('/admin/appearance/herobanner', data)
    }
    getAppearanceCategories = () => {
        return this.init().get('/admin/appearance/category')
    }
    addAppearanceCategories = (data) => {
        return this.init().post('/admin/appearance/category', data)
    }
    getAboutus = () => {
        return this.init().get('/admin/appearance/aboutus')
    }
    addAboutus = (data) => {
        return this.init().post('/admin/appearance/aboutus', data)
    }
    getBrandSlider = () => {
        return this.init().get('/admin/appearance/brandslider')
    }
    addBrandSlider = (data) => {
        return this.init().post('/admin/appearance/brandslider', data)
    }
    getFeaturerdProducts = () => {
        return this.init().get('/admin/appearance/featurerdProducts')
    }
    addFeaturerdProducts = (data) => {
        return this.init().post('/admin/appearance/featurerdProducts', data)
    }
    getOfferbanner = () => {
        return this.init().get('/admin/appearance/offerbanner')
    }
    addOfferbanner = (data) => {
        return this.init().post('/admin/appearance/offerbanner', data)
    }
    getTestimonials = () => {
        return this.init().get('/admin/appearance/testimonials')
    }
    addTestimonials = (data) => {
        return this.init().post('/admin/appearance/testimonials', data)
    }
    getCounters = () => {
        return this.init().get('/admin/appearance/counters')
    }
    addCounters = (data) => {
        return this.init().post('/admin/appearance/counters', data)
    }
    getInstagram = () => {
        return this.init().get('/admin/appearance/instagram')
    }
    addInstagram = (data) => {
        return this.init().post('/admin/appearance/instagram', data)
    }

    //getNotification
    getNotification = (data) => {
        return this.init().get(`/admin/getAllNotifications?${data}`)
    }
    markAsRead = (data) => {
        return this.init().put(`/admin/readedNotification/${data}`)
    }

    //getTermsCondition
    getTermsCondition = (data) => {
        return this.init().get('/admin/getTermsAndCondition')
    }
    addTermsCondition = (data) => {
        return this.init().post('/admin/addTermsAndCondition',data)
    }

}

const api = new Api();

export default api