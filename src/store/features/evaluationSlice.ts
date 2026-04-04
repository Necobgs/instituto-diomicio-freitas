
import evaluationService from "@/services/evaluationService";
import { iEvaluationForm, iEvaluationState, iPaginationEvaluation, iParamsEvaluation } from "@/types/evaluation";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initEvaluations = createAsyncThunk('evaluation/fetch', async ({ page = 1, limit = 8, user, student, dateIni, dateEnd, enabled }: iParamsEvaluation = {})  => {
    return await evaluationService.getEvaluations({page, limit, user, dateIni, dateEnd, student, enabled});
});

export const getEvaluationById = createAsyncThunk("evaluation/getById", async (id: number) => {
    return await evaluationService.getEvaluationById(id);
});

export const addEvaluation = createAsyncThunk('evaluation/add', async (payload: iEvaluationForm) => {
    return await evaluationService.addEvaluation({ ...payload });
});

export const editEvaluation = createAsyncThunk('evaluation/edit', async (payload: iEvaluationForm) => {
    return await evaluationService.editEvaluation({ ...payload });
});

export const removeEvaluation = createAsyncThunk('evaluation/remove', async (payload: number) => {
    await evaluationService.removeEvaluation(payload);
    return payload;
});


const initialState: iEvaluationState = {
    evaluations: [],
    evaluation: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false
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
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initEvaluations.rejected, (state) => {
                state.error = "Erro ao carregar lista de avaliações";
                state.loading = false;
                state.evaluations = [];
                state.count = 0;
            })
            .addCase(getEvaluationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEvaluationById.fulfilled, (state, action: PayloadAction<iEvaluationForm>) => {
                state.evaluation = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getEvaluationById.rejected, (state) => {
                state.error = "Erro ao carregar avaliação";
                state.loading = false;
                state.evaluation = null;
                state.count = 0;
            })
            .addCase(addEvaluation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEvaluation.fulfilled, (state, action: PayloadAction<iEvaluationForm>) => {
                state.evaluations.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addEvaluation.rejected, (state) => {
                state.error = "Erro ao adicionar avaliação";
                state.loading = false;
            })
            .addCase(editEvaluation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editEvaluation.fulfilled, (state, action: PayloadAction<iEvaluationForm>) => {
                state.evaluations = state.evaluations.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editEvaluation.rejected, (state) => {
                state.error = "Erro ao editar avaliação";
                state.loading = false;
            })
            .addCase(removeEvaluation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEvaluation.fulfilled, (state, action: PayloadAction<number>) => {
                state.evaluations = state.evaluations.filter((t) => t.id !== action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeEvaluation.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            });
    },
});

export const selectEvaluations = (state: { evaluation: iEvaluationState }) => state.evaluation.evaluations;
export const selectEvaluation = (state: { evaluation: iEvaluationState }) => state.evaluation.evaluation;
export const selectEvaluationError = (state: { evaluation: iEvaluationState }) => state.evaluation.error;
export const selectEvaluationLoading = (state: { evaluation: iEvaluationState }) => state.evaluation.loading;
export const selectEvaluationCount = (state: { evaluation: iEvaluationState }) => state.evaluation.count;
export const selectEvaluationHasNextPage = (state: { evaluation: iEvaluationState }) => state.evaluation.hasNextPage;
export const selectEvaluationHasPreviousPage = (state: { evaluation: iEvaluationState }) => state.evaluation.hasPreviousPage;

export const evaluationReducer = evaluationSlice.reducer;