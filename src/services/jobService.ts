import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iJobForm, iPaginationJob, iParamsJob } from "@/types/job";

const endpoint = 'job';

const getJobs = async ({ page = 1, limit = 8, name, enabled }: iParamsJob = {}): Promise<iPaginationJob> => {
  
  const filter: string = buildFilterQuery([
    { key: 'name', value: name, operator: '$ilike' },
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
    data: response.data.items as iJobForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getJobById = async (id: number): Promise<iJobForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iJobForm;
  } catch (error: any) {
    console.log("Error fetching job:", error);
    throw error?.response?.data?.message || 'Erro ao buscar cargo';
  }
};

const addJob = async (newJob: iJobForm): Promise<iJobForm> => {
  try {
    const response = await api.post(endpoint, newJob);
    return response.data as iJobForm;
  } catch (error: any) {
    console.log("Error adding job:", error);
    throw error?.response?.data?.message || 'Erro ao adicionar cargo';
  }
}

const editJob = async (dataJob: iJobForm): Promise<iJobForm> => {
  try {
    const response = await api.patch(`${endpoint}/${dataJob.id}`, dataJob);
    return response.data as iJobForm;
  } catch (error: any) {
    console.log("Error editing job:", error);
    throw error?.response?.data?.message || 'Erro ao editar cargo';
  }
}

const removeJob = async (id: number): Promise<iJobForm> => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data as iJobForm;
  } catch (error: any) {
    console.log("Error removing job:", error);
    throw error?.response?.data?.message || 'Erro ao remover cargo';
  }
}

export default {
    getJobs,
    addJob,
    editJob,
    removeJob,
    getJobById
};