import { iEnterprise, iEnterpriseForm, iPaginationEnterprise, iParamsEnterprise } from "@/types/enterprise";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'enterprise';

const getEnterprises = async ({ page = 1, limit = 8, name, cnpj, enabled }: iParamsEnterprise = {}): Promise<iPaginationEnterprise> => {
  let query = `_page=${page}&_limit=${limit}`;

  // Nome - includes
  if (name) query += `&name_like=${encodeURIComponent(name)}`;

  // CNPJ - startsWith (usa regex ^)
  if (cnpj) query += `&cnpj_like=${encodeURIComponent(`^${cnpj}`)}`;

  // Status
  if (enabled) query += `&enabled=${encodeURIComponent(enabled)}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iEnterprise[],
    total
  };
};

const getEnterpriseById = async (id: number): Promise<iEnterprise> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iEnterprise;
};

const addEnterprise = async (newEnterprise: iEnterpriseForm): Promise<iEnterprise> => {
    const response = await api.post(endpoint, newEnterprise);
    return response.data as iEnterprise;
}

const editEnterprise = async (dataEnterprise: iEnterprise): Promise<iEnterprise> => {
    const response = await api.put(`${endpoint}/${dataEnterprise.id}`, dataEnterprise);
    return response.data as iEnterprise;
}

const removeEnterprise = async (enterprise: iEnterprise): Promise<iEnterprise> => {
    const response = await api.delete(`${endpoint}/${enterprise.id}`);
    return response.data as iEnterprise;
}

export default {
    getEnterprises,
    addEnterprise,
    editEnterprise,
    removeEnterprise,
    getEnterpriseById
};