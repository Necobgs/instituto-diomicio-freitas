import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iStudent extends iRoot{
    name:string;
    phone:string;
    date_birthday:Date | null,
    cpf:string;
}

export interface iPaginationStudent extends iPagination{
  data: iStudent[];
}

export interface iParamsStudent {
    page?: number;
    limit?: number;
    name?: string;
    cpf?: string;
    phone?: string;
    enabled?: string;
}

export interface iStudentState extends iState {
    students: iStudent[];
}

export type iStudentForm = Partial<iStudent>;