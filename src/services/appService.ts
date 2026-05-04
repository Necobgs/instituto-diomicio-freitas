import { api } from "@/config/api";

const endpoint = '';

const getApp = async (): Promise<string> => {

  try {
    const response = await api.get(endpoint);
    return response.data as string;
  } catch (error: any) {
    console.log("Error fetching app:", error);
    throw error?.response?.data?.message || 'Erro ao buscar aplicação';
  }
};

export default {
  getApp
};