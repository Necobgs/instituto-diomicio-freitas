import { iQuestion, iQuestionForm, iPaginationQuestion, iParamsQuestion } from "@/types/question";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'question';

const getQuestions = async ({ page = 1, limit = 300, id_evaluation }: iParamsQuestion = {}): Promise<iPaginationQuestion> => {
  let query = id_evaluation ? "" : `_page=${page}&_limit=${limit}`;

  if (id_evaluation) query += `&id_evaluation=${id_evaluation}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iQuestion[],
    total
  };
};

const getQuestionById = async (id: number): Promise<iQuestion> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iQuestion;
};

const addQuestion = async (newQuestion: iQuestionForm): Promise<iQuestion> => {
    const response = await api.post(endpoint, newQuestion);
    return response.data as iQuestion;
}

const editQuestion = async (dataQuestion: iQuestionForm): Promise<iQuestion> => {
    const response = await api.put(`${endpoint}/${dataQuestion.id}`, dataQuestion);
    return response.data as iQuestion;
}

const removeQuestion = async (id: number): Promise<void> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
};

export default {
    getQuestions,
    addQuestion,
    editQuestion,
    removeQuestion,
    getQuestionById
};