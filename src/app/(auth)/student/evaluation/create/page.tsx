"use client";

import { Button } from "@/components/ui/button";
import { QuestionCombobox } from "@/components/ui/combo-box-question";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import iEvaluation from "@/types/evaluation";
import { iQuestion } from "@/types/question";
import { iStudent } from "@/types/student";
import { useRouter } from "next/navigation";
import { useState } from "react";

const questions: iQuestion[] = [
    {
        id: 1,
        text: "Atende as regras.",
        discursive: false,
    },
    {
        id: 2,
        text: "Socializa com o grupo.",
        discursive: false,
    },
    {
        id: 3,
        text: "Isola-se do grupo.",
        discursive: false,
    },
    {
        id: 4,
        text: "Possui tolerância a frustração.",
        discursive: false,
    },
    {
        id: 5,
        text: "Em sua opinião o usuário tem perfil para esta instituição? Por quê?",
        discursive: true,
    },
    {
        id: 6,
        text: "Em que situações demonstra irritações?",
        discursive: true,
    },
];

export default function EvaluationCreatePage() {

    const router = useRouter();

    const [formData, setformData] = useState<iEvaluation>({
        id: 0,
        student: null,
        entry_date: null,
        date: null,
        teacher_name: "",
        interview_note: 0,
        note: 0,
        questions: [],
    });

    const [cbStudentValue, setCbStudentValue] = useState<string | undefined>(undefined);
    const [student, setStudent] = useState<iStudent | undefined>(undefined);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setformData((prev) => {
            return {
                ...prev,
                [name]: name == "date" || name == "entry_date" ? new Date(value): value,
            }
        });
    }

    const handleQuestionChange = (id: number, value: string) => {
        setformData((prev) => {
            let newObj: iEvaluation = {...prev};

            if (newObj.questions.find((obj) => obj.id === id)) {
                const newQuestions = newObj.questions.map((obj) => {
                    return obj.id === id ? {...obj, value: value} : obj
                });

                newObj.questions = newQuestions;
            }
            else {
                newObj.questions.push({id: id, value: value});
            }

            return newObj;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log(formData,student);
        e.preventDefault();
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Gerar Avaliação</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                    <div  className="flex flex-col gap-1">
                        <label className="font-bold">Aluno</label>
                        <StudentCombobox setValue={setCbStudentValue} value={cbStudentValue} setStudent={setStudent}/>
                    </div>

                    <div  className="flex flex-col gap-1 w-[200px]">
                        <label className="font-bold">Data da entrada</label>
                        <Input
                            id="entry_date"
                            name="entry_date"
                            type="date"
                            value={formData?.entry_date ? formData?.entry_date.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div  className="flex flex-col gap-1 w-[200px]">
                        <label className="font-bold">Data da avaliação:</label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData?.date ? formData?.date.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div  className="flex flex-col gap-1 min-w-[250px] w-[50%]">
                        <label className="font-bold">Nome do professor</label>
                        <Input
                            id="teacher_name"
                            name="teacher_name"
                            value={formData?.teacher_name}
                            onChange={handleInputChange} 
                            placeholder="Nome do professor"
                        />
                    </div>
                    
                    {questions.map((obj, idx) => {
                        return (
                            <div key={`question_${idx}`} className="flex flex-col gap-1">
                                <label className="font-bold">{`${idx + 1} - ${obj.text}`}</label>
                                {obj.discursive 
                                ?<Textarea 
                                    name={`question${idx}`}
                                    value={formData?.questions ? formData?.questions.find((quest) => quest.id === obj.id)?.value : ""}
                                    onChange={(e) => handleQuestionChange(obj.id, e.target.value)}/>
                                :<QuestionCombobox
                                    value={formData?.questions ? formData?.questions.find((quest) => quest.id === obj.id)?.value : ""}
                                    setValue={handleQuestionChange}
                                    id_item={obj.id}
                                />
                                }
                            </div>
                        );
                    })}

                    <div  className="flex flex-col gap-1 min-w-[250px] w-[40%]">
                        <label className="font-bold">Nota da entrevista com os pais</label>
                        <Input
                            id="interview_note"
                            name="interview_note"
                            value={formData?.interview_note}
                            type="number"
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div  className="flex flex-col gap-1 min-w-[250px] w-[40%]">
                        <label className="font-bold">Nota avaliação</label>
                        <Input
                            id="note"
                            name="note"
                            value={formData?.note}
                            type="number"
                            onChange={handleInputChange} 
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student/evaluation')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}