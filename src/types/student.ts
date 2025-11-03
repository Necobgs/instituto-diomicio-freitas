import { iRoot } from "./iRoot";

export interface iStudent extends iRoot{
    name:string;
    phone:string;
    date_of_birth:Date | null,
    cpf:string;
    enabled:boolean;
}

export interface iPaginationStudent {
  data: iStudent[];
  total: number;
}

export interface iParamsStudent {
    page?: number;
    limit?: number;
    name?: string;
    cpf?: string;
    phone?: string;
    enabled?: string;
}

export type iStudentForm = Partial<iStudent>;