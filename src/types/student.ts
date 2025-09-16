import { iRoot } from "./iRoot";

export interface iStudent extends iRoot{
    name:string;
    phone:string;
    date_of_birth:Date | null,
    cpf:string;
}