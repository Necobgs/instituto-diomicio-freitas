
import enterpriseService from "@/services/enterpriseService";
import { iEnterprise, iEnterpriseForm } from "@/types/enterprise";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnterpriseState {
    enterprises: iEnterprise[];
    error: string | null;
    loading: boolean;
}

export const initEnterprises = createAsyncThunk('enterprise/fetch', async () => {
    return await enterpriseService.getEnterprises();
});

export const addEnterprise = createAsyncThunk('enterprise/add', async (payload: iEnterpriseForm) => {
    return await enterpriseService.addEnterprise(payload);
});

export const editEnterprise = createAsyncThunk('enterprise/edit', async (payload: iEnterprise) => {
    return await enterpriseService.editEnterprise({ ...payload });
});

export const removeEnterprise = createAsyncThunk('enterprise/remove', async (payload: iEnterprise) => {
    const response = await enterpriseService.removeEnterprise(payload);
    return response;
});


const initialState: EnterpriseState = {
    enterprises: [],
    error: null,
    loading: false,
};

const enterpriseSlice = createSlice({
    name: "enterprise",
    initialState,
    reducers: {
        removeAllEnterprises(state) {
            state.enterprises = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initEnterprises.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initEnterprises.fulfilled, (state, action: PayloadAction<iEnterprise[]>) => {
                state.enterprises = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initEnterprises.rejected, (state) => {
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.enterprises = [];
            })
            .addCase(addEnterprise.fulfilled, (state, action: PayloadAction<iEnterprise>) => {
                state.enterprises.push(action.payload);
                state.error = null;
            })
            .addCase(addEnterprise.rejected, (state) => {
                state.error = "Erro ao adicionar fornecedor";
            })
            .addCase(removeEnterprise.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeEnterprise.fulfilled, (state, action: PayloadAction<iEnterprise>) => {
                state.enterprises = state.enterprises.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeEnterprise.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editEnterprise.fulfilled, (state, action: PayloadAction<iEnterprise>) => {
                state.enterprises = state.enterprises.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editEnterprise.rejected, (state) => {
                state.error = "Erro ao editar fornecedor";
            });
    },
});


export const selectEnterprises = (state: { enterprise: EnterpriseState }) => state.enterprise.enterprises;
export const selectEnterpriseError = (state: { enterprise: EnterpriseState }) => state.enterprise.error;
export const selectEnterpriseLoading = (state: { enterprise: EnterpriseState }) => state.enterprise.loading;

export const { removeAllEnterprises } = enterpriseSlice.actions;
export const enterpriseReducer = enterpriseSlice.reducer;