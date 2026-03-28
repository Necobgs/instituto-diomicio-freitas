import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iReferral, iReferralForm, iPaginationReferral, iParamsReferral } from "@/types/referral";

const endpoint = 'referral';

const getReferrals = async ({ page = 1, limit = 8, studentId, enterpriseId, jobId, admission_date_ini, admission_date_end, termination_date_ieedf_ini, termination_date_ieedf_end, enabled }: iParamsReferral = {}): Promise<iPaginationReferral> => {
  
  const filter: string = buildFilterQuery([
    { key: 'studentId', value: studentId, operator: '$eq' }, 
    { key: 'enterpriseId', value: enterpriseId, operator: '$eq' },
    { key: 'jobId', value: jobId, operator: '$eq' },
    { key: 'admission_date_ini', value: (!admission_date_ini ? '' : `${admission_date_ini}T00:00:00.000Z`), operator: '$gte' },
    { key: 'admission_date_end', value: (!admission_date_end ? '' : `${admission_date_end}T00:00:00.000Z`), operator: '$lte' },
    { key: 'termination_date_ieedf_ini', value: (!termination_date_ieedf_ini ? '' : `${termination_date_ieedf_ini}T00:00:00.000Z`), operator: '$gte' },
    { key: 'termination_date_ieedf_end', value: (!termination_date_ieedf_end ? '' : `${termination_date_ieedf_end}T00:00:00.000Z`), operator: '$lte' },
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
    data: response.data.items as iReferral[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getReferralById = async (id: number): Promise<iReferral> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iReferral;
};

const addReferral = async (newReferral: iReferralForm): Promise<iReferral> => {
    const response = await api.post(endpoint, newReferral);
    return response.data as iReferral;
}

const editReferral = async (dataReferral: iReferralForm): Promise<iReferral> => {
    const response = await api.put(`${endpoint}/${dataReferral.id}`, dataReferral);
    return response.data as iReferral;
}

const removeReferral = async (id: number): Promise<iReferral> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
    return response.data as iReferral;
};

export default {
    getReferrals,
    addReferral,
    editReferral,
    removeReferral,
    getReferralById
};