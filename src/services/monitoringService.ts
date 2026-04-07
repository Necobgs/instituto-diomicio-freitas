import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iMonitoringForm, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";

const endpoint = 'monitoring';

const getMonitorings = async ({ page = 1, limit = 8, student, visitDateIni, visitDateEnd, enabled }: iParamsMonitoring = {}): Promise<iPaginationMonitoring> => {
  
  const filter: string = buildFilterQuery([
    { key: 'studentId', value: student?.id, operator: '$eq' }, 
    { key: 'visitDate', value: [visitDateIni, visitDateEnd], operator: ['$gte', '$lte'] },
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

const getMonitoringById = async (id: number): Promise<iMonitoringForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iMonitoringForm;
  } catch (error: any) {
    console.log("Error fetching monitoring:", error);
    throw error?.response?.data?.message || 'Erro ao buscar acompanhamento';
  }
};

const addMonitoring = async (newMonitoring: iMonitoringForm): Promise<iMonitoringForm> => {
  try {
    const response = await api.post(endpoint, newMonitoring);
    return response.data as iMonitoringForm;
  } catch (error: any) {
    console.log("Error adding monitoring:", error);
    throw error?.response?.data?.message || 'Erro ao adicionar acompanhamento';
  }
}

const editMonitoring = async (dataMonitoring: iMonitoringForm): Promise<iMonitoringForm> => {
  try {
    const response = await api.put(`${endpoint}/${dataMonitoring.id}`, dataMonitoring);
    return response.data as iMonitoringForm;
  } catch (error: any) {
    console.log("Error editing monitoring:", error);
    throw error?.response?.data?.message || 'Erro ao editar acompanhamento';
  }
}

const removeMonitoring = async (id: number): Promise<iMonitoringForm> => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data as iMonitoringForm;
  } catch (error: any) {
    console.log("Error removing monitoring:", error);
    throw error?.response?.data?.message || 'Erro ao remover acompanhamento';
  }
};

export default {
    getMonitorings,
    addMonitoring,
    editMonitoring,
    removeMonitoring,
    getMonitoringById
};