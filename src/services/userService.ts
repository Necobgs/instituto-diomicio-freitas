import { iUser, iUserForm, iPaginationUser, iParamsUser, iLoginCredentials, iRegisterForm } from "@/types/user";
import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:3001/`
});

const endpoint = 'users';

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    const { password, ...userWithoutPassword } = dataUser;
    const response = await api.patch(`${endpoint}/${dataUser.id}`, userWithoutPassword);
    return response.data as iUser;
}

const removeUser = async (user: iUser): Promise<iUser> => {
    const response = await api.delete(`${endpoint}/${user.id}`);
    return response.data as iUser;
}

const validateToken = async(): Promise<iUser> => {

    const token = localStorage.getItem('token');
    let arrayToken = token?.split('.');

    if (arrayToken?.[1]) {
        const payload = JSON.parse(atob(arrayToken[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("chegou")
        if (exp < currentTime) {
            console.log("token expirado")
            throw new Error('Token expirado');
        }

        const response = await api.get(`${endpoint}/${payload.sub}`);
        console.log("response.data", response.data);
        return response.data as iUser;
    }
    
    throw new Error('Token não encontrado');
};

const login = async (credentials: iLoginCredentials): Promise<{ token: string; user: iUser }> => {
    const response = await api.post('/login', credentials);
    const { accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    return { token: accessToken, user };
};

const register = async (newUser: iUserForm): Promise<iUser> => {
    const response = await api.post('/register', newUser);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const getMe = async (): Promise<iUser> => {
    const response = await api.get('/me');
    return response.data;
};

export default {
    getUsers,
    addUser,
    editUser,
    removeUser,
    getUserById,
    register,
    validateToken,
    login,
    logout,
    getMe
};