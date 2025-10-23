import { iRoot } from "./iRoot";

export interface iUser extends iRoot{
    name:string;
    email:string;
    cpf:string;
    password:string;
    enabled:boolean;
}

export interface iPaginationUser {
  data: iUser[];
  total: number;
}

export interface iParamsUser {
    page?: number;
    limit?: number;
    name?: string;
    cpf?: string;
    email?:string;
    enabled?: string;
}

export type iUserForm = Omit<iUser, "id">;