import { iRoot } from "./iRoot";

export interface iEnterprise extends iRoot{
    name:string;
    phone:string;
    cnpj:string;
}

export type iEnterpriseForm = Omit<iEnterprise, "id">;