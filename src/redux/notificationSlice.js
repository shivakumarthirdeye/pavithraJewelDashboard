import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isRefresh: false,
    isLoading: false,
    notificationData: [],
    notificationCountData: 0,
    createdNotificationData:{},
    errorMsg: "",
    isError: false,
};

export const getNotification = createAsyncThunk('getNotification', async (body, { rejectWithValue, dispatch }) => {
    try {              
        //  console.log(body,"userId");
         
        const { data, status } = await api.getNotification();
        console.log(data,status ,"getall notifications");
         


        if (status === 200) {
            dispatch(setNotification(data.data||[]))
            // dispatch(setRefresh())
        }
        return data.data

    } catch (err) {
        console.log(err,"error");
        
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const getNotificationCount = createAsyncThunk('getNotificationCount', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getNotificationCount(body);
        if (status === 200) {
            dispatch(setNotificationCount(data.data))
            // dispatch(setRefresh())
        }
        return data.data

    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const markAsRead=createAsyncThunk('markAsRead',async(body, { rejectWithValue, dispatch })=>{
    try {
        const { data, status } = await api.markAsRead(body);
        if (status === 200) {
            dispatch(updateNotificationStatus(body))

        }
        return data.data

    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
})


export const markAllAsRead=createAsyncThunk('markAllAsRead',async(body,{rejectWithValue,dispatch})=>{
    try {
        
        const { data, status } = await api.markAllAsReaded(body);
         if(status === 200){
            dispatch (updateAllNotificationMarkAsRead())
            Toastify.success("Marked all notifications as readed  ✅ ");

            
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
        setCreatednotification:(state,action)=>{
             state.createdNotificationData=action.payload
        },
        setNotificationCount: (state, action) => {
            state.notificationCountData = action.payload
        },
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        addNotification: (state, action) => {
            state.notificationData = [action.payload, ...state.notificationData]; // Prepend the new notification
        },
        updateNotificationStatus:(state,action)=>{
            state.notificationData = state.notificationData?.map((notification) => {
                if(action.payload === notification._id) {
                    return {
                        ...notification,
                        isRead: true
                    }
                } else {
                    return notification
                }
            })
        },
        updateAllNotificationMarkAsRead:(state,action)=>{
            state.notificationData=state.notificationData?.map((notification)=>{
              return{
                ...notification,isRead:true
            }  
            })
        }

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


export const { setNotification,setNotificationCount,setRefresh,addNotification, updateNotificationStatus , updateAllNotificationMarkAsRead,setCreatednotification} = notificationSlice.actions

export default notificationSlice.reducer;
