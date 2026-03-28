import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iMonitoring, iMonitoringForm, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";

const endpoint = 'monitoring';

const getMonitorings = async ({ page = 1, limit = 8, student, enterprise, visit_date_ini, visit_date_fim, enabled }: iParamsMonitoring = {}): Promise<iPaginationMonitoring> => {
  
  const filter: string = buildFilterQuery([
    { key: 'studentId', value: student?.id, operator: '$eq' }, 
    { key: 'enterpriseId', value: enterprise?.id, operator: '$eq' },
    { key: 'visit_date_ini', value: (!visit_date_ini ? '' : `${visit_date_ini}T00:00:00.000Z`), operator: '$gte' },
    { key: 'visit_date_fim', value: (!visit_date_fim ? '' : `${visit_date_fim}T00:00:00.000Z`), operator: '$lte' },
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
    data: response.data.items as iMonitoring[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getMonitoringById = async (id: number): Promise<iMonitoring> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iMonitoring;
};

const addMonitoring = async (newMonitoring: iMonitoringForm): Promise<iMonitoring> => {
    const response = await api.post(endpoint, newMonitoring);
    return response.data as iMonitoring;
}

const editMonitoring = async (dataMonitoring: iMonitoringForm): Promise<iMonitoring> => {
    const response = await api.put(`${endpoint}/${dataMonitoring.id}`, dataMonitoring);
    return response.data as iMonitoring;
}

const removeMonitoring = async (id: number): Promise<iMonitoring> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
    return response.data as iMonitoring;
};

export default {
    getMonitorings,
    addMonitoring,
    editMonitoring,
    removeMonitoring,
    getMonitoringById
};