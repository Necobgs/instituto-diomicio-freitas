import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iEnterprise extends iRoot{
    name:string;
    cnpj:string;
    phone:string;
}

export type iEnterpriseForm = Partial<iEnterprise>;

export interface iPaginationEnterprise extends iPagination {
  data: iEnterpriseForm[];
}

export interface iParamsEnterprise {
    page?: number;
    limit?: number;
    name?: string;
    cnpj?: string;
    phone?: string;
    enabled?: string;
}

export interface iEnterpriseState extends iState {
    enterprises: iEnterpriseForm[];
    enterprise: iEnterpriseForm | null;
}

export const defaultFilterEnterprise: iParamsEnterprise = {
    name: "",
    phone: "",
    cnpj: "",
    enabled: "true"
};

export const defaultEnterprise: iEnterpriseForm = {
    name: "",
    phone: "",
    cnpj: "",
};