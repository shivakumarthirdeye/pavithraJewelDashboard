import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";


const initialState = {
    isLoading: false,
    isRefresh: false,
    customerData:{},
    searchCustomerData:{},
    customersDetailData:{},
    deleteCustomersData:{},
    errorMsg: "",
    isError: false
}

export const getAllCustomers = createAsyncThunk("getAllCustomers" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAllCustomers(body);
        if (status === 200) {
                //get categories data
                dispatch(setCustomers(data.data))
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})
export const getAllCustomersList = createAsyncThunk("getAllCustomersList" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAllCustomersList(body);
        if (status === 200) {
            
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})
export const searchCustomers = createAsyncThunk("searchCustomers" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.searchCustomers(body);
        if (status === 200) {
                //get categories data
                dispatch(setSearchCustomers(data.data))
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})
export const getCustomersDetail = createAsyncThunk("getCustomersDetail" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getCustomersDetail(body);
        if (status === 200) {
                //get categories data
                dispatch(setCustomersDetail(data.data))
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})
export const deleteCustomers = createAsyncThunk('deleteCustomers', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteCustomers(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteCustomer(body));
            Toastify.success("Customer Deleted successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const customerSlice = createSlice({
    name:'customers',
    initialState,
    reducers:{
        setCustomers: (state,action) => {
            state.customerData = action.payload
        },
        setSearchCustomers: (state,action) => {
            state.searchCustomerData = action.payload
        },
        setCustomersDetail: (state,action) => {
            state.customersDetailData = action.payload
        },
        setDeleteCustomer: (state,action) => {
            state.deleteCustomersData = action.payload
        },
        setRefresh: (state,action) => {
            state.isRefresh = !state.isRefresh
        },
    },
    extraReducers: (builder) => {

        // getCustomers
        builder.addCase(getAllCustomers.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getAllCustomers.fulfilled, (state, action) => {
            state.isLoading = false
            state.customerData = action.payload
        })
        builder.addCase(getAllCustomers.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

        // searchCustomers
        builder.addCase(searchCustomers.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(searchCustomers.fulfilled, (state, action) => {
            state.isLoading = false
            state.searchCustomerData = action.payload
        })
        builder.addCase(searchCustomers.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

        // getProductsDetails
        builder.addCase(getCustomersDetail.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getCustomersDetail.fulfilled, (state, action) => {
            state.isLoading = false
            state.customersDetailData = action.payload
        })
        builder.addCase(getCustomersDetail.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getProductsDetails
        builder.addCase(deleteCustomers.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(deleteCustomers.fulfilled, (state, action) => {
            state.isLoading = false
            state.deleteCustomersData = action.payload
        })
        builder.addCase(deleteCustomers.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
    }
})


export const {
    setCustomers,
    setCustomersDetail,
    setSearchCustomers,
    setDeleteCustomer,
    setRefresh
} = customerSlice.actions;

export default customerSlice.reducer;