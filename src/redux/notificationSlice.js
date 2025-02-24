import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isRefresh: false,
    isLoading: false,
    notificationData: [],
    errorMsg: "",
    isError: false,
};

export const getNotification = createAsyncThunk('getNotification', async (body, { rejectWithValue, dispatch }) => {
    try { 
        const { data, status } = await api.getNotification();

        if (status === 200) {
            dispatch(setNotification(data||[]))
        }
        return data

    } catch (err) {
        console.log(err,"error");
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const markAsRead=createAsyncThunk('markAsRead',async(body, { rejectWithValue, dispatch })=>{
    try {
        const { data, status } = await api.markAsRead(body);
        if (status === 200) {
            dispatch(getNotification())
        }
        return data.data

    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})






export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.notificationData = action.payload
        },
       
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        
    },

    extraReducers: (builder) => {

        
        builder.addCase(getNotification.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getNotification.fulfilled, (state, action) => {
            state.isLoading = false
            state.notificationData = action.payload
        })
        builder.addCase(getNotification.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
    }
})


export const { setNotification,setRefresh} = notificationSlice.actions

export default notificationSlice.reducer;
