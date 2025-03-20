import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    addCategoriesData: {},
    filterOptions: {
        search: "",
        page: 1,
        status: '',
        order: '',
        sortBy: '',
        limit: 10
    },
    editCategoriesData: {},
    categoriesData: {},
    deleteCategoriesData: {},
    categoriesExportData: {},
    categoryByIdData: {},
    errorMsg: "",
    isError: false
}

export const getCategories = createAsyncThunk('getCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const queryParams = new URLSearchParams(body).toString();
        const { data, status } = await api.getCategories(queryParams);
        if (status === 200) {
            //get categories data
            dispatch(setCategories(data))
            // dispatch(setRefresh())
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getCategoriesExport = createAsyncThunk('getCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getCategoriesExport(body);
        if (status === 200) {
            //get categories data
            dispatch(setCategoriesExport(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addCategories = createAsyncThunk('addCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addCategories(body);
        if (status === 200) {
            dispatch(setAddCategories(body))
            Toastify.success('Category Added Successfuly');
            dispatch(setRefresh());
        }
        return data.data;
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const editCategories = createAsyncThunk('editCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editCategories(body);
        if (status === 200) {
            // render otp screen
            dispatch(setEditCategories(body));
            Toastify.success("Category Edited successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getCategoryById = createAsyncThunk('getCategoryById', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getCategoryById(body);
        if (status === 200) {
            // render otp screen
            dispatch(setCategoryById(data?.data));
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const deleteCategories = createAsyncThunk('deleteCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.deleteCategories(body);

        if (status === 200) {
            // render otp screen
            dispatch(setDeleteCategories(body));
            Toastify.success("Category Deleted successfully")
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {

        setCategories: (state, action) => {
            state.categoriesData = action.payload
        },
        setCategoriesExport: (state, action) => {
            state.categoriesExportData = action.payload
        },
        setAddCategories: (state, action) => {
            state.addCategoriesData = action.payload
        },
        setEditCategories: (state, action) => {
            state.editCategoriesData = action.payload
        },
        setDeleteCategories: (state, action) => {
            state.deleteCategoriesData = action.payload
        },
        setCategoryById: (state, action) => {
            state.categoryByIdData = action.payload
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
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.categoriesData = action.payload
        })
        builder.addCase(getCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

    }
})

export const {
    setAddCategories,
    setEditCategories,
    setCategories,
    setDeleteCategories,
    setRefresh,
    setFilterValues,
    setCategoriesExport,
    setCategoryById
} = categoriesSlice.actions

export default categoriesSlice.reducer;