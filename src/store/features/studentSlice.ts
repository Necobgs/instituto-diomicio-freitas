
import studentService from "@/services/studentService";
import { iStudentForm, iPaginationStudent, iParamsStudent, iStudentState } from "@/types/student";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initStudents = createAsyncThunk('student/fetch', async ({ page = 1, limit = 8, name, cpf, phone, responsibleName, responsiblePhone, useMedicine, dateBirthdayIni, dateBirthdayEnd, dateEntryIni, dateEntryEnd, enabled }: iParamsStudent = {})  => {
    return await studentService.getStudents({page, limit, name, cpf, phone, responsibleName, responsiblePhone, useMedicine, dateBirthdayIni, dateBirthdayEnd, dateEntryIni, dateEntryEnd, enabled});
});

export const getStudentById = createAsyncThunk("student/getById", async (id: number) => {
    return await studentService.getStudentById(id);
});

export const addStudent = createAsyncThunk('student/add', async (payload: iStudentForm) => {
    return await studentService.addStudent(payload);
});

export const editStudent = createAsyncThunk('student/edit', async (payload: iStudentForm) => {
    return await studentService.editStudent({ ...payload });
});

export const removeStudent = createAsyncThunk('student/remove', async (payload: iStudentForm) => {
    const response = await studentService.removeStudent(payload);
    return response;
});

const initialState: iStudentState = {
    students: [],
    student: null,
    error: null,
    loading: false,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initStudents.fulfilled, (state, action: PayloadAction<iPaginationStudent>) => {
                state.loading = false;
                state.error = null;
                state.students = action.payload.data;
                state.count = action.payload.count;
                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(initStudents.rejected, (state) => {
                state.error = "Erro ao carregar lista de estudantes";
                state.loading = false;
                state.students = [];
                state.count = 0;
                state.hasNextPage = false;
                state.hasPreviousPage = false;
            })
            .addCase(getStudentById.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getStudentById.fulfilled, (state, action: PayloadAction<iStudentForm>) => {
                state.student = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(getStudentById.rejected, (state) => {
                state.error = "Erro ao buscar estudante";
                state.loading = false;
            })
            .addCase(addStudent.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(addStudent.fulfilled, (state, action: PayloadAction<iStudentForm>) => {
                state.students.push(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(addStudent.rejected, (state) => {
                state.error = "Erro ao adicionar estudante";
                state.loading = false;
            })
            .addCase(editStudent.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(editStudent.fulfilled, (state, action: PayloadAction<iStudentForm>) => {
                state.students = state.students.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
                state.loading = false;
            })
            .addCase(editStudent.rejected, (state) => {
                state.error = "Erro ao editar estudante";
                state.loading = false;
            })
            .addCase(removeStudent.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(removeStudent.fulfilled, (state, action: PayloadAction<iStudentForm>) => {
                state.students = state.students.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeStudent.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            });
    },
});

export const selectStudents = (state: { student: iStudentState }) => state.student.students;
export const selectStudent = (state: { student: iStudentState }) => state.student.student;
export const selectStudentError = (state: { student: iStudentState }) => state.student.error;
export const selectStudentLoading = (state: { student: iStudentState }) => state.student.loading;
export const selectStudentCount = (state: { student: iStudentState }) => state.student.count;
export const selectStudentHasNextPage = (state: { student: iStudentState }) => state.student.hasNextPage;
export const selectStudentHasPreviousPage = (state: { student: iStudentState }) => state.student.hasPreviousPage;

export const studentReducer = studentSlice.reducer;