import { iRoot } from "./iRoot";

export interface iUser extends iRoot{
    username:string;
    email:string;
    cpf:string;
    password:string;
    mustChangePassword:boolean;
}

export interface iPaginationUser {
  data: iUser[];
  count: number;
}

export interface iParamsUser {
    page?: number;
    limit?: number;
    username?: string;
    cpf?: string;
    email?:string;
    enabled?: string;
}

export type iUserForm = Partial<iUser>;

export interface iLoginCredentials {
    username: string;
    password: string;
}

export interface iRegisterForm extends iUserForm {
    password: string;
}