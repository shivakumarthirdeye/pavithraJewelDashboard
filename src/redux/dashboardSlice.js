import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    updateGoldRateData: {},
    statisticsData: {},
    filterOptions: {
        filter: "",
        
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
export const getStatistics = createAsyncThunk('getStatistics', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getStatistics(queryParams);
        if (status === 200) {
            //get categories data
            dispatch(setStatistics(data))
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
        setStatistics: (state, action) => {
            state.statisticsData = action.payload
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
    },
    extraReducers: (builder) => {

        // Gold Rate
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

        //Statistics
        builder.addCase(getStatistics.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getStatistics.fulfilled, (state, action) => {
            state.isLoading = false
            state.statisticsData = action.payload
        })
        builder.addCase(getStatistics.rejected, (state, action) => {
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
    setStatistics
} = dashboardSlice.actions

export default dashboardSlice.reducer;