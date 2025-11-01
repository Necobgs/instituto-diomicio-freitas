
import questionService from "@/services/questionService";
import { iQuestion, iQuestionForm, iPaginationQuestion, iParamsQuestion } from "@/types/question";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionState {
    questions: iQuestion[];
    error: string | null;
    loading: boolean;
    total: number;
}

export const initQuestions = createAsyncThunk('question/fetch', async ({ page = 1, limit = 8, id_evaluation }: iParamsQuestion = {})  => {
    return await questionService.getQuestions({page, limit, id_evaluation});
});

export const getQuestionById = createAsyncThunk("question/getById", async (id: number) => {
    return await questionService.getQuestionById(id);
});

export const addQuestion = createAsyncThunk('question/add', async (payload: iQuestionForm) => {
    return await questionService.addQuestion(payload);
});

export const editQuestion = createAsyncThunk('question/edit', async (payload: iQuestionForm) => {
    return await questionService.editQuestion({ ...payload });
});

export const removeQuestion = createAsyncThunk('question/remove', async (payload: number) => {
    await questionService.removeQuestion(payload);
    return payload;
});


const initialState: QuestionState = {
    questions: [],
    error: null,
    loading: false,
    total: 0,
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initQuestions.fulfilled, (state, action: PayloadAction<iPaginationQuestion>) => {
                state.questions = action.payload.data;
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initQuestions.rejected, (state) => {
                state.error = "Erro ao carregar lista de questões";
                state.loading = false;
                state.questions = [];
                state.total = 0;
            })
            .addCase(addQuestion.fulfilled, (state, action: PayloadAction<iQuestion>) => {
                state.questions.push(action.payload);
                state.error = null;
            })
            .addCase(addQuestion.rejected, (state) => {
                state.error = "Erro ao adicionar questão";
            })
            .addCase(removeQuestion.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeQuestion.fulfilled, (state, action: PayloadAction<number>) => {
                state.questions = state.questions.filter((t) => t.id !== action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeQuestion.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editQuestion.fulfilled, (state, action: PayloadAction<iQuestion>) => {
                state.questions = state.questions.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editQuestion.rejected, (state) => {
                state.error = "Erro ao editar questão";
            });
    },
});


export const selectQuestions = (state: { question: QuestionState }) => state.question.questions;
export const selectQuestionError = (state: { question: QuestionState }) => state.question.error;
export const selectQuestionLoading = (state: { question: QuestionState }) => state.question.loading;
export const selectQuestionTotal = (state: { question: QuestionState }) => state.question.total;

export const questionReducer = questionSlice.reducer;