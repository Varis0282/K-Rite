import { createSlice } from "@reduxjs/toolkit";

export const loader = createSlice({
    name: 'loaders',
    initialState: {
        loading : false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setLoading } = loader.actions;