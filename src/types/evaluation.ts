import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iStudentForm } from "./student";
import { iUserForm } from "./user";

export interface iEvaluation extends iRoot {
    student?: iStudentForm;
    studentId?: number;
    user?: iUserForm;
    userId?: number;
    date: Date | null | string;
    interviewNote: number;
    note: number;
    q01: string;
    q02: string;
    q03: string;
    q04: string;
    q05: string;
    q06: string;
    q07: string;
    q08: string;
    q09: string;
    q10: string;
    q11: string;
    q12: string;
    q13: string;
    q14: string;
    q15: string;
    q16: string;
    q17: string;
    q18: string;
    q19: string;
    q20: string;
    q21: string;
    q22: string;
    q23: string;
    q24: string;
    q25: string;
    q26: string;
    q27: string;
    q28: string;
    q29: string;
    q30: string;
    q31: string;
    q32: string;
    q33: string;
    q34: string;
    q35: string;
    q36: string;
    q37: string;
    q38: string;
    q39: string;
    q40: string;
    q41: string;
    q42: string;
    q43: string;
    q44: string;
    q45: string;
    q46: string;
    q47: string;
    q48: string;
    q49: string;
}

export type iEvaluationForm = Partial<iEvaluation>;

export interface iPaginationEvaluation extends iPagination {
  data: iEvaluationForm[];
}

export interface iParamsEvaluation{
    page?: number;
    limit?: number;
    student?: iStudentForm | undefined;
    user?: iUserForm;
    dateIni?: string;
    dateEnd?: string;
    enabled?: string;
}

export interface iQuestionEvaluation {
    key: string;
    value: string;
    title?: string;
    obrigatory?: boolean;
    type?: "discursive" | "alternative";
}

export interface iEvaluationState {
    evaluations: iEvaluationForm[];
    evaluation: iEvaluationForm | null;
    error: string | null;
    loading: boolean;
    total: number;
}

export const defaultEvaluation: iEvaluationForm = {
    student: undefined,
    date: null,
    interviewNote: 0,
    note: 0,
    q01: "a",
    q02: "a",
    q03: "a", 
    q04: "a",
    q05: "a",
    q06: "a", 
    q07: "a",
    q08: "a",
    q09: "a",
    q10: "a",
    q11: "a",
    q12: "a",
    q13: "a",
    q14: "a",
    q15: "a",
    q16: "a",
    q17: "a",
    q18: "a",    
    q19: "a",
    q20: "a",
    q21: "a",
    q22: "a",
    q23: "a",
    q24: "a",
    q25: "a",
    q26: "a",
    q27: "a",
    q28: "a",
    q29: "a",
    q30: "a",
    q31: "a",
    q32: "a",
    q33: "a",
    q34: "a",
    q35: "a",
    q36: "a",
    q37: "a",
    q38: "a",
    q39: "a",
    q40: "a",
    q41: "a",
    q42: "a",
    q43: "a",
    q44: "a",
    q45: "a",
    q46: "a",
    q47: "",
    q48: "",
    q49: "",  
}

export const defaultQuestions: iQuestionEvaluation[] = [
    { key: "q01", value: "", title: "Atende as regras.", type: "alternative", obrigatory: true },
    { key: "q02", value: "", title: "Socializa com o grupo.", type: "alternative", obrigatory: true },
    { key: "q03", value: "", title: "Isola-se do grupo.", type: "alternative", obrigatory: true },
    { key: "q04", value: "", title: "Possui tolerância a frustração.", type: "alternative", obrigatory: true },
    { key: "q05", value: "", title: "Respeita colega e professores.", type: "alternative", obrigatory: true },
    { key: "q06", value: "", title: "Faz relatos fantasiosos.", type: "alternative", obrigatory: true },
    { key: "q07", value: "", title: "Concentra-se nas atividades.", type: "alternative", obrigatory: true },
    { key: "q08", value: "", title: "Tem iniciativa.", type: "alternative", obrigatory: true },
    { key: "q09", value: "", title: "Sonolência durante as atividades em sala de aula.", type: "alternative", obrigatory: true },
    { key: "q10", value: "", title: "Alterações intensas de humor.", type: "alternative", obrigatory: true },
    { key: "q11", value: "", title: "Indica oscilação repentina de humor.", type: "alternative", obrigatory: true },
    { key: "q12", value: "", title: "Irrita-se com facilidade.", type: "alternative", obrigatory: true },
    { key: "q13", value: "", title: "Ansiedade.", type: "alternative", obrigatory: true },
    { key: "q14", value: "", title: "Escuta quando seus colegas falam.", type: "alternative", obrigatory: true },
    { key: "q15", value: "", title: "Escuta e segue orientação dos professores.", type: "alternative", obrigatory: true },
    { key: "q16", value: "", title: "Mantém-se em sala de aula.", type: "alternative", obrigatory: true },
    { key: "q17", value: "", title: "Desloca-se muito na sala.", type: "alternative", obrigatory: true },
    { key: "q18", value: "", title: "Fala demasiadamente.", type: "alternative", obrigatory: true },
    { key: "q19", value: "", title: "É pontual.", type: "alternative", obrigatory: true },
    { key: "q20", value: "", title: "É assíduo.", type: "alternative", obrigatory: true },
    { key: "q21", value: "", title: "Demonstra desejo de trabalhar.", type: "alternative", obrigatory: true },
    { key: "q22", value: "", title: "Apropria-se indevidamente daquilo que não é seu.", type: "alternative", obrigatory: true },
    { key: "q23", value: "", title: "Indica hábito de banho diário.", type: "alternative", obrigatory: true },
    { key: "q24", value: "", title: "Indica hábito de escovação e qualidade na escovação.", type: "alternative", obrigatory: true },
    { key: "q25", value: "", title: "Indica cuidado com a aparência e limpeza do uniforme.", type: "alternative", obrigatory: true },
    { key: "q26", value: "", title: "Indica autonomia quanto a estes hábitos (23, 24, 25).", type: "alternative", obrigatory: true },
    { key: "q27", value: "", title: "Indica falta do uso de medicação com oscilações de comportamento.", type: "alternative", obrigatory: true },
    { key: "q28", value: "", title: "Tem meio articulado de conseguir receitas e aquisições das medicações.", type: "alternative", obrigatory: true },
    { key: "q29", value: "", title: "Traz seus materiais organizados.", type: "alternative", obrigatory: true },
    { key: "q30", value: "", title: "Usa transporte coletivo.", type: "alternative", obrigatory: true },
    { key: "q31", value: "", title: "Tem iniciativa diante das atividades propostas.", type: "alternative", obrigatory: true },
    { key: "q32", value: "", title: "Localiza-se no espaço da Instituição.", type: "alternative", obrigatory: true },
    { key: "q33", value: "", title: "Situa-se nas trocas de sala e atividades.", type: "alternative", obrigatory: true },
    { key: "q34", value: "", title: "Interage par a par.", type: "alternative", obrigatory: true },
    { key: "q35", value: "", title: "Interage em grupo.", type: "alternative", obrigatory: true },
    { key: "q36", value: "", title: "Cria conflitos e intrigas.", type: "alternative", obrigatory: true },
    { key: "q37", value: "", title: "Promove a harmonia.", type: "alternative", obrigatory: true },
    { key: "q38", value: "", title: "Faz intrigas entre colegas x professores.", type: "alternative", obrigatory: true },
    { key: "q39", value: "", title: "Demonstra interesse em participar das atividades extraclasses.", type: "alternative", obrigatory: true },
    { key: "q40", value: "", title: "Existe interação/participação da família em apoio ao usuário na Instituição.", type: "alternative", obrigatory: true },
    { key: "q41", value: "", title: "Existe superproteção da família quanto à autonomia do usuário.", type: "alternative", obrigatory: true },
    { key: "q42", value: "", title: "Usuário traz relatos negativos da família.", type: "alternative", obrigatory: true },
    { key: "q43", value: "", title: "Usuário traz relatos positivos da família.", type: "alternative", obrigatory: true },
    { key: "q44", value: "", title: "Família incentiva a autonomia do usuário.", type: "alternative", obrigatory: true },
    { key: "q45", value: "", title: "Família incentiva a inserção no mercado de trabalho.", type: "alternative", obrigatory: true },
    { key: "q46", value: "", title: "Traz os documentos enviados pela Instituição assinados.", type: "alternative", obrigatory: true },
    { key: "q47", value: "", title: "Em sua opinião o usuário tem perfil para esta instituição? Por quê?", type: "discursive", obrigatory: false },
    { key: "q48", value: "", title: "Em que situações demonstra irritações?", type: "discursive", obrigatory: false },
    { key: "q49", value: "", title: "Caso o aluno faça uso de medicação", type: "discursive", obrigatory: false },
];