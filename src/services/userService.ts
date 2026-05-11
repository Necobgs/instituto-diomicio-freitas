import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iDefaultResponse } from "@/types/app";
import { iPermissionForm } from "@/types/permission";
import { iUserForm, iPaginationUser, iParamsUser, iLoginCredentials, iPasswordChangeForm } from "@/types/user";

const endpoint = 'user';

const getUsers = async ({ page = 1, limit = 8, username, cpf, email, enabled }: iParamsUser = {}): Promise<iPaginationUser> => {
  
  const filter: string = buildFilterQuery([
    { key: 'username', value: username, operator: '$ilike' }, 
    { key: 'cpf', value: cpf, operator: '$startsWith' },
    { key: 'email', value: email, operator: '$startsWith' },
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
    data: response.data.items as iUserForm[],
    count: response.data.count,
    hasNextPage: response.data.hasNextPage,
    hasPreviousPage: response.data.hasPreviousPage
  };
};

const getUserById = async (id: number): Promise<iUserForm> => {
    try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data as iUserForm;
    } catch (error: any) {
        console.log("Error fetching user:", error);
        throw error?.response?.data?.message || 'Erro ao buscar usuário';
    }
};

const getUserPermissionsById = async (id: number): Promise<iPermissionForm[]> => {
    try {
        const response = await api.get(`${endpoint}/${id}/permissions`);
        return response.data as iPermissionForm[];
    } catch (error: any) {
        console.log("Error fetching user permissions:", error);
        throw error?.response?.data?.message || 'Erro ao buscar permissões do usuário';
    }
};

const addUser = async (newUser: iUserForm): Promise<iUserForm> => {
    try {
        const response = await api.post(endpoint, newUser);
        return response.data as iUserForm;
    } catch (error: any) {
        console.log("Error adding user:", error);
        throw error?.response?.data?.message || 'Erro ao adicionar usuário';
    }
}

const editUser = async (dataUser: iUserForm): Promise<iUserForm> => {
    try {
        const response = await api.patch(`${endpoint}/${dataUser.id}`, dataUser);
        return response.data as iUserForm;
    } catch (error: any) {
        console.log("Error editing user:", error);
        throw error?.response?.data?.message || 'Erro ao editar usuário';
    }
}

const removeUser = async (id: number): Promise<iUserForm> => {
    try {
        const response = await api.delete(`${endpoint}/${id}`);
        return response.data as iUserForm;
    } catch (error: any) {
        console.log("Error removing user:", error);
        throw error?.response?.data?.message || 'Erro ao remover usuário';
    }
}

const passwordChange = async (credentials: iPasswordChangeForm): Promise<iDefaultResponse> => {
    try {
        const response = await api.post(`${endpoint}/password-change`, credentials);
        return response.data as iDefaultResponse;
    } catch (error: any) {
        console.log("Error changing password:", error);
        throw error?.response?.data?.message || 'Erro ao alterar senha';
    }
}

const resetToDefaultPasswordByID = async (id: number): Promise<iDefaultResponse> => {
    try {
        const response = await api.post(`${endpoint}/${id}/reset-to-default-password`);
        return response.data as iDefaultResponse;
    } catch (error: any) {
        console.log("Error resetting password:", error);
        throw error?.response?.data?.message || 'Erro ao resetar senha para padrão';
    }
}

const passwordChangeRequest = async (email: string): Promise<iDefaultResponse> => {
    try {
        const response = await api.post(`${endpoint}/password-change-request`, { email });
        return response.data as iDefaultResponse;
    } catch (error: any) {
        console.log("Error requesting password change:", error);
        throw error?.response?.data?.message || 'Erro ao solicitar alteração de senha';
    }
}

const login = async (credentials: iLoginCredentials): Promise<{ token: string, id: number }> => {

    try {
        const response = await api.post('/auth/login', credentials);
        const accessToken = response.data.access_token;
        let user: iUserForm | null = null;
        try {
            user = JSON.parse(atob(accessToken.split('.')[1]));
        }
        catch {
            console.log("Erro ao decodificar token");
        }
        localStorage.setItem('token', accessToken);
        return { token: accessToken, id: user?.id || 0 };
    } catch (error: any) {
        console.log("Error login:", error);
        throw error?.response?.data?.message || 'Erro ao realizar login';
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

export default {
    getUsers,
    addUser,
    passwordChange,
    resetToDefaultPasswordByID,
    passwordChangeRequest,
    editUser,
    removeUser,
    getUserById,
    getUserPermissionsById,
    login,
    logout,
};