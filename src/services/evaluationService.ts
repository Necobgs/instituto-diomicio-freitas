import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iEvaluationForm, iPaginationEvaluation, iParamsEvaluation } from "@/types/evaluation";
import { iMonitoringForm } from "@/types/monitoring";

const endpoint = 'evaluation';

const getEvaluations = async ({ page = 1, limit = 8, user, student, dateIni, dateEnd, enabled }: iParamsEvaluation = {}): Promise<iPaginationEvaluation> => {
  const filter: string = buildFilterQuery([
    { key: 'user_id', value: user?.id, operator: '$eq' }, 
    { key: 'student_id', value: student?.id, operator: '$eq' },
    { key: 'date', value: [dateIni, dateEnd], operator: ['$gte', '$lte'] },
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
    data: response.data.items as iMonitoringForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getEvaluationById = async (id: number): Promise<iEvaluationForm> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iEvaluationForm;
};

const addEvaluation = async (newEvaluation: iEvaluationForm): Promise<iEvaluationForm> => {
    const response = await api.post(endpoint, newEvaluation);
    return response.data as iEvaluationForm;
}

const editEvaluation = async (dataEvaluation: iEvaluationForm): Promise<iEvaluationForm> => {
    const response = await api.patch(`${endpoint}/${dataEvaluation.id}`, dataEvaluation);
    return response.data as iEvaluationForm;
}

const removeEvaluation = async (id: number): Promise<iEvaluationForm> => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data as iEvaluationForm;
};

export default {
    getEvaluations,
    addEvaluation,
    editEvaluation,
    removeEvaluation,
    getEvaluationById
};