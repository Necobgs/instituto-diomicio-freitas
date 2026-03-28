

import referralService from "@/services/referralService";
import { iReferral, iReferralForm, iReferralState, iPaginationReferral, iParamsReferral } from "@/types/referral";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initReferrals = createAsyncThunk('referral/fetch', async ({ page = 1, limit = 8, studentId, enterpriseId, jobId, admission_date_ini, admission_date_end, termination_date_ieedf_ini, termination_date_ieedf_end, enabled }: iParamsReferral = {})  => {
    return await referralService.getReferrals({ page, limit,  studentId, enterpriseId, jobId, admission_date_ini, admission_date_end, termination_date_ieedf_ini, termination_date_ieedf_end, enabled});
});

export const getReferralById = createAsyncThunk("referral/getById", async (id: number) => {
    return await referralService.getReferralById(id);
});

export const addReferral = createAsyncThunk('referral/add', async (payload: iReferralForm) => {
    return await referralService.addReferral(payload);
});

export const editReferral = createAsyncThunk('referral/edit', async (payload: iReferralForm) => {
    return await referralService.editReferral({ ...payload });
});

export const removeReferral = createAsyncThunk('referral/remove', async (payload: number) => {
    await referralService.removeReferral(payload);
    return payload;
});

const initialState: iReferralState = {
    referrals: [],
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const referralSlice = createSlice({
    name: "referral",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initReferrals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initReferrals.fulfilled, (state, action: PayloadAction<iPaginationReferral>) => {
                state.referrals = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initReferrals.rejected, (state) => {
                state.error = "Erro ao carregar lista de encaminhamentos";
                state.loading = false;
                state.referrals = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(addReferral.fulfilled, (state, action: PayloadAction<iReferral>) => {
                state.referrals.push(action.payload);
                state.error = null;
            })
            .addCase(addReferral.rejected, (state) => {
                state.error = "Erro ao adicionar encaminhamento";
            })
            .addCase(removeReferral.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeReferral.fulfilled, (state, action: PayloadAction<number>) => {
                state.referrals = state.referrals.filter((t) => t.id !== action.payload);
                state.count = state.count - 1;
                state.error = null;
                state.loading = false;
            })
            .addCase(removeReferral.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editReferral.fulfilled, (state, action: PayloadAction<iReferral>) => {
                state.referrals = state.referrals.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editReferral.rejected, (state) => {
                state.error = "Erro ao editar encaminhamento";
            });
    },
});


export const selectReferrals = (state: { referral: iReferralState }) => state.referral.referrals;
export const selectReferralError = (state: { referral: iReferralState }) => state.referral.error;
export const selectReferralLoading = (state: { referral: iReferralState }) => state.referral.loading;
export const selectReferralTotal = (state: { referral: iReferralState }) => state.referral.count;
export const selectReferralHasNextPage = (state: { referral: iReferralState }) => state.referral.hasNextPage;
export const selectReferralHasPreviousPage = (state: { referral: iReferralState }) => state.referral.hasPreviousPage;

export const referralReducer = referralSlice.reducer;