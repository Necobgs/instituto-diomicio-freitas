"use client";

import { Button } from "@/components/ui/button";
import { QuestionCombobox } from "@/components/ui/combo-box-question";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import iEvaluation from "@/types/evaluation";
import { iQuestion } from "@/types/question";
import { iStudent } from "@/types/student";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const evaluations: iEvaluation[] = [
    { 
        id: 1,
        student: { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123", created_at: new Date(), updated_at: new Date(), },
        entry_date: new Date(2022, 10, 10),
        date: new Date(2024, 10, 10),
        teacher_name: "",
        interview_note: 50,
        note: 60,
        questions: [
            {id: 1, value: '2'},
            {id: 2, value: '1'},
            {id: 3, value: '1'},
            {id: 4, value: '3'},
            {id: 5, value: 'Não'},
            {id: 6, value: 'Sim'}
        ]
    },
    { 
        id: 2,
        student: { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123", created_at: new Date(), updated_at: new Date(), },
        entry_date: new Date(2023, 10, 10),
        date: new Date(2024, 8, 10),
        teacher_name: "",
        interview_note: 40,
        note: 30,
        questions: [
            {id: 1, value: '2'},
            {id: 2, value: '4'},
            {id: 3, value: '2'},
            {id: 4, value: '3'},
            {id: 5, value: 'teste'},
            {id: 6, value: 'Sim'}
        ]
    },
    { 
        id: 3,
        student: { id: 2, name: "Paulo", phone: "(48) 12345-6789", date_of_birth: new Date(2006, 6, 20), cpf: "456", created_at: new Date(), updated_at: new Date(), },
        entry_date: new Date(2024, 10, 10),
        date: new Date(2025, 8, 8),
        teacher_name: "",
        interview_note: 50,
        note: 70,
        questions: [
            {id: 1, value: '3'},
            {id: 2, value: '4'},
            {id: 3, value: '2'},
            {id: 4, value: '3'},
            {id: 5, value: 'teste'},
            {id: 6, value: 'Sim'}
        ]
    }
];

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

export default function EvaluationUpdatePage() {

    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const evaluation: iEvaluation | undefined = evaluations.find((obj) => obj.id.toString() === id);

    const defaultEvaluation: iEvaluation = {
        id: 0,
        student: undefined,
        entry_date: null,
        date: null,
        teacher_name: "",
        interview_note: 0,
        note: 0,
        questions: [],
    }

    const [formData, setFormData] = useState<iEvaluation>(evaluation ? evaluation : defaultEvaluation);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: name == "date" || name == "entry_date" ? new Date(value): value,
            }
        });
    }

    const handleQuestionChange = (id: number, value: string) => {
        setFormData((prev) => {
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
        e.preventDefault();
        if (formData) {
            console.log('Avalaição alterada:', formData);
            alert('Avaliação alterada com sucesso! (Simulação)');
            router.push('/evaluation'); // Redireciona para a lista de usuários (ajuste o caminho conforme necessário)
        }
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
                        <StudentCombobox
                            student={formData?.student}
                            setStudent={(student: iStudent | undefined) =>
                                setFormData((prev) => ({ ...prev, student }))
                            }
                        />
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
                        <Button className="bg-red-500">Excluir</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student/evaluation')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}