
import userService from "@/services/userService";
import { iUser, iUserForm, iPaginationUser, iParamsUser } from "@/types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    users: iUser[];
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


const initialState: UserState = {
    users: [],
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
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.users = [];
                state.total = 0;
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state) => {
                state.error = "Erro ao adicionar usuário";
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users = state.users.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<iUser>) => {
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editUser.rejected, (state) => {
                state.error = "Erro ao editar usuário";
            });
    },
});


export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserTotal = (state: { user: UserState }) => state.user.total;

export const { removeAllUsers } = userSlice.actions;
export const userReducer = userSlice.reducer;