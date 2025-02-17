import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        search:"",
        page:1,
        status:'',
        order:'',
        sortBy:'',
        limit:10
      },
    addCouponsData: {},
    editCouponsData: {},
    couponsData: {},
    deleteCouponData: {},
    subCategoiesExportData:{},
    errorMsg: "",
    isError: false
}

export const getAllCoupons = createAsyncThunk('getAllCoupons', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllCoupons(queryParams);
        if (status === 200) {
                //get categories data
                dispatch(setAllCoupons(data))
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addCoupons = createAsyncThunk('addCoupons', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addCoupons(body);

        if (status === 200) {
            dispatch(setAddCoupons(body));
            Toastify.success('Coupon added successfuly');
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editCoupons = createAsyncThunk('editCoupons', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editCoupons(body);
        if (status === 200) {
            // render otp screen
            dispatch(setEditCoupons(body));
            Toastify.success("Coupon Edited Successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const deleteCoupon = createAsyncThunk('deleteCoupons', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteCoupons(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteCoupon(body));
            Toastify.success("Coupon Deleted Successfully");
            dispatch(setRefresh());
        }
        return data.data
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const getSubCategoriesExport = createAsyncThunk('getSubCategoriesExport', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getSubCategoriesExport();
        if (status === 200) {
                dispatch(setSubCategoriesExport(data))                
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        setSubCategoriesExport: (state, action) => {
            state.subCategoiesExportData = action.payload
        },
        setAllCoupons: (state, action) => {
            state.couponsData = action.payload
        },
        setAddCoupons: (state, action) => {
            state.addCouponsData = action.payload
        },
        setEditCoupons: (state, action) => {
            state.editCouponsData = action.payload
        },
        setDeleteCoupon: (state, action) => {
            state.deleteCouponData = action.payload
        },
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
    },
    extraReducers: (builder) => {

        // SubCategories
        builder.addCase(getAllCoupons.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getAllCoupons.fulfilled, (state, action) => {
            state.isLoading = false
            state.couponsData = action.payload
        })
        builder.addCase(getAllCoupons.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
    }
})

export const { 
    setChildCategories,
    setAddCoupons,
    setEditCoupons,
    setAllCoupons,
    setDeleteCoupon,
    setRefresh,
    setFilterValues,
    setSubCategoriesExport,
} = couponSlice.actions

export default couponSlice.reducer;