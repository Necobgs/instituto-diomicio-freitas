import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iStudentForm, iPaginationStudent, iParamsStudent } from "@/types/student";

const endpoint = 'student';

const getStudents = async ({ page = 1, limit = 8, name, cpf, phone, responsibleName, responsiblePhone, useMedicine, dateBirthdayIni, dateBirthdayEnd, dateEntryIni, dateEntryEnd, enabled }: iParamsStudent = {}): Promise<iPaginationStudent> => {
  
  const filter: string = buildFilterQuery([
    { key: 'name', value: name, operator: '$ilike' }, 
    { key: 'cpf', value: cpf, operator: '$startsWith' },
    { key: 'phone', value: phone, operator: '$startsWith' },
    { key: 'responsibleName', value: responsibleName, operator: '$ilike' },
    { key: 'responsiblePhone', value: responsiblePhone, operator: '$startsWith' },
    { key: 'useMedicine', value: useMedicine, operator: '$eq' },
    { key: 'dateBirthday', value: [dateBirthdayIni, dateBirthdayEnd], operator: ['$gte', '$lte'] },
    { key: 'dateEntry', value: [dateEntryIni, dateEntryEnd], operator: ['$gte', '$lte'] },
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
    data: response.data.items as iStudentForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getStudentById = async (id: number): Promise<iStudentForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iStudentForm;
  } catch (error: any) {
    console.log("Error fetching student:", error);
    throw error?.response?.data?.message || 'Erro ao buscar estudante';
  }
};

const addStudent = async (newStudent: iStudentForm): Promise<iStudentForm> => {
  try {
    const response = await api.post(endpoint, newStudent);
    return response.data as iStudentForm;
  } catch (error: any) {
    console.log("Error adding student:", error);
    throw error?.response?.data?.message || 'Erro ao adicionar estudante';
  }
}

const editStudent = async (dataStudent: iStudentForm): Promise<iStudentForm> => {
  try {
    const response = await api.patch(`${endpoint}/${dataStudent.id}`, dataStudent);
    return response.data as iStudentForm;
  } catch (error: any) {
    console.log("Error editing student:", error);
    throw error?.response?.data?.message || 'Erro ao editar estudante';
  }
}

const removeStudent = async (student: iStudentForm): Promise<iStudentForm> => {
  try {
    const response = await api.delete(`${endpoint}/${student.id}`);
    return response.data as iStudentForm;
  } catch (error: any) {
    console.log("Error removing student:", error);
    throw error?.response?.data?.message || 'Erro ao remover estudante';
  }
}

export default {
  getStudents,
  addStudent,
  editStudent,
  removeStudent,
  getStudentById
};