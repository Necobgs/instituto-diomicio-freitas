import { iRoot } from "./iRoot";

export interface iUser extends iRoot{
    name:string;
    email:string;
    cpf:string;
}