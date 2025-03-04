import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/Api";
import Toastify from "../helper/Toastify";

const initialState = {
    isLoading: false,
    isRefresh: false,
    addSlidersData: {},
    slidersData: {},
    deleteCategoriesData: {},
    heroBannerData: {},
    addHeroBannerData: {},
    appearanceCategoriesData: {},
    addAppearanceCategoriesData: {},
    aboutUsData: {},
    addAboutUsData: {},
    brandSliderData: {},
    addBrandSliderData: {},
    featurerdProductsData: {},
    addFeaturerdProductsData: {},
    offerBannerData: {},
    addOfferBannerData: {},
    testimonialsData: {},
    addTestimonialsData: {},
    countersData: {},
    addCountersData: {},
    instagramData: {},
    addInstagramData: {},
    errorMsg: "",
    isError: false
}

export const getSliders = createAsyncThunk('getSliders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getSliders(body);
        if (status === 200) {
            //get categories data
            dispatch(setSliders(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addSliders = createAsyncThunk('addSliders', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addSliders(body);
        if (status === 200) {
            dispatch(setAddSliders(body))
            Toastify.success('Slider Added Successfuly');
            dispatch(setRefresh());
        }
        return data.data;
    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getHeroBanner = createAsyncThunk('getHeroBanner', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getHeroBanner(body);
        if (status === 200) {
            //get categories data
            dispatch(setHeroBanner(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addHeroBanner = createAsyncThunk('addHeroBanner', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addHeroBanner(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddHeroBanner(body));
            Toastify.success("Hero banner added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getAppearanceCategories = createAsyncThunk('getAppearanceCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAppearanceCategories(body);
        if (status === 200) {
            //get categories data
            dispatch(setAppearanceCategories(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)

export const addAppearanceCategories = createAsyncThunk('addAppearanceCategories', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addAppearanceCategories(body);
        if (status === 201) {
            // render otp screen
            dispatch(setAddAppearanceCategories(body));
            Toastify.success("Categories added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getAboutus = createAsyncThunk('getAboutus', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getAboutus(body);
        if (status === 200) {
            //get categories data
            dispatch(setAboutus(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addAboutus = createAsyncThunk('addAboutus', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addAboutus(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddAboutus(body));
            Toastify.success("About us added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getBrandSlider = createAsyncThunk('getBrandSlider', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getBrandSlider(body);
        if (status === 200) {
            //get categories data
            dispatch(setBrandSlider(data?.data?.brandSliders))
        }
        return data?.data?.brandSliders
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addBrandSlider = createAsyncThunk('addBrandSlider', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addBrandSlider(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddBrandSlider(body));
            Toastify.success("Brand sliders added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getFeaturerdProducts = createAsyncThunk('getFeaturerdProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getFeaturerdProducts(body);
        if (status === 200) {
            //get categories data
            dispatch(setFeaturerdProducts(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addFeaturerdProducts = createAsyncThunk('addFeaturerdProducts', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addFeaturerdProducts(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddFeaturerdProducts(body));
            Toastify.success("Brand sliders added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getOfferbanner = createAsyncThunk('getOfferbanner', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getOfferbanner(body);
        if (status === 200) {
            //get categories data
            dispatch(setOfferbanner(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addOfferbanner = createAsyncThunk('addOfferbanner', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addOfferbanner(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddOfferbanner(body));
            Toastify.success("Offer Banner added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getTestimonials = createAsyncThunk('getTestimonials', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getTestimonials(body);
        if (status === 200) {
            //get categories data
            dispatch(setTestimonials(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addTestimonials = createAsyncThunk('addTestimonials', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addTestimonials(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddTestimonials(body));
            Toastify.success("Testimonials added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getCounters = createAsyncThunk('getCounters', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getCounters(body);
        if (status === 200) {
            //get categories data
            dispatch(setCounters(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addCounters = createAsyncThunk('addCounters', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addCounters(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddCounters(body));
            Toastify.success("Counters added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const getInstagram = createAsyncThunk('getInstagram', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.getInstagram(body);
        if (status === 200) {
            //get categories data
            dispatch(setInstagram(data))
        }
        return data
    } catch (err) {
        // Toastify.error(err.response.data.message)
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)
export const addInstagram = createAsyncThunk('addInstagram', async (body, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.addInstagram(body);
        if (status === 200) {
            // render otp screen
            dispatch(setAddInstagram(body));
            Toastify.success("Instagram added successfully");
            dispatch(setRefresh());
        }
        return data.data

    } catch (err) {
        Toastify.error(err.response.data.message);
        return rejectWithValue(err.response.data.message || "'Something went wrong. Please try again later.'")
    }
}
)


export const appearanceSlice = createSlice({
    name: "appearance",
    initialState,
    reducers: {

        setSliders: (state, action) => {
            state.slidersData = action.payload
        },
        setCategoriesExport: (state, action) => {
            state.categoriesExportData = action.payload
        },
        setAddSliders: (state, action) => {
            state.addSlidersData = action.payload
        },
        setHeroBanner: (state, action) => {
            state.heroBannerData = action.payload
        },
        setAddHeroBanner: (state, action) => {
            state.addHeroBannerData = action.payload
        },
        setAppearanceCategories: (state, action) => {
            state.appearanceCategoriesData = action.payload
        },
        setAddAppearanceCategories: (state, action) => {
            state.addAppearanceCategoriesData = action.payload
        },
        setAboutus: (state, action) => {
            state.aboutUsData = action.payload
        },
        setAddAboutus: (state, action) => {
            state.addAboutUsData = action.payload
        },
        setBrandSlider: (state, action) => {
            state.brandSliderData = action.payload
        },
        setAddBrandSlider: (state, action) => {
            state.addBrandSliderData = action.payload
        },
        setFeaturerdProducts: (state, action) => {
            state.featurerdProductsData = action.payload
        },
        setAddFeaturerdProducts: (state, action) => {
            state.addFeaturerdProductsData = action.payload
        },
        setOfferbanner: (state, action) => {
            state.offerBannerData = action.payload
        },
        setAddOfferbanner: (state, action) => {
            state.addOfferBannerData = action.payload
        },
        setTestimonials: (state, action) => {
            state.testimonialsData = action.payload
        },
        setAddTestimonials: (state, action) => {
            state.addTestimonialsData = action.payload
        },
        setCounters: (state, action) => {
            state.countersData = action.payload
        },
        setAddCounters: (state, action) => {
            state.addCountersData = action.payload
        },
        setInstagram: (state, action) => {
            state.instagramData = action.payload
        },
        setAddInstagram: (state, action) => {
            state.addInstagramData = action.payload
        },
        setRefresh: (state) => {
            state.isRefresh = !state.isRefresh
        },
    },
    extraReducers: (builder) => {

        // getSliders
        builder.addCase(getSliders.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getSliders.fulfilled, (state, action) => {
            state.isLoading = false
            state.slidersData = action.payload
        })
        builder.addCase(getSliders.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

        // getHeroBanner
        builder.addCase(getHeroBanner.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getHeroBanner.fulfilled, (state, action) => {
            state.isLoading = false
            state.heroBannerData = action.payload
        })
        builder.addCase(getHeroBanner.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getHeroBanner
        builder.addCase(getAppearanceCategories.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getAppearanceCategories.fulfilled, (state, action) => {
            state.isLoading = false
            state.appearanceCategoriesData = action.payload
        })
        builder.addCase(getAppearanceCategories.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getAboutus
        builder.addCase(getAboutus.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getAboutus.fulfilled, (state, action) => {
            state.isLoading = false
            state.aboutUsData = action.payload
        })
        builder.addCase(getAboutus.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getBrandSlider
        builder.addCase(getBrandSlider.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getBrandSlider.fulfilled, (state, action) => {
            state.isLoading = false
            state.brandSliderData = action.payload
        })
        builder.addCase(getBrandSlider.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getFeaturerdProducts
        builder.addCase(getFeaturerdProducts.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getFeaturerdProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.featurerdProductsData = action.payload
        })
        builder.addCase(getFeaturerdProducts.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getOfferbanner
        builder.addCase(getOfferbanner.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getOfferbanner.fulfilled, (state, action) => {
            state.isLoading = false
            state.offerBannerData = action.payload
        })
        builder.addCase(getOfferbanner.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getTestimonials
        builder.addCase(getTestimonials.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getTestimonials.fulfilled, (state, action) => {
            state.isLoading = false
            state.testimonialsData = action.payload
        })
        builder.addCase(getTestimonials.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getCounters
        builder.addCase(getCounters.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getCounters.fulfilled, (state, action) => {
            state.isLoading = false
            state.countersData = action.payload
        })
        builder.addCase(getCounters.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })
        // getInstagram
        builder.addCase(getInstagram.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getInstagram.fulfilled, (state, action) => {
            state.isLoading = false
            state.instagramData = action.payload
        })
        builder.addCase(getInstagram.rejected, (state, action) => {
            state.isLoading = false
            state.errorMsg = action.payload
        })

    }
})

export const {
    setAddSliders,
    setHeroBanner,
    setSliders,
    setDeleteCategories,
    setRefresh,
    setFilterValues,
    setCategoriesExport,
    setAddHeroBanner,
    setAppearanceCategories,
    setAddAppearanceCategories,
    setAboutus,
    setAddAboutus,
    setBrandSlider,
    setAddBrandSlider,
    setFeaturerdProducts,
    setAddFeaturerdProducts,
    setAddOfferbanner,
    setOfferbanner,
    setAddTestimonials,
    setTestimonials,
    setCounters,
    setAddCounters,
    setAddInstagram,
    setInstagram
} = appearanceSlice.actions

export default appearanceSlice.reducer;