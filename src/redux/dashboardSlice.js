import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    updateGoldRateData: {},
    filterOptions: {
        search: "",
        page: 1,
        status: '',
        order: '',
        sortBy: '',
        limit: 10
    },
    goldRateData: {},
    errorMsg: "",
    isError: false
}

export const updateGoldRate = createAsyncThunk('updateGoldRate', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.updateGoldRate(body);
        if (status === 200) {
            dispatch(setUpdateGoldRate(body))
            Toastify.success('Gold Rate Updated Successfuly');
            dispatch(setRefresh());
        }
        return data.data;
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getGoldRate = createAsyncThunk('getGoldRate', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getGoldRate();
        if (status === 200) {
            //get categories data
            dispatch(setGoldRate(data))
            // dispatch(setRefresh())
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setGoldRate: (state, action) => {
            state.goldRateData = action.payload
        },        
        setUpdateGoldRate: (state, action) => {
            state.updateGoldRateData = action.payload
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
    },
    extraReducers: (builder) => {

        // Categories
        builder.addCase(getGoldRate.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getGoldRate.fulfilled, (state, action) => {
            state.isLoading = false
            state.goldRateData = action.payload
        })
        builder.addCase(getGoldRate.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

    }
})

export const {
    setUpdateGoldRate,
    setGoldRate,
    setRefresh,
    setFilterValues,
} = dashboardSlice.actions

export default dashboardSlice.reducer;