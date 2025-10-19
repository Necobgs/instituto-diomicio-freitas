import { iRoot } from "./iRoot";

export interface iEnterprise extends iRoot{
    name:string;
    phone:string;
    cnpj:string;
    enabled:boolean;
}

export type iEnterpriseForm = Omit<iEnterprise, "id">;