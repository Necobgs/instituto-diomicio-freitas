import { iStudent, iStudentForm, iPaginationStudent, iParamsStudent } from "@/types/student";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'student';

const getStudents = async ({ page = 1, limit = 8, name, cpf, phone , enabled }: iParamsStudent = {}): Promise<iPaginationStudent> => {
  let query = `_page=${page}&_limit=${limit}`;

  if (name) query += `&name_like=${encodeURIComponent(name)}`;

  if (cpf) query += `&cpf_like=${encodeURIComponent(`^${cpf}`)}`;

  if (phone) query += `&phone_like=${encodeURIComponent(`^${phone}`)}`;

  if (enabled) query += `&enabled=${encodeURIComponent(enabled)}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iStudent[],
    total
  };
};

const getStudentById = async (id: number): Promise<iStudent> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iStudent;
};

const addStudent = async (newStudent: iStudentForm): Promise<iStudent> => {
    const response = await api.post(endpoint, newStudent);
    return response.data as iStudent;
}

const editStudent = async (dataStudent: iStudent): Promise<iStudent> => {
    const response = await api.put(`${endpoint}/${dataStudent.id}`, dataStudent);
    return response.data as iStudent;
}

const removeStudent = async (student: iStudent): Promise<iStudent> => {
    const response = await api.delete(`${endpoint}/${student.id}`);
    return response.data as iStudent;
}

export default {
  getStudents,
  addStudent,
  editStudent,
  removeStudent,
  getStudentById
};