import { configureStore } from "@reduxjs/toolkit";
import { enterpriseReducer } from "./features/enterpriseSlice";
import { userReducer } from "./features/userSlice";
import { studentReducer } from "./features/studentSlice";
import { monitoringReducer } from "./features/monitoringSlice";
import { evaluationReducer } from "./features/evaluationSlice";
import { referralReducer } from "./features/referralSlice";
import { jobReducer } from "./features/jobSlice";
import { appReducer } from "./features/appSlice";
import { permissionReducer } from "./features/permissionSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        enterprise: enterpriseReducer,
        user: userReducer,
        permission: permissionReducer,
        job: jobReducer,
        student: studentReducer,
        referral: referralReducer,
        monitoring: monitoringReducer,
        evaluation: evaluationReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;