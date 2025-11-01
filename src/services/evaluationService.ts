import { iEvaluation, iEvaluationForm, iPaginationEvaluation, iParamsEvaluation } from "@/types/evaluation";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'evaluation';

const getEvaluations = async ({ page = 1, limit = 8, student, teacher_name, entry_date, date }: iParamsEvaluation = {}): Promise<iPaginationEvaluation> => {
  let query = `_page=${page}&_limit=${limit}`;

  if (student) query += `&student.id=${student.id}`;

  if (teacher_name) query += `&teacher_name_like=${encodeURIComponent(`^${teacher_name}`)}`;

  if (entry_date) query += `&entry_date=${encodeURIComponent(`${entry_date}T00:00:00.000Z`)}`;

  if (date) query += `&date=${encodeURIComponent(`${date}T00:00:00.000Z`)}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iEvaluation[],
    total
  };
};

const getEvaluationById = async (id: number): Promise<iEvaluation> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iEvaluation;
};

const addEvaluation = async (newEvaluation: iEvaluationForm): Promise<iEvaluation> => {
    const response = await api.post(endpoint, newEvaluation);
    return response.data as iEvaluation;
}

const editEvaluation = async (dataEvaluation: iEvaluationForm): Promise<iEvaluation> => {
    const response = await api.put(`${endpoint}/${dataEvaluation.id}`, dataEvaluation);
    return response.data as iEvaluation;
}

const removeEvaluation = async (id: number): Promise<void> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
};

export default {
    getEvaluations,
    addEvaluation,
    editEvaluation,
    removeEvaluation,
    getEvaluationById
};