
import jobService from "@/services/jobService";
import { iJobForm, iJobState, iPaginationJob, iParamsJob } from "@/types/job";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initJobs = createAsyncThunk('job/fetch', async ({ page = 1, limit = 8, name, enabled }: iParamsJob = {})  => {
    return await jobService.getJobs({page, limit, name, enabled});
});

export const getJobById = createAsyncThunk("job/getById", async (id: number) => {
    return await jobService.getJobById(id);
});

export const addJob = createAsyncThunk('job/add', async (payload: iJobForm) => {
    return await jobService.addJob(payload);
});

export const editJob = createAsyncThunk('job/edit', async (payload: iJobForm) => {
    return await jobService.editJob(payload);
});

export const removeJob = createAsyncThunk('job/remove', async (payload: iJobForm) => {
    const response = await jobService.removeJob(payload);
    return response;
});

const initialState: iJobState = {
    jobs: [],
    job: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initJobs.fulfilled, (state, action: PayloadAction<iPaginationJob>) => {
                state.jobs = action.payload.data;
                state.count = action.payload.count;
                state.loading = false;
                state.error = null;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initJobs.rejected, (state) => {
                state.error = "Erro ao carregar lista de cargos";
                state.loading = false;
                state.jobs = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobById.fulfilled, (state, action: PayloadAction<iJobForm>) => {
                state.job = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getJobById.rejected, (state) => {
                state.error = "Erro ao buscar cargo";
                state.loading = false;
            })
            .addCase(addJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addJob.fulfilled, (state, action: PayloadAction<iJobForm>) => {
                state.jobs.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addJob.rejected, (state) => {
                state.error = "Erro ao adicionar cargo";
                state.loading = false;
            })
            .addCase(editJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editJob.fulfilled, (state, action: PayloadAction<iJobForm>) => {
                state.jobs = state.jobs.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editJob.rejected, (state) => {
                state.error = "Erro ao editar cargo";
                state.loading = false;
            })
            .addCase(removeJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeJob.fulfilled, (state, action: PayloadAction<iJobForm>) => {
                state.jobs = state.jobs.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeJob.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            });
    },
});


export const selectJobs = (state: { job: iJobState }) => state.job.jobs;
export const selectJob = (state: { job: iJobState }) => state.job.job;
export const selectJobError = (state: { job: iJobState }) => state.job.error;
export const selectJobLoading = (state: { job: iJobState }) => state.job.loading;
export const selectJobCount = (state: { job: iJobState }) => state.job.count;
export const selectJobHasNextPage = (state: { job: iJobState }) => state.job.hasNextPage;
export const selectJobHasPreviousPage = (state: { job: iJobState }) => state.job.hasPreviousPage;

export const jobReducer = jobSlice.reducer;