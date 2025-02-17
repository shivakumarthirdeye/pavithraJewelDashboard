import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";


const initialState = {
    isLoading: false,
    isRefresh: false,
    customerData:{},
    exportCustomersData:{},
    customersDetailData:{},
    deleteCustomersData:{},
    filterOptions: {
        search: "",
        page: 1,
        order: '',
        sortBy: '',
        limit: 10,
    },
    errorMsg: "",
    isError: false
}

export const getAllCustomers = createAsyncThunk("getAllCustomers" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllCustomers(queryParams);
        if (status === 200) {
                //get customer data
                dispatch(setCustomers(data))
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})
export const getExportsCustomers = createAsyncThunk("getExportsCustomers" ,async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getExportsCustomers();
        if (status === 200) {
            dispatch(setExportCustomers(data.data))
                
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
                dispatch(setCustomersDetail(data))
                
            } 
            return data
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
         setCustomersDetail: (state,action) => {
            state.customersDetailData = action.payload
        },
        setDeleteCustomer: (state,action) => {
            state.deleteCustomersData = action.payload
        },
        setExportCustomers: (state,action) => {
            state.exportCustomersData = action.payload
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
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
    }
})


export const {
    setCustomers,
    setCustomersDetail,
    setSearchCustomers,
    setDeleteCustomer,
    setFilterValues,
    setExportCustomers,
    setRefresh
} = customerSlice.actions;

export default customerSlice.reducer;