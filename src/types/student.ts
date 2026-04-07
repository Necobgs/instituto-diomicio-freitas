import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iStudent extends iRoot{
    name: string;
    phone: string;
    dateBirthday: Date | null | string,
    cpf: string;
    responsibleName: string;
    responsiblePhone: string;
    useMedicine: boolean;
    infoMedicine: string;
    dateEntry: Date | null | string;
}

export type iStudentForm = Partial<iStudent>;

export interface iPaginationStudent extends iPagination{
  data: iStudentForm[];
}

export interface iParamsStudent {
    page?: number;
    limit?: number;
    name?: string;
    cpf?: string;
    phone?: string;
    responsibleName?: string;
    responsiblePhone?: string;
    useMedicine?: string;
    dateBirthdayIni?: string;
    dateBirthdayEnd?: string;
    dateEntryIni?: string;
    dateEntryEnd?: string;
    enabled?: string;
}

export interface iStudentState extends iState {
    students: iStudentForm[];
    student: iStudentForm | null;
}

export const defaultFilterStudent = {
    name: "",
    cpf: "",
    phone: "",
    responsibleName: "",
    responsiblePhone: "",
    useMedicine: "",
    dateBirthdayIni: "",
    dateBirthdayEnd: "",
    dateEntryIni: "",
    dateEntryEnd: "",
    enabled: "true"
};

export const defaultStudent: iStudentForm = {
    name: "",
    phone: "",
    dateBirthday: "",
    cpf: "",
    responsibleName: "",
    responsiblePhone: "",
    useMedicine: false,
    infoMedicine: "",
    dateEntry: "",
};