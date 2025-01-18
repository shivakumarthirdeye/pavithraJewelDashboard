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
        this.api_url = process.env.NODE_ENV === "development" ? "https://pavitra-jewels-backend.onrender.com/api" : `https://pavitra-jewels-backend.onrender.com/api`;
        // this.api_url = process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : `http://localhost:5000/api`;
        
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
    
    // get Products
    getProducts = (data) => {
        return this.init().get(`/admin/product?${data}`, data)
    }
    getProductsWithoutParams = () => {
        return this.init().get(`/admin/product/get-all-products`)
    }
    getProductsDetails = (data) => {
        return this.init().get(`/admin/product/get-single-product/${data}`, data)
    }
    addProduct = (data) => {
        return this.init().post("/admin/product/new-product", data)
    }
    editProduct = (data) => {
        return this.init().put(`/admin/product/edit-product/${data?._id}`, data)
    }
    deleteProduct = (data) => {
        return this.init().delete(`/admin/product/delete-product/${data}`, data)
    }
    getAttributes = (data) => {
        return this.init().get(`/admin/attributes/get-all-attributes`, data)
    }
    getSubCat = (data) => {
        return this.init().get(`/admin/subcategory/get-subcategory-without-pagination`, data)
    }
    getSearchProduct = (data) => {
        return this.init().get(`/admin/product/search-by-name-or-sku${data}`, data)
    }
    getSupplierName = () => {
        return this.init().get('/admin/supplier/get-all-suppliers')
    }
    filterProducts = (date,status,category,productType,page) => {
        return this.init().get(`/admin/product/filter-product?date=${date}&status=${status}&category=${category}&productType=${productType}&page=${page}`)
    }
    getReviewsForProducts = (data) => {
        return this.init().get(`/admin/product/get-reviews/${data}`)
    }
    getAllSingleProductList = () => {
        return this.init().get(`/admin/product/get-all-single-products-list`)
    }
    getAllComboProductList = () => {
        return this.init().get(`/admin/product/get-all-combo-products-list`)
    }
     
    

}

const api = new Api();

export default api