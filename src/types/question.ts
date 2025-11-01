import { iRoot } from "./iRoot";

export interface iQuestion extends iRoot{
    type:string
    title:string,
    value:string;
    order:number;
    id_evaluation:number;
}

export type iQuestionForm = Partial<iQuestion>;

export interface iPaginationQuestion {
  data: iQuestion[];
  total: number;
}

export interface iParamsQuestion{
    page?:number;
    limit?:number;
    id_evaluation?:number;
}