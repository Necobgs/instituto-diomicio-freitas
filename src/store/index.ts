import { configureStore } from "@reduxjs/toolkit";
import { enterpriseReducer } from "./features/enterpriseSlice";
import { userReducer } from "./features/userSlice";

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        user: userReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;