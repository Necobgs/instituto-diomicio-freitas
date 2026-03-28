

import monitoringService from "@/services/monitoringService";
import { iMonitoring, iMonitoringForm, iMonitoringState, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initMonitorings = createAsyncThunk('monitoring/fetch', async ({ page = 1, limit = 8, studentId, enterpriseId, visit_date_ini, visit_date_end, enabled }: iParamsMonitoring = {})  => {
    return await monitoringService.getMonitorings({page, limit, studentId, enterpriseId, visit_date_ini, visit_date_end, enabled });
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
    await monitoringService.removeMonitoring(payload);
    return payload;
});

const initialState: iMonitoringState = {
    monitorings: [],
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
            .addCase(addMonitoring.fulfilled, (state, action: PayloadAction<iMonitoring>) => {
                state.monitorings.push(action.payload);
                state.error = null;
            })
            .addCase(addMonitoring.rejected, (state) => {
                state.error = "Erro ao adicionar acompanhamento";
            })
            .addCase(removeMonitoring.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeMonitoring.fulfilled, (state, action: PayloadAction<number>) => {
                state.monitorings = state.monitorings.filter((t) => t.id !== action.payload);
                state.count = state.count - 1;
                state.error = null;
                state.loading = false;
            })
            .addCase(removeMonitoring.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editMonitoring.fulfilled, (state, action: PayloadAction<iMonitoring>) => {
                state.monitorings = state.monitorings.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editMonitoring.rejected, (state) => {
                state.error = "Erro ao editar acompanhamento";
            });
    },
});


export const selectMonitorings = (state: { monitoring: iMonitoringState }) => state.monitoring.monitorings;
export const selectMonitoringError = (state: { monitoring: iMonitoringState }) => state.monitoring.error;
export const selectMonitoringLoading = (state: { monitoring: iMonitoringState }) => state.monitoring.loading;
export const selectMonitoringTotal = (state: { monitoring: iMonitoringState }) => state.monitoring.count;
export const selectMonitoringHasNextPage = (state: { monitoring: iMonitoringState }) => state.monitoring.hasNextPage;
export const selectMonitoringHasPreviousPage = (state: { monitoring: iMonitoringState }) => state.monitoring.hasPreviousPage;

export const monitoringReducer = monitoringSlice.reducer;