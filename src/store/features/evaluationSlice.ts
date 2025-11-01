
import evaluationService from "@/services/evaluationService";
import { iEvaluation, iEvaluationForm, iPaginationEvaluation, iParamsEvaluation } from "@/types/evaluation";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EvaluationState {
    evaluations: iEvaluation[];
    error: string | null;
    loading: boolean;
    total: number;
}

export const initEvaluations = createAsyncThunk('evaluation/fetch', async ({ page = 1, limit = 8, student, teacher_name, entry_date, date }: iParamsEvaluation = {})  => {
    return await evaluationService.getEvaluations({page, limit, student, teacher_name, entry_date, date});
});

export const getEvaluationById = createAsyncThunk("evaluation/getById", async (id: number) => {
    return await evaluationService.getEvaluationById(id);
});

export const addEvaluation = createAsyncThunk('evaluation/add', async (payload: iEvaluationForm) => {
    return await evaluationService.addEvaluation(payload);
});

export const editEvaluation = createAsyncThunk('evaluation/edit', async (payload: iEvaluationForm) => {
    return await evaluationService.editEvaluation({ ...payload });
});

export const removeEvaluation = createAsyncThunk('evaluation/remove', async (payload: number) => {
    await evaluationService.removeEvaluation(payload);
    return payload;
});


const initialState: EvaluationState = {
    evaluations: [],
    error: null,
    loading: false,
    total: 0,
};

const evaluationSlice = createSlice({
    name: "evaluation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initEvaluations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initEvaluations.fulfilled, (state, action: PayloadAction<iPaginationEvaluation>) => {
                state.evaluations = action.payload.data;
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initEvaluations.rejected, (state) => {
                state.error = "Erro ao carregar lista de avaliações";
                state.loading = false;
                state.evaluations = [];
                state.total = 0;
            })
            .addCase(addEvaluation.fulfilled, (state, action: PayloadAction<iEvaluation>) => {
                state.evaluations.push(action.payload);
                state.error = null;
            })
            .addCase(addEvaluation.rejected, (state) => {
                state.error = "Erro ao adicionar avaliação";
            })
            .addCase(removeEvaluation.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeEvaluation.fulfilled, (state, action: PayloadAction<number>) => {
                state.evaluations = state.evaluations.filter((t) => t.id !== action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeEvaluation.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editEvaluation.fulfilled, (state, action: PayloadAction<iEvaluation>) => {
                state.evaluations = state.evaluations.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editEvaluation.rejected, (state) => {
                state.error = "Erro ao editar avaliação";
            });
    },
});


export const selectEvaluations = (state: { evaluation: EvaluationState }) => state.evaluation.evaluations;
export const selectEvaluationError = (state: { evaluation: EvaluationState }) => state.evaluation.error;
export const selectEvaluationLoading = (state: { evaluation: EvaluationState }) => state.evaluation.loading;
export const selectEvaluationTotal = (state: { evaluation: EvaluationState }) => state.evaluation.total;

export const evaluationReducer = evaluationSlice.reducer;