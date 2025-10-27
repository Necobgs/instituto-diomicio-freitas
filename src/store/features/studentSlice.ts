
import studentService from "@/services/studentService";
import { iStudent, iStudentForm, iPaginationStudent, iParamsStudent } from "@/types/student";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StudentState {
    students: iStudent[];
    error: string | null;
    loading: boolean;
    total: number;
}

export const initStudents = createAsyncThunk('student/fetch', async ({ page = 1, limit = 8, name, cpf, enabled }: iParamsStudent = {})  => {
    return await studentService.getStudents({page, limit, name, cpf, enabled});
});

export const getStudentById = createAsyncThunk("student/getById", async (id: number) => {
    return await studentService.getStudentById(id);
});

export const addStudent = createAsyncThunk('student/add', async (payload: iStudentForm) => {
    return await studentService.addStudent(payload);
});

export const editStudent = createAsyncThunk('student/edit', async (payload: iStudent) => {
    return await studentService.editStudent({ ...payload });
});

export const removeStudent = createAsyncThunk('student/remove', async (payload: iStudent) => {
    const response = await studentService.removeStudent(payload);
    return response;
});


const initialState: StudentState = {
    students: [],
    error: null,
    loading: false,
    total: 0,
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
                state.students = action.payload.data;
                state.total = action.payload.total;
                state.loading = false;
                state.error = null;
            })
            .addCase(initStudents.rejected, (state) => {
                state.error = "Erro ao carregar lista de estudantes";
                state.loading = false;
                state.students = [];
                state.total = 0;
            })
            .addCase(addStudent.fulfilled, (state, action: PayloadAction<iStudent>) => {
                state.students.push(action.payload);
                state.error = null;
            })
            .addCase(addStudent.rejected, (state) => {
                state.error = "Erro ao adicionar estudante";
            })
            .addCase(removeStudent.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeStudent.fulfilled, (state, action: PayloadAction<iStudent>) => {
                state.students = state.students.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeStudent.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editStudent.fulfilled, (state, action: PayloadAction<iStudent>) => {
                state.students = state.students.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editStudent.rejected, (state) => {
                state.error = "Erro ao editar estudante";
            });
    },
});


export const selectStudents = (state: { student: StudentState }) => state.student.students;
export const selectStudentError = (state: { student: StudentState }) => state.student.error;
export const selectStudentLoading = (state: { student: StudentState }) => state.student.loading;
export const selectStudentTotal = (state: { student: StudentState }) => state.student.total;

export const studentReducer = studentSlice.reducer;