import { iStudent } from "./student";

export default interface iEvaluation{
    id: number,
    student: iStudent | undefined;
    entry_date: Date | null;
    date: Date | null;
    teacher_name: string;
    interview_note: number,
    note: number,
    questions: {id: number, value: string}[];
}