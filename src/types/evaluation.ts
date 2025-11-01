import { iStudent } from "./student";

export interface iEvaluation{
    id: number,
    student: iStudent | undefined;
    entry_date: Date | null;
    date: Date | null;
    teacher_name: string;
    interview_note: number,
    note: number,
}

export type iEvaluationForm = Partial<iEvaluation>;

export interface iPaginationEvaluation {
  data: iEvaluation[];
  total: number;
}

export interface iParamsEvaluation{
    page?: number;
    limit?: number;
    student?: iStudent;
    entry_date?: string;
    date?: string;
    teacher_name?: string;
}