
import enterpriseService from "@/services/enterpriseService";
import { iEnterpriseForm, iEnterpriseState, iPaginationEnterprise, iParamsEnterprise } from "@/types/enterprise";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initEnterprises = createAsyncThunk('enterprise/fetch', async ({ page = 1, limit = 8, name, cnpj, phone, enabled }: iParamsEnterprise = {})  => {
    return await enterpriseService.getEnterprises({page, limit, name, cnpj, phone, enabled});
});

export const getEnterpriseById = createAsyncThunk("enterprise/getById", async (id: number) => {
    return await enterpriseService.getEnterpriseById(id);
});

export const addEnterprise = createAsyncThunk('enterprise/add', async (payload: iEnterpriseForm) => {
    return await enterpriseService.addEnterprise(payload);
});

export const editEnterprise = createAsyncThunk('enterprise/edit', async (payload: iEnterpriseForm) => {
    return await enterpriseService.editEnterprise(payload);
});

export const removeEnterprise = createAsyncThunk('enterprise/remove', async (id: number) => {
    return await enterpriseService.removeEnterprise(id);
});

const initialState: iEnterpriseState = {
    enterprises: [],
    enterprise: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const enterpriseSlice = createSlice({
    name: "enterprise",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initEnterprises.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initEnterprises.fulfilled, (state, action: PayloadAction<iPaginationEnterprise>) => {
                state.enterprises = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initEnterprises.rejected, (state) => {
                state.error = "Erro ao carregar lista de empresas";
                state.loading = false;
                state.enterprises = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getEnterpriseById.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getEnterpriseById.fulfilled, (state, action: PayloadAction<iEnterpriseForm>) => {
                state.enterprise = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getEnterpriseById.rejected, (state) => {
                state.error = "Erro ao buscar empresa";
                state.loading = false;
            })
            .addCase(addEnterprise.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(addEnterprise.fulfilled, (state, action: PayloadAction<iEnterpriseForm>) => {
                state.enterprises.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addEnterprise.rejected, (state) => {
                state.error = "Erro ao adicionar empresa";
                state.loading = false;
            })
            .addCase(editEnterprise.fulfilled, (state, action: PayloadAction<iEnterpriseForm>) => {
                state.enterprises = state.enterprises.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editEnterprise.rejected, (state) => {
                state.error = "Erro ao editar empresa";
            })
            .addCase(removeEnterprise.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(removeEnterprise.fulfilled, (state, action: PayloadAction<iEnterpriseForm>) => {
                state.enterprises = state.enterprises.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeEnterprise.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
    },
});


export const selectEnterprises = (state: { enterprise: iEnterpriseState }) => state.enterprise.enterprises;
export const selectEnterprise = (state: { enterprise: iEnterpriseState }) => state.enterprise.enterprise;
export const selectEnterpriseError = (state: { enterprise: iEnterpriseState }) => state.enterprise.error;
export const selectEnterpriseLoading = (state: { enterprise: iEnterpriseState }) => state.enterprise.loading;
export const selectEnterpriseCount = (state: { enterprise: iEnterpriseState }) => state.enterprise.count;
export const selectEnterpriseHasNextPage = (state: { enterprise: iEnterpriseState }) => state.enterprise.hasNextPage;
export const selectEnterpriseHasPreviousPage = (state: { enterprise: iEnterpriseState }) => state.enterprise.hasPreviousPage;

export const enterpriseReducer = enterpriseSlice.reducer;