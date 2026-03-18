import { api } from "@/config/api";
import { buildFilterQuery } from "@/functions/filter";
import { iUser, iUserForm, iPaginationUser, iParamsUser, iLoginCredentials, iRegisterForm } from "@/types/user";

const endpoint = 'user';

const getUsers = async ({ page = 1, limit = 8, username, cpf, email, enabled }: iParamsUser = {}): Promise<iPaginationUser> => {
  
  const filter: string = buildFilterQuery([
    { key: 'username', value: username, operator: '$ilike' }, 
    { key: 'cpf', value: cpf, operator: '$startsWith' },
    { key: 'email', value: email, operator: '$startsWith' },
    { key: 'deleted_at', value: enabled, operator: '$null' }
  ]);
  
  const response = await api.get(endpoint,{
    params: {
      filter: filter,
      page,
      limit
    }
  });

  return {
    data: response.data.items as iUser[],
    count: response.data.count
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

const login = async (credentials: iLoginCredentials): Promise<{ token: string, user: iUserForm | null }> => {
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
    console.log("user", user);
    console.log("accessToken", response.data);
    return { token: accessToken, user: user };
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



/*class Filter(){
    function getParam(operator:string, value:string,name:string){
        
    }

    function desestructure(variavel:any,name:string){
        return (variavel && {name: variavel}) || {};
    }
}*/