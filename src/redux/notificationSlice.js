import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";


const initialState = {
    isRefresh: false,
    isLoading: false,
    incomingNotification: [],
    unReadedNotifications: 0,
    pagination: {
        totalPages: 1,
        totalNotifications: 0,
        pageNotifications: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false,
    },
    errorMsg: "",
    isError: false,
};

export const getNotification = createAsyncThunk('notifications/getNotification',
    async (params = {}, { rejectWithValue, dispatch }) => {
        try {
            const { data, status } = await api.getNotification({ params });
            if (status === 200) {
                dispatch(setNotification(data?.data || {}));
            }
            return data?.data || {};
        } catch (err) {
            console.error("Notification Fetch Error →", err);
            return rejectWithValue(
                err.response?.data?.message || "Something went wrong. Please try again later."
            );
        }
});

export const markAsRead = createAsyncThunk('markAsRead', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.markAsRead(body);
        if (status === 200) {
            dispatch(getNotification())
        }
        return data.data

    } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
});


export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.incomingNotification = action.payload.notifications || [];
            state.unReadedNotifications = action.payload.unReadedNotifications || 0;
        },

        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
    },

    extraReducers: (builder) => {

        builder.addCase(getNotification.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.errorMsg = "";
        })
        builder.addCase(getNotification.fulfilled, (state, action) => {
            state.isLoading = false;
            state.incomingNotification = action.payload.notifications || [];
            state.unReadedNotifications = action.payload.unReadedNotifications || 0;
            state.pagination = {
                totalPages: action.payload.totalPages || 1,
                totalNotifications: action.payload.totalNotifications || 0,
                pageNotifications: action.payload.pageNotifications || 0,
                isFirst: action.payload.isFirst || false,
                isLast: action.payload.isLast || false,
                hasNext: action.payload.hasNext || false,
                hasPrevious: action.payload.hasPrevious || false,
            };
        })
        builder.addCase(getNotification.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMsg = action.payload || "Failed to load notifications.";
        })
    }
});


export const { setNotification, setRefresh } = notificationSlice.actions;

export default notificationSlice.reducer;
