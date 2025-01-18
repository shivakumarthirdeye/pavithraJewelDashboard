import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    productsData: {},
    filterOptions: {
        status: "",
        search: "",
        startDate: "",
        endDate: "",
        category: "",
        page: 1,
        order: '',
        sortBy: '',
        limit: 10
    },
    productsDataWithoutParam: {},
    productsDetailsData: {},
    addProductsData: {},
    editProductsData: {},
    customerReviewsData: {},
    deleteProductsData: {},
    errorMsg: "",
    isError: false
}

export const getProducts = createAsyncThunk('getProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getProducts(queryParams);
        if (status === 200) {
            //get categories data
            dispatch(setProducts(data))

        }
        return data
    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getProductsWithoutParams = createAsyncThunk('getProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getProductsWithoutParams();
        if (status === 200) {
            //get categories data
            dispatch(setProductsWithoutParam(data.data))

        }
        return data.data
    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getProductsDetails = createAsyncThunk('getProductsDetails', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getProductsDetails(body);
        if (status === 200) {
            //get categories data
            dispatch(setProductsDetails(data.data))

        }
        return data.data
    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addProducts = createAsyncThunk('addProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addProduct(body);

        if (status === 201) {
            // render otp screen
            dispatch(setAddProducts(body));
            Toastify.success(data.data.message);
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editProducts = createAsyncThunk('editProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editProduct(body);

        if (status === 200) {
            // render otp screen
            dispatch(setEditProduct(body));
            Toastify.success("Product Edited successfully");
            dispatch(setRefresh());

        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const deleteProducts = createAsyncThunk('deleteProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteProduct(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteProduct(body));
            Toastify.success("Product Deleted successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getReviewsForProducts = createAsyncThunk('getReviewsForProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getReviewsForProducts(body);
        if (status === 200) {
            //get categories data
            dispatch(setCustomerReviews(data.data))
            dispatch(setRefresh());
        }
        return data.data
    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.productsData = action.payload
        },
        setProductsWithoutParam: (state, action) => {
            state.productsDataWithoutParam = action.payload
        },
        setProductsDetails: (state, action) => {
            state.productsDetailsData = action.payload
        },
        setAddProducts: (state, action) => {
            state.addProductsData = action.payload
        },
        setCustomerReviews: (state, action) => {
            state.customerReviewsData = action.payload
        },
        setEditProduct: (state, action) => {
            state.editProductsData = action.payload
        },
        setDeleteProduct: (state, action) => {
            state.deleteProductsData = action.payload
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        }
    },
    extraReducers: (builder) => {

        // getProducts
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.productsData = action.payload
        })
        builder.addCase(getProducts.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getProductsDetails
        builder.addCase(getProductsDetails.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getProductsDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.productsDetailsData = action.payload
        })
        builder.addCase(getProductsDetails.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

    }
})

export const {
    setAddProducts,
    setEditProduct,
    setProducts,
    setDeleteProduct,
    setProductsDetails,
    setRefresh,
    setCustomerReviews,
    setProductsWithoutParam,
    setFilterValues
} = productSlice.actions

export default productSlice.reducer;