import { configureStore } from "@reduxjs/toolkit";
import { enterpriseReducer } from "./features/enterpriseSlice";
import { userReducer } from "./features/userSlice";
import { studentReducer } from "./features/studentSlice";
import { monitoringReducer } from "./features/monitoringSlice";
import { evaluationReducer } from "./features/evaluationSlice";
import { questionReducer } from "./features/questionSlice";

export const store = configureStore({
    reducer: {
        enterprise: enterpriseReducer,
        user: userReducer,
        student: studentReducer,
        monitoring: monitoringReducer,
        evaluation: evaluationReducer,
        question: questionReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;