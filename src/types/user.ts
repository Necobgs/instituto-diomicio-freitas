import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iPermissionForm } from "./permission";
import { iState } from "./state";

export interface iUser extends iRoot{
    username:string;
    email:string;
    cpf:string;
    mustChangePassword:boolean;
    permissionsId?: number[] | null;
    permissions?: iPermissionForm[] | null;
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

export interface iPasswordChangeForm {
    newPassword: string;
    token: string;
}

export interface iUserState extends iState {
    users: iUserForm[];
    user: iUserForm | null;  // Usuário selecionado para visualização/edição
    userPermissions: iPermissionForm[]; // Permissões do usuário selecionado
    currentUser: iUserForm | null;  // Usuário logado
    idUser: number;
    token: string | null;
}

export const defaultFilterUser: iParamsUser = {
    username: "",
    cpf: "",
    email: "",
    enabled: "true",
};

export const defaultUser: iUserForm = {
    username: "", 
    email: "",
    cpf: "", 
    permissionsId: [],
}