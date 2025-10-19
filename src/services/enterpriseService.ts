import { iEnterprise, iEnterpriseForm } from "@/types/enterprise";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'enterprise';

const getEnterprises = async (): Promise<iEnterprise[]> => {
    const response = await api.get(endpoint);
    return response.data as iEnterprise[];
}

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
};