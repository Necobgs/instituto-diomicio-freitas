import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iUser extends iRoot{
    username:string;
    email:string;
    cpf:string;
    mustChangePassword:boolean;
}

export type iUserForm = Partial<iUser>;

export interface iPaginationUser extends iPagination {
  data: iUserForm[];
}

export interface iParamsUser {
    page?: number;
    limit?: number;
    username?: string;
    cpf?: string;
    email?:string;
    enabled?: string;
}

export interface iLoginCredentials {
    email: string;
    password: string;
}

export interface iUserState extends iState {
    users: iUser[];
    currentUser: iUserForm | null;  // Usuário logado
    token: string | null;
    isAuthenticated: boolean;
}