import { iRoot } from "./iRoot";

export interface iEnterprise extends iRoot{
    name:string;
    phone:string;
    cnpj:string;
    enabled:boolean;
}

export interface iPaginationEnterprise {
  data: iEnterprise[];
  total: number;
}

export interface iParamsEnterprise {
    page?: number;
    limit?: number;
    name?: string;
    cnpj?: string;
    enabled?: string;
}

export type iEnterpriseForm = Omit<iEnterprise, "id">;