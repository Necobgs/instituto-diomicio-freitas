import { iRoot } from "./iRoot";

export interface iQuestion extends iRoot{
    type:string
    title:string,
    value:string;
    id_evaluation:number;
}