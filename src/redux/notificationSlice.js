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
            const { data } = await api.getNotification({ params });
            return {
                data: data?.data,
                page: params.page
            };

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
            const { data, page } = action.payload;
            const newNotifications = data.notifications || [];

            if (page === 1) {
                state.incomingNotification = newNotifications;
            } else {
                const existingIds = new Set(state.incomingNotification.map(n => n._id));
                const uniqueNew = newNotifications.filter(n => !existingIds.has(n._id));
                state.incomingNotification = [...state.incomingNotification, ...uniqueNew];
            }

            state.isLoading = false;
            state.unReadedNotifications = data.unReadedNotifications || 0;
            state.pagination = {
                totalPages: data.totalPages || 1,
                totalNotifications: data.totalNotifications || 0,
                pageNotifications: data.pageNotifications || 0,
                isFirst: data.isFirst || false,
                isLast: data.isLast || false,
                hasNext: data.hasNext || false,
                hasPrevious: data.hasPrevious || false,
            };
        })
        builder.addCase(getNotification.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMsg = action.payload || "Failed to load notifications.";
        })
    }
});


export const { setRefresh } = notificationSlice.actions;

export default notificationSlice.reducer;
