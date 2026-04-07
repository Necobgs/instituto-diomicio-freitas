

import monitoringService from "@/services/monitoringService";
import { iMonitoringForm, iMonitoringState, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initMonitorings = createAsyncThunk('monitoring/fetch', async ({ page = 1, limit = 8, student, visitDateIni, visitDateEnd, enabled }: iParamsMonitoring = {})  => {
    return await monitoringService.getMonitorings({page, limit, student, visitDateIni, visitDateEnd, enabled });
});

export const getMonitoringById = createAsyncThunk("monitoring/getById", async (id: number) => {
    return await monitoringService.getMonitoringById(id);
});

export const addMonitoring = createAsyncThunk('monitoring/add', async (payload: iMonitoringForm) => {
    return await monitoringService.addMonitoring(payload);
});

export const editMonitoring = createAsyncThunk('monitoring/edit', async (payload: iMonitoringForm) => {
    return await monitoringService.editMonitoring({ ...payload });
});

export const removeMonitoring = createAsyncThunk('monitoring/remove', async (payload: number) => {
    return await monitoringService.removeMonitoring(payload);
});

const initialState: iMonitoringState = {
    monitorings: [],
    monitoring: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const monitoringSlice = createSlice({
    name: "monitoring",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initMonitorings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initMonitorings.fulfilled, (state, action: PayloadAction<iPaginationMonitoring>) => {
                state.monitorings = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initMonitorings.rejected, (state) => {
                state.error = "Erro ao carregar lista de acompanhamentos";
                state.loading = false;
                state.monitorings = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getMonitoringById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMonitoringById.fulfilled, (state, action: PayloadAction<iMonitoringForm>) => {
                state.monitoring = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getMonitoringById.rejected, (state) => {
                state.error = "Erro ao buscar acompanhamento";
                state.loading = false;
            })
            .addCase(addMonitoring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMonitoring.fulfilled, (state, action: PayloadAction<iMonitoringForm>) => {
                state.monitorings.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addMonitoring.rejected, (state) => {
                state.error = "Erro ao adicionar acompanhamento";
                state.loading = false;
            })
            .addCase(editMonitoring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editMonitoring.fulfilled, (state, action: PayloadAction<iMonitoringForm>) => {
                state.monitorings = state.monitorings.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editMonitoring.rejected, (state) => {
                state.error = "Erro ao editar acompanhamento";
                state.loading = false;
            })
            .addCase(removeMonitoring.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(removeMonitoring.fulfilled, (state, action: PayloadAction<iMonitoringForm>) => {
                state.monitorings = state.monitorings.filter((t) => t.id !== action.payload);
                state.count = state.count - 1;
                state.error = null;
                state.loading = false;
            })
            .addCase(removeMonitoring.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            });
    },
});


export const selectMonitorings = (state: { monitoring: iMonitoringState }) => state.monitoring.monitorings;
export const selectMonitoring = (state: { monitoring: iMonitoringState }) => state.monitoring.monitoring;
export const selectMonitoringError = (state: { monitoring: iMonitoringState }) => state.monitoring.error;
export const selectMonitoringLoading = (state: { monitoring: iMonitoringState }) => state.monitoring.loading;
export const selectMonitoringCount = (state: { monitoring: iMonitoringState }) => state.monitoring.count;
export const selectMonitoringHasNextPage = (state: { monitoring: iMonitoringState }) => state.monitoring.hasNextPage;
export const selectMonitoringHasPreviousPage = (state: { monitoring: iMonitoringState }) => state.monitoring.hasPreviousPage;

export const monitoringReducer = monitoringSlice.reducer;