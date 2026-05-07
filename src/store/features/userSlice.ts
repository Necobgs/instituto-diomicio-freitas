
import userService from "@/services/userService";
import { iDefaultResponse } from "@/types/app";
import { iPermissionForm } from "@/types/permission";
import { iUserForm, iPaginationUser, iParamsUser, iLoginCredentials, iUserState, iPasswordChangeForm } from "@/types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initUsers = createAsyncThunk('user/fetch', async ({ page = 1, limit = 8, username, cpf, email, enabled }: iParamsUser = {})  => {
    return await userService.getUsers({page, limit, username, cpf, email, enabled});
});

export const getUserById = createAsyncThunk("user/getById", async (id: number) => {
    return await userService.getUserById(id);
});

export const getUserPermissionsById = createAsyncThunk("user/getPermissionsById", async (id: number) => {
    return await userService.getUserPermissionsById(id);
});

export const addUser = createAsyncThunk('user/add', async (payload: iUserForm) => {
    return await userService.addUser(payload);
});

export const editUser = createAsyncThunk('user/edit', async (payload: iUserForm) => {
    return await userService.editUser({ ...payload });
});

export const removeUser = createAsyncThunk('user/remove', async (id: number) => {
    const response = await userService.removeUser(id);
    return response;
});

export const passwordChange = createAsyncThunk('user/password-change', async (payload: iPasswordChangeForm) => {
    const response = await userService.passwordChange(payload);
    return response;
});

export const resetToDefaultPasswordByID = createAsyncThunk('user/reset-to-default-password', async (id: number) => {
    const response = await userService.resetToDefaultPasswordByID(id);
    return response;
});

export const passwordChangeRequest = createAsyncThunk('user/password-change-request', async (email: string) => {
    const response = await userService.passwordChangeRequest(email);
    return response;
});

export const loginUser = createAsyncThunk('user/login', async (credentials: iLoginCredentials, { rejectWithValue }) => {
    try {
        const response = await userService.login(credentials);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro no login');
    }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
    userService.logout();
    return null;
});

const initialState: iUserState = {
    users: [],
    user: null,
    userPermissions: [],
    currentUser: null,
    idUser: 0,
    token: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setTokenFromStorage(state) {

            state.error = null;
            state.loading = false;

            try {
                state.token = localStorage.getItem('token');
                state.idUser = !state.token ? 0 : (JSON.parse(atob(state.token.split('.')[1]))?.id || 0);
            }
            catch {
                state.error = "Erro ao decodificar token";
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initUsers.fulfilled, (state, action: PayloadAction<iPaginationUser>) => {
                state.users = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initUsers.rejected, (state) => {
                state.error = "Erro ao carregar lista de usuários";
                state.loading = false;
                state.users = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action: PayloadAction<iUserForm>) => {
                state.user = action.payload;
                if (state.user.id === state.idUser) {
                    state.currentUser = action.payload;
                }
                state.error = null;
                state.loading = false;
            })
            .addCase(getUserById.rejected, (state) => {
                state.error = "Erro ao buscar usuário";
                state.loading = false;
            })
            .addCase(getUserPermissionsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserPermissionsById.fulfilled, (state, action: PayloadAction<iPermissionForm[]>) => {
                state.userPermissions = action.payload;
                if (state.user) {
                    state.user.permissions = action.payload;
                }
                if (state.user?.id === state.currentUser?.id && state.currentUser) {
                    state.currentUser.permissions = action.payload;
                }
                state.error = null;
                state.loading = false;
            })
            .addCase(getUserPermissionsById.rejected, (state) => {
                state.error = "Erro ao buscar permissões do usuário";
                state.loading = false;
            })
            .addCase(addUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<iUserForm>) => {
                state.users.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<iUserForm>) => {
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(removeUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<iUserForm>) => {
                state.users = state.users.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(passwordChange.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(passwordChange.fulfilled, (state, action: PayloadAction<iDefaultResponse>) => {
                state.error = null;
                state.loading = false;
            })
            .addCase(passwordChange.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(resetToDefaultPasswordByID.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(resetToDefaultPasswordByID.fulfilled, (state, action: PayloadAction<iDefaultResponse>) => {
                state.error = null;
                state.loading = false;
            })
            .addCase(resetToDefaultPasswordByID.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(passwordChangeRequest.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(passwordChangeRequest.fulfilled, (state, action: PayloadAction<iDefaultResponse>) => {
                state.error = null;
                state.loading = false;
            })
            .addCase(passwordChangeRequest.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string, id: number }>) => {                
                state.token = action.payload.token;
                state.idUser = action.payload.id;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.idUser = 0;
                state.token = null;
            });
    },
});


export const selectUsers = (state: { user: iUserState }) => state.user.users;
export const selectUser = (state: { user: iUserState }) => state.user.user;
export const selectUserPermissions = (state: { user: iUserState }) => state.user.userPermissions;
export const selectUserError = (state: { user: iUserState }) => state.user.error;
export const selectUserLoading = (state: { user: iUserState }) => state.user.loading;
export const selectUserCount = (state: { user: iUserState }) => state.user.count;
export const selectCurrentUser = (state: { user: iUserState }) => state.user.currentUser;
export const selectIdUser = (state: { user: iUserState }) => state.user.idUser;
export const selectToken = (state: { user: iUserState }) => state.user.token;
export const selectUserHasNextPage = (state: { user: iUserState }) => state.user.hasNextPage;
export const selectUserHasPreviousPage = (state: { user: iUserState }) => state.user.hasPreviousPage;

export const { setTokenFromStorage } = userSlice.actions;
export const userReducer = userSlice.reducer;