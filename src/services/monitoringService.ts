import { iMonitoring, iMonitoringForm, iPaginationMonitoring, iParamsMonitoring } from "@/types/monitoring";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'monitoring';


const getMonitorings = async ({ page = 1, limit = 8, student, admission_date, enterprise, job_title, hr_contact, hr_resposible, termination_date_ieedf }: iParamsMonitoring = {}): Promise<iPaginationMonitoring> => {
  let query = `_page=${page}&_limit=${limit}`;

  console.log(admission_date, termination_date_ieedf)

  if (student) query += `&student.id=${student.id}`;

  if (admission_date) query += `&admission_date=${encodeURIComponent(`${admission_date}T00:00:00.000Z`)}`;

  if (enterprise) query += `&enterprise.id=${enterprise.id}`;

  if (job_title) query += `&job_title_like=${encodeURIComponent(job_title)}`;

  if (hr_contact) query += `&hr_contact_like=${encodeURIComponent(hr_contact)}`;

  if (hr_resposible) query += `&hr_resposible_like=${encodeURIComponent(hr_resposible)}`;

  if (termination_date_ieedf) query += `&termination_date_ieedf=${encodeURIComponent(`${termination_date_ieedf}T00:00:00.000Z`)}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iMonitoring[],
    total
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

const removeMonitoring = async (id: number): Promise<void> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
};

export default {
    getMonitorings,
    addMonitoring,
    editMonitoring,
    removeMonitoring,
    getMonitoringById
};