
import permissionService from "@/services/permissionService";
import { iPermissionForm, iPermissionState, iPaginationPermission, iParamsPermission } from "@/types/permission";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initPermissions = createAsyncThunk('permission/fetch', async ({ page = 1, limit = 8 }: iParamsPermission = {})  => {
    return await permissionService.getPermissions({page, limit });
});

export const getPermissionById = createAsyncThunk("permission/getById", async (id: number) => {
    return await permissionService.getPermissionById(id);
});

const initialState: iPermissionState = {
    permissions: [],
    permission: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const permissionSlice = createSlice({
    name: "permission",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initPermissions.fulfilled, (state, action: PayloadAction<iPaginationPermission>) => {
                state.permissions = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initPermissions.rejected, (state) => {
                state.error = "Erro ao carregar lista de empresas";
                state.loading = false;
                state.permissions = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getPermissionById.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getPermissionById.fulfilled, (state, action: PayloadAction<iPermissionForm>) => {
                state.permission = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getPermissionById.rejected, (state) => {
                state.error = "Erro ao buscar empresa";
                state.loading = false;
            })
    },
});


export const selectPermissions = (state: { permission: iPermissionState }) => state.permission.permissions;
export const selectPermission = (state: { permission: iPermissionState }) => state.permission.permission;
export const selectPermissionError = (state: { permission: iPermissionState }) => state.permission.error;
export const selectPermissionLoading = (state: { permission: iPermissionState }) => state.permission.loading;
export const selectPermissionCount = (state: { permission: iPermissionState }) => state.permission.count;
export const selectPermissionHasNextPage = (state: { permission: iPermissionState }) => state.permission.hasNextPage;
export const selectPermissionHasPreviousPage = (state: { permission: iPermissionState }) => state.permission.hasPreviousPage;

export const permissionReducer = permissionSlice.reducer;