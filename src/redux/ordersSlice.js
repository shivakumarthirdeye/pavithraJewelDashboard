import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    ordersData: {},
    searchOrdersData: {},
    ordersDetailsData: {},
    deleteOrdersData: {},
    customerReviewsData: {},
    editReviewsData: {},
    revertOrdersData: {},
    approveRejectData: {},
    orderStatistics: {},
    errorMsg: "",
    isError: false
}




export const orderStatistics = createAsyncThunk('orderStatistics', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.orderStatistics();
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
        const { data, status } = await api.getOrders(body);
        if (status === 200) {
                //get categories data
                dispatch(setOrders(data.data))
                
            } 
            return data.data
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

export const searchOrders = createAsyncThunk('searchOrders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.searchOrders(body);
        if (status === 200) {
                //get categories data
                dispatch(setSearchOrders(data.data))
                
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



export const exchangeProduct = createAsyncThunk('exchangeProduct', async ({orderId,reasonForRejection}, { rejectWithValue, dispatch }) => {
    try {
        console.log("rejectttttttttttttttt",orderId,reasonForRejection)
        const { data, status } = await api.exchangeProduct(orderId,reasonForRejection);
        console.log("reduxxxxxxxxxx",data)
        if (status === 200) {
            Toastify.success(data.data.message);
            // dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const filterOrder = createAsyncThunk('filterOrder', async ({date,status,filter,isDeleted,page}, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.filterOrder(date,status,filter,isDeleted,page);
        if (response.status === 200) {
              
                dispatch(setOrders(response.data.data))
                
            } 
            return response.data.data
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
        setSearchOrders: (state, action) => {
            state.searchOrdersData = action.payload
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
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        setStatistics:(state,action) => {
            state.orderStatistics = action.payload
        }
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
        // searchOrdersData
        builder.addCase(searchOrders.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(searchOrders.fulfilled, (state, action) => {
            state.isLoading = false
            state.searchOrdersData = action.payload
        })
        builder.addCase(searchOrders.rejected, (state, action) => {
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
        // editReviews
        builder.addCase(editReviews.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(editReviews.fulfilled, (state, action) => {
            state.isLoading = false
            state.editReviewsData = action.payload
        })
        builder.addCase(editReviews.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // revertOrders
        builder.addCase(revertOrders.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(revertOrders.fulfilled, (state, action) => {
            state.isLoading = false
            state.revertOrdersData = action.payload
        })
        builder.addCase(revertOrders.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // ApproveReject
        builder.addCase(approveReject.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(approveReject.fulfilled, (state, action) => {
            state.isLoading = false
            state.approveRejectData = action.payload
        })
        builder.addCase(approveReject.rejected, (state, action) => {
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
    setStatistics
 } = ordersSlice.actions

export default ordersSlice.reducer;