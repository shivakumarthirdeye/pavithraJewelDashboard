import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    addTermsConditionData: {},
    termsConditionData: {},
    errorMsg: "",
    isError: false
}

export const getTermsCondition = createAsyncThunk('getTermsCondition', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getTermsCondition();
        if (status === 200) {
            //get termscondition data
            dispatch(setTermsCondition(data.data))
            // dispatch(setRefresh())
        }
        return data.data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addTermsCondition = createAsyncThunk('addTermsCondition', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addTermsCondition(body);
        if (status === 200) {
            dispatch(setAddTermsCondition(body))
            Toastify.success('Terms And Condition Added Successfuly');
            dispatch(setRefresh());
        }
        return data.data;
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const termsConditionSlice = createSlice({
    name: "termscondition",
    initialState,
    reducers: {

        setTermsCondition: (state, action) => {
            state.termsConditionData = action.payload
        },
        setAddTermsCondition: (state, action) => {
            state.addTermsConditionData = action.payload
        },
        
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
        
    },
    extraReducers: (builder) => {

        // Categories
        builder.addCase(getTermsCondition.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getTermsCondition.fulfilled, (state, action) => {
            state.isLoading = false
            state.termsConditionData = action.payload
        })
        builder.addCase(getTermsCondition.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

    }
})

export const {
    setAddTermsCondition,
    setTermsCondition,
    setRefresh
} = termsConditionSlice.actions

export default termsConditionSlice.reducer;