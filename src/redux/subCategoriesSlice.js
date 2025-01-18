import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    filterOptions:{
        search:"",
        page:1,
        status:'',
        order:'',
        sortBy:'',
        limit:10
      },
    addSubCategoriesData: {},
    editSubCategoriesData: {},
    subCategoriesData: {},
    deleteSubCategoriesData: {},
    subCategoiesExportData:{},
    errorMsg: "",
    isError: false
}

export const getSubCategories = createAsyncThunk('getSubCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getSubCategories(queryParams);
        if (status === 200) {
                //get categories data
                dispatch(setSubCategories(data))
                // dispatch(setRefresh())
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addSubCategories = createAsyncThunk('addSubCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addSubCategories(body);

        if (status === 200) {
            dispatch(setAddSubCategories(body));
            Toastify.success("Subcategory Added Successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editSubCategories = createAsyncThunk('editSubCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editSubCategories(body);
        if (status === 200) {
            // render otp screen
            dispatch(setEditSubCategories(body));
            Toastify.success("Sub-Category Edited Successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const deleteSubCategories = createAsyncThunk('deleteSubCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteSubCategories(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteSubCategories(body));
            Toastify.success("Subcategory Deleted Successfully");
            dispatch(setRefresh());
        }
        return data.data
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const getSubCategoriesExport = createAsyncThunk('getSubCategoriesExport', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getSubCategoriesExport();
        if (status === 200) {
                dispatch(setSubCategoriesExport(data))                
            } 
            return data
        } catch (err) {
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const subCategoriesSlice = createSlice({
    name: "subCategories",
    initialState,
    reducers: {
        setSubCategoriesExport: (state, action) => {
            state.subCategoiesExportData = action.payload
        },
        setSubCategories: (state, action) => {
            state.subCategoriesData = action.payload
        },
        setAddSubCategories: (state, action) => {
            state.addSubCategoriesData = action.payload
        },
        setEditSubCategories: (state, action) => {
            state.editSubCategoriesData = action.payload
        },
        setDeleteSubCategories: (state, action) => {
            state.deleteSubCategoriesData = action.payload
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
        builder.addCase(getSubCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getSubCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.subCategoriesData = action.payload
        })
        builder.addCase(getSubCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // addSubCategories
        builder.addCase(addSubCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(addSubCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.addSubCategoriesData = action.payload
        })
        builder.addCase(addSubCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // deleteSubCategories
        builder.addCase(deleteSubCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(deleteSubCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.deleteSubCategoriesData = action.payload
        })
        builder.addCase(deleteSubCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // editCategories
        builder.addCase(editSubCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(editSubCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.editSubCategoriesData = action.payload
        })
        builder.addCase(editSubCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
    }
})

export const { 
    setChildCategories,
    setAddSubCategories,
    setEditSubCategories,
    setSubCategories,
    setDeleteSubCategories,
    setRefresh,
    setFilterValues,
    setSubCategoriesExport,
} = subCategoriesSlice.actions

export default subCategoriesSlice.reducer;