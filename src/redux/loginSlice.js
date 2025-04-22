import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";
import { setLogin } from "./userSlice";

const initialState = {
    isLoading: false,
    isResending: false,
    loginInfo: {
        email: "",
        password: "",
    },
    forgotPasswordData: {},
    resetPasswordData: {},
    verifyOtpData: {},
    errorMsg: "",
    isError: false
}

export const login = createAsyncThunk('login', async (body, { rejectWithValue, dispatch }) => {
    try {
    
        
        const { data, status } = await api.adminLogin(body);
        dispatch(setLoading(true))

        

        if (status === 200) {
                dispatch(setLoading(false))
                dispatch(setLogin(true))
                Toastify.success("Logged in successfully");
                localStorage.setItem("token",data.data.token)

        }
    } catch (err) {
        dispatch(setLoading(false))
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const forgotPassword = createAsyncThunk('forgotPassword', async (body, { rejectWithValue, dispatch }) => {
    try {
       
     
        const { data, status } = await api.forgotPassword(body);
        
        dispatch(setLoading(true))
        if (status === 200) {
                dispatch(setLoading(false))
                dispatch(setForgotPassword(body))
                Toastify.success(data.data.message);
                localStorage.setItem("email",body.email)
        }
        return data.data
    } catch (err) {
        dispatch(setLoading(false))
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const verifyOtp = createAsyncThunk('verifyOtp', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.verifyOtp(body);
        dispatch(setLoading(true))
        if (status === 200) {
                dispatch(setLoading(false))
                dispatch(setVerifyOtp(body))
                Toastify.success("OTP Verified successfully");
        }
        return data.data
    } catch (err) {
        dispatch(setLoading(false))
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const resetPassword = createAsyncThunk('resetPassword', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.resetPassword(body);
       
        dispatch(setLoading(true))
        if (status === 200) {
                dispatch(setLoading(false))
                // dispatch(setResetPassword(body))
                Toastify.success(data.data.message);
        }
        return data.data
    } catch (err) {
        dispatch(setLoading(false))
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setLoginData: (state, action) => {
            state.loginInfo = action.payload
        },
        setForgotPassword: (state, action) => {
            state.forgotPasswordData = action.payload
        },
        setVerifyOtp: (state, action) => {
            state.verifyOtpData = action.payload
        },
        setResetPassword: (state, action) => {
            state.resetPasswordData = action.payload
        },
        
    },
    
})

export const { setLoading,setLoginData,setForgotPassword, setVerifyOtp,setResetPassword} = loginSlice.actions

export default loginSlice.reducer;