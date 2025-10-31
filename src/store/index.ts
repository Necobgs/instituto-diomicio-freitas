import { configureStore } from "@reduxjs/toolkit";
import { enterpriseReducer } from "./features/enterpriseSlice";
import { userReducer } from "./features/userSlice";
import { studentReducer } from "./features/studentSlice";
import { monitoringReducer } from "./features/monitoringSlice";

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        user: userReducer,
        student: studentReducer,
        monitoring: monitoringReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;