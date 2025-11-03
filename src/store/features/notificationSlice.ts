
import notificationService from "@/services/notificationService";
import { iNotification, iNotificationForm, iPaginationNotification, iParamsNotification } from "@/types/notification";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
    notifications: iNotification[];
    error: string | null;
    loading: boolean;
    total: number;
    hasUnreadNotifications: boolean;
}

export const initNotifications = createAsyncThunk('notification/fetch', async ({ page = 1, limit = 8, read }: iParamsNotification = {})  => {
    return await notificationService.getNotifications({page, limit, read});
});

export const getNotificationById = createAsyncThunk("notification/getById", async (id: number) => {
    return await notificationService.getNotificationById(id);
});

export const addNotification = createAsyncThunk('notification/add', async (payload: iNotificationForm) => {
    return await notificationService.addNotification(payload);
});

export const editNotification = createAsyncThunk('notification/edit', async (payload: iNotificationForm) => {
    return await notificationService.editNotification({ ...payload });
});

export const removeNotification = createAsyncThunk('notification/remove', async (payload: number) => {
    await notificationService.removeNotification(payload);
    return payload;
});

export const verifyHasUnreadNotifications = createAsyncThunk('notification/verifyHasUnreadNotifications', async ()  => {
    return await notificationService.getNotifications({page: 1, limit: 1, read: "false"});
});

const initialState: NotificationState = {
    notifications: [],
    error: null,
    loading: false,
    total: 0,
    hasUnreadNotifications: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initNotifications.fulfilled, (state, action: PayloadAction<iPaginationNotification>) => {
                state.notifications = action.payload.data;
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initNotifications.rejected, (state) => {
                state.error = "Erro ao carregar lista de notificações";
                state.loading = false;
                state.notifications = [];
                state.total = 0;
            })
            .addCase(addNotification.fulfilled, (state, action: PayloadAction<iNotification>) => {
                state.notifications.push(action.payload);
                state.error = null;
            })
            .addCase(addNotification.rejected, (state) => {
                state.error = "Erro ao adicionar notificação";
            })
            .addCase(removeNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeNotification.fulfilled, (state, action: PayloadAction<number>) => {
                state.notifications = state.notifications.filter((t) => t.id !== action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeNotification.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editNotification.fulfilled, (state, action: PayloadAction<iNotification>) => {
                state.notifications = state.notifications.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editNotification.rejected, (state) => {
                state.error = "Erro ao editar notificação";
            })
            .addCase(verifyHasUnreadNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyHasUnreadNotifications.fulfilled, (state, action: PayloadAction<iPaginationNotification>) => {
                state.hasUnreadNotifications = action.payload.data[0] ? true : false;
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyHasUnreadNotifications.rejected, (state) => {
                state.error = "Erro ao verificar se tem alguma notificação não lida";
                state.loading = false;
            });
    },
});


export const selectNotifications = (state: { notification: NotificationState }) => state.notification.notifications;
export const selectNotificationError = (state: { notification: NotificationState }) => state.notification.error;
export const selectNotificationLoading = (state: { notification: NotificationState }) => state.notification.loading;
export const selectNotificationTotal = (state: { notification: NotificationState }) => state.notification.total;
export const selectHasUnreadNotifications = (state: { notification: NotificationState }) => state.notification.hasUnreadNotifications;

export const notificationReducer = notificationSlice.reducer;