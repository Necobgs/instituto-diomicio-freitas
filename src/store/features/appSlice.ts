
import appService from "@/services/appService";
import { iAppState } from "@/types/app";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getApp = createAsyncThunk('app/fetch', async ()  => {
    return await appService.getApp();
});

const initialState: iAppState = {
    isFetched: false,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getApp.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getApp.fulfilled, (state, action: PayloadAction<string>) => {
                state.isFetched = true;
                state.error = null;
                state.loading = false;
            })
            .addCase(getApp.rejected, (state) => {
                state.error = "Erro ao carregar aplicação";
                state.loading = false;
                state.isFetched = false;
            })
    },
});


export const selectIsFetched = (state: { app: iAppState }) => state.app.isFetched;
export const selectEnterpriseError = (state: { app: iAppState }) => state.app.error;
export const selectEnterpriseLoading = (state: { app: iAppState }) => state.app.loading;

export const appReducer = appSlice.reducer;