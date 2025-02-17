import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        search:"",
        page:1,
        order:'',
        sortBy:'',
        limit:10
      },
    addCountryData: {},
    editCountryData: {},
    countryData: {},
    deleteCountryData: {},
    exportCountryData:{},
    errorMsg: "",
    isError: false
}

export const getAllCountry = createAsyncThunk('getAllCountry', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getAllCountry(queryParams);
        if (status === 200) {
                //get categories data
                dispatch(setAllCountry(data))
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addCountry = createAsyncThunk('addCountry', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addCountry(body);

        if (status === 200) {
            dispatch(setAddCountry(body));
            Toastify.success('Country added successfuly');
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editCountry = createAsyncThunk('editCountry', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editCountry(body);
        if (status === 200) {
            // render otp screen
            dispatch(setEditCountry(body));
            Toastify.success("Country Edited Successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const deleteCountry = createAsyncThunk('deleteCountry', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteCountry(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteCountry(body));
            Toastify.success("Country Deleted Successfully");
            dispatch(setRefresh());
        }
        return data.data
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const getExportCountry = createAsyncThunk('getExportCountry', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getExportCountry();
        if (status === 200) {
                dispatch(setExportCountry(data))                
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {
        setSubCategoriesExport: (state, action) => {
            state.subCategoiesExportData = action.payload
        },
        setAllCountry: (state, action) => {
            state.countryData = action.payload
        },
        setAddCountry: (state, action) => {
            state.addCountryData = action.payload
        },
        setEditCountry: (state, action) => {
            state.editCountryData = action.payload
        },
        setDeleteCountry: (state, action) => {
            state.deleteCountryData = action.payload
        },
        setExportCountry: (state, action) => {
            state.exportCountryData = action.payload
        },
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        setFilterValues: (state, action) => {
            state.filterOptions = { ...state.filterOptions, ...action.payload }
        },
    },
    extraReducers: (builder) => {

        // SubCategories
        builder.addCase(getAllCountry.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getAllCountry.fulfilled, (state, action) => {
            state.isLoading = false
            state.countryData = action.payload
        })
        builder.addCase(getAllCountry.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        
    }
})

export const { 
    setChildCategories,
    setAddCountry,
    setEditCountry,
    setAllCountry,
    setDeleteCountry,
    setRefresh,
    setFilterValues,
    setSubCategoriesExport,
    setExportCountry
} = countrySlice.actions

export default countrySlice.reducer;