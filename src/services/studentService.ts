import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iStudent, iStudentForm, iPaginationStudent, iParamsStudent } from "@/types/student";

const endpoint = 'student';

const getStudents = async ({ page = 1, limit = 8, name, cpf, phone , enabled }: iParamsStudent = {}): Promise<iPaginationStudent> => {
  
  const filter: string = buildFilterQuery([
    { key: 'name', value: name, operator: '$ilike' }, 
    { key: 'cpf', value: cpf, operator: '$startsWith' },
    { key: 'phone', value: phone, operator: '$startsWith' },
  ]);

  const response = await api.get(endpoint,{
    params: {
      filter: filter,
      page,
      limit,
      withDeleted: enabled === "all" ? true : false,
      onlyDeleted: enabled === "false" ? true : false,
    }
  });

  return {
    data: response.data.items as iStudent[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
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
    const response = await api.patch(`${endpoint}/${dataStudent.id}`, dataStudent);
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