import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iEnterpriseForm, iPaginationEnterprise, iParamsEnterprise } from "@/types/enterprise";

const endpoint = 'enterprise';

const getEnterprises = async ({ page = 1, limit = 8, name, cnpj, phone, enabled }: iParamsEnterprise = {}): Promise<iPaginationEnterprise> => {
  
  const filter: string = buildFilterQuery([
    { key: 'name', value: name, operator: '$ilike' }, 
    { key: 'cnpj', value: cnpj, operator: '$startsWith' },
    { key: 'phone', value: phone, operator: '$startsWith' },
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
    data: response.data.items as iEnterpriseForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getEnterpriseById = async (id: number): Promise<iEnterpriseForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iEnterpriseForm;
  } catch (error: any) {
    console.log("Error fetching enterprise:", error);
    throw error?.response?.data?.message || 'Erro ao buscar empresa';
  }
};

const addEnterprise = async (newEnterprise: iEnterpriseForm): Promise<iEnterpriseForm> => {
  try {
    const response = await api.post(endpoint, newEnterprise);
    return response.data as iEnterpriseForm;
  } catch (error: any) {
    console.log("Error adding enterprise:", error);
    throw error?.response?.data?.message || 'Erro ao adicionar empresa';
  }
}

const editEnterprise = async (dataEnterprise: iEnterpriseForm): Promise<iEnterpriseForm> => {
  try {
      const response = await api.patch(`${endpoint}/${dataEnterprise.id}`, dataEnterprise);
      return response.data as iEnterpriseForm;
  } catch (error: any) {
      console.log("Error editing enterprise:", error);
      throw error?.response?.data?.message || 'Erro ao editar empresa';
  }
}

const removeEnterprise = async (id: number): Promise<iEnterpriseForm> => {
  try {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data as iEnterpriseForm;
  } catch (error: any) {
      console.log("Error removing enterprise:", error);
      throw error?.response?.data?.message || 'Erro ao remover empresa';
  }
}

export default {
    getEnterprises,
    addEnterprise,
    editEnterprise,
    removeEnterprise,
    getEnterpriseById
};