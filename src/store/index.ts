import { configureStore } from "@reduxjs/toolkit";
import { enterpriseReducer } from "./features/enterpriseSlice";
import { userReducer } from "./features/userSlice";
import { studentReducer } from "./features/studentSlice";
import { monitoringReducer } from "./features/monitoringSlice";
import { evaluationReducer } from "./features/evaluationSlice";
import { referralReducer } from "./features/referralSlice";
import { jobReducer } from "./features/jobSlice";

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        user: userReducer,
        job: jobReducer,
        student: studentReducer,
        referral: referralReducer,
        monitoring: monitoringReducer,
        evaluation: evaluationReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;