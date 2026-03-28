import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";

export interface iEnterprise extends iRoot{
    name:string;
    cnpj:string;
    phone:string;
}

export interface iPaginationEnterprise extends iPagination {
  data: iEnterprise[];
}

export interface iParamsEnterprise {
    page?: number;
    limit?: number;
    name?: string;
    cnpj?: string;
    phone?: string;
    enabled?: string;
}

export type iEnterpriseForm = Partial<iEnterprise>;