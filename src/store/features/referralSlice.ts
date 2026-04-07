

import referralService from "@/services/referralService";
import { iReferralForm, iReferralState, iPaginationReferral, iParamsReferral } from "@/types/referral";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initReferrals = createAsyncThunk('referral/fetch', async ({ page = 1, limit = 8, student, enterprise, job, admissionDateIni, admissionDateEnd, terminationDateIeedfIni, terminationDateIeedfEnd, enabled }: iParamsReferral = {})  => {
    return await referralService.getReferrals({ page, limit,  student, enterprise, job, admissionDateIni, admissionDateEnd, terminationDateIeedfIni, terminationDateIeedfEnd, enabled});
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
    referral: null,
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
            .addCase(getReferralById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReferralById.fulfilled, (state, action: PayloadAction<iReferralForm>) => {
                state.referral = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getReferralById.rejected, (state) => {
                state.error = "Erro ao buscar encaminhamento";
                state.loading = false;
            })
            .addCase(addReferral.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReferral.fulfilled, (state, action: PayloadAction<iReferralForm>) => {
                state.referrals.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addReferral.rejected, (state) => {
                state.error = "Erro ao adicionar encaminhamento";
                state.loading = false;
            })
            .addCase(editReferral.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editReferral.fulfilled, (state, action: PayloadAction<iReferralForm>) => {
                state.referrals = state.referrals.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editReferral.rejected, (state) => {
                state.error = "Erro ao editar encaminhamento";
                state.loading = false;
            })
            .addCase(removeReferral.pending, (state) => {
                state.loading = true;
                state.error = null;
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
            });
    },
});


export const selectReferrals = (state: { referral: iReferralState }) => state.referral.referrals;
export const selectReferral = (state: { referral: iReferralState }) => state.referral.referral;
export const selectReferralError = (state: { referral: iReferralState }) => state.referral.error;
export const selectReferralLoading = (state: { referral: iReferralState }) => state.referral.loading;
export const selectReferralTotal = (state: { referral: iReferralState }) => state.referral.count;
export const selectReferralHasNextPage = (state: { referral: iReferralState }) => state.referral.hasNextPage;
export const selectReferralHasPreviousPage = (state: { referral: iReferralState }) => state.referral.hasPreviousPage;

export const referralReducer = referralSlice.reducer;