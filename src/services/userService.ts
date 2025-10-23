import { iUser, iUserForm, iPaginationUser, iParamsUser } from "@/types/user";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = 'user';

const getUsers = async ({ page = 1, limit = 8, name, cpf, email, enabled }: iParamsUser = {}): Promise<iPaginationUser> => {
  let query = `_page=${page}&_limit=${limit}`;

  if (name) query += `&name_like=${encodeURIComponent(name)}`;

  if (cpf) query += `&cpf_like=${encodeURIComponent(`^${cpf}`)}`;

  if (email) query += `&email_like=${encodeURIComponent(`^${email}`)}`;

  if (enabled) query += `&enabled=${encodeURIComponent(enabled)}`;

  const response = await api.get(`${endpoint}?${query}`);
  const total = response.headers["x-total-count"]
    ? parseInt(response.headers["x-total-count"])
    : 0;

  return {
    data: response.data as iUser[],
    total
  };
};

const getUserById = async (id: number): Promise<iUser> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data as iUser;
};

const addUser = async (newUser: iUserForm): Promise<iUser> => {
    const response = await api.post(endpoint, newUser);
    return response.data as iUser;
}

const editUser = async (dataUser: iUser): Promise<iUser> => {
    const response = await api.put(`${endpoint}/${dataUser.id}`, dataUser);
    return response.data as iUser;
}

const removeUser = async (user: iUser): Promise<iUser> => {
    const response = await api.delete(`${endpoint}/${user.id}`);
    return response.data as iUser;
}

export default {
    getUsers,
    addUser,
    editUser,
    removeUser,
    getUserById
};