import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    ordersData: {},
    trashOrdersData: {},
    ordersDetailsData: {},
    deleteOrdersData: {},
    customerReviewsData: {},
    editReviewsData: {},
    revertOrdersData: {},
    approveRejectData: {},
    orderStatisticsData: {},
    editPendingPriceData: {},
    filterOptions: {
        status: "",
        search: "",
        startDate: "",
        endDate: "",
        page: 1,
        order: '',
        sortBy: '',
        limit: 10,
        orderType:''
    },
    errorMsg: "",
    isError: false
}




export const orderStatistics = createAsyncThunk('orderStatistics', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.orderStatistics(body);
        // console.log('dasta=======>',body);
        
        if (status === 200) {
                //get categories data
                dispatch(setStatistics(data.data))
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const getOrders = createAsyncThunk('getOrders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getOrders(queryParams);
        if (status === 200) {
                //get categories data
                dispatch(setOrders(data))
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const getAllDeletedOrdersList = createAsyncThunk('getAllDeletedOrdersList', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAllDeletedOrdersList(body);
        if (status === 200) {
                //get categories data
               
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const getAllOrdersList = createAsyncThunk('getAllOrdersList', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAllOrdersList(body);
        if (status === 200) {
                //get categories data
               
                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const getOrdersDetails = createAsyncThunk('getOrdersDetails', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getOrdersDetails(body);
        if (status === 200) {
                //get categories data
                dispatch(setOrdersDetails(data.data))                
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getCustomerReviews = createAsyncThunk('getCustomerReviews', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getCustomerReviews(body);
        if (status === 200) {
                //get categories data
                dispatch(setCustomerReviews(data.data))  
            } 
            return data.data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const deleteOrders = createAsyncThunk('deleteOrders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteOrders(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteOrders(body));
            Toastify.success("Order Deleted successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const revertOrders = createAsyncThunk('revertOrders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.revertOrders(body);

        if (status === 200) {
            // render otp screen
            dispatch(setRevertOrders(body));
            Toastify.success("Order Reverted successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editReviews = createAsyncThunk('editReviews', async ({url,val}, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editReviews({url,val});

        if (status === 200) {
            // render otp screen
            dispatch(setEditReviews({url,val}));
            Toastify.success("Reviews Edited successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editPendingPrice = createAsyncThunk('editPendingPrice', async ({url,val}, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editPendingPrice({url,val});

        if (status === 200) {
            // render otp screen
            dispatch(setEditPendingPrice({url,val}));
            Toastify.success("Price Edited successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const approveReject = createAsyncThunk('approveReject', async ({ url, val }, { rejectWithValue, dispatch }) => {
    console.log('url:', url);  // Check if URL is properly constructed
    console.log('value:', val);  // Ensure the value is correct
    try {
        const { data, status } = await api.approveReject(url, val);  // Make sure url and val are passed correctly

        if (status === 200) {
            dispatch(setApproveReject({ url, val }));
            Toastify.success(data.data);
            dispatch(setRefresh());
        }
        return data.data;
    } catch (err) {
        Toastify.error(err.response?.data?.message || "Something went wrong.");
        return rejectWithValue(err.response?.data?.message || "Something went wrong.");
    }
});

export const getTrashOrders = createAsyncThunk('getTrashOrders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getTrashOrders(queryParams);
        if (status === 200) {
                //get categories data
                dispatch(setTrashOrders(data))
                
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.ordersData = action.payload
        },
        setOrdersDetails: (state, action) => {
            state.ordersDetailsData = action.payload
        },
        setDeleteOrders: (state, action) => {
            state.deleteOrdersData = action.payload
        },
        setCustomerReviews: (state, action) => {
            state.customerReviewsData = action.payload
        },
        setEditReviews: (state, action) => {
            state.editReviewsData = action.payload
        },
        setRevertOrders: (state, action) => {
            state.revertOrdersData = action.payload
        },
        setApproveReject: (state, action) => {
            state.approveRejectData = action.payload
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        setStatistics:(state,action) => {
            state.orderStatisticsData = action.payload
        },
        setEditPendingPrice:(state,action) => {
            state.editPendingPriceData = action.payload
        },
        setTrashOrders: (state, action) => {
            state.trashOrdersData = action.payload
        },
    },
    extraReducers: (builder) => {

        // getOrders
        builder.addCase(getOrders.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.isLoading = false
            state.ordersData = action.payload
        })
        builder.addCase(getOrders.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
        // getProductsDetails
        builder.addCase(getOrdersDetails.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getOrdersDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.ordersDetailsData = action.payload
        })
        builder.addCase(getOrdersDetails.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getCustomerReviews
        builder.addCase(getCustomerReviews.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getCustomerReviews.fulfilled, (state, action) => {
            state.isLoading = false
            state.customerReviewsData = action.payload
        })
        builder.addCase(getCustomerReviews.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
        // getTrashOrders
        builder.addCase(getTrashOrders.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getTrashOrders.fulfilled, (state, action) => {
            state.isLoading = false
            state.trashOrdersData = action.payload
        })
        builder.addCase(getTrashOrders.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
    }
})

export const { 
    setOrders,
    setDeleteOrders,
    setOrdersDetails,
    setRefresh,
    setCustomerReviews,
    setEditReviews,
    setSearchOrders,
    setRevertOrders,
    setApproveReject,
    setStatistics,
    setFilterValues,
    setEditPendingPrice,
    setTrashOrders
 } = ordersSlice.actions

export default ordersSlice.reducer;