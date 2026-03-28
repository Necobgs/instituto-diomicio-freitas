import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iJob, iJobForm, iPaginationJob, iParamsJob } from "@/types/job";

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
    data: response.data.items as iJob[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getJobById = async (id: number): Promise<iJob> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iJob;
};

const addJob = async (newJob: iJobForm): Promise<iJob> => {
    const response = await api.post(endpoint, newJob);
    return response.data as iJob;
}

const editJob = async (dataJob: iJobForm): Promise<iJob> => {
    const response = await api.patch(`${endpoint}/${dataJob.id}`, dataJob);
    return response.data as iJob;
}

const removeJob = async (job: iJobForm): Promise<iJob> => {
    const response = await api.delete(`${endpoint}/${job.id}`);
    return response.data as iJob;
}

export default {
    getJobs,
    addJob,
    editJob,
    removeJob,
    getJobById
};