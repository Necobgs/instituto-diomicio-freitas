
import userService from "@/services/userService";
import { iUser, iUserForm, iPaginationUser, iParamsUser, iLoginCredentials, iUserState } from "@/types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initUsers = createAsyncThunk('user/fetch', async ({ page = 1, limit = 8, username, cpf, email, enabled }: iParamsUser = {})  => {
    return await userService.getUsers({page, limit, username, cpf, email, enabled});
});

export const getUserById = createAsyncThunk("user/getById", async (id: number) => {
    return await userService.getUserById(id);
});

export const addUser = createAsyncThunk('user/add', async (payload: iUserForm) => {
    return await userService.addUser(payload);
});

export const editUser = createAsyncThunk('user/edit', async (payload: iUserForm) => {
    return await userService.editUser({ ...payload });
});

export const removeUser = createAsyncThunk('user/remove', async (payload: iUserForm) => {
    const response = await userService.removeUser(payload);
    return response;
});

export const validateTokenUser = createAsyncThunk('user/validateToken', async (_, { rejectWithValue }) => {
    try {
        const response = await userService.validateToken();
        return response;
    } catch (error: any) {
        localStorage.removeItem('token');
        return rejectWithValue(error.response?.data?.message || 'Erro ao validar token');
    }
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
    currentUser: null,
    token: null,
    isAuthenticated: false,
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
        removeAllUsers(state) {
            state.users = [];
            state.error = null;
            state.loading = false;
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
            .addCase(addUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users = state.users.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(validateTokenUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateTokenUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.token = localStorage.getItem('token');
                state.currentUser = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(validateTokenUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string, user: iUserForm | null }>) => {                
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.token = null;
                state.isAuthenticated = false;
                state.users = [];
            });
    },
});


export const selectUsers = (state: { user: iUserState }) => state.user.users;
export const selectUserError = (state: { user: iUserState }) => state.user.error;
export const selectUserLoading = (state: { user: iUserState }) => state.user.loading;
export const selectUserCount = (state: { user: iUserState }) => state.user.count;
export const selectCurrentUser = (state: { user: iUserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: iUserState }) => state.user.isAuthenticated;
export const selectToken = (state: { user: iUserState }) => state.user.token;
export const selectUserHasNextPage = (state: { user: iUserState }) => state.user.hasNextPage;
export const selectUserHasPreviousPage = (state: { user: iUserState }) => state.user.hasPreviousPage;

export const { removeAllUsers } = userSlice.actions;
export const userReducer = userSlice.reducer;