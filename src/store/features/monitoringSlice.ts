

import monitoringService from "@/services/monitoringService";
import { iMonitoring, iMonitoringForm, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MonitoringState {
    monitorings: iMonitoring[];
    error: string | null;
    loading: boolean;
    total: number;
}

export const initMonitorings = createAsyncThunk('monitoring/fetch', async ({ page = 1, limit = 8, student, admission_date, enterprise, job_title, hr_contact, hr_resposible, termination_date_ieedf }: iParamsMonitoring = {})  => {
    return await monitoringService.getMonitorings({page, limit, student, admission_date, enterprise, job_title, hr_contact, hr_resposible, termination_date_ieedf });
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

const initialState: MonitoringState = {
    monitorings: [],
    error: null,
    loading: false,
    total: 0,
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
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initMonitorings.rejected, (state) => {
                state.error = "Erro ao carregar lista de acompanhamentos";
                state.loading = false;
                state.monitorings = [];
                state.total = 0;
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
                state.total = state.total - 1;
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


export const selectMonitorings = (state: { monitoring: MonitoringState }) => state.monitoring.monitorings;
export const selectMonitoringError = (state: { monitoring: MonitoringState }) => state.monitoring.error;
export const selectMonitoringLoading = (state: { monitoring: MonitoringState }) => state.monitoring.loading;
export const selectMonitoringTotal = (state: { monitoring: MonitoringState }) => state.monitoring.total;

export const monitoringReducer = monitoringSlice.reducer;