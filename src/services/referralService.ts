import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iReferralForm, iPaginationReferral, iParamsReferral } from "@/types/referral";

const endpoint = 'referral';

const getReferrals = async ({ page = 1, limit = 8, student, enterprise, job, admissionDateIni, admissionDateEnd, terminationDateIeedfIni, terminationDateIeedfEnd, enabled }: iParamsReferral = {}): Promise<iPaginationReferral> => {
  
  const filter: string = buildFilterQuery([
    { key: 'studentId', value: student?.id, operator: '$eq' }, 
    { key: 'enterpriseId', value: enterprise?.id, operator: '$eq' },
    { key: 'jobId', value: job?.id, operator: '$eq' },
    { key: 'admissionDate', value: [admissionDateIni, admissionDateEnd], operator: ['$gte', '$lte'] },
    { key: 'terminationDateIeedf', value: [terminationDateIeedfIni, terminationDateIeedfEnd], operator: ['$gte', '$lte'] },
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
    data: response.data.items as iReferralForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getReferralById = async (id: number): Promise<iReferralForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iReferralForm;
  } catch (error: any) {
    console.log("Error fetching referral:", error);
    throw error?.response?.data?.message || 'Erro ao buscar encaminhamento';
  }
};

const addReferral = async (newReferral: iReferralForm): Promise<iReferralForm> => {
  try {
    const response = await api.post(endpoint, newReferral);
    return response.data as iReferralForm;
  } catch (error: any) {
    console.log("Error adding referral:", error);
    throw error?.response?.data?.message || 'Erro ao adicionar encaminhamento';
  }
}

const editReferral = async (dataReferral: iReferralForm): Promise<iReferralForm> => {
  try {
    const response = await api.patch(`${endpoint}/${dataReferral.id}`, dataReferral);
    return response.data as iReferralForm;
  } catch (error: any) {
    console.log("Error editing referral:", error);
    throw error?.response?.data?.message || 'Erro ao editar encaminhamento';
  }
}

const removeReferral = async (id: number): Promise<iReferralForm> => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data as iReferralForm;
  } catch (error: any) {
    console.log("Error removing referral:", error);
    throw error?.response?.data?.message || 'Erro ao remover encaminhamento';
  }
};

export default {
    getReferrals,
    addReferral,
    editReferral,
    removeReferral,
    getReferralById
};