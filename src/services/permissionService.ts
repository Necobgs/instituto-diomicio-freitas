import { api } from "@/config/api";
import { iPermissionForm, iPaginationPermission, iParamsPermission } from "@/types/permission";

const endpoint = 'permission';

const getPermissions = async ({ page = 1, limit = 500 }: iParamsPermission = {}): Promise<iPaginationPermission> => {
  
  const filter: string = "";
  
  const response = await api.get(endpoint,{
    params: {
      filter: filter,
      page,
      limit,
    }
  });

  return {
    data: response.data.items as iPermissionForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getPermissionById = async (id: number): Promise<iPermissionForm> => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data as iPermissionForm;
  } catch (error: any) {
    console.log("Error fetching permission:", error);
    throw error?.response?.data?.message || 'Erro ao buscar permissão';
  }
};

export default {
    getPermissions,
    getPermissionById
};