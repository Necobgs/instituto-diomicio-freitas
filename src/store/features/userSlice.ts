
import userService from "@/services/userService";
import { iUser, iUserForm, iPaginationUser, iParamsUser, iLoginCredentials } from "@/types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    users: iUser[];
    currentUser: iUser | null;  // Usuário logado
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
    loading: boolean;
    total: number;
}

export const initUsers = createAsyncThunk('user/fetch', async ({ page = 1, limit = 8, name, cpf, email, enabled }: iParamsUser = {})  => {
    return await userService.getUsers({page, limit, name, cpf, email, enabled});
});

export const getUserById = createAsyncThunk("user/getById", async (id: number) => {
    return await userService.getUserById(id);
});

export const addUser = createAsyncThunk('user/add', async (payload: iUserForm) => {
    return await userService.addUser(payload);
});

export const editUser = createAsyncThunk('user/edit', async (payload: iUser) => {
    return await userService.editUser({ ...payload });
});

export const removeUser = createAsyncThunk('user/remove', async (payload: iUser) => {
    const response = await userService.removeUser(payload);
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

export const registerUser = createAsyncThunk('user/register', async (payload: iUserForm, { rejectWithValue }) => {
    try {
        const response = await userService.register(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro no registro');
    }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
    userService.logout();
    return null;
});

export const fetchMe = createAsyncThunk('user/me', async (_, { rejectWithValue }) => {
    try {
        const user = await userService.getMe();
        return user;
    } catch (error: any) {
        userService.logout();
        return rejectWithValue('Sessão expirada');
    }
});

const initialState: UserState = {
    users: [],
    currentUser: null,
    token: localStorage?.getItem('token') || null,
    isAuthenticated: !!localStorage?.getItem('token'),
    error: null,
    loading: false,
    total: 0,
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
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initUsers.rejected, (state) => {
                state.error = "Erro ao carregar lista de usuários";
                state.loading = false;
                state.users = [];
                state.total = 0;
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
                console.log("editUser", action.payload)
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: iUser }>) => {
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
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.currentUser = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.token = null;
                state.isAuthenticated = false;
                state.users = [];
            })
            .addCase(fetchMe.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.currentUser = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.isAuthenticated = false;
                state.currentUser = null;
            });
    },
});


export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserTotal = (state: { user: UserState }) => state.user.total;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectToken = (state: { user: UserState }) => state.user.token;

export const { removeAllUsers } = userSlice.actions;
export const userReducer = userSlice.reducer;