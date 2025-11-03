import { iNotification, iNotificationForm, iPaginationNotification, iParamsNotification } from "@/types/notification";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'notification';

const getNotifications = async ({ page = 1, limit = 8, read }: iParamsNotification = {}): Promise<iPaginationNotification> => {
  let query = `_page=${page}&_limit=${limit}`;

  if (read) query += `&read=${read}`;

  const response = await api.get(`${endpoint}?${query}`);

  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iNotification[],
    total
  };
};

const getNotificationById = async (id: number): Promise<iNotification> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iNotification;
};

const addNotification = async (newNotification: iNotificationForm): Promise<iNotification> => {
    const response = await api.post(endpoint, newNotification);
    return response.data as iNotification;
}

const editNotification = async (dataNotification: iNotificationForm): Promise<iNotification> => {
    const response = await api.put(`${endpoint}/${dataNotification.id}`, dataNotification);
    return response.data as iNotification;
}

const removeNotification = async (id: number): Promise<void> => {
    const response = await api.delete(`${endpoint}/${id}`);
    if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Falha no DELETE: ${response.status}`);
    }
};

export default {
    getNotifications,
    addNotification,
    editNotification,
    removeNotification,
    getNotificationById
};