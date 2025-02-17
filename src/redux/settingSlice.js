import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    changePasswordData: {},
    editProfileData: {},
    errorMsg: "",
    isError: false
}




export const editProfile = createAsyncThunk('editProfile', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.editProfile(body);
        if (status === 200) {
            // render otp screen
            dispatch(setEditProfile(body));
            Toastify.success("Profile Edited Successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const changePassword = createAsyncThunk('changePassword', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.changePassword(body);

        if (status === 200) {
            // render otp screen
            dispatch(setChangePassword(body));
            Toastify.success("Password Changed Successfully");
            dispatch(setRefresh());
        }
        return data.data
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)



export const settingSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setEditProfile: (state, action) => {
            state.editProfileData = action.payload
        },
        setChangePassword: (state, action) => {
            state.changePasswordData = action.payload
        },
        
        setRefresh:(state) => {
            state.isRefresh = !state.isRefresh
        },
        
    },
})

export const { 
    setChangePassword,
    setEditProfile,    
    setRefresh,
} = settingSlice.actions

export default settingSlice.reducer;